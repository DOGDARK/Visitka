from pydantic import BaseModel


class OrderRequest(BaseModel):
    description: str | None = None
    tariff: str 
    db: bool = False
    payment: bool = False
    pages_enabled: bool = False
    pages_count: int | None = None
    final_price: int 
    init_data: str


class OrderResponse(BaseModel):
    id: int
    description: str | None = None
    tariff: str 
    db: bool = False
    payment: bool = False
    pages_nabled: bool = False
    pages_ount: int | None = None
    final_price: int 
    order_status: str | None = None

    model_config = {"from_attributes": True}
