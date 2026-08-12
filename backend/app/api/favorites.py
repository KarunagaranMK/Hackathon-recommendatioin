from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from datetime import datetime

from app.middleware.auth import get_current_user
from app.database.mongodb import get_db

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.post("", response_model=dict)
async def toggle_favorite(body: dict, current_user=Depends(get_current_user)):
    """Toggle a project as favorite. If already favorited, remove it."""
    db = get_db()
    project_id = body.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id required")

    user_id = str(current_user["_id"])
    existing = await db.favorites.find_one(
        {"user_id": user_id, "project_id": project_id}
    )
    if existing:
        await db.favorites.delete_one({"_id": existing["_id"]})
        return {"message": "Removed from favorites", "favorited": False}

    # Fetch project info
    try:
        project = await db.projects.find_one(
            {"_id": ObjectId(project_id)}, {"embedding": 0}
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    fav = {
        "user_id": user_id,
        "project_id": project_id,
        "title": project["title"],
        "domain": project["domain"],
        "difficulty": project["difficulty"],
        "saved_at": datetime.utcnow(),
    }
    await db.favorites.insert_one(fav)
    return {"message": "Added to favorites", "favorited": True}


@router.get("", response_model=dict)
async def get_favorites(current_user=Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])
    cursor = db.favorites.find({"user_id": user_id}).sort("saved_at", -1)
    favs = []
    async for f in cursor:
        f["id"] = str(f["_id"])
        f.pop("_id", None)
        favs.append(f)
    return {"favorites": favs, "total": len(favs)}


@router.get("/ids", response_model=dict)
async def get_favorite_ids(current_user=Depends(get_current_user)):
    db = get_db()
    user_id = str(current_user["_id"])
    cursor = db.favorites.find({"user_id": user_id}, {"project_id": 1})
    ids = [f["project_id"] async for f in cursor]
    return {"favorite_ids": ids}
