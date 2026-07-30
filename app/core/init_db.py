from app.core.database import Base, engine
from app.core.logging import logger


async def init_db() -> None:
    """Initializes database tables during application startup."""
    logger.info("Initializing database schemas...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database schemas initialized successfully.")
