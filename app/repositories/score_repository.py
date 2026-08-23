from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.score import Score
from app.schemas.score import ScoreCreate


class ScoreRepository:
    """Repository handling database operations for Scores."""

    async def create(self, db: AsyncSession, score_in: ScoreCreate) -> Score:
        score = Score(**score_in.model_dump())
        db.add(score)
        await db.flush()
        return score

    async def get_latest_by_profile_id(
        self, db: AsyncSession, profile_id: int
    ) -> Optional[Score]:
        result = await db.execute(
            select(Score)
            .where(Score.profile_id == profile_id)
            .order_by(Score.calculated_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()


score_repository = ScoreRepository()
