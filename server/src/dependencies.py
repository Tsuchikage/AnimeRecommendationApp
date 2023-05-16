from datetime import datetime

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette import status

from settings import get_settings
from db.engine import get_async_session
from db.models import User
from utils import decode_jwt

settings = get_settings()

oauth = OAuth2PasswordBearer(tokenUrl="/api/auth/login", scheme_name="JWT")


async def get_current_user(
    token: str = Depends(oauth), session: AsyncSession = Depends(get_async_session)
) -> User:
    try:
        token_data = decode_jwt(token)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    q = select(User).filter_by(username=token_data.username)

    user = (await session.execute(q)).scalars().first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user",
        )
    return user




