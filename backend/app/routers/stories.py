from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from ..models import Story, NewsResponse
from ..database import client


router = APIRouter(
    prefix="/stories",
    tags=["stories"]
)

@router.get("/", response_model=NewsResponse)
async def get_stories(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1)
):
    """
    Get stories with pagination.
    """
    skip = (page - 1) * limit
    cursor = client.db.articles.find({}).skip(skip).limit(limit)
    stories = []
    async for document in cursor:
        stories.append(Story(**document))
    # Check if there are more stories
    total_count = await client.db.articles.count_documents({})
    has_more = skip + limit < total_count
    return NewsResponse(stories=stories, hasMore=has_more)

@router.get("/category/{category}", response_model=List[Story])
async def get_stories_by_category(category: str):
    """
    Get stories filtered by category.
    """
    cursor = client.db.articles.find({"category": category})
    stories = []
    async for document in cursor:
        stories.append(Story(**document))
    return stories

@router.get("/{id}", response_model=Optional[Story])
async def get_story_by_id(id: int):
    """
    Get a single story by its ID.
    """
    document = await client.db.articles.find_one({"id": id})
    if document:
        return Story(**document)
    raise HTTPException(status_code=404, detail="Story not found")
