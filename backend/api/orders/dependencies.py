from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.core.dependencies import get_session
from backend.api.orders.repo import OrderRepo
from backend.api.orders.service import OrderService
from backend.api.users.repo import UserRepo


def get_repo(session: AsyncSession = Depends(get_session)) -> OrderRepo:
    return OrderRepo(session)


def get_user_repo(session: AsyncSession = Depends(get_session)) -> UserRepo:
    return UserRepo(session)


def get_service(
    repo: OrderRepo = Depends(get_repo), user_repo: UserRepo = Depends(get_user_repo)
) -> OrderService:
    return OrderService(repo, user_repo)


ServiceDep = Annotated[OrderService, Depends(get_service)]
