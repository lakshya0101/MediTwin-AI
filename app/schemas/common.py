from typing import Generic, Optional, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standardized API success response wrapper."""
    success: bool = Field(default=True, description="Indicates if the API operation was successful.")
    data: Optional[T] = Field(default=None, description="Response payload data.")
    message: Optional[str] = Field(default=None, description="Optional human-readable response summary.")


class ErrorDetail(BaseModel):
    """Detailed error object structure for standard error payloads."""
    code: str = Field(..., description="Machine-readable error classification code.")
    message: str = Field(..., description="Human-readable error description.")
    details: Optional[dict] = Field(default=None, description="Detailed validation errors or contextual diagnostic dictionary.")


class ErrorResponse(BaseModel):
    """Standardized API error response wrapper."""
    success: bool = Field(default=False, description="Indicates failure status.")
    error: ErrorDetail = Field(..., description="Structured error details.")


class HealthData(BaseModel):
    """Payload schema for system health and readiness state."""
    status: str = Field(..., json_schema_extra={"example": "online"}, description="Overall service status (online/degraded).")
    app_name: str = Field(..., json_schema_extra={"example": "MediTwin AI Backend"}, description="Application instance name.")
    environment: str = Field(..., json_schema_extra={"example": "development"}, description="Current runtime environment.")
    database: str = Field(..., json_schema_extra={"example": "healthy"}, description="Database connectivity status.")
    version: str = Field(..., json_schema_extra={"example": "1.0.0"}, description="Application version.")
    uptime_seconds: float = Field(..., json_schema_extra={"example": 142.5}, description="System uptime in seconds.")
    timestamp: str = Field(..., json_schema_extra={"example": "2026-07-31T01:43:35Z"}, description="Current UTC timestamp in ISO-8601 format.")


class HealthResponse(APIResponse[HealthData]):
    """Structured health check API response model."""
    pass
