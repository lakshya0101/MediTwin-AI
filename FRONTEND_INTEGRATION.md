# MediTwin AI - Frontend Integration Guide

This document provides a comprehensive integration specification for frontend engineers building UI applications for MediTwin AI.

---

## 🔑 Key Concepts & Conventions

- **Base URL**: `http://localhost:8000/api/v1`
- **Content-Type**: `application/json`
- **Standardized Response Envelope**: Every endpoint returns an `APIResponse` object.
- **Error Response Envelope**: Every error returns a standardized `ErrorResponse` object with standard HTTP status codes (`400`, `404`, `422`, `500`).

---

## 📦 Standard Response Envelopes

### Success Envelope
```typescript
interface APIResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

### Error Envelope
```typescript
interface ErrorDetail {
  code: string;       // e.g. "VALIDATION_ERROR", "APPLICATION_ERROR", "INTERNAL_SERVER_ERROR"
  message: string;    // Human readable error summary
  details?: Record<string, any>; // Optional validation breakdown
}

interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}
```

---

## 🗂️ TypeScript Type Definitions

```typescript
export type BiologicalSex = "male" | "female" | "other";
export type SmokingStatus = "never" | "former" | "current";
export type RiskCategory = "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";

export interface HealthProfile {
  id: number;
  full_name: string;
  age: number;
  biological_sex: BiologicalSex;
  height_cm: number;
  weight_kg: number;
  systolic_bp: number;
  diastolic_bp: number;
  fasting_glucose: number;
  total_cholesterol: number;
  hdl_cholesterol: number;
  ldl_cholesterol: number;
  exercise_hours_per_week: number;
  sleep_hours_per_night: number;
  stress_level: number;
  smoking_status: SmokingStatus;
  alcohol_drinks_per_week: number;
  water_intake_liters: number;
  created_at: string;
  updated_at: string;
}

export interface SubScoresBreakdown {
  bmi_score: number;
  bp_score: number;
  glucose_score: number;
  cholesterol_score: number;
  exercise_score: number;
  sleep_score: number;
  stress_score: number;
  smoking_score: number;
  alcohol_score: number;
  water_score: number;
}

export interface DetailedHealthScore {
  id: number;
  profile_id: number;
  overall_score: number;
  bmi: number;
  bmi_category: string;
  cardiovascular_score: number;
  metabolic_score: number;
  lifestyle_score: number;
  calculated_at: string;
  sub_scores?: SubScoresBreakdown;
  risk_category?: RiskCategory;
}

export interface SimulationProjection {
  id: number;
  profile_id: number;
  input_changes: Record<string, any>;
  projected_score: {
    baseline_score: number;
    projected_overall_score: number;
    overall_score_delta: number;
    projected_bmi: number;
    projected_bmi_category: string;
    projected_cardiovascular_score: number;
    cardiovascular_score_delta: number;
    projected_metabolic_score: number;
    metabolic_score_delta: number;
    projected_lifestyle_score: number;
    lifestyle_score_delta: number;
    projected_risk_category: RiskCategory;
    projected_sub_scores: SubScoresBreakdown;
  };
  created_at: string;
}
```

---

## 📡 Endpoint Specifications & Examples

### 1. Health Diagnostics
- **`GET /health`**
- **Summary**: Check backend availability & database connection.
- **Sample Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "status": "online",
    "app_name": "MediTwin AI Backend",
    "environment": "development",
    "database": "healthy",
    "version": "1.0.0",
    "uptime_seconds": 342.15,
    "timestamp": "2026-07-31T01:43:35.123456+00:00"
  },
  "message": "System operational"
}
```

---

### 2. Profile Management

#### `POST /profile`
- **Summary**: Create a patient profile.
- **Sample Request Body**:
```json
{
  "full_name": "Sarah Connor",
  "age": 35,
  "biological_sex": "female",
  "height_cm": 168.0,
  "weight_kg": 62.0,
  "systolic_bp": 118,
  "diastolic_bp": 76,
  "fasting_glucose": 92.0,
  "total_cholesterol": 180.0,
  "hdl_cholesterol": 65.0,
  "ldl_cholesterol": 95.0,
  "exercise_hours_per_week": 4.5,
  "sleep_hours_per_night": 8.0,
  "stress_level": 3,
  "smoking_status": "never",
  "alcohol_drinks_per_week": 1,
  "water_intake_liters": 2.5
}
```
- **Sample Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Sarah Connor",
    "age": 35,
    "biological_sex": "female",
    "height_cm": 168.0,
    "weight_kg": 62.0,
    "systolic_bp": 118,
    "diastolic_bp": 76,
    "fasting_glucose": 92.0,
    "total_cholesterol": 180.0,
    "hdl_cholesterol": 65.0,
    "ldl_cholesterol": 95.0,
    "exercise_hours_per_week": 4.5,
    "sleep_hours_per_night": 8.0,
    "stress_level": 3,
    "smoking_status": "never",
    "alcohol_drinks_per_week": 1,
    "water_intake_liters": 2.5,
    "created_at": "2026-07-31T02:00:00+00:00",
    "updated_at": "2026-07-31T02:00:00+00:00"
  },
  "message": "Patient profile created successfully."
}
```

#### `GET /profile/{id}`
- **Summary**: Retrieve profile details by ID.
- **Sample Response (200 OK)**: Returns `APIResponse<HealthProfile>`.
- **Sample Error (404 Not Found)**:
```json
{
  "success": false,
  "error": {
    "code": "APPLICATION_ERROR",
    "message": "Profile with ID 999 not found."
  }
}
```

#### `PUT /profile/{id}`
- **Summary**: Update profile fields. Send only the fields to update.

---

### 3. Health Score Engine

#### `POST /score/calculate/{profile_id}`
- **Summary**: Computes and persists health scores for a profile.
- **Sample Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "profile_id": 1,
    "overall_score": 93.4,
    "bmi": 21.97,
    "bmi_category": "Normal weight",
    "cardiovascular_score": 95.0,
    "metabolic_score": 92.0,
    "lifestyle_score": 93.0,
    "calculated_at": "2026-07-31T02:01:00+00:00",
    "sub_scores": {
      "bmi_score": 100.0,
      "bp_score": 100.0,
      "glucose_score": 100.0,
      "cholesterol_score": 100.0,
      "exercise_score": 100.0,
      "sleep_score": 100.0,
      "stress_score": 80.0,
      "smoking_score": 100.0,
      "alcohol_score": 80.0,
      "water_score": 100.0
    },
    "risk_category": "Low Risk"
  },
  "message": "Health score computed successfully."
}
```

---

### 4. Digital Twin Simulation Engine

#### `POST /simulation/{profile_id}`
- **Summary**: Runs a scenario simulation by specifying hypothetical changes.
- **Sample Request Body**:
```json
{
  "exercise_hours_per_week": 6.0,
  "weight_kg": 59.0,
  "stress_level": 2
}
```
- **Sample Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "profile_id": 1,
    "input_changes": {
      "exercise_hours_per_week": 6.0,
      "weight_kg": 59.0,
      "stress_level": 2
    },
    "projected_score": {
      "baseline_score": 93.4,
      "projected_overall_score": 96.2,
      "overall_score_delta": 2.8,
      "projected_bmi": 20.9,
      "projected_bmi_category": "Normal weight",
      "projected_cardiovascular_score": 97.0,
      "cardiovascular_score_delta": 2.0,
      "projected_metabolic_score": 94.5,
      "metabolic_score_delta": 2.5,
      "projected_lifestyle_score": 97.5,
      "lifestyle_score_delta": 4.5,
      "projected_risk_category": "Low Risk"
    },
    "created_at": "2026-07-31T02:02:00+00:00"
  },
  "message": "Digital twin simulation executed successfully."
}
```
