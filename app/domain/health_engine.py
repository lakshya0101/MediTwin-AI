"""Deterministic medical health scoring engine.

Framework-independent mathematical functions to compute health sub-scores,
composite domain scores (Cardiovascular, Metabolic, Lifestyle), and overall health score.
"""

from typing import Any, Dict
from app.domain import constants


def calculate_bmi(height_cm: float, weight_kg: float) -> float:
    """Calculates Body Mass Index (BMI)."""
    if height_cm <= 0:
        raise ValueError("Height must be greater than zero.")
    height_m = height_cm / 100.0
    return round(weight_kg / (height_m * height_m), 2)


def categorize_bmi(bmi: float) -> str:
    """Categorizes BMI value according to WHO guidelines."""
    if bmi < constants.BMI_UNDERWEIGHT_UPPER:
        return "Underweight"
    elif bmi <= constants.BMI_NORMAL_UPPER:
        return "Normal weight"
    elif bmi <= constants.BMI_OVERWEIGHT_UPPER:
        return "Overweight"
    else:
        return "Obesity"


def calculate_bmi_score(bmi: float) -> float:
    """Computes a 0-100 score for BMI."""
    if 18.5 <= bmi <= 24.9:
        return 100.0
    elif 25.0 <= bmi <= 29.9:
        return round(100.0 - (bmi - 24.9) * 8.0, 2)
    elif bmi >= 30.0:
        return max(0.0, round(60.0 - (bmi - 29.9) * 4.0, 2))
    else:
        # Underweight (< 18.5)
        return max(0.0, round(100.0 - (18.5 - bmi) * 10.0, 2))


def calculate_bp_score(systolic: int, diastolic: int) -> float:
    """Computes a 0-100 score for blood pressure."""
    if systolic < 120 and diastolic < 80:
        return 100.0
    elif systolic <= 129 and diastolic < 80:
        return 85.0
    elif systolic <= 139 or diastolic <= 89:
        return 70.0
    elif systolic <= 179 or diastolic <= 119:
        return 45.0
    else:
        return 20.0


def calculate_glucose_score(glucose: float) -> float:
    """Computes a 0-100 score for fasting blood glucose."""
    if glucose <= constants.GLUCOSE_NORMAL_UPPER:
        return 100.0
    elif glucose <= constants.GLUCOSE_PREDIABETES_UPPER:
        # 100-125 mg/dL -> 95 to 60
        penalty = (glucose - 99.0) * 1.35
        return max(60.0, round(100.0 - penalty, 2))
    else:
        # Diabetes range (>= 126 mg/dL)
        penalty = (glucose - 125.0) * 0.5
        return max(10.0, round(60.0 - penalty, 2))


def calculate_cholesterol_score(total: float, hdl: float, ldl: float, sex: str) -> float:
    """Computes a 0-100 score for lipid profile."""
    # Total cholesterol scoring (0-40 pts)
    if total < 200.0:
        total_score = 40.0
    elif total <= 239.0:
        total_score = 30.0
    else:
        total_score = 15.0

    # HDL scoring (0-30 pts)
    hdl_cutoff = constants.HDL_LOW_FEMALE if sex.lower() == "female" else constants.HDL_LOW_MALE
    if hdl >= constants.HDL_OPTIMAL_LOWER:
        hdl_score = 30.0
    elif hdl >= hdl_cutoff:
        hdl_score = 20.0
    else:
        hdl_score = 10.0

    # LDL scoring (0-30 pts)
    if ldl < constants.LDL_OPTIMAL_UPPER:
        ldl_score = 30.0
    elif ldl <= constants.LDL_NEAR_OPTIMAL_UPPER:
        ldl_score = 25.0
    elif ldl <= constants.LDL_BORDERLINE_UPPER:
        ldl_score = 18.0
    elif ldl <= constants.LDL_HIGH_UPPER:
        ldl_score = 10.0
    else:
        ldl_score = 5.0

    return round(total_score + hdl_score + ldl_score, 2)


def calculate_exercise_score(hours: float) -> float:
    """Computes a 0-100 score for weekly physical exercise."""
    if hours >= constants.EXERCISE_RECOMMENDED_MIN_HOURS:
        return 100.0
    elif hours > 0:
        return round((hours / constants.EXERCISE_RECOMMENDED_MIN_HOURS) * 100.0, 2)
    else:
        return 20.0


def calculate_sleep_score(hours: float) -> float:
    """Computes a 0-100 score for nightly sleep duration."""
    if constants.SLEEP_RECOMMENDED_MIN_HOURS <= hours <= constants.SLEEP_RECOMMENDED_MAX_HOURS:
        return 100.0
    elif hours < constants.SLEEP_RECOMMENDED_MIN_HOURS:
        return max(10.0, round((hours / constants.SLEEP_RECOMMENDED_MIN_HOURS) * 100.0, 2))
    else:
        # Over-sleeping (> 9 hours)
        excess = hours - constants.SLEEP_RECOMMENDED_MAX_HOURS
        return max(50.0, round(100.0 - excess * 10.0, 2))


def calculate_stress_score(stress_level: int) -> float:
    """Computes a 0-100 score for perceived stress level (1-10 scale)."""
    bounded_stress = max(1, min(10, stress_level))
    return round((11 - bounded_stress) * 10.0, 2)


def calculate_smoking_score(smoking_status: str) -> float:
    """Computes a 0-100 score for smoking status."""
    status_lower = smoking_status.lower()
    if status_lower == "never":
        return 100.0
    elif status_lower == "former":
        return 70.0
    else:
        return 20.0


def calculate_alcohol_score(drinks_per_week: int, sex: str) -> float:
    """Computes a 0-100 score for alcohol consumption."""
    moderate_limit = 7 if sex.lower() == "female" else 14
    if drinks_per_week == 0:
        return 100.0
    elif drinks_per_week <= moderate_limit:
        return 80.0
    elif drinks_per_week <= moderate_limit * 2:
        return 50.0
    else:
        return 20.0


def calculate_water_score(liters: float) -> float:
    """Computes a 0-100 score for daily water intake."""
    if constants.WATER_RECOMMENDED_MIN_LITERS <= liters <= constants.WATER_RECOMMENDED_MAX_LITERS:
        return 100.0
    elif liters < constants.WATER_RECOMMENDED_MIN_LITERS:
        return round((liters / constants.WATER_RECOMMENDED_MIN_LITERS) * 100.0, 2)
    else:
        return 90.0


def calculate_cardiovascular_score(bp_score: float, bmi_score: float, cholesterol_score: float) -> float:
    """Computes composite Cardiovascular score."""
    return round(bp_score * 0.45 + cholesterol_score * 0.35 + bmi_score * 0.20, 2)


def calculate_metabolic_score(glucose_score: float, bmi_score: float, cholesterol_score: float) -> float:
    """Computes composite Metabolic score."""
    return round(glucose_score * 0.50 + bmi_score * 0.30 + cholesterol_score * 0.20, 2)


def calculate_lifestyle_score(
    exercise_score: float,
    sleep_score: float,
    stress_score: float,
    smoking_score: float,
    alcohol_score: float,
    water_score: float,
) -> float:
    """Computes composite Lifestyle score."""
    return round(
        exercise_score * 0.25
        + sleep_score * 0.20
        + stress_score * 0.15
        + smoking_score * 0.20
        + alcohol_score * 0.10
        + water_score * 0.10,
        2,
    )


def determine_risk_category(overall_score: float) -> str:
    """Determines patient health risk tier from overall health score."""
    if overall_score >= 85.0:
        return "Low Risk"
    elif overall_score >= 70.0:
        return "Moderate Risk"
    elif overall_score >= 50.0:
        return "High Risk"
    else:
        return "Critical Risk"


def calculate_full_health_assessment(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Runs complete deterministic health calculation across all metrics."""
    bmi = calculate_bmi(profile_data["height_cm"], profile_data["weight_kg"])
    bmi_cat = categorize_bmi(bmi)
    bmi_sc = calculate_bmi_score(bmi)

    bp_sc = calculate_bp_score(profile_data["systolic_bp"], profile_data["diastolic_bp"])
    glucose_sc = calculate_glucose_score(profile_data["fasting_glucose"])
    chol_sc = calculate_cholesterol_score(
        profile_data["total_cholesterol"],
        profile_data["hdl_cholesterol"],
        profile_data["ldl_cholesterol"],
        profile_data["biological_sex"],
    )

    ex_sc = calculate_exercise_score(profile_data["exercise_hours_per_week"])
    sleep_sc = calculate_sleep_score(profile_data["sleep_hours_per_night"])
    stress_sc = calculate_stress_score(profile_data["stress_level"])
    smoke_sc = calculate_smoking_score(profile_data["smoking_status"])
    alc_sc = calculate_alcohol_score(profile_data["alcohol_drinks_per_week"], profile_data["biological_sex"])
    water_sc = calculate_water_score(profile_data["water_intake_liters"])

    cardio_sc = calculate_cardiovascular_score(bp_sc, bmi_sc, chol_sc)
    metabolic_sc = calculate_metabolic_score(glucose_sc, bmi_sc, chol_sc)
    lifestyle_sc = calculate_lifestyle_score(ex_sc, sleep_sc, stress_sc, smoke_sc, alc_sc, water_sc)

    overall_sc = round(
        cardio_sc * constants.CARDIOVASCULAR_WEIGHT
        + metabolic_sc * constants.METABOLIC_WEIGHT
        + lifestyle_sc * constants.LIFESTYLE_WEIGHT,
        2,
    )

    risk_cat = determine_risk_category(overall_sc)

    return {
        "overall_score": overall_sc,
        "bmi": bmi,
        "bmi_category": bmi_cat,
        "cardiovascular_score": cardio_sc,
        "metabolic_score": metabolic_sc,
        "lifestyle_score": lifestyle_sc,
        "risk_category": risk_cat,
        "sub_scores": {
            "bmi_score": bmi_sc,
            "bp_score": bp_sc,
            "glucose_score": glucose_sc,
            "cholesterol_score": chol_sc,
            "exercise_score": ex_sc,
            "sleep_score": sleep_sc,
            "stress_score": stress_sc,
            "smoking_score": smoke_sc,
            "alcohol_score": alc_sc,
            "water_score": water_sc,
        },
    }
