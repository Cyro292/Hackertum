from fastapi import APIRouter, HTTPException, Query
from typing import List
from bson import ObjectId

from ..models import NewsResponse, Story, StoryDBO, UserLike
from ..database import stories_collection, user_likes_collection


router = APIRouter(prefix="/api/v1/stories", tags=["Stories"])


async def dbo_to_model(story_dbo: StoryDBO) -> Story:
    """
    Convert StoryDBO to Story by fetching associated UserLike documents.
    """
    # Fetch UserLike documents based on ObjectIds
    if story_dbo.likes:
        user_like_ids = [like_id for like_id in story_dbo.likes]
        # Bulk fetch UserLikes
        cursor = user_likes_collection.find({"_id": {"$in": user_like_ids}})
        user_likes = await cursor.to_list(length=len(user_like_ids))
        # Convert to UserLike models
        likes = [UserLike(**ul) for ul in user_likes]
    else:
        likes = []

    story = Story(
        id=str(story_dbo.id),
        category=story_dbo.category,
        title=story_dbo.title,
        description=story_dbo.description,
        content=story_dbo.content,
        image=story_dbo.image,
        readtime=story_dbo.readtime,
        isFeature=story_dbo.isFeature,
        likes=likes,
        publishedAt=story_dbo.publishedAt,
        author=story_dbo.author
    )
    return story

@router.get("/get_stories", response_model=NewsResponse)
async def get_stories(page: int = Query(1, ge=1), limit: int = Query(6, ge=1)):
    skip = (page - 1) * limit
    cursor = stories_collection.find().skip(skip).limit(limit)
    stories_dbo_raw = await cursor.to_list(length=limit)
    stories_dbo = [StoryDBO(**story) for story in stories_dbo_raw]
    stories = [await dbo_to_model(story) for story in stories_dbo]
    return NewsResponse(stories=stories)

@router.get("/get_stories_by_category", response_model=NewsResponse)
async def get_stories_by_category(category: str):
    cursor = stories_collection.find({"category": category})
    stories_dbo_raw = await cursor.to_list(length=100)  # Adjust as needed
    if not stories_dbo_raw:
        return NewsResponse(stories=[])
    stories_dbo = [StoryDBO(**story) for story in stories_dbo_raw]
    stories = [await dbo_to_model(story) for story in stories_dbo]
    return NewsResponse(stories=stories)

@router.get("/get_story_by_id", response_model=Story)
async def get_story_by_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=404, detail="Story not found")

    story_dbo_raw = await stories_collection.find_one({"_id": ObjectId(id)})
    if not story_dbo_raw:
        raise HTTPException(status_code=404, detail="Story not found")

    story_dbo = StoryDBO(**story_dbo_raw)
    story = await dbo_to_model(story_dbo)
    return story