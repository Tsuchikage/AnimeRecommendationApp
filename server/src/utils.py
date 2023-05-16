from datetime import datetime, timedelta

from jose import jwt
from passlib.context import CryptContext
from db.schemas import TokenPayload

from settings import get_settings

settings = get_settings()

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_context.verify(password, hashed_password)


def create_access_token(username: str) -> str:
    expires_delta = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    encode_data = {"exp": expires_delta, "username": username}
    return jwt.encode(encode_data, settings.JWT_SECRET_KEY, settings.JWT_ALGORITHM)

def decode_jwt(token: str) -> TokenPayload:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        return TokenPayload(**payload)

def create_refresh_token(username: str) -> str:
    expires_delta = datetime.utcnow() + timedelta(
        minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
    )
    encode_data = {"exp": expires_delta, "username": username}
    return jwt.encode(
        encode_data, settings.JWT_REFRESH_SECRET_KEY, settings.JWT_ALGORITHM
    )