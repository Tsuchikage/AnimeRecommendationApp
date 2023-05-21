from fastapi import APIRouter, Depends, Request
from dependencies import get_current_user
from models import User, RecommendationPayload
from dependencies import get_recommendations


router = APIRouter(tags=["recommendations"], prefix="/recommendations")


@router.post("/")
async def generate_recommendations(payload: RecommendationPayload,
                                   request: Request,
                                   user: User = Depends(get_current_user)):
    return get_recommendations(request.app.data, payload.search_words, payload.count)
