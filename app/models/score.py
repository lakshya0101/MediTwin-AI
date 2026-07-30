from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.profile import Profile


class Score(Base):
    """SQLAlchemy model representing computed health metrics and overall scores."""

    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, index=True)
    profile_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    bmi: Mapped[float] = mapped_column(Float, nullable=False)
    bmi_category: Mapped[str] = mapped_column(String(50), nullable=False)
    cardiovascular_score: Mapped[float] = mapped_column(Float, nullable=False)
    metabolic_score: Mapped[float] = mapped_column(Float, nullable=False)
    lifestyle_score: Mapped[float] = mapped_column(Float, nullable=False)

    calculated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="scores")
