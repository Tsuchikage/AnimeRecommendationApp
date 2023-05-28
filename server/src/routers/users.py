from fastapi import Depends, APIRouter, Request
from dependencies import get_current_user
from models import User
from fastapi_pagination import Page
from fastapi_pagination.ext.motor import paginate
from typing import Any
from bson import ObjectId

router = APIRouter(tags=["users"], prefix="/users")

@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return user


@router.get("/recommendations")
async def recommendations(request: Request, user: User = Depends(get_current_user)) -> Page[Any]:
    paginated_list = await paginate(request.app.db.recommendations, 
                                    {"user_id": ObjectId(user['id'])},
                                    None,
                                    {"created_at": -1})

    for item in paginated_list.items:
        item['id'] = str(item['_id'])
        item['user_id'] = str(item['user_id'])

        total_results = 0

        for key, values in item['data'].items():
            values_length = len(values)

            item['data'][key] = [str(object_id) for object_id in values]
            total_results += values_length

        item['total'] = total_results
        item.pop('_id')

    return paginated_list
