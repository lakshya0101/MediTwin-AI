from datetime import datetime
from typing import Dict, Optional
from pydantic import BaseModel, ConfigDict, Field


class ScoreBase(BaseModel):
    """Base Pydantic schema for health score metrics."""
    overall_score: float = Field(..., ge=0, le=100, json_schema_extra={"example": 85.5})
    bmi: float = Field(..., ge=10, le=90, json_schema_extra={"example": 24.5})
    bmi_category: str = Field(..., json_schema_extra={"example": "Normal weight"})
    cardiovascular_score: float = Field(..., ge=0, le=100, json_schema_extra={"example": 88.0})
    metabolic_score: float = Field(..., ge=0, le=100, json_schema_extra={"example": 82.0})
    lifestyle_score: float = Field(..., ge=0, le=100, json_schema_extra={"example": 86.5})


class ScoreCreate(ScoreBase):
    """Schema for internal creation of Score record."""
    profile_id: int


class ScoreResponse(ScoreBase):
    """Schema for returning computed Score response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    profile_id: int
    calculated_at: datetime


class SubScoresBreakdown(BaseModel):
    """Detailed sub-scores breakdown."""
    bmi_score: float
    bp_score: float
    glucose_score: float
    cholesterol_score: float
    exercise_score: float
    sleep_score: float
    stress_score: float
    smoking_score: float
    alcohol_score: float
    water_score: float


class DetailedScoreResponse(ScoreResponse):
    """Enriched score response containing full sub-score analysis and risk profile."""
    sub_scores: Optional[SubScoresBreakdown] = None
    risk_category: Optional[str] = Field(None, json_schema_extra={"example": "Low Risk"})
