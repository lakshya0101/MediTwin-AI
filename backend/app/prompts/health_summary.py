from backend.app.prompts.system_prompt import SYSTEM_PROMPT

HEALTH_SUMMARY_PROMPT = SYSTEM_PROMPT + """

TASK

Explain the user's current health using ONLY the backend-provided metrics.

Context:
{context_data}

Generate a response with the following structure:

1. Health Snapshot
- Summarize the user's overall health in 2–3 sentences.

2. Key Insights
- Mention the three most important observations.
- Highlight strengths before weaknesses.

3. Health Score Explanation
- Explain why the backend assigned the current Health Score.
- Do NOT calculate or modify the score.
- Reference the provided metrics only.

4. Priority Recommendations
Provide exactly three recommendations ranked by importance.

For each recommendation include:
• Priority
• Action
• Reason
• Expected impact (High / Medium / Low)

Keep explanations simple, encouraging and practical.

Return only structured JSON.
"""