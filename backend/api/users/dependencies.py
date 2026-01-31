from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.core.dependencies import get_session
from backend.api.users.repo import UserRepo
from backend.api.users.service import UserService


def get_repo(session: AsyncSession = Depends(get_session)) -> UserRepo:
    return UserRepo(session)


def get_service(repo: UserRepo = Depends(get_repo)) -> UserService:
    return UserService(repo)


ServiceDep = Annotated[UserService, Depends(get_service)]
