from functools import lru_cache
from pydantic import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AnimeRecommendation API"
    ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60
    REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
    JWT_ALGORITHM = "HS256"
    JWT_SECRET_KEY: str = "SECRET"
    JWT_REFRESH_SECRET_KEY: str = "SECRET"

    MONGO_INITDB_DATABASE: str = 'anime'
    DATABASE_URI: str = "mongodb://root:password@localhost:27017/"


@lru_cache()
def get_settings():
    return Settings()


