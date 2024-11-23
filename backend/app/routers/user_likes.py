from typing import List, Mapping, cast
from bson import ObjectId
from fastapi import APIRouter, HTTPException

from ..models import UserLikeDBO, UserLike
from ..database import user_likes_collection

router = APIRouter(prefix="/api/v1/user_likes", tags=["UserLikes"])

@router.post("/create", response_model=UserLike)
async def create_user_like(user_like: UserLikeDBO):
    # Check if a UserLike with the same name already exists
    existing = await user_likes_collection.find_one({"name": user_like.name})
    if existing:
        raise HTTPException(status_code=400, detail="UserLike with this name already exists.")

    result = await user_likes_collection.insert_one(user_like.model_dump())
    created_user_like: Mapping = cast(Mapping, await user_likes_collection.find_one({"_id": result.inserted_id}))
    return UserLike(**created_user_like)

@router.get("/get_all", response_model=List[UserLike])
async def get_all_user_likes():
    cursor = user_likes_collection.find()
    user_likes = await cursor.to_list(length=100)  # Adjust as needed
    return [UserLike(**ul) for ul in user_likes]

@router.get("/get_by_id/{id}", response_model=UserLike)
async def get_user_like_by_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=404, detail="UserLike not found")

    user_like = await user_likes_collection.find_one({"_id": ObjectId(id)})
    if not user_like:
        raise HTTPException(status_code=404, detail="UserLike not found")
    return UserLike(**user_like)