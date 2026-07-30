from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.score import DetailedScoreResponse
from app.services.score_service import score_service

router = APIRouter(prefix="/score", tags=["Health Scores"])


@router.post(
    "/calculate/{profile_id}",
    response_model=APIResponse[DetailedScoreResponse],
    status_code=status.HTTP_200_OK,
    summary="Calculate & Store Health Score",
    description="Computes comprehensive health scores, composite domain ratings, and risk tier for a profile.",
)
async def calculate_score(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await score_service.calculate_and_save_score(db, profile_id)
    return APIResponse(
        success=True,
        data=result,
        message="Health score computed successfully.",
    )


@router.get(
    "/{profile_id}",
    response_model=APIResponse[DetailedScoreResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Latest Health Score",
    description="Fetches latest calculated health score and biomarker sub-scores for a profile.",
)
async def get_score(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await score_service.get_latest_score(db, profile_id)
    return APIResponse(
        success=True,
        data=result,
        message="Latest health score retrieved successfully.",
    )
