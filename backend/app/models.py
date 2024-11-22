from pydantic import BaseModel, Field
from typing import Optional, List

class Article(BaseModel):
    title: str
    content: str
    images: Optional[List[str]] = []

class ArticleInDB(Article):
    id: str = Field(default_factory=str, alias="_id")
