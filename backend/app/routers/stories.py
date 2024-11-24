from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from bson import ObjectId

from ..utils import story_dbo_to_model
from ..models import NewsResponse, Story, StoryCreate, StoryDBO, StoryDBOId
from ..database import stories_collection, user_likes_collection


router = APIRouter(prefix="/api/v1/stories", tags=["Stories"])

@router.get("/get_all_stories", response_model=List[Story])
async def get_all_stories():
    # Fetch limit + 1 stories to determine if there are more
    stories_dbo_raw = await stories_collection.find().to_list()

    stories_dbo = [StoryDBOId(**story) for story in stories_dbo_raw]
    stories = [await story_dbo_to_model(story) for story in stories_dbo]
    return stories


@router.get("/get_stories", response_model=NewsResponse)
async def get_stories(
    page: int = Query(1, ge=1, description="Page number to retrieve"),
    limit: int = Query(7, ge=1, description="Number of stories per page"),
    category: Optional[str] = Query(None, description="Category to filter stories by")
):
    skip = (page - 1) * limit

    # Build the query filter
    query_filter = {}
    if category:
        query_filter["category"] = category

    # print(f"routers/stories.py :: {stories_collection = }")

    # Fetch limit + 1 stories to determine if there are more
    cursor = stories_collection.find(query_filter).skip(skip).limit(limit + 1)
    stories_dbo_raw = await cursor.to_list(length=limit + 1)
    
    # Determine if there are more stories
    if len(stories_dbo_raw) > limit:
        has_more = True
        stories_dbo_raw = stories_dbo_raw[:limit]  # Trim the extra story
    else:
        has_more = False

    stories_dbo = [StoryDBOId(**story) for story in stories_dbo_raw]
    stories = [await story_dbo_to_model(story) for story in stories_dbo]
    return NewsResponse(stories=stories, hasMore=has_more)


@router.get("/get_story_by_id", response_model=Story)
async def get_story_by_id(id: str):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=404, detail="Story not found")

    story_dbo_raw = await stories_collection.find_one({"_id": ObjectId(id)})
    if not story_dbo_raw:
        raise HTTPException(status_code=404, detail="Story not found")

    story_dbo = StoryDBOId(**story_dbo_raw)
    story = await story_dbo_to_model(story_dbo)
    return story

@router.post("/create_story", response_model=Story)
async def create_story(story: StoryCreate):
    # Validate UserLike ObjectIds
    if story.likes:
        valid_like_ids = []
        for like_id in story.likes:
            if ObjectId.is_valid(like_id):
                valid_like_ids.append(ObjectId(like_id))
            else:
                raise HTTPException(status_code=400, detail=f"Invalid UserLike ID: {like_id}")
        
        # Optionally, verify that each UserLike exists
        existing_likes = await user_likes_collection.find({"_id": {"$in": valid_like_ids}}).to_list(length=len(valid_like_ids))
        if len(existing_likes) != len(valid_like_ids):
            raise HTTPException(status_code=400, detail="One or more UserLike IDs do not exist.")
    else:
        valid_like_ids = []

    story_dbo = StoryDBO(
        category=story.category,
        title=story.title,
        description=story.description,
        content=story.content,
        image=story.image,
        readtime=story.readtime,
        isFeature=story.isFeature,
        likes=valid_like_ids,
        publishedAt=story.publishedAt,
        author=story.author,
        audio=story.audio,
        tags=story.tags,
        sources=story.sources
    )

    result = await stories_collection.insert_one(story_dbo.model_dump())

    print(f"routers/stories.py :: {result = }")

    created_story_dbo_raw = await stories_collection.find_one({"_id": result.inserted_id})

    print(f"routers/stories.py :: {created_story_dbo_raw = }")

    if not created_story_dbo_raw:
        raise HTTPException(status_code=500, detail="Failed to create story.")

    # created_story["_id"] = PyObjectId.validate(created_story["_id"])
    # print(f"routers/stories.py :: {created_story = }")

    created_story_dbo = StoryDBOId(**created_story_dbo_raw)

    print(f"routers/stories.py :: {created_story_dbo = }")

    story_model = await story_dbo_to_model(created_story_dbo)
    return story_model