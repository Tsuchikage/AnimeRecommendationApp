from fastapi import APIRouter, Depends, Request
from dependencies import get_current_user
from models import User
from fastapi_pagination import Page
from fastapi_pagination.ext.motor import paginate
from typing import Any


router = APIRouter(tags=["anime"], prefix="/anime")


@router.get("/list")
async def get_animelist(request: Request, user: User = Depends(get_current_user)) -> Page[Any]:
    paginated_list = await paginate(request.app.db.animelist)

    for item in paginated_list.items:
        item['id'] = str(item['_id'])
        item.pop('_id')

    return paginated_list
