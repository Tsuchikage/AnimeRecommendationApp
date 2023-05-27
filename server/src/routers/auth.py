from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from fastapi.security import OAuth2PasswordRequestForm
from crud.users import create_user, get_user_by_username, auth_user

from dependencies import oauth
import models
from utils import (
    create_access_token,
    create_refresh_token,
    verify_password,
    decode_jwt,
)

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post("/signup")
async def signup(request: Request, payload: models.UserAuth = Body(...)):
    existing_user = await get_user_by_username(request.app.db, payload.username.lower())
    
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail="Incorrect username or password")

    new_user = await create_user(request.app.db, payload)

    return new_user



@router.post("/login")
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    existing_user = await auth_user(request.app.db, form_data.username.lower())

    if existing_user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    
    password_verified = verify_password(
        password=form_data.password, hashed_password=existing_user['password']
    )

    if not password_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    
    user = await get_user_by_username(request.app.db, existing_user['username'])
    print(user)
    
    token = models.Token(
        access_token=create_access_token(existing_user['username']),
        refresh_token=create_refresh_token(existing_user['username']),
    )

    return {
        "access_token": token.access_token,
        "refresh_token": token.refresh_token,
        "user": user
    }

@router.post('/refresh', response_model=models.Token)
def refresh(token: Annotated[str, Depends(oauth)]):
    token_data = decode_jwt(token)

    return models.Token(
        access_token=create_access_token(token_data.username),
        refresh_token=create_refresh_token(token_data.username),
    )

