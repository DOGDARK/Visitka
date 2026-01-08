import pytest
from backend.api.orders.service import Service
from unittest.mock import AsyncMock, MagicMock
from backend.api.orders.schemas import OrderResponse, OrderRequest

@pytest.fixture
def mock_repo():
    return AsyncMock()

@pytest.fixture
def mock_user_repo():
    return AsyncMock()

@pytest.fixture
def service(mock_repo, mock_user_repo):
    return Service(mock_repo, mock_user_repo)

@pytest.mark.asyncio
async def test_create_order(mock_repo, mock_user_repo, service):
    request_data = OrderRequest(init_data="data", final_price=10, tariff = "tariff")
    parse_mock = MagicMock()
    tg_user_id = 1
    parse_mock.return_value = {"user":{"id":tg_user_id}}
    service._parse_init_data = parse_mock
    
    user_id = 2
    user_mock = MagicMock()
    user_mock.id = user_id
    mock_user_repo.get_user_by_tg_id.return_value = user_mock 
    
    mock_repo.create_order.return_value = {"id": 2, "final_price": 10, "tariff": "tariff"}

    result = await service.create_order(request_data)

    mock_user_repo.get_user_by_tg_id.assert_called_once_with(tg_user_id)
    mock_repo.create_order.assert_called_once()
    call_args = mock_repo.create_order.call_args[0][0]
    assert call_args["user_id"] == user_id
    assert isinstance(result, OrderResponse)
