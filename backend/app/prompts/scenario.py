from backend.app.prompts.system_prompt import SYSTEM_PROMPT

SCENARIO_PROMPT = SYSTEM_PROMPT + """

TASK

Explain the effect of the following simulated lifestyle change.

Current Context:
{context_data}

Scenario:
{scenario}

Explain:

1. Why the Health Score changed.

2. Which health metrics improved.

3. Which metrics became worse.

4. Overall wellness trend.

5. Next best action.

Base every explanation only on the provided simulation.

Do not invent data.

Return only structured JSON.
"""