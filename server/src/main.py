from app import create_app
from db.base import Base
from db.engine import async_engine

# models.Base.metadata.create_all(bind=async_engine)

app = create_app()

@app.on_event("startup")
async def init_tables():
    # print("startup")
    async with async_engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)