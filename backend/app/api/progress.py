from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

from app.middleware.auth import get_current_user
from app.database.mongodb import get_db

router = APIRouter(prefix="/progress", tags=["Learning Progress"])


class StepUpdate(BaseModel):
    project_id: str
    step_index: int
    completed: bool


class ProgressCreate(BaseModel):
    project_id: str
    total_steps: int
    completed_steps: Optional[List[int]] = []


@router.get("/{project_id}", response_model=dict)
async def get_progress(project_id: str, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])
    record = await db.learning_progress.find_one(
        {"user_id": user_id, "project_id": project_id}
    )
    if not record:
        return {
            "user_id": user_id,
            "project_id": project_id,
            "completed_steps": [],
            "total_steps": 0,
            "overall_progress": 0.0,
            "updated_at": None,
        }
    record.pop("_id", None)
    total = record.get("total_steps", 0)
    completed = len(record.get("completed_steps", []))
    record["overall_progress"] = round((completed / total * 100), 1) if total > 0 else 0.0
    return record


@router.post("", response_model=dict)
async def create_progress(body: ProgressCreate, current_user=Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])
    existing = await db.learning_progress.find_one(
        {"user_id": user_id, "project_id": body.project_id}
    )
    if existing:
        raise HTTPException(status_code=400, detail="Progress record already exists. Use PUT to update.")
    record = {
        "user_id": user_id,
        "project_id": body.project_id,
        "total_steps": body.total_steps,
        "completed_steps": body.completed_steps or [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    await db.learning_progress.insert_one(record)
    total = record["total_steps"]
    completed = len(record["completed_steps"])
    overall = round((completed / total * 100), 1) if total > 0 else 0.0
    record.pop("_id", None)
    record["overall_progress"] = overall
    return record


@router.put("/{project_id}", response_model=dict)
async def update_progress(
    project_id: str, body: StepUpdate, current_user=Depends(get_current_user)
):
    db = get_db()
    user_id = str(current_user["_id"])
    record = await db.learning_progress.find_one(
        {"user_id": user_id, "project_id": project_id}
    )
    if not record:
        raise HTTPException(status_code=404, detail="Progress record not found. Create one first.")

    completed_steps = record.get("completed_steps", [])

    if body.completed and body.step_index not in completed_steps:
        completed_steps.append(body.step_index)
    elif not body.completed and body.step_index in completed_steps:
        completed_steps.remove(body.step_index)

    total = record.get("total_steps", 0)
    overall = round((len(completed_steps) / total * 100), 1) if total > 0 else 0.0

    await db.learning_progress.update_one(
        {"user_id": user_id, "project_id": project_id},
        {
            "$set": {
                "completed_steps": completed_steps,
                "overall_progress": overall,
                "updated_at": datetime.utcnow(),
            }
        },
    )

    return {
        "user_id": user_id,
        "project_id": project_id,
        "completed_steps": completed_steps,
        "total_steps": total,
        "overall_progress": overall,
        "updated_at": datetime.utcnow().isoformat(),
    }


@router.get("", response_model=dict)
async def get_all_progress(current_user=Depends(get_current_user)):
    """Get all learning progress records for the current user."""
    db = get_db()
    user_id = str(current_user["_id"])
    cursor = db.learning_progress.find({"user_id": user_id}).sort("updated_at", -1)
    records = []
    async for r in cursor:
        r.pop("_id", None)
        total = r.get("total_steps", 0)
        completed = len(r.get("completed_steps", []))
        r["overall_progress"] = round((completed / total * 100), 1) if total > 0 else 0.0
        records.append(r)
    return {"progress_records": records, "total": len(records)}
