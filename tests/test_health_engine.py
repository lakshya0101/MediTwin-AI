import pytest
from app.domain import health_engine


def test_calculate_bmi():
    # 175 cm, 70 kg -> ~22.86
    bmi = health_engine.calculate_bmi(175.0, 70.0)
    assert bmi == 22.86


def test_categorize_bmi():
    assert health_engine.categorize_bmi(17.5) == "Underweight"
    assert health_engine.categorize_bmi(22.0) == "Normal weight"
    assert health_engine.categorize_bmi(27.5) == "Overweight"
    assert health_engine.categorize_bmi(32.0) == "Obesity"


def test_bp_score():
    assert health_engine.calculate_bp_score(115, 75) == 100.0
    assert health_engine.calculate_bp_score(125, 78) == 85.0
    assert health_engine.calculate_bp_score(135, 85) == 70.0
    assert health_engine.calculate_bp_score(150, 95) == 45.0


def test_full_health_assessment():
    profile_data = {
        "height_cm": 175.0,
        "weight_kg": 75.0,
        "systolic_bp": 120,
        "diastolic_bp": 80,
        "fasting_glucose": 90.0,
        "total_cholesterol": 180.0,
        "hdl_cholesterol": 55.0,
        "ldl_cholesterol": 100.0,
        "biological_sex": "male",
        "exercise_hours_per_week": 4.0,
        "sleep_hours_per_night": 8.0,
        "stress_level": 3,
        "smoking_status": "never",
        "alcohol_drinks_per_week": 1,
        "water_intake_liters": 2.5,
    }

    result = health_engine.calculate_full_health_assessment(profile_data)
    assert "overall_score" in result
    assert 0 <= result["overall_score"] <= 100
    assert result["risk_category"] in ["Low Risk", "Moderate Risk", "High Risk", "Critical Risk"]
    assert result["bmi_category"] == "Normal weight"
