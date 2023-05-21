from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Body, Request
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from serializers import serialize_user

from dependencies import oauth
import models
from utils import (
    create_access_token,
    create_refresh_token,
    get_hashed_password,
    verify_password,
    decode_jwt,
)

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post("/signup")
async def create_user(request: Request, payload: models.UserAuth = Body(...)):
    user = jsonable_encoder({"username": payload.username,
                             "password": get_hashed_password(payload.password)})

    existing_user = request.app.db['users'].find_one({'username': payload.username.lower()})
    
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, 
                            detail="Incorrect username or password")


    user = request.app.db['users'].insert_one(user)
    
    new_user = request.app.db['users'].find_one({"_id": user.inserted_id})
    return serialize_user(new_user)



@router.post("/login", response_model=models.Token)
async def login(request: Request, form_data: OAuth2PasswordRequestForm = Depends()):
    existing_user = request.app.db['users'].find_one({'username': form_data.username.lower()})

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
    
    return models.Token(
        access_token=create_access_token(existing_user['username']),
        refresh_token=create_refresh_token(existing_user['username']),
    )

@router.post('/refresh', response_model=models.Token)
def refresh(token: Annotated[str, Depends(oauth)]):
    token_data = decode_jwt(token)

    return models.Token(
        access_token=create_access_token(token_data.username),
        refresh_token=create_refresh_token(token_data.username),
    )

