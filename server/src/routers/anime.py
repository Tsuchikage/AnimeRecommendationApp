from fastapi import APIRouter, Depends, Request
from dependencies import get_current_user
from models import User
from fastapi_pagination import Page
from fastapi_pagination.ext.motor import paginate
from typing import Any


router = APIRouter(tags=["anime"], prefix="/anime")


@router.get("/")
async def get_animelist(request: Request, 
                        q: str | None = None,
                        type: str | None = None,
                        genre: str | None = None,
                        user: User = Depends(get_current_user)) -> Page[Any]:
    
    query = {}
    
    if q:
        query['title'] = {'$regex': q, '$options': 'i'}

    if genre:
        genres = genre.split(';')
        query['genres'] = {'$all': genres}        

    if type:
        types = type.split(';')
        query['type'] = {'$in': types}

    paginated_list = await paginate(request.app.db.animelist, query)

    for item in paginated_list.items:
        item['id'] = str(item['_id'])
        item.pop('_id')

    return paginated_list
