import pytest
import pytest_asyncio
from backend.api.orders.models import Order
from backend.api.orders.repo import Repo
from sqlalchemy import select

from backend.api.users.models import User


@pytest.fixture()
def test_repo(test_session):
    return Repo(test_session)

@pytest_asyncio.fixture()
async def test_user(test_session):
    user = User(tg_user_id=1)
    test_session.add(user)
    await test_session.commit()
    await test_session.refresh(user)
    return user


@pytest.mark.asyncio()
async def test_create_order(test_repo, test_session, test_user):
    result = await test_repo.create_order({"user_id": test_user.id, "final_price": 10, "tariff": "tariff"})
    expected = await test_session.execute(select(Order))
    assert result == expected.scalars().first()