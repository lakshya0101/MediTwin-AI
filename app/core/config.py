from enum import Enum
from typing import Any, Dict, List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_NAME: str = "MediTwin AI Backend"
    APP_DESCRIPTION: str = (
        "MediTwin AI - Digital Health Twin Platform Backend API. "
        "Provides asynchronous health data processing, digital twin state management, and predictive medical AI integrations."
    )
    APP_VERSION: str = "1.0.0"
    APP_ENV: Environment = Environment.DEVELOPMENT
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # OpenAPI / Swagger Metadata
    CONTACT_NAME: str = "MediTwin AI Development Team"
    CONTACT_EMAIL: str = "support@meditwin.ai"
    CONTACT_URL: str = "https://meditwin.ai"
    LICENSE_NAME: str = "MIT License"
    LICENSE_URL: str = "https://opensource.org/licenses/MIT"

    # Database Configuration
    DATABASE_URL: str = "sqlite+aiosqlite:///./meditwin.db"

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(f"Invalid CORS origins value: {v}")

    # Logging Configuration
    LOG_LEVEL: str = "INFO"


settings = Settings()

TAGS_METADATA: List[Dict[str, Any]] = [
    {
        "name": "Health Check",
        "description": "System health diagnostics, readiness checks, database connection status, and uptime tracking.",
    },
]
