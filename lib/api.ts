import { mockTwinData, mockTimelineEvents, mockAIRecommendations } from './mock-data';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getTwinData() {
  await delay(800);
  return mockTwinData;
}

export async function getTimelineEvents() {
  await delay(600);
  return mockTimelineEvents;
}

export async function getAIRecommendations() {
  await delay(1000);
  return mockAIRecommendations;
}

export async function runSimulation(variables: Record<string, number>) {
  await delay(1500);
  // Return slightly modified mock data based on simulation variables
  const scoreChange = Math.floor(Math.random() * 10) - 3;
  return {
    ...mockTwinData,
    vitalityScore: Math.min(100, Math.max(0, mockTwinData.vitalityScore + scoreChange)),
    lastSimulation: 'Just now',
  };
}
