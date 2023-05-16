from fastapi import Depends, APIRouter, Path
from typing import Annotated
from dependencies import get_current_user
from db.schemas import User

router = APIRouter(tags=["users"], prefix="/users")


@router.get("/")
async def create_user():
    return {"Hello": "User"}


@router.get("/me", response_model=User)
async def me(user: Annotated[User, Depends(get_current_user)]):
    return {"Hello": "User"}


@router.put("/{user_id}", response_model=User)
async def find_user(user_id: Annotated[str, Path(id="The ID of the user to get")]):
    return {"Hello": "User"}
