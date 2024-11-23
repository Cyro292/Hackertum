import os


MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://root:root@mongo:27017")
DATABASE_NAME = "main_db"
COLLECTION_NAME = "stories"
USER_LIKES_COLLECTION = "user_likes"