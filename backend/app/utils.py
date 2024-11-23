import typing
from bson import ObjectId
from typing import Dict, Any

from .models import UserLike, UserLikeDBO

def convert_objectid_to_str(document: Dict[str, Any]) -> Dict[str, Any]:
    if '_id' in document and isinstance(document['_id'], ObjectId):
        document['_id'] = str(document['_id'])
    return document

def convert_userlikedbo_to_userlike(user_like_dbo: typing.Mapping) -> UserLike:
    return UserLike(
        id=str(user_like_dbo['_id']),
        name=user_like_dbo['name'],
        image=user_like_dbo['image']
    )