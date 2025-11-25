from fastapi import APIRouter

from backend.api.users.dependencies import ServiceDep
from backend.api.users.schemas import UserRequest, UserResponse

users_router = APIRouter(prefix="/users", tags=["users"])


@users_router.post("", response_model=UserResponse, status_code=201)
async def create_user(user_data: UserRequest, service: ServiceDep) -> UserResponse:
    return await service.save_user(user_data)


@users_router.get("/{tg_user_id}", response_model=UserResponse, status_code=200)
async def get_user_by_tg_id(tg_user_id: int, service: ServiceDep) -> UserResponse:
    return await service.get_user_by_tg_id(tg_user_id)
