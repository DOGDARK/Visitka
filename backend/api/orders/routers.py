from fastapi import APIRouter

from backend.api.orders.dependencies import ServiceDep
from backend.api.orders.schemas import OrderRequest, OrderResponse

orders_router = APIRouter(prefix="/orders", tags=["orders"])


@orders_router.post("", response_model=OrderResponse, status_code=201)
async def create_order(order_data: OrderRequest, service: ServiceDep) -> OrderResponse:
    return await service.create_order(order_data)


@orders_router.get("/{order_id}", response_model=OrderResponse, status_code=200)
async def get_order(order_id: int, service: ServiceDep) -> OrderResponse:
    return await service.get_order(order_id)
