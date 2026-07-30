from backend.app.prompts.system_prompt import SYSTEM_PROMPT

RECOMMENDATIONS_PROMPT = SYSTEM_PROMPT + """

TASK

Generate personalized recommendations using ONLY the backend data.

Context:
{context_data}

Return exactly three recommendations ranked from highest to lowest impact.

For every recommendation include:

Priority

Action

Reason

Expected Impact

The Expected Impact should be one of:

High

Medium

Low

Recommendations must be:

• Specific
• Actionable
• Personalized
• Easy to follow

Avoid generic advice like:

"Exercise more."

Instead say:

"Walk for 30 minutes at least five days per week."

Return only structured JSON.
"""