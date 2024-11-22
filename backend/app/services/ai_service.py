import os
import aiohttp

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://ai_service_mock:5000")

async def process_with_ai(article_content: str) -> str:
    url = f"{AI_SERVICE_URL}/process"
    async with aiohttp.ClientSession() as session:
        async with session.post(url, json={'content': article_content}) as resp:
            if resp.status == 200:
                data = await resp.json()
                return data.get('processed_content', article_content)
            else:
                # Handle error
                return article_content
