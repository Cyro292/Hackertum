from .models import Story, StoryDBO, StoryDBOId, UserLike, UserLikeDBO, UserLikeDBOId
from .database import user_likes_collection

def userlike_dbo_to_model(user_like_dbo: UserLikeDBOId) -> UserLike:
    return UserLike(
        id=str(user_like_dbo.id),
        name=user_like_dbo.name,
        image=user_like_dbo.image
    )

async def story_dbo_to_model(story_dbo: StoryDBOId) -> Story:
    """
    Convert StoryDBO to Story by fetching associated UserLike documents.
    """
    # Fetch UserLike documents based on ObjectIds
    if story_dbo.likes:
        user_like_ids = [like_id for like_id in story_dbo.likes]
        # Bulk fetch UserLikes
        cursor = user_likes_collection.find({"_id": {"$in": user_like_ids}})
        user_like_dbos_raw = await cursor.to_list(length=len(user_like_ids))
        # Convert to UserLike models
        user_like_dbos = [UserLikeDBOId(**ul) for ul in user_like_dbos_raw]

        user_like_models = [userlike_dbo_to_model(ul) for ul in user_like_dbos]
    else:
        user_like_models = []

    story = Story(
        id=str(story_dbo.id),
        category=story_dbo.category,
        title=story_dbo.title,
        description=story_dbo.description,
        content=story_dbo.content,
        image=story_dbo.image,
        readtime=story_dbo.readtime,
        isFeature=story_dbo.isFeature,
        likes=user_like_models,
        publishedAt=story_dbo.publishedAt,
        author=story_dbo.author,
        audio=story_dbo.audio,
        tags=story_dbo.tags,
        sources=story_dbo.sources
    )
    return story