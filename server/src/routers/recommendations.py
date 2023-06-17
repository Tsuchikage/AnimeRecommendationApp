from fastapi import APIRouter, Depends, Request, HTTPException, status
from dependencies import get_current_user
from models import User, RecommendationPayload
from crud.recommendations import get_item_based_recommendations, get_content_based_recommendations, create_recommendation, find_recommendation


router = APIRouter(tags=["recommendations"], prefix="/recommendations")


@router.post("/item-based")
async def generate_item_based_recommendations(payload: RecommendationPayload,
                                   request: Request,
                                   user: User = Depends(get_current_user)):
    recommendations = await get_item_based_recommendations(request, payload.search_words, payload.count)

    recommendaiton_id = await create_recommendation(request.app.db, user['id'], recommendations, payload.search_words)

    return await find_recommendation(request.app.db, recommendaiton_id)


@router.post("/content-based")
async def generate_content_based_recommendations(payload: RecommendationPayload,
                                   request: Request,
                                   user: User = Depends(get_current_user)):
    recommendations = await get_content_based_recommendations(request, payload.search_words, payload.count)

    recommendaiton_id = await create_recommendation(request.app.db, user['id'], recommendations, payload.search_words)

    return await find_recommendation(request.app.db, recommendaiton_id)


@router.get("/{recommendaiton_id}")
async def find(recommendaiton_id, request: Request, user: User = Depends(get_current_user)):
    recommendation = await find_recommendation(request.app.db, recommendaiton_id)

    if recommendation is None:
      raise HTTPException(
          status_code=status.HTTP_404_NOT_FOUND,
          detail=f"Recommendation {recommendaiton_id} not found",
      )
    
     
    return recommendation
