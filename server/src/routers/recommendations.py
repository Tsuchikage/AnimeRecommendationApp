from fastapi import APIRouter, Depends, Request
from dependencies import get_current_user
from models import User, RecommendationPayload
from crud.recommendations import get_recommendations, create_recommendation


router = APIRouter(tags=["recommendations"], prefix="/recommendations")


@router.post("/")
async def generate_recommendations(payload: RecommendationPayload,
                                   request: Request,
                                   user: User = Depends(get_current_user)):
    recommendations = get_recommendations(request, payload.search_words, payload.count)

    create_recommendation(request.app.db, user['id'], recommendations)

    return recommendations
