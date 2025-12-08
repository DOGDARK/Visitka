import json
from typing import Any
from urllib.parse import parse_qs, unquote

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from backend.api.orders.repo import Repo
from backend.api.orders.schemas import OrderRequest, OrderResponse


class Service:
    def __init__(self, repo: Repo) -> None:
        self._repo = repo

    async def create_order(self, order_data: OrderRequest) -> OrderResponse:
        data = order_data.model_dump(by_alias=True)
        init_data = data.pop("init_data")

        parsed = self._parse_init_data(init_data)
        tg_user_id = parsed.get("user", {}).get("id")

        if not tg_user_id:
            raise HTTPException(status_code=400, detail="tg_user_id not found")

        data["user_id"] = tg_user_id

        try:
            order = await self._repo.create_order(data)
        except IntegrityError:
            raise HTTPException(status_code=400, detail="Order create error")

        return OrderResponse.model_validate(order)

    async def get_order(self, order_id: int) -> OrderResponse:
        order = await self._repo.get_order(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return OrderResponse.model_validate(order)

    def _parse_init_data(self, init_data: str) -> dict[str, Any]:
        parsed = parse_qs(init_data)
        result = {}

        for key, values in parsed.items():
            value = values[0]

            if key == "user":
                result[key] = json.loads(unquote(value))
            elif key == "auth_date":
                result[key] = int(value)
            else:
                result[key] = value

        return result
