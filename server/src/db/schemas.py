import datetime

from pydantic import BaseModel, SecretStr


class PydanticTimestampMixin:
    created_at: datetime.datetime
    updated_at: datetime.datetime


class UserBase(BaseModel, PydanticTimestampMixin):
    username: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    username: str
    password: SecretStr
   
    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    username: str
    exp: float


class SimpleResponseSchema(BaseModel):
    status: str
    message: str