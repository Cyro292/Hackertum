from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorCollection, AsyncIOMotorDatabase
from pymongo import ASCENDING, TEXT

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
    
    # Indexes for stories
    await stories_collection.create_index([("category", ASCENDING)])
    await stories_collection.create_index([("title", ASCENDING)])
    await stories_collection.create_index([("publishedAt", ASCENDING)])
    await stories_collection.create_index([("author", ASCENDING)])
    await stories_collection.create_index([("tags", ASCENDING)])      # Existing Multikey Index
    await stories_collection.create_index([("sources", ASCENDING)])   # New Multikey Index

    # Optional: Create a text index for full-text search on title and description
    await stories_collection.create_index([("title", TEXT), ("description", TEXT)])

    # Index for user_likes
    await user_likes_collection.create_index([("name", ASCENDING)], unique=True)
    # Add other index creations here if necessary