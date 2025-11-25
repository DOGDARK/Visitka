from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.core.db_init import DbSession


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with DbSession() as session:
        yield session
