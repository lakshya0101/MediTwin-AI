from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ProfileBase(BaseModel):
    """Base Pydantic model for Profile attributes with rigorous clinical validation."""
    full_name: str = Field(..., min_length=1, max_length=255, json_schema_extra={"example": "John Doe"})
    age: int = Field(..., ge=1, le=120, json_schema_extra={"example": 35})
    biological_sex: str = Field(..., json_schema_extra={"example": "male"}, description="male, female, or other")
    height_cm: float = Field(..., gt=30, lt=300, json_schema_extra={"example": 175.0})
    weight_kg: float = Field(..., gt=10, lt=500, json_schema_extra={"example": 75.0})
    systolic_bp: int = Field(..., ge=60, le=260, json_schema_extra={"example": 120})
    diastolic_bp: int = Field(..., ge=30, le=160, json_schema_extra={"example": 80})
    fasting_glucose: float = Field(..., ge=40, le=500, json_schema_extra={"example": 95.0}, description="mg/dL")
    total_cholesterol: float = Field(..., ge=70, le=600, json_schema_extra={"example": 190.0}, description="mg/dL")
    hdl_cholesterol: float = Field(..., ge=10, le=150, json_schema_extra={"example": 55.0}, description="mg/dL")
    ldl_cholesterol: float = Field(..., ge=20, le=400, json_schema_extra={"example": 110.0}, description="mg/dL")
    exercise_hours_per_week: float = Field(..., ge=0, le=56, json_schema_extra={"example": 3.5})
    sleep_hours_per_night: float = Field(..., ge=1, le=24, json_schema_extra={"example": 7.5})
    stress_level: int = Field(..., ge=1, le=10, json_schema_extra={"example": 4}, description="Scale 1 (lowest) to 10 (highest)")
    smoking_status: str = Field(..., json_schema_extra={"example": "never"}, description="never, former, or current")
    alcohol_drinks_per_week: int = Field(..., ge=0, le=100, json_schema_extra={"example": 2})
    water_intake_liters: float = Field(..., ge=0, le=20, json_schema_extra={"example": 2.5})

    @field_validator("biological_sex")
    @classmethod
    def validate_biological_sex(cls, v: str) -> str:
        v_clean = v.strip().lower()
        if v_clean not in {"male", "female", "other"}:
            raise ValueError("biological_sex must be one of: 'male', 'female', 'other'")
        return v_clean

    @field_validator("smoking_status")
    @classmethod
    def validate_smoking_status(cls, v: str) -> str:
        v_clean = v.strip().lower()
        if v_clean not in {"never", "former", "current"}:
            raise ValueError("smoking_status must be one of: 'never', 'former', 'current'")
        return v_clean

    @model_validator(mode="after")
    def validate_blood_pressure(self) -> "ProfileBase":
        if self.systolic_bp <= self.diastolic_bp:
            raise ValueError(
                f"Systolic blood pressure ({self.systolic_bp} mmHg) must be greater than diastolic blood pressure ({self.diastolic_bp} mmHg)."
            )
        return self


class ProfileCreate(ProfileBase):
    """Schema for creating a new Profile."""
    pass


class ProfileUpdate(BaseModel):
    """Schema for updating an existing Profile (all fields optional)."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    age: Optional[int] = Field(None, ge=1, le=120)
    biological_sex: Optional[str] = None
    height_cm: Optional[float] = Field(None, gt=30, lt=300)
    weight_kg: Optional[float] = Field(None, gt=10, lt=500)
    systolic_bp: Optional[int] = Field(None, ge=60, le=260)
    diastolic_bp: Optional[int] = Field(None, ge=30, le=160)
    fasting_glucose: Optional[float] = Field(None, ge=40, le=500)
    total_cholesterol: Optional[float] = Field(None, ge=70, le=600)
    hdl_cholesterol: Optional[float] = Field(None, ge=10, le=150)
    ldl_cholesterol: Optional[float] = Field(None, ge=20, le=400)
    exercise_hours_per_week: Optional[float] = Field(None, ge=0, le=56)
    sleep_hours_per_night: Optional[float] = Field(None, ge=1, le=24)
    stress_level: Optional[int] = Field(None, ge=1, le=10)
    smoking_status: Optional[str] = None
    alcohol_drinks_per_week: Optional[int] = Field(None, ge=0, le=100)
    water_intake_liters: Optional[float] = Field(None, ge=0, le=20)

    @field_validator("biological_sex")
    @classmethod
    def validate_biological_sex(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v_clean = v.strip().lower()
        if v_clean not in {"male", "female", "other"}:
            raise ValueError("biological_sex must be one of: 'male', 'female', 'other'")
        return v_clean

    @field_validator("smoking_status")
    @classmethod
    def validate_smoking_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v_clean = v.strip().lower()
        if v_clean not in {"never", "former", "current"}:
            raise ValueError("smoking_status must be one of: 'never', 'former', 'current'")
        return v_clean


class ProfileResponse(ProfileBase):
    """Schema for returning Profile response."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
