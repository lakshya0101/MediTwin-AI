from datetime import datetime
from typing import TYPE_CHECKING, List
from sqlalchemy import CheckConstraint, DateTime, Float, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.score import Score
    from app.models.simulation import Simulation


class Profile(Base):
    """SQLAlchemy model representing a patient's digital health profile with database constraints."""

    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    biological_sex: Mapped[str] = mapped_column(String(50), nullable=False)
    height_cm: Mapped[float] = mapped_column(Float, nullable=False)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    systolic_bp: Mapped[int] = mapped_column(Integer, nullable=False)
    diastolic_bp: Mapped[int] = mapped_column(Integer, nullable=False)
    fasting_glucose: Mapped[float] = mapped_column(Float, nullable=False)
    total_cholesterol: Mapped[float] = mapped_column(Float, nullable=False)
    hdl_cholesterol: Mapped[float] = mapped_column(Float, nullable=False)
    ldl_cholesterol: Mapped[float] = mapped_column(Float, nullable=False)
    exercise_hours_per_week: Mapped[float] = mapped_column(Float, nullable=False)
    sleep_hours_per_night: Mapped[float] = mapped_column(Float, nullable=False)
    stress_level: Mapped[int] = mapped_column(Integer, nullable=False)
    smoking_status: Mapped[str] = mapped_column(String(50), nullable=False)
    alcohol_drinks_per_week: Mapped[int] = mapped_column(Integer, nullable=False)
    water_intake_liters: Mapped[float] = mapped_column(Float, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationships
    scores: Mapped[List["Score"]] = relationship(
        "Score", back_populates="profile", cascade="all, delete-orphan", order_by="desc(Score.calculated_at)"
    )
    simulations: Mapped[List["Simulation"]] = relationship(
        "Simulation", back_populates="profile", cascade="all, delete-orphan", order_by="desc(Simulation.created_at)"
    )

    __table_args__ = (
        CheckConstraint("age > 0 AND age <= 120", name="check_valid_age"),
        CheckConstraint("systolic_bp > diastolic_bp", name="check_systolic_gt_diastolic"),
        CheckConstraint("stress_level >= 1 AND stress_level <= 10", name="check_stress_level_range"),
        Index("idx_profile_created", "created_at"),
    )
