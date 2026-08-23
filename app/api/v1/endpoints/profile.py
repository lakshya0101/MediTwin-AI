from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.common import APIResponse
from app.schemas.profile import ProfileCreate, ProfileResponse, ProfileUpdate
from app.services.profile_service import profile_service

router = APIRouter(prefix="/profile", tags=["Profiles"])


@router.post(
    "",
    response_model=APIResponse[ProfileResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create Patient Health Profile",
    description="Registers a new patient profile with clinical biomarkers and lifestyle metrics.",
)
async def create_profile(
    profile_in: ProfileCreate,
    db: AsyncSession = Depends(get_db),
):
    result = await profile_service.create_profile(db, profile_in)
    return APIResponse(
        success=True,
        data=result,
        message="Patient profile created successfully.",
    )


@router.get(
    "/{profile_id}",
    response_model=APIResponse[ProfileResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Patient Health Profile",
    description="Fetches patient health profile by profile ID.",
)
async def get_profile(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await profile_service.get_profile(db, profile_id)
    return APIResponse(
        success=True,
        data=result,
        message="Patient profile retrieved successfully.",
    )


@router.put(
    "/{profile_id}",
    response_model=APIResponse[ProfileResponse],
    status_code=status.HTTP_200_OK,
    summary="Update Patient Health Profile",
    description="Updates existing patient profile biomarkers or lifestyle metrics.",
)
async def update_profile(
    profile_id: int,
    profile_in: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await profile_service.update_profile(db, profile_id, profile_in)
    return APIResponse(
        success=True,
        data=result,
        message="Patient profile updated successfully.",
    )


@router.delete(
    "/{profile_id}",
    response_model=APIResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Delete Patient Health Profile",
    description="Deletes patient profile and all associated health scores/simulations.",
)
async def delete_profile(
    profile_id: int,
    db: AsyncSession = Depends(get_db),
):
    await profile_service.delete_profile(db, profile_id)
    return APIResponse(
        success=True,
        data={"id": profile_id},
        message=f"Profile {profile_id} deleted successfully.",
    )
