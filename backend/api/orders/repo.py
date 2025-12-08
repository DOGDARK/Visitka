from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.orders.models import Order


class Repo:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create_order(self, order_data: dict[str, Any]) -> Order:
        order = Order(**order_data)
        self._session.add(order)
        await self._session.commit()
        await self._session.refresh(order)
        return order

    async def get_order(self, order_id: int) -> Order | None:
        stmt = select(Order).where(Order.id == order_id)
        res = await self._session.execute(stmt)
        return res.scalar_one_or_none()
