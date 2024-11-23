from fastapi import FastAPI
from contextlib import asynccontextmanager

from .routers import stories_router, user_likes_router
from .database import connect_to_mongo, close_mongo_connection, create_indexes


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Startup: Connect to MongoDB and create indexes
    await connect_to_mongo()
    await create_indexes()

    yield # Run the application

    # Shutdown: Close MongoDB connection
    await close_mongo_connection()


app = FastAPI(
    title="News API",
    description="API for managing news stories",
    version="1.0.0",
    lifespan=lifespan
)
app.include_router(stories_router)
app.include_router(user_likes_router)
# app.include_router(admin_router)
