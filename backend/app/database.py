import os
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

MONGO_DETAILS = os.getenv("MONGO_DETAILS", "mongodb://mongo:27017")
client: Optional[AsyncIOMotorClient] = None

async def connect_to_mongo():
    global client
    client = AsyncIOMotorClient(MONGO_DETAILS)
    print("Connected to MongoDB")

async def close_mongo_connection():
    global client
    client.close()
    print("Closed MongoDB connection")
