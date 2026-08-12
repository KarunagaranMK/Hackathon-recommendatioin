from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime

from app.models.user import UserProfile, UserPublic
from app.middleware.auth import get_current_user
from app.database.mongodb import get_db

router = APIRouter(prefix="/profile", tags=["Profile"])


def serialize_user(user: dict) -> dict:
    user["id"] = str(user["_id"])
    return user


@router.get("", response_model=dict)
async def get_profile(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"],
        "profile": current_user.get("profile"),
        "is_admin": current_user.get("is_admin", False),
        "created_at": current_user.get("created_at"),
    }


@router.post("", response_model=dict)
async def create_profile(
    profile: UserProfile, current_user=Depends(get_current_user)
):
    db = get_db()
    profile_data = profile.model_dump()
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"profile": profile_data, "updated_at": datetime.utcnow()}},
    )
    return {"message": "Profile saved successfully", "profile": profile_data}


@router.put("", response_model=dict)
async def update_profile(
    profile: UserProfile, current_user=Depends(get_current_user)
):
    db = get_db()
    profile_data = profile.model_dump(exclude_none=True)
    # Merge with existing profile
    existing_profile = current_user.get("profile") or {}
    merged = {**existing_profile, **profile_data}
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"profile": merged, "updated_at": datetime.utcnow()}},
    )
    return {"message": "Profile updated successfully", "profile": merged}
