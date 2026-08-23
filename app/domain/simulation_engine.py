"""Digital Twin scenario simulation engine.

Applies hypothetical lifestyle/biomarker modifications to baseline profile,
recalculates overall health metrics, and returns projected scores and deltas.
"""

from typing import Any, Dict
from app.domain import health_engine


def run_simulation(baseline_profile: Dict[str, Any], hypothetical_changes: Dict[str, Any]) -> Dict[str, Any]:
    """Runs a health projection simulation based on hypothetical modifications."""
    simulated_profile = baseline_profile.copy()
    
    # Merge hypothetical changes
    for key, value in hypothetical_changes.items():
        if value is not None and key in simulated_profile:
            simulated_profile[key] = value

    baseline_assessment = health_engine.calculate_full_health_assessment(baseline_profile)
    simulated_assessment = health_engine.calculate_full_health_assessment(simulated_profile)

    overall_delta = round(
        simulated_assessment["overall_score"] - baseline_assessment["overall_score"], 2
    )
    cardio_delta = round(
        simulated_assessment["cardiovascular_score"] - baseline_assessment["cardiovascular_score"], 2
    )
    metabolic_delta = round(
        simulated_assessment["metabolic_score"] - baseline_assessment["metabolic_score"], 2
    )
    lifestyle_delta = round(
        simulated_assessment["lifestyle_score"] - baseline_assessment["lifestyle_score"], 2
    )

    return {
        "baseline_score": baseline_assessment["overall_score"],
        "projected_overall_score": simulated_assessment["overall_score"],
        "overall_score_delta": overall_delta,
        "projected_bmi": simulated_assessment["bmi"],
        "projected_bmi_category": simulated_assessment["bmi_category"],
        "projected_cardiovascular_score": simulated_assessment["cardiovascular_score"],
        "cardiovascular_score_delta": cardio_delta,
        "projected_metabolic_score": simulated_assessment["metabolic_score"],
        "metabolic_score_delta": metabolic_delta,
        "projected_lifestyle_score": simulated_assessment["lifestyle_score"],
        "lifestyle_score_delta": lifestyle_delta,
        "projected_risk_category": simulated_assessment["risk_category"],
        "projected_sub_scores": simulated_assessment["sub_scores"],
    }
