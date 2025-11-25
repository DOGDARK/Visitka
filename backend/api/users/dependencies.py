from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.api.core.dependencies import get_session
from backend.api.users.repo import Repo
from backend.api.users.service import Service


def get_repo(session: AsyncSession = Depends(get_session)) -> Repo:
    return Repo(session)


def get_service(repo: Repo = Depends(get_repo)) -> Service:
    return Service(repo)


ServiceDep = Annotated[Service, Depends(get_service)]
