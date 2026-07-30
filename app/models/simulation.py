from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict
from sqlalchemy import JSON, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.profile import Profile


class Simulation(Base):
    """SQLAlchemy model storing hypothetical simulation scenarios and projected health metrics."""

    __tablename__ = "simulations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, index=True)
    profile_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True
    )
    input_changes: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    projected_score: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # Relationships
    profile: Mapped["Profile"] = relationship("Profile", back_populates="simulations")
