from fastapi import APIRouter, FastAPI
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware
from settings import get_settings
from routers import auth_router, users_router


settings = get_settings()


def create_app():
    
    app = FastAPI(
        title="ANIME RECOMMENDATION API",
        version="0.0.1",
        docs_url="/api/docs",
        openapi_url="/api/openapi.json",
    )
    api = APIRouter(prefix="/api")

    api.include_router(auth_router)
    api.include_router(users_router)

    app.include_router(api)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )


    add_pagination(app)

    print(settings.DATABASE_URI)
    return app
