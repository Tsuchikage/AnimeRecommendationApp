from fastapi import Depends, APIRouter
from dependencies import get_current_user
from models import User

router = APIRouter(tags=["users"], prefix="/users")

@router.get("/me")
async def me(user: User = Depends(get_current_user)):
    return user
