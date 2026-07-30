import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import TAGS_METADATA, settings
from app.core.database import engine
from app.core.exceptions import register_exception_handlers
from app.core.init_db import init_db
from app.core.logging import logger, setup_logging

app_start_time: float = 0.0


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan context manager handling application startup initialization and shutdown cleanup."""
    global app_start_time
    app_start_time = time.time()

    # 1. Initialize structured logging configuration
    setup_logging()
    logger.info(f"Initializing {settings.APP_NAME} in [{settings.APP_ENV}] mode...")

    # 2. Execute database schema initialization via dedicated module
    await init_db()

    yield

    # 3. Graceful shutdown: Dispose database connection pool
    logger.info("Application shutting down. Disposing database engine connections...")
    await engine.dispose()
    logger.info("Database engine connections disposed successfully.")


app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    contact={
        "name": settings.CONTACT_NAME,
        "email": settings.CONTACT_EMAIL,
        "url": settings.CONTACT_URL,
    },
    license_info={
        "name": settings.LICENSE_NAME,
        "url": settings.LICENSE_URL,
    },
    openapi_tags=TAGS_METADATA,
    lifespan=lifespan,
)


@app.middleware("http")
async def log_requests_middleware(request: Request, call_next) -> Response:
    """Middleware logging HTTP method, endpoint path, status code, and execution duration."""
    start_time = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start_time) * 1000.0

    logger.info(
        f"{request.method} {request.url.path} | Status: {response.status_code} | Duration: {duration_ms:.2f}ms"
    )
    return response


# Configure CORS Middleware
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register Global Exception Handlers
register_exception_handlers(app)

# Include Central API Router
app.include_router(api_router)


@app.get("/", include_in_schema=False)
async def root():
    """Root landing endpoint returning API details and links to documentation/health check."""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
    }
