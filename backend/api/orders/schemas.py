from pydantic import BaseModel


class OrderRequest(BaseModel):
    desciption: str | None = None
    tariff: str | None = None
    db: bool = False
    payment: bool = False
    pagesEnabled: bool = False
    pagesCount: int | None = None
    finalPrice: int | None = None
    init_data: str




class OrderResponse(BaseModel):
    id: int
    desciption: str | None = None
    tariff: str | None = None
    db: bool = False
    payment: bool = False
    pagesEnabled: bool = False
    pagesCount: int | None = None
    finalPrice: int | None = None
