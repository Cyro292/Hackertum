from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase
from pymongo import ASCENDING

from typing import cast

from .constants import COLLECTION_NAME, DATABASE_NAME, MONGODB_URL, USER_LIKES_COLLECTION


client: AsyncIOMotorClient = cast(AsyncIOMotorClient, None)
db: AsyncIOMotorDatabase = cast(AsyncIOMotorDatabase, None)
stories_collection: AsyncIOMotorCollection = cast(AsyncIOMotorCollection, None)
user_likes_collection: AsyncIOMotorCollection = cast(AsyncIOMotorCollection, None)


async def connect_to_mongo():
    global client, db, stories_collection, user_likes_collection

    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    stories_collection = db[COLLECTION_NAME]
    user_likes_collection = db[USER_LIKES_COLLECTION]

async def close_mongo_connection():
    await client.close()

# Ensure indexes if necessary
# For example, indexing the category field for faster queries
async def create_indexes():
    """
    Initialize the database by creating necessary indexes.
    """
    # Index for stories
    await stories_collection.create_index([("category", ASCENDING)])
    await stories_collection.create_index([("title", ASCENDING)])
    await stories_collection.create_index([("publishedAt", ASCENDING)])
    await stories_collection.create_index([("author", ASCENDING)])

    # Index for user_likes (if needed)
    await user_likes_collection.create_index([("name", ASCENDING)], unique=True)
    # Add other index creations here if necessary

