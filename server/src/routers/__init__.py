from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.anime import router as anime_router
from routers.recommendations import router as recommendations_router

__all__ = ["auth_router", "users_router", "recommendations_router", "anime_router"]