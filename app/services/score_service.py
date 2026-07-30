from fastapi import status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.domain import health_engine
from app.repositories.profile_repository import profile_repository
from app.repositories.score_repository import score_repository
from app.schemas.score import DetailedScoreResponse, ScoreCreate, ScoreResponse, SubScoresBreakdown


class ScoreService:
    """Service layer for computing and persisting health scores."""

    async def calculate_and_save_score(
        self, db: AsyncSession, profile_id: int
    ) -> DetailedScoreResponse:
        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
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

        base_res = ScoreResponse.model_validate(score_record)

        return DetailedScoreResponse(
            **base_res.model_dump(),
            sub_scores=SubScoresBreakdown(**assessment["sub_scores"]),
            risk_category=assessment["risk_category"],
        )

    async def get_latest_score(
        self, db: AsyncSession, profile_id: int
    ) -> DetailedScoreResponse:
        profile = await profile_repository.get_by_id(db, profile_id)
        if not profile:
            raise AppException(
                message=f"Profile with ID {profile_id} not found.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        score_record = await score_repository.get_latest_by_profile_id(db, profile_id)
        if not score_record:
            # If no stored score, calculate immediately
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


score_service = ScoreService()
