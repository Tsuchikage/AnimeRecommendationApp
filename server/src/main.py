from app import create_app
from settings import get_settings
from dependencies import init_dataset, init_animelist_collection
from motor.motor_asyncio import AsyncIOMotorClient

settings = get_settings()
app = create_app()


@app.on_event("startup")
async def startup_db_client():
    print(f"settings.DATABASE_URI: {settings.DATABASE_URI}")
    app.db = AsyncIOMotorClient(settings.DATABASE_URI)[settings.MONGO_INITDB_DATABASE]

    await init_animelist_collection(app.db)

    app.data = init_dataset()


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()