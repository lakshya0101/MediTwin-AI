"""
Gemini AI Service - wired into the main app structure.
Calls the Gemini API using computed health scores from the backend engine.
The AI explains, simulates, and coaches. It never calculates scores.
"""
import os
import logging
from typing import Any, Dict
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("meditwin.gemini")

DEFAULT_MODEL = "gemini-3.5-flash-lite"

try:
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
except Exception as e:
    client = None
    logger.warning(f"Gemini client init failed: {e}")

SYSTEM_PROMPT = """
You are MediTwin AI — a Digital Health Twin simulator.

You receive backend-computed health scores and biomarker data. Your role is to:
1. Explain what these numbers mean for this specific person.
2. Project trends and simulate lifestyle changes.
3. Provide actionable, encouraging coaching.

STRICT RULES:
- Never claim to diagnose any disease.
- Never guarantee future medical outcomes.
- Never invent or modify the numeric scores provided to you — only explain them.
- Always end responses with: "This is a simulation for educational purposes only and does not constitute medical advice."
- Use encouraging, evidence-informed language.
- Be specific and personalized using the data provided.
"""


def _score_to_context(score: Any) -> str:
    """Convert a DetailedScoreResponse to a rich text context string for Gemini."""
    lines = [
        f"Overall Health Score: {score.overall_score:.1f}/100",
        f"BMI: {score.bmi:.1f} ({score.bmi_category})",
        f"Risk Category: {score.risk_category}",
        f"Cardiovascular Score: {score.cardiovascular_score:.1f}/100",
        f"Metabolic Score: {score.metabolic_score:.1f}/100",
        f"Lifestyle Score: {score.lifestyle_score:.1f}/100",
    ]
    if score.sub_scores:
        s = score.sub_scores
        lines += [
            f"BMI Sub-score: {s.bmi_score:.1f}",
            f"Blood Pressure Sub-score: {s.bp_score:.1f}",
            f"Glucose Sub-score: {s.glucose_score:.1f}",
            f"Cholesterol Sub-score: {s.cholesterol_score:.1f}",
            f"Exercise Sub-score: {s.exercise_score:.1f}",
            f"Sleep Sub-score: {s.sleep_score:.1f}",
            f"Stress Sub-score: {s.stress_score:.1f}",
            f"Smoking Sub-score: {s.smoking_score:.1f}",
            f"Alcohol Sub-score: {s.alcohol_score:.1f}",
            f"Hydration Sub-score: {s.water_score:.1f}",
        ]
    return "\n".join(lines)


def _call_gemini(prompt: str) -> str:
    if not client:
        raise RuntimeError("Gemini client not initialized. Check GEMINI_API_KEY.")
    response = client.models.generate_content(
        model=DEFAULT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.7,
        ),
    )
    return response.text


class GeminiService:
    async def get_health_summary(self, score: Any) -> Dict:
        context = _score_to_context(score)
        prompt = f"""
TASK: Generate a personalized health summary.

Health Data:
{context}

Return a JSON object with these exact keys:
- summary: (string) 2-3 sentence empathetic overview of health status
- key_insights: (list of 3 strings) strongest positive habits and biggest improvement areas
- score_explanation: (string) explanation of why the overall score is what it is
- recommendations: (list of 2 strings) top 2 immediate recommendations
- disclaimer: (string) the required educational disclaimer

Return only valid JSON.
"""
        try:
            import json
            raw = _call_gemini(prompt)
            # Strip markdown code fences if present
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except Exception as e:
            logger.error(f"Gemini health summary error: {e}")
            raise RuntimeError(f"AI service error: {e}")

    async def get_future_prediction(self, score: Any) -> Dict:
        context = _score_to_context(score)
        prompt = f"""
TASK: Project this person's health trajectory over time.

Health Data:
{context}

Return a JSON object with these exact keys:
- summary: (string) Overall trajectory summary
- today_projection: (string) Current state
- one_month_projection: (string) 1-month outlook if habits are maintained
- six_months_projection: (string) 6-month outlook
- one_year_projection: (string) 1-year outlook
- key_insights: (list of 3 strings) Key trajectory insights
- recommendations: (list of 2 strings) To improve trajectory
- disclaimer: (string) educational disclaimer

Return only valid JSON.
"""
        try:
            import json
            raw = _call_gemini(prompt)
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except Exception as e:
            logger.error(f"Gemini future prediction error: {e}")
            raise RuntimeError(f"AI service error: {e}")

    async def get_recommendations(self, score: Any) -> Dict:
        context = _score_to_context(score)
        prompt = f"""
TASK: Generate exactly 3 prioritized lifestyle recommendations.

Health Data:
{context}

For each recommendation, the Expected Impact must be one of: High, Medium, Low.
Do NOT invent numeric score changes.

Return a JSON object with these exact keys:
- summary: (string) Brief summary of what needs to change
- prioritized_recommendations: (list of 3 strings) Each in format: "Priority N: [Action]. Expected Impact: [High/Medium/Low]"
- key_insights: (list of 3 strings) Why these recommendations matter
- disclaimer: (string) educational disclaimer

Return only valid JSON.
"""
        try:
            import json
            raw = _call_gemini(prompt)
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except Exception as e:
            logger.error(f"Gemini recommendations error: {e}")
            raise RuntimeError(f"AI service error: {e}")

    async def get_scenario_explanation(self, score: Any, scenario: str) -> Dict:
        context = _score_to_context(score)
        prompt = f"""
TASK: Simulate a what-if lifestyle scenario.

Current Health Data:
{context}

Proposed Scenario: "{scenario}"

Return a JSON object with these exact keys:
- summary: (string) What this scenario means for this person
- score_change_explanation: (string) How and why health metrics would change
- metrics_improved: (list of strings) Specific metrics that would improve
- risks_altered: (list of strings) Risks that would increase or decrease
- next_best_action: (string) Single most important next step
- key_insights: (list of 3 strings) Key simulation insights
- recommendations: (list of 2 strings) Supplementary recommendations
- disclaimer: (string) educational disclaimer

Return only valid JSON.
"""
        try:
            import json
            raw = _call_gemini(prompt)
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except Exception as e:
            logger.error(f"Gemini scenario error: {e}")
            raise RuntimeError(f"AI service error: {e}")

    async def ask_coach(self, score: Any, question: str) -> Dict:
        context = _score_to_context(score)
        prompt = f"""
TASK: Answer the user's health question as their personal AI Health Coach.

Their Current Health Data:
{context}

User Question: "{question}"

Return a JSON object with these exact keys:
- answer: (string) Direct, personalized answer to the question
- summary: (string) One sentence summary of the answer
- key_insights: (list of 2-3 strings) Key insights related to the answer
- recommendations: (list of 2 strings) Actionable recommendations related to the question
- disclaimer: (string) educational disclaimer

Return only valid JSON.
"""
        try:
            import json
            raw = _call_gemini(prompt)
            clean = raw.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
            return json.loads(clean)
        except Exception as e:
            logger.error(f"Gemini coach error: {e}")
            raise RuntimeError(f"AI service error: {e}")


gemini_service = GeminiService()
