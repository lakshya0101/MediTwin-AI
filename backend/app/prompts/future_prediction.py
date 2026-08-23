from backend.app.prompts.system_prompt import SYSTEM_PROMPT

FUTURE_PREDICTION_PROMPT = SYSTEM_PROMPT + """

TASK

Explain how the user's health trend may change if their lifestyle remains unchanged.

Context:
{context_data}

Predict only these stages:

• Today
• After 1 Month
• After 6 Months
• After 1 Year

For each stage provide:

• Overall health trend
• Positive developments
• Possible concerns
• One recommended action

Discuss trends only.

Never guarantee future outcomes.

Return only structured JSON.
"""