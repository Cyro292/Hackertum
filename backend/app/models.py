from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from pydantic.json_schema import JsonSchemaValue
from bson import ObjectId

# # Custom ObjectId type for Pydantic
# class PyObjectId(ObjectId):
#     # @classmethod
#     # def __get_validators__(cls):
#     #     yield cls.validate

#     @classmethod
#     def validate(cls, v):
#         if not ObjectId.is_valid(v):
#             raise ValueError("Invalid ObjectId")
#         return cls(v)

#     @classmethod
#     def __get_pydantic_json_schema__(cls) -> JsonSchemaValue:
#         return {"type": "string", "pattern": "^[0-9a-fA-F]{24}$"}
    
#     def __repr__(self) -> str:
#         return f"Py{super().__repr__()}"

class UserLikeDBO(BaseModel):
    name: str
    image: str

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        # json_encoders = {ObjectId: str}

class StoryDBO(BaseModel):
    category: str
    title: str
    description: str
    content: str
    image: Optional[str] = ""
    readtime: Optional[str] = "1 min read"
    isFeature: Optional[bool] = False
    likes: List[ObjectId] = Field(default_factory=list)
    publishedAt: str  # Existing Field
    author: str = ""   # Existing Field
    audio: str = ""    # Existing Field
    tags: List[str] = Field(default_factory=list)  # Existing Field
    sources: List[str] = Field(default_factory=list)  # New Field

    # @validator('publishedAt')
    # def validate_published_at(cls, v):
    #     # Optional: Validate the format of publishedAt
    #     try:
    #         datetime.strptime(v, "%Y-%m-%dT%H:%M:%S")
    #     except ValueError:
    #         raise ValueError("publishedAt must be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)")
    #     return v

    # @validator('tags', each_item=True)
    # def lowercase_tags(cls, v):
    #     return v.lower()

    # @validator('tags')
    # def unique_tags(cls, v):
    #     if len(v) != len(set(v)):
    #         raise ValueError("Duplicate tags are not allowed")
    #     return v

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        # json_encoders = {ObjectId: str}

# API Models
class UserLike(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    image: str

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class Story(BaseModel):
    id: str = Field(..., alias="_id")
    category: str
    title: str
    description: str
    content: str
    image: Optional[str] = ""
    readtime: Optional[str] = "1 min read"
    isFeature: Optional[bool] = False
    likes: List[UserLike] = []
    publishedAt: str    # Existing Field
    author: str = ""    # Existing Field
    audio: str = ""     # Existing Field
    tags: List[str] = Field(default_factory=list)  # Existing Field
    sources: List[str] = Field(default_factory=list)  # New Field

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class NewsResponse(BaseModel):
    stories: List[Story]
    hasMore: bool = False