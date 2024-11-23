import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import cast, AsyncGenerator
from fastapi import FastAPI, Request
from pydantic_settings import BaseSettings


MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://mongo:27017")
client: AsyncIOMotorClient = cast(AsyncIOMotorClient, None)

class Settings(BaseSettings):
    MONGO_DETAILS: str = "mongodb://mongo:27017"
    DATABASE_NAME: str = "news_db"  # Specify your database name

    class Config:
        env_file = ".env"

settings = Settings()

async def get_database(request: Request) -> AsyncIOMotorDatabase:
    """
    Dependency to get the MongoDB database.
    """
    return request.app.state.db

async def connect_to_mongo(app: FastAPI):
    """
    Connect to MongoDB and store the client in the app's state.
    """
    global client

    client = AsyncIOMotorClient(settings.MONGO_DETAILS)
    app.state.db = client[settings.DATABASE_NAME]
    print("Connected to MongoDB")

async def close_mongo_connection(app: FastAPI):
    """
    Close the MongoDB connection.
    """
    app.state.db.client.close()
    print("Closed MongoDB connection")

async def get_next_sequence(db: AsyncIOMotorDatabase, name: str) -> int:
    ret = await db.counters.find_one_and_update(
        {'_id': name},
        {'$inc': {'seq': 1}},
        upsert=True,
        return_document=True
    )
    return ret['seq']


async def create_indexes(db: AsyncIOMotorDatabase):
    """
    Create necessary indexes for collections.
    """
    await db.pending_articles.create_index("id", unique=True)
    await db.pending_articles.create_index("link", unique=True)
    await db.articles.create_index("id", unique=True)
    await db.articles.create_index("link", unique=True)
    await db.counters.create_index("id", unique=True)  # Assuming counters use 'id'

