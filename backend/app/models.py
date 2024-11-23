from typing import List, Optional
from pydantic import BaseModel, Field
from pydantic.json_schema import JsonSchemaValue
from bson import ObjectId

# Custom ObjectId type for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls) -> JsonSchemaValue:
        return {"type": "string", "pattern": "^[0-9a-fA-F]{24}$"}

# Data models for MongoDB (DBO - Database Objects)
class UserLikeDBO(BaseModel):
    name: str
    image: str

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class StoryDBO(BaseModel):
    category: str
    title: str
    description: str
    content: str
    image: Optional[str] = ""
    readtime: Optional[str] = "1 min read"
    isFeature: Optional[bool] = False
    likes: List[PyObjectId] = Field(default_factory=list)
    publishedAt: str
    author: str = ""

    class Config:
        orm_mode = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

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
    publishedAt: str
    author: str = ""

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class NewsResponse(BaseModel):
    stories: List[Story]