import pytest_asyncio
from backend.api.core.settings import Settings
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from backend.api.core.models import Base

@pytest_asyncio.fixture(scope="function")
async def test_session():
    engine = create_async_engine(
    f"postgresql+asyncpg://{Settings.POSTGRES_USER}:{Settings.POSTGRES_PASSWORD}@{Settings.POSTGRES_HOST}:"
    f"{Settings.POSTGRES_PORT}/{Settings.POSTGRES_DB}",
)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    session = async_session()
    
    yield session
    
    await session.close()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)