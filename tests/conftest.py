import pytest_asyncio
from app.core.init_db import init_db


@pytest_asyncio.fixture(autouse=True, scope="function")
async def setup_test_database():
    """Autouse fixture to ensure database tables exist prior to test execution."""
    await init_db()
