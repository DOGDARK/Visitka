from pydantic import BaseModel


class UserRequest(BaseModel):
    init_data: str
    first_name: str | None = None
    last_name: str | None = None


class UserResponse(BaseModel):
    id: int
    tg_user_id: int
    first_name: str | None = None
    last_name: str | None = None
