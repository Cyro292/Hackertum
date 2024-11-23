from fastapi import FastAPI
from contextlib import asynccontextmanager
import asyncio

from .routers import stories_router, admin_router
from .database import connect_to_mongo, close_mongo_connection, create_indexes
from .rss_feeds import fetch_rss_feeds


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB and create indexes
    await connect_to_mongo(app)
    await create_indexes(app.state.db)
    # Start RSS feed fetching in the background
    app.state.rss_task = asyncio.create_task(fetch_rss_feeds(app.state.db))
    yield
    # Shutdown: Cancel background tasks and close MongoDB connection
    app.state.rss_task.cancel()
    await close_mongo_connection(app)


app = FastAPI(lifespan=lifespan)

app.include_router(stories_router)
app.include_router(admin_router)
