import uuid
from typing import Optional, List, Any
from pydantic import BaseModel, Field

class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    username: str

    class Config:
        allow_population_by_field_name = True

class UserUpdate(BaseModel):
    username: Optional[str]


class UserAuth(BaseModel):
    username: str
    password: str


class Recommendations(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    user_id: Any
    search_words: list = []
    recommendations: list = []
    created_at: str

    class Config:
        allow_population_by_field_name = True


class Token(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    username: str
    exp: float


class PaginationPayload(BaseModel):
    page: int = 1
    limit: int = 5
    q: Optional[str] = None


class RecommendationPayload(BaseModel):
    search_words: List[str] = []
    count: int = 3
