from datetime import datetime
from typing import Any, Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class SimulationInput(BaseModel):
    """Input payload representing hypothetical lifestyle or biomarker changes."""
    weight_kg: Optional[float] = Field(None, gt=10, lt=500, json_schema_extra={"example": 70.0})
    systolic_bp: Optional[int] = Field(None, ge=60, le=260, json_schema_extra={"example": 115})
    diastolic_bp: Optional[int] = Field(None, ge=30, le=160, json_schema_extra={"example": 75})
    fasting_glucose: Optional[float] = Field(None, ge=40, le=500, json_schema_extra={"example": 90.0})
    exercise_hours_per_week: Optional[float] = Field(None, ge=0, le=56, json_schema_extra={"example": 5.0})
    sleep_hours_per_night: Optional[float] = Field(None, ge=1, le=24, json_schema_extra={"example": 8.0})
    stress_level: Optional[int] = Field(None, ge=1, le=10, json_schema_extra={"example": 2})
    smoking_status: Optional[str] = Field(None, json_schema_extra={"example": "never"})
    alcohol_drinks_per_week: Optional[int] = Field(None, ge=0, le=100, json_schema_extra={"example": 0})
    water_intake_liters: Optional[float] = Field(None, ge=0, le=20, json_schema_extra={"example": 3.0})


class SimulationCreate(BaseModel):
    """Internal schema for saving a simulation record."""
    profile_id: int
    input_changes: Dict[str, Any]
    projected_score: Dict[str, Any]


class SimulationResponse(BaseModel):
    """Schema for returning simulation results."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    profile_id: int
    input_changes: Dict[str, Any]
    projected_score: Dict[str, Any]
    created_at: datetime
