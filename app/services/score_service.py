import logging
import time
from typing import Optional
from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.domain import health_engine
from app.integrations.base_ai import BaseAIProvider
from app.repositories.profile_repository import profile_repository
from app.repositories.score_repository import score_repository
from app.schemas.score import DetailedScoreResponse, ScoreCreate, ScoreResponse, SubScoresBreakdown

logger = logging.getLogger("meditwin.score_service")


class ScoreService:
    """Service layer for computing and persisting health scores with optional AI hook integration."""

    def __init__(self, ai_provider: Optional[BaseAIProvider] = None) -> None:
        self.ai_provider = ai_provider

    async def calculate_and_save_score(
        self, db: AsyncSession, profile_id: int
    ) -> DetailedScoreResponse:
        start_time = time.perf_counter()
        logger.info(f"Initiating health score calculation for Profile ID: {profile_id}")

        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
            logger.warning(f"Score calculation aborted. Profile ID {profile_id} not found.")
            raise AppException(
                message=f"Profile with ID {profile_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        profile_dict = {
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "systolic_bp": profile.systolic_bp,
            "diastolic_bp": profile.diastolic_bp,
            "fasting_glucose": profile.fasting_glucose,
            "total_cholesterol": profile.total_cholesterol,
            "hdl_cholesterol": profile.hdl_cholesterol,
            "ldl_cholesterol": profile.ldl_cholesterol,
            "biological_sex": profile.biological_sex,
            "exercise_hours_per_week": profile.exercise_hours_per_week,
            "sleep_hours_per_night": profile.sleep_hours_per_night,
            "stress_level": profile.stress_level,
            "smoking_status": profile.smoking_status,
            "alcohol_drinks_per_week": profile.alcohol_drinks_per_week,
            "water_intake_liters": profile.water_intake_liters,
        }

        assessment = health_engine.calculate_full_health_assessment(profile_dict)

        score_in = ScoreCreate(
            profile_id=profile_id,
            overall_score=assessment["overall_score"],
            bmi=assessment["bmi"],
            bmi_category=assessment["bmi_category"],
            cardiovascular_score=assessment["cardiovascular_score"],
            metabolic_score=assessment["metabolic_score"],
            lifestyle_score=assessment["lifestyle_score"],
        )

        score_record = await score_repository.create(db, score_in)
        await db.commit()
        await db.refresh(score_record)

        duration_ms = (time.perf_counter() - start_time) * 1000.0
        logger.info(
            f"Health score calculation complete for Profile ID: {profile_id} | "
            f"Overall Score: {assessment['overall_score']} | Risk: {assessment['risk_category']} | Duration: {duration_ms:.2f}ms"
        )

        base_res = ScoreResponse.model_validate(score_record)
        response = DetailedScoreResponse(
            **base_res.model_dump(),
            sub_scores=SubScoresBreakdown(**assessment["sub_scores"]),
            risk_category=assessment["risk_category"],
        )

        # AI Extension Hook
        await self.trigger_ai_insights_hook(profile_dict, assessment)

        return response

    async def get_latest_score(
        self, db: AsyncSession, profile_id: int
    ) -> DetailedScoreResponse:
        logger.info(f"Fetching latest health score for Profile ID: {profile_id}")

        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
            raise AppException(
                message=f"Profile with ID {profile_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        score_record = await score_repository.get_latest_by_profile_id(db, profile_id)
        if not score_record:
            logger.info(f"No stored score found for Profile ID {profile_id}. Triggering initial calculation.")
            return await self.calculate_and_save_score(db, profile_id)

        profile_dict = {
            "height_cm": profile.height_cm,
            "weight_kg": profile.weight_kg,
            "systolic_bp": profile.systolic_bp,
            "diastolic_bp": profile.diastolic_bp,
            "fasting_glucose": profile.fasting_glucose,
            "total_cholesterol": profile.total_cholesterol,
            "hdl_cholesterol": profile.hdl_cholesterol,
            "ldl_cholesterol": profile.ldl_cholesterol,
            "biological_sex": profile.biological_sex,
            "exercise_hours_per_week": profile.exercise_hours_per_week,
            "sleep_hours_per_night": profile.sleep_hours_per_night,
            "stress_level": profile.stress_level,
            "smoking_status": profile.smoking_status,
            "alcohol_drinks_per_week": profile.alcohol_drinks_per_week,
            "water_intake_liters": profile.water_intake_liters,
        }

        assessment = health_engine.calculate_full_health_assessment(profile_dict)
        base_res = ScoreResponse.model_validate(score_record)

        return DetailedScoreResponse(
            **base_res.model_dump(),
            sub_scores=SubScoresBreakdown(**assessment["sub_scores"]),
            risk_category=assessment["risk_category"],
        )

    async def trigger_ai_insights_hook(
        self, profile_data: dict, health_assessment: dict
    ) -> Optional[str]:
        """Extension point hook for invoking AI provider LLM insights asynchronously."""
        if not self.ai_provider:
            return None
        try:
            logger.info("Executing AI insight hook...")
            return await self.ai_provider.generate_health_insights(profile_data, health_assessment)
        except NotImplementedError:
            logger.debug("AI Provider method not implemented yet (Phase 2). Skipping AI hook.")
            return None
        except Exception as e:
            logger.error(f"Error in AI insights hook: {str(e)}", exc_info=True)
            return None


score_service = ScoreService()
