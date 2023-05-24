from app import create_app
from settings import get_settings
from pymongo import MongoClient
from dependencies import init_dataset

settings = get_settings()
app = create_app()


@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(settings.DATABASE_URI)
    app.db = app.mongodb_client[settings.MONGO_INITDB_DATABASE]
    app.data = init_dataset()


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()