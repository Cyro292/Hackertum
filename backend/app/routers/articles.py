from fastapi import APIRouter, HTTPException
from typing import List
from models import Article, ArticleInDB
from database import client
from services.ai_service import process_with_ai
from bson.objectid import ObjectId

router = APIRouter(
    prefix="/articles",
    tags=["articles"]
)

@router.post("/", response_model=ArticleInDB)
async def create_article(article: Article):
    # Process content with AI service
    processed_content = await process_with_ai(article.content)
    article.content = processed_content

    article_dict = article.dict()
    result = await client.db.articles.insert_one(article_dict)
    article_dict["_id"] = str(result.inserted_id)
    return ArticleInDB(**article_dict)

@router.get("/", response_model=List[ArticleInDB])
async def get_articles():
    articles = []
    cursor = client.db.articles.find({})
    async for document in cursor:
        document["_id"] = str(document["_id"])
        articles.append(ArticleInDB(**document))
    return articles

@router.get("/{article_id}", response_model=ArticleInDB)
async def get_article(article_id: str):
    document = await client.db.articles.find_one({"_id": ObjectId(article_id)})
    if document:
        document["_id"] = str(document["_id"])
        return ArticleInDB(**document)
    raise HTTPException(status_code=404, detail="Article not found")
