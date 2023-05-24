from fastapi import Depends, APIRouter, Request
from dependencies import get_current_user
from models import User, RecommendationOut
from fastapi_pagination import Page, paginate
from crud.users import get_user_recommendations

router = APIRouter(tags=["users"], prefix="/users")

@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return user


@router.get("/recommendations")
async def recommendations(request: Request, user: User = Depends(get_current_user)) -> Page[RecommendationOut]:
    return paginate(get_user_recommendations(request.app.db, user['id']))
