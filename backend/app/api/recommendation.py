from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime

from app.middleware.auth import get_current_user
from app.database.mongodb import get_db
from app.models.project import RecommendationRequest

router = APIRouter(prefix="/recommend", tags=["Recommendation"])


@router.post("", response_model=dict)
async def recommend_projects(
    req: RecommendationRequest = RecommendationRequest(),
    current_user=Depends(get_current_user),
):
    db = get_db()
    profile = current_user.get("profile")
    if not profile:
        raise HTTPException(
            status_code=400,
            detail="Please complete your profile before getting recommendations.",
        )

    # Build student text
    from app.ai.embedding import profile_to_sentence, rank_projects_by_text
    from app.ai.skill_gap import analyze_skill_gap
    from app.ai.roadmap import generate_roadmap

    sentence = profile_to_sentence(profile)

    # Fetch all projects (no need for stored embeddings — TF-IDF computes on the fly)
    cursor = db.projects.find({}, {"title": 1, "description": 1,
                                   "problem_statement": 1, "domain": 1, "difficulty": 1,
                                   "skills_required": 1, "technologies": 1,
                                   "estimated_duration": 1, "learning_resources": 1,
                                   "roadmap": 1, "architecture": 1, "modules": 1})
    projects = [p async for p in cursor]

    if not projects:
        raise HTTPException(status_code=404, detail="No projects found in database. Please seed the dataset.")

    # Rank by TF-IDF cosine similarity (lightweight, no GPU/PyTorch needed)
    top_projects = rank_projects_by_text(profile, projects, top_k=req.top_k)

    # Build response with skill gap + roadmap
    student_skills = (
        (profile.get("programming_languages") or []) +
        (profile.get("frameworks") or []) +
        (profile.get("databases") or []) +
        (profile.get("cloud_skills") or []) +
        (profile.get("ai_skills") or [])
    )

    results = []
    for proj in top_projects:
        skill_gap = analyze_skill_gap(student_skills, proj.get("skills_required", []))
        roadmap = generate_roadmap(
            skill_gap["missing_skills"],
            proj.get("domain", ""),
            proj.get("technologies", []),
        )
        results.append({
            "project_id": str(proj["_id"]),
            "title": proj["title"],
            "description": proj["description"],
            "problem_statement": proj.get("problem_statement", ""),
            "domain": proj["domain"],
            "difficulty": proj["difficulty"],
            "technologies": proj.get("technologies", []),
            "skills_required": proj.get("skills_required", []),
            "estimated_duration": proj.get("estimated_duration", ""),
            "learning_resources": proj.get("learning_resources", []),
            "architecture": proj.get("architecture", ""),
            "modules": proj.get("modules", []),
            "similarity_score": round(proj["similarity_score"] * 100, 2),
            "skill_gap": skill_gap,
            "roadmap": roadmap,
        })

    # Save to history
    await db.history.insert_one({
        "user_id": str(current_user["_id"]),
        "results": [r["project_id"] for r in results],
        "timestamp": datetime.utcnow(),
    })

    # Save to recommendations
    await db.recommendations.update_one(
        {"user_id": str(current_user["_id"])},
        {"$set": {"results": results, "generated_at": datetime.utcnow()}},
        upsert=True,
    )

    return {"recommendations": results, "total": len(results), "profile_sentence": sentence}


@router.get("/history", response_model=dict)
async def get_recommendation_history(current_user=Depends(get_current_user)):
    db = get_db()
    saved = await db.recommendations.find_one({"user_id": str(current_user["_id"])})
    if not saved:
        return {"recommendations": [], "total": 0}
    saved.pop("_id", None)
    return {"recommendations": saved.get("results", []), "total": len(saved.get("results", []))}
