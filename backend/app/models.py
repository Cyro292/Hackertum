from pydantic import BaseModel, Field
from typing import Optional, List


class Story(BaseModel):
    id: int
    category: str
    title: str
    description: str
    content: str
    image: Optional[str] = None
    isFeature: Optional[bool] = False
    link: Optional[str] = Field(None, exclude=True)  # Include the link field but exclude it from responses

    class Config:
        orm_mode = True


class NewsResponse(BaseModel):
    stories: List[Story]
    hasMore: bool