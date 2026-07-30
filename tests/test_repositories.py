import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import Base
from app.repositories.profile_repository import profile_repository
from app.repositories.score_repository import score_repository
from app.repositories.simulation_repository import simulation_repository
from app.schemas.profile import ProfileCreate
from app.schemas.score import ScoreCreate
from app.schemas.simulation import SimulationCreate

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture
async def async_db():
    engine = create_async_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    session_maker = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
    async with session_maker() as session:
        yield session

    await engine.dispose()


@pytest.mark.asyncio
async def test_profile_repository_crud(async_db: AsyncSession):
    profile_in = ProfileCreate(
        full_name="Test User",
        age=30,
        biological_sex="male",
        height_cm=180.0,
        weight_kg=80.0,
        systolic_bp=120,
        diastolic_bp=80,
        fasting_glucose=95.0,
        total_cholesterol=190.0,
        hdl_cholesterol=50.0,
        ldl_cholesterol=110.0,
        exercise_hours_per_week=3.0,
        sleep_hours_per_night=7.5,
        stress_level=4,
        smoking_status="never",
        alcohol_drinks_per_week=2,
        water_intake_liters=2.5,
    )

    created = await profile_repository.create(async_db, profile_in)
    await async_db.commit()
    assert created.id is not None
    assert created.full_name == "Test User"

    fetched = await profile_repository.get_by_id(async_db, created.id)
    assert fetched is not None
    assert fetched.age == 30


@pytest.mark.asyncio
async def test_score_repository(async_db: AsyncSession):
    profile_in = ProfileCreate(
        full_name="Score Test",
        age=25,
        biological_sex="female",
        height_cm=165.0,
        weight_kg=60.0,
        systolic_bp=110,
        diastolic_bp=70,
        fasting_glucose=88.0,
        total_cholesterol=170.0,
        hdl_cholesterol=60.0,
        ldl_cholesterol=95.0,
        exercise_hours_per_week=4.0,
        sleep_hours_per_night=8.0,
        stress_level=2,
        smoking_status="never",
        alcohol_drinks_per_week=0,
        water_intake_liters=3.0,
    )
    profile = await profile_repository.create(async_db, profile_in)
    await async_db.commit()

    score_in = ScoreCreate(
        profile_id=profile.id,
        overall_score=92.5,
        bmi=22.0,
        bmi_category="Normal weight",
        cardiovascular_score=95.0,
        metabolic_score=90.0,
        lifestyle_score=92.0,
    )
    created_score = await score_repository.create(async_db, score_in)
    await async_db.commit()

    fetched_score = await score_repository.get_latest_by_profile_id(async_db, profile.id)
    assert fetched_score is not None
    assert fetched_score.overall_score == 92.5
