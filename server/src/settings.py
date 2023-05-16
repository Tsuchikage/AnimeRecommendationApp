from functools import lru_cache
from typing import Any

from pydantic import BaseSettings, PostgresDsn, validator


class Settings(BaseSettings):
    APP_NAME: str = "AnimeRecommendation API"
    ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60
    REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
    JWT_ALGORITHM = "HS256"
    JWT_SECRET_KEY: str = "SECRET"
    JWT_REFRESH_SECRET_KEY: str = "SECRET"

    POSTGRES_USER: str = 'user'
    POSTGRES_PASSWORD: str = 'password'
    POSTGRES_HOST: str = 'localhost'
    POSTGRES_DB: str = 'anime'
    POSTGRES_PORT: str = '5432'
    DATABASE_URI: PostgresDsn | None = None

    @validator("DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str | None, values: dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_HOST"),
            path=f'/{values.get("POSTGRES_DB") or ""}',
            port=f'{values.get("POSTGRES_PORT") or ""}',
        )



@lru_cache()
def get_settings():
    return Settings()


