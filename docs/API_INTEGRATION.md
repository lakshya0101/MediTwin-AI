# 🔌 MediTwin AI — API Integration Guide

Developer reference for integrating the MediTwin AI backend into a frontend application.

---

## Base URL

```
http://localhost:8000/api/v1/ai
```

> For production, replace `http://localhost:8000` with the deployed backend URL.

---

## General Notes

- All requests must use `Content-Type: application/json`
- All responses are structured JSON validated via Pydantic
- Every AI response includes a `disclaimer` field — display it to users
- The AI **never calculates scores**. Pass backend-computed values (`health_score`, `bmi`, etc.) in every request
- Gemini model: `gemini-3.5-flash-lite`

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| `200 OK` | Request succeeded |
| `422 Unprocessable Entity` | Invalid or missing request fields |
| `500 Internal Server Error` | Server-side error or AI service failure |
| `502 Bad Gateway` | AI returned an invalid/unexpected response |
| `503 Service Unavailable` | Gemini API is overloaded, retry later |

---

## Endpoints

---

### 1. `POST /health-summary`

**Purpose:** Explains the user's current health status using backend-computed scores. Returns a structured summary, key observations, score reasoning, and recommendations.

#### Request Body

```json
{
  "health_data": {
    "profile": {
      "age": 35,
      "gender": "Female",
      "weight_kg": 68,
      "height_cm": 165,
      "smoking_status": "Never",
      "activity_level": "Sedentary",
      "diet_quality": "Fair"
    },
    "health_score": 68,
    "risk_level": "Moderate",
    "bmi": 25.0,
    "sleep_score": 65,
    "activity_score": 40
  }
}
```

#### Response

```json
{
  "summary": "Your health twin reflects a moderate baseline. While no chronic conditions are present, sedentary habits and suboptimal sleep are key factors limiting your score.",
  "key_insights": [
    "Non-smoking status is your strongest protective factor.",
    "Sedentary lifestyle is the biggest drag on your activity score of 40.",
    "Sleep score of 65 suggests inconsistent rest patterns."
  ],
  "score_explanation": "A health score of 68 reflects your non-smoking status and fair diet offset by low physical activity and disrupted sleep. Small lifestyle changes could meaningfully improve this.",
  "recommendations": [
    "Add a 20-minute walk to your daily routine.",
    "Set a consistent bedtime to improve sleep consistency."
  ],
  "disclaimer": "This is a simulated health profile. It does not constitute medical advice or diagnosis."
}
```

#### Possible Errors

| Status | Cause |
|---|---|
| `422` | `health_data` field missing or malformed |
| `500` | Gemini API key not set or internal error |
| `502` | Gemini returned unexpected JSON structure |

#### React Fetch Example

```js
const getHealthSummary = async (healthData) => {
  const res = await fetch("http://localhost:8000/api/v1/ai/health-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ health_data: healthData }),
  });

  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};
```

---

### 2. `POST /future-prediction`

**Purpose:** Projects the user's health trajectory at four time intervals — Today, 1 Month, 6 Months, and 1 Year — assuming current lifestyle is maintained.

#### Request Body

```json
{
  "health_data": {
    "profile": { "age": 45, "activity_level": "Light", "smoking_status": "Former" },
    "health_score": 45,
    "risk_level": "High",
    "bmi": 29.0,
    "sleep_score": 45,
    "activity_score": 35
  }
}
```

#### Response

```json
{
  "summary": "If current habits continue, your health trajectory shows gradual decline across key metrics over the next year.",
  "today_projection": "Current high blood pressure and low activity are active risk contributors. No immediate crisis, but the trend is concerning.",
  "one_month_projection": "Without intervention, fatigue and stress markers may worsen. Sleep quality is projected to stay poor.",
  "six_months_projection": "Cardiovascular risk may increase moderately. Weight is likely to remain stable or rise slightly.",
  "one_year_projection": "Sustained inactivity combined with high BMI increases the probability of metabolic complications if no changes are made.",
  "key_insights": [
    "Former smoker status provides some recovery, but current stress erodes this benefit.",
    "Sleep score of 45 is a leading indicator of long-term health deterioration."
  ],
  "recommendations": [
    "Consult a physician about blood pressure management.",
    "Introduce light evening walks to reverse inactivity trend."
  ],
  "disclaimer": "These projections are trend-based simulations, not guaranteed medical outcomes. Consult a doctor for clinical guidance."
}
```

#### Possible Errors

| Status | Cause |
|---|---|
| `422` | `health_data` field missing or malformed |
| `500` | Gemini API key not set or internal error |

#### React Fetch Example

```js
const getFuturePrediction = async (healthData) => {
  const res = await fetch("http://localhost:8000/api/v1/ai/future-prediction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ health_data: healthData }),
  });

  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};
```

---

### 3. `POST /recommendations`

**Purpose:** Returns exactly three prioritized, personalized lifestyle recommendations with qualitative impact ratings (High / Medium / Low).

> **Important:** Impact ratings are qualitative only. The AI does not invent numerical score changes.

#### Request Body

```json
{
  "health_data": {
    "profile": { "age": 41, "activity_level": "Sedentary", "smoking_status": "Current" },
    "health_score": 38,
    "risk_level": "High",
    "bmi": 29.4,
    "sleep_score": 35,
    "activity_score": 20
  }
}
```

#### Response

```json
{
  "summary": "Your profile shows three high-leverage areas for improvement. Targeting these first will produce the most meaningful health gains.",
  "prioritized_recommendations": [
    "Priority 1: Quit or significantly reduce smoking. Expected Impact: High",
    "Priority 2: Establish a consistent sleep schedule, targeting 7-8 hours each night. Expected Impact: High",
    "Priority 3: Begin a daily 15-minute walk before or after work shifts. Expected Impact: Medium"
  ],
  "key_insights": [
    "Smoking is the single largest preventable risk factor in your profile.",
    "A sleep score of 35 is critically low and affects every other health dimension.",
    "Even minimal movement significantly improves metabolic health in sedentary individuals."
  ],
  "disclaimer": "These recommendations are personalized simulations, not medical prescriptions. Always consult a healthcare provider."
}
```

#### Possible Errors

| Status | Cause |
|---|---|
| `422` | `health_data` field missing or malformed |
| `500` | Gemini API key not set or internal error |

#### React Fetch Example

```js
const getRecommendations = async (healthData) => {
  const res = await fetch("http://localhost:8000/api/v1/ai/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ health_data: healthData }),
  });

  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};
```

---

### 4. `POST /scenario`

**Purpose:** Simulates a What-If lifestyle scenario. Explains what changed, what metrics improved, what risks shifted, and what the user should do next.

#### Supported Scenarios (examples)

| Scenario | Example String |
|---|---|
| Daily walking | `"Walk 7000 steps every day"` |
| Quit smoking | `"Quit smoking completely"` |
| Better sleep | `"Sleep 8 hours every night"` |
| Weight loss | `"Lose 5 kg over 3 months"` |
| Weight gain | `"Gain 5 kg"` |
| Stop exercising | `"Stop all physical activity"` |
| Hydration | `"Drink 3 litres of water daily"` |

#### Request Body

```json
{
  "health_data": {
    "profile": { "age": 38, "activity_level": "Moderate", "smoking_status": "Quit recently (3 months ago)" },
    "health_score": 65,
    "risk_level": "Moderate",
    "bmi": 26.2,
    "sleep_score": 60,
    "activity_score": 55
  },
  "scenario": "Walk 7000 steps every day"
}
```

#### Response

```json
{
  "summary": "Adopting a daily 7000-step habit is projected to produce meaningful improvement across your cardiovascular and metabolic health markers.",
  "score_change_explanation": "Increased daily movement reduces resting heart rate, improves insulin sensitivity, and contributes to gradual weight normalization — all factors that would improve your overall health score.",
  "metrics_improved": [
    "Activity score (from 55 toward 75+)",
    "Resting heart rate",
    "Mood and stress markers",
    "BMI trend (gradual reduction)"
  ],
  "risks_altered": [
    "Cardiovascular risk: Decreased",
    "Metabolic syndrome risk: Decreased",
    "Injury risk from overexertion: Slightly increased if not paced properly"
  ],
  "next_best_action": "Start with 4000 steps daily for the first two weeks, then increase to 7000 gradually to avoid overexertion.",
  "key_insights": [
    "7000 steps is a clinically studied threshold for cardiovascular benefit.",
    "Combined with your recent smoking cessation, this would significantly compound your health recovery."
  ],
  "recommendations": [
    "Use a step-tracking app to maintain consistency.",
    "Walk after meals to maximize metabolic benefit."
  ],
  "disclaimer": "This is a lifestyle simulation. Results will vary based on individual physiology. This is not medical advice."
}
```

#### Possible Errors

| Status | Cause |
|---|---|
| `422` | `health_data` or `scenario` field missing |
| `500` | Gemini API key not set or internal error |

#### React Fetch Example

```js
const simulateScenario = async (healthData, scenario) => {
  const res = await fetch("http://localhost:8000/api/v1/ai/scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ health_data: healthData, scenario }),
  });

  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};
```

---

### 5. `POST /coach`

**Purpose:** Conversational AI Health Coach. Answers the user's health questions using their profile as context. Supports chat history for multi-turn conversations.

#### Request Body

```json
{
  "health_data": {
    "profile": { "age": 30, "activity_level": "Very Active", "diet_quality": "Excellent" },
    "health_score": 94,
    "risk_level": "Very Low",
    "bmi": 22.6,
    "sleep_score": 88,
    "activity_score": 95
  },
  "question": "Why is my health score not 100?",
  "history": [
    {
      "role": "user",
      "content": "What is a health score?"
    },
    {
      "role": "assistant",
      "content": "Your health score is a composite measure of your lifestyle, metrics, and habits — scored from 0 to 100 by the MediTwin backend."
    }
  ]
}
```

> **Note:** `history` is optional. Omit it for a fresh conversation or include previous messages for context-aware responses.

#### Response

```json
{
  "answer": "A score of 94 is excellent — you're in the top tier. The remaining 6 points typically reflect micro-factors like slight sleep variability or the natural physiological limits of the scoring model. Perfection is rarely achievable, nor is it the goal.",
  "summary": "Your 94 score reflects near-optimal health. Minor variability in tracked metrics prevents a perfect 100.",
  "key_insights": [
    "Sleep score of 88, while excellent, has minor room for improvement.",
    "Sustaining this level long-term is more important than chasing 100."
  ],
  "recommendations": [
    "Focus on consistency rather than optimization.",
    "Ensure recovery days are included in your training plan."
  ],
  "disclaimer": "Health scores are simulated estimates. They are not a clinical measurement. Consult a doctor for medical evaluation."
}
```

#### Possible Errors

| Status | Cause |
|---|---|
| `422` | `question` or `health_data` field missing |
| `500` | Gemini API key not set or internal error |

#### React Fetch Example

```js
const askCoach = async (healthData, question, history = []) => {
  const res = await fetch("http://localhost:8000/api/v1/ai/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ health_data: healthData, question, history }),
  });

  if (!res.ok) throw new Error(`Error: ${res.status}`);
  return await res.json();
};
```

---

## Shared `health_data` Shape

All endpoints accept a `health_data` object. Here is the full reference:

```json
{
  "health_data": {
    "profile": {
      "age": 30,
      "gender": "Male | Female | Other",
      "weight_kg": 75,
      "height_cm": 182,
      "smoking_status": "Never | Former | Current | Quit recently",
      "activity_level": "Sedentary | Light | Moderate | Active | Very Active | Extreme",
      "diet_quality": "Poor | Fair | Good | Excellent",
      "blood_pressure": "120/80",
      "heart_rate_resting": 65,
      "chronic_conditions": ["Type 2 Diabetes", "Hypertension"]
    },
    "health_score": 72,
    "risk_level": "Very Low | Low | Moderate | High",
    "bmi": 25.0,
    "sleep_score": 65,
    "activity_score": 40,
    "simulation_result": {}
  }
}
```

> All numeric scores (`health_score`, `sleep_score`, `activity_score`) must be computed by the backend. The AI **only explains** these values — it does not invent them.

---

## Interactive API Docs

When the backend is running locally:

| URL | Description |
|---|---|
| [`http://localhost:8000/docs`](http://localhost:8000/docs) | Swagger UI — test endpoints directly in browser |
| [`http://localhost:8000/redoc`](http://localhost:8000/redoc) | ReDoc — clean API reference |
| [`http://localhost:8000/health`](http://localhost:8000/health) | Server health check |
