from enum import Enum

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.api.core.models import Base


class OrderStatus(Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    FAILED = "failed"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    description: Mapped[str] = mapped_column(String(128), nullable=True)
    tariff: Mapped[str] = mapped_column(String(128), nullable=False)
    db: Mapped[bool] = mapped_column(bool, default=False)
    payment: Mapped[bool] = mapped_column(bool, default=False)
    pagesEnabled: Mapped[bool] = mapped_column(bool, default=False)
    pagesCount: Mapped[int] = mapped_column(Integer, nullable=True)
    finalPrice: Mapped[int] = mapped_column(Integer, nullable=False)
    order_status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), nullable=False, default=OrderStatus.NEW)
