from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.users.models import User


class UserRepo:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def save_user(self, user_data: dict[str, Any]) -> User:
        user = User(**user_data)
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def get_user_by_tg_id(self, tg_user_id: int) -> User | None:
        stmt = select(User).where(User.tg_user_id == tg_user_id)
        res = await self._session.execute(stmt)
        return res.scalar_one_or_none()
