from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from dependencies import oauth
from db import models, engine, schemas
from utils import (
    create_access_token,
    create_refresh_token,
    get_hashed_password,
    verify_password,
    decode_jwt
)

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post("/signup", response_model=schemas.User, status_code=201)
async def create_user(data: schemas.UserCreate, session: AsyncSession = Depends(engine.get_async_session)):
    q = select(models.User).filter_by(username=data.username)

    user = (await session.execute(q)).scalars().first()

    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this username is already exist",
        )
    user = models.User(
        username=data.username,
        password=get_hashed_password(data.password),
    )

    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@router.post("/login", response_model=schemas.Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(engine.get_async_session),
):
    q = select(models.User).filter_by(username=form_data.username)

    user = (await session.execute(q)).scalars().first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    password_verified = verify_password(
        password=form_data.password, hashed_password=user.password
    )

    if not password_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    
    return schemas.Token(
        access_token=create_access_token(user.username),
        refresh_token=create_refresh_token(user.username),
    )

@router.post('/refresh')
def refresh(token: Annotated[str, Depends(oauth)]):
    token_data = decode_jwt(token)

    return schemas.Token(
        access_token=create_access_token(token_data.username),
        refresh_token=create_refresh_token(token_data.username),
    )

