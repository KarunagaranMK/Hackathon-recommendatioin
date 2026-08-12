from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId
from typing import Optional, List
from datetime import datetime

from app.models.project import ProjectCreate, Project
from app.middleware.auth import get_current_user, get_admin_user
from app.database.mongodb import get_db

router = APIRouter(prefix="/projects", tags=["Projects"])


def serialize_project(p: dict) -> dict:
    p["id"] = str(p["_id"])
    p.pop("_id", None)
    p.pop("embedding", None)  # don't expose raw embeddings
    return p


@router.get("", response_model=dict)
async def list_projects(
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    technology: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user=Depends(get_current_user),
):
    db = get_db()
    query = {}
    if domain:
        query["domain"] = {"$regex": domain, "$options": "i"}
    if difficulty:
        query["difficulty"] = {"$regex": difficulty, "$options": "i"}
    if technology:
        query["technologies"] = {"$in": [technology]}
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    total = await db.projects.count_documents(query)
    skip = (page - 1) * limit
    cursor = db.projects.find(query, {"embedding": 0}).skip(skip).limit(limit)
    projects = [serialize_project(p) async for p in cursor]

    return {
        "projects": projects,
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/{project_id}", response_model=dict)
async def get_project(project_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    try:
        project = await db.projects.find_one(
            {"_id": ObjectId(project_id)}, {"embedding": 0}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_project(project)


@router.post("", response_model=dict, status_code=201)
async def create_project(
    project_data: ProjectCreate, admin=Depends(get_admin_user)
):
    db = get_db()
    from app.ai.embedding import generate_embedding, project_to_text

    project_dict = project_data.model_dump()
    text = project_to_text(project_dict)
    embedding = generate_embedding(text)
    project_dict["embedding"] = embedding
    project_dict["created_at"] = datetime.utcnow()
    result = await db.projects.insert_one(project_dict)
    return {"message": "Project created", "id": str(result.inserted_id)}


@router.put("/{project_id}", response_model=dict)
async def update_project(
    project_id: str, project_data: ProjectCreate, admin=Depends(get_admin_user)
):
    db = get_db()
    from app.ai.embedding import generate_embedding, project_to_text

    project_dict = project_data.model_dump()
    text = project_to_text(project_dict)
    project_dict["embedding"] = generate_embedding(text)
    project_dict["updated_at"] = datetime.utcnow()
    try:
        result = await db.projects.update_one(
            {"_id": ObjectId(project_id)}, {"$set": project_dict}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project updated"}


@router.delete("/{project_id}", response_model=dict)
async def delete_project(project_id: str, admin=Depends(get_admin_user)):
    db = get_db()
    try:
        result = await db.projects.delete_one({"_id": ObjectId(project_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}
