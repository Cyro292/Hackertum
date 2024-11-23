import asyncio
import feedparser # type: ignore

from typing import Any

from .models import Story
from .database import get_next_sequence


RSS_FEEDS = [
    "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",  # Example RSS feed
    "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
    # Add more RSS feed URLs here
]

async def fetch_rss_feeds(db: Any):
    while True:
        for feed_url in RSS_FEEDS:
            feed = feedparser.parse(feed_url)
            for entry in feed.entries:
                # Check if the article already exists in pending_articles or articles
                existing_article = await db.pending_articles.find_one({"link": entry.link})
                existing_article_in_articles = await db.articles.find_one({"link": entry.link})
                if existing_article or existing_article_in_articles:
                    continue  # Skip if already exists

                # Generate a new unique ID
                article_id = await get_next_sequence(db, 'storyid')

                # Create a Story object
                story_data = {
                    "id": article_id,
                    "category": entry.get('category', 'General'),
                    "title": entry.get('title', ''),
                    "description": entry.get('summary', ''),
                    "content": entry.get('content', [{'value': ''}])[0]['value'],
                    "image": None,  # You may extract image URLs from the entry if available
                    "isFeature": False,
                    "link": entry.link  # Store the link to prevent duplicates
                }
                story = Story(**story_data)

                # Insert into pending_articles
                await db.pending_articles.insert_one(story.model_dump())
        await asyncio.sleep(3600)  # Fetch feeds every hour