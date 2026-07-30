import time
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.schemas.common import HealthData, HealthResponse

router = APIRouter()

_fallback_start_time = time.time()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="System Health & Database Readiness Check",
    description="Validates overall application service status, version details, database connectivity, and system uptime.",
)
async def check_health(db: AsyncSession = Depends(get_db)):
    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception:
        db_status = "unhealthy"

    from app.main import app_start_time

    start_baseline = app_start_time if app_start_time > 0 else _fallback_start_time
    uptime_seconds = round(time.time() - start_baseline, 2)

    health_data = HealthData(
        status="online" if db_status == "healthy" else "degraded",
        app_name=settings.APP_NAME,
        environment=settings.APP_ENV,
        database=db_status,
        version=settings.APP_VERSION,
        uptime_seconds=uptime_seconds,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )

    return HealthResponse(
        success=True,
        data=health_data,
        message="System operational" if db_status == "healthy" else "Database service degraded",
    )
