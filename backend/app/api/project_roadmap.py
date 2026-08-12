"""
Project Roadmap API
On-demand roadmap generation for any project + team assignment.
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.middleware.auth import get_current_user
from app.database.mongodb import get_db
from app.ai.skill_gap import analyze_skill_gap
from app.ai.roadmap import generate_roadmap
from app.ai.team_split import assign_team_work, calculate_roadmap_stats
from app.ai.web_scraper import enrich_roadmap_with_resources

router = APIRouter(prefix="/projects", tags=["Project Roadmap"])


class RoadmapRequest(BaseModel):
    team_size: Optional[int] = 1
    enrich_resources: Optional[bool] = True  # scrape GitHub for live links


@router.post("/{project_id}/roadmap", response_model=dict)
async def generate_project_roadmap(
    project_id: str,
    body: RoadmapRequest = RoadmapRequest(),
    current_user=Depends(get_current_user),
):
    """
    Generate a personalized roadmap for a specific project.
    - Computes skill gap vs user profile
    - Generates ordered learning steps
    - Optionally enriches with GitHub resources (web scraping)
    - Splits work across team members
    """
    from bson import ObjectId

    db = get_db()

    # ── Load project ──────────────────────────────────────────────────
    try:
        oid = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID format")

    project = await db.projects.find_one({"_id": oid})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # ── Load user profile ─────────────────────────────────────────────
    profile = current_user.get("profile") or {}
    student_skills = (
        (profile.get("programming_languages") or []) +
        (profile.get("frameworks") or []) +
        (profile.get("databases") or []) +
        (profile.get("cloud_skills") or []) +
        (profile.get("ai_skills") or [])
    )

    # ── Skill gap analysis ────────────────────────────────────────────
    required_skills = project.get("skills_required", [])
    skill_gap = analyze_skill_gap(student_skills, required_skills)

    # ── Generate roadmap ──────────────────────────────────────────────
    missing = skill_gap["missing_skills"]
    if not missing:
        # No missing skills — roadmap = overview of all project skills
        roadmap = [
            {
                "step": i + 1,
                "skill": skill,
                "description": f"You already know {skill} — review advanced patterns for {project.get('domain', 'this')} projects",
                "estimated_time": "1 week",
                "resources": [],
            }
            for i, skill in enumerate(required_skills[:5])
        ]
    else:
        roadmap = generate_roadmap(
            missing_skills=missing,
            domain=project.get("domain", ""),
            technologies=project.get("technologies", []),
        )

    # ── Enrich with live GitHub resources (web scraping) ─────────────
    if body.enrich_resources and roadmap:
        try:
            roadmap = await enrich_roadmap_with_resources(roadmap)
        except Exception:
            pass  # fallback to static resources silently

    # ── Calculate stats ───────────────────────────────────────────────
    stats = calculate_roadmap_stats(roadmap)

    # ── Team assignment ───────────────────────────────────────────────
    team_size = max(1, min(body.team_size or 1, 8))
    team = assign_team_work(roadmap, team_size) if team_size > 1 else None

    return {
        "project_id": project_id,
        "project_title": project.get("title", ""),
        "project_domain": project.get("domain", ""),
        "skill_gap": skill_gap,
        "roadmap": roadmap,
        "stats": stats,
        "team": team,
    }


@router.post("/{project_id}/team-split", response_model=dict)
async def split_team_work(
    project_id: str,
    body: RoadmapRequest,
    current_user=Depends(get_current_user),
):
    """Split an existing roadmap across a team — call after roadmap is generated."""
    from bson import ObjectId

    db = get_db()

    try:
        oid = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    project = await db.projects.find_one({"_id": oid})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    profile = current_user.get("profile") or {}
    student_skills = (
        (profile.get("programming_languages") or []) +
        (profile.get("frameworks") or []) +
        (profile.get("databases") or []) +
        (profile.get("cloud_skills") or []) +
        (profile.get("ai_skills") or [])
    )

    required_skills = project.get("skills_required", [])
    skill_gap = analyze_skill_gap(student_skills, required_skills)
    roadmap = generate_roadmap(
        skill_gap["missing_skills"],
        project.get("domain", ""),
        project.get("technologies", []),
    )

    team_size = max(1, min(body.team_size or 1, 8))
    team = assign_team_work(roadmap, team_size)
    stats = calculate_roadmap_stats(roadmap)

    return {
        "project_id": project_id,
        "roadmap": roadmap,
        "stats": stats,
        "team": team,
    }
