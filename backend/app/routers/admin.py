from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from typing import List

from ..models import Story
from ..database import get_database, get_next_sequence


router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.get("/pending_articles", response_model=List[Story])
async def get_pending_articles(db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Retrieve all pending articles.
    """
    articles = []
    cursor = db.pending_articles.find({})
    async for document in cursor:
        articles.append(Story(**document))
    return articles

@router.put("/pending_articles/{id}", response_model=Story)
async def edit_pending_article(id: int, updated_story: Story, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Edit a pending article.
    """
    # Ensure that we keep the original 'link' field
    existing_article = await db.pending_articles.find_one({"id": id})
    if not existing_article:
        raise HTTPException(status_code=404, detail="Pending article not found")

    updated_data = updated_story.dict(exclude_unset=True)
    updated_data['link'] = existing_article['link']  # Preserve the link

    result = await db.pending_articles.find_one_and_update(
        {"id": id},
        {"$set": updated_data},
        return_document=True
    )
    if result:
        return Story(**result)
    raise HTTPException(status_code=404, detail="Pending article not found")

@router.post("/pending_articles/{id}/accept")
async def accept_pending_article(id: int, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Accept a pending article and move it to articles.
    """
    article = await db.pending_articles.find_one({"id": id})
    if article:
        # Insert into articles
        await db.articles.insert_one(article)
        # Remove from pending_articles
        await db.pending_articles.delete_one({"id": id})
        return {"message": "Article accepted"}
    raise HTTPException(status_code=404, detail="Pending article not found")

@router.post("/pending_articles/{id}/decline")
async def decline_pending_article(id: int, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    Decline a pending article and remove it from pending_articles.
    """
    result = await db.pending_articles.delete_one({"id": id})
    if result.deleted_count == 1:
        return {"message": "Article declined"}
    raise HTTPException(status_code=404, detail="Pending article not found")

# Optional: Temporary Endpoint for Testing (Remove in Production)
@router.post("/pending_articles/mock", response_model=Story)
async def create_mock_pending_article(story: Story, db: AsyncIOMotorDatabase = Depends(get_database)):
    """
    **Temporary Endpoint**: Create a mock pending article for testing.
    """
    # Check if the link already exists to prevent duplicates
    existing_article = await db.pending_articles.find_one({"link": story.link})
    existing_article_in_articles = await db.articles.find_one({"link": story.link})
    if existing_article or existing_article_in_articles:
        raise HTTPException(status_code=400, detail="Article with this link already exists")

    # Generate a new unique ID
    story.id = await get_next_sequence(db, 'storyid')

    # Insert into pending_articles
    await db.pending_articles.insert_one(story.model_dump())
    return story