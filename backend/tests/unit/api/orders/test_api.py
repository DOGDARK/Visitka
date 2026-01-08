from unittest.mock import AsyncMock

from fastapi.testclient import TestClient

from backend.api.main import app
from backend.api.orders.dependencies import get_service
from backend.api.orders.schemas import OrderResponse

client = TestClient(app)


def test_create_order():
    expected_resp = OrderResponse(id=1, final_price= 10, tariff="tariff")

    def override_get_service():
        serv = AsyncMock()
        serv.create_order.return_value = expected_resp
        return serv

    app.dependency_overrides[get_service] = override_get_service

    response = client.post("/orders", json={"init_data": "data", "final_price": 10, "tariff": "tariff"})

    assert response.status_code == 201
    assert response.json() == expected_resp.model_dump()



def test_get_order():
    expected_resp = OrderResponse(id=1, final_price= 10, tariff="tariff")

    def override_get_service():
        serv = AsyncMock()
        serv.get_order.return_value = expected_resp
        return serv

    app.dependency_overrides[get_service] = override_get_service

    response = client.get("/orders/1")

    assert response.status_code == 200
    assert response.json() == expected_resp.model_dump()
