from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.core.dependencies import get_session
from backend.api.orders.repo import Repo
from backend.api.orders.service import Service

from backend.api.users.repo import Repo as UserRepo

def get_repo(session: AsyncSession = Depends(get_session)) -> Repo:
    return Repo(session)

def get_user_repo(session: AsyncSession = Depends(get_session)) -> UserRepo:
    return UserRepo(session)

def get_service(
    repo: Repo = Depends(get_repo),
    user_repo: UserRepo = Depends(get_user_repo)
) -> Service:
    return Service(repo, user_repo)


ServiceDep = Annotated[Service, Depends(get_service)]
