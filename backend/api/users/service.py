import json
from typing import Any
from urllib.parse import parse_qs, unquote

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

from backend.api.users.repo import Repo
from backend.api.users.schemas import UserRequest, UserResponse


class Service:
    def __init__(self, repo: Repo) -> None:
        self._repo = repo

    async def save_user(self, user_data: UserRequest) -> UserResponse:
        data = user_data.model_dump()
        init_data = data.pop("init_data")
        tg_user_id = self._parse_init_data(init_data).get("user").get("id")
        if not tg_user_id:
            raise HTTPException(status_code=400, detail="tg_user_id not found")
        data["tg_user_id"] = tg_user_id
        try:
            user = await self._repo.save_user(data)
        except IntegrityError:
            raise HTTPException(status_code=400, detail="User already exists")
        return UserResponse.model_validate(user, from_attributes=True)

    async def get_user_by_tg_id(self, tg_user_id: int) -> UserResponse | None:
        user = await self._repo.get_user_by_tg_id(tg_user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserResponse.model_validate(user, from_attributes=True)

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
