'use server';

import { analyzeScenario, type ScenarioAnalysisInput } from '@/ai/flows/scenario-analysis-advisor';

export async function getScenarioAnalysis(input: ScenarioAnalysisInput): Promise<string> {
  try {
    const analysis = await analyzeScenario(input);
    return analysis;
  } catch (error) {
    console.error('Error in getScenarioAnalysis action:', error);
    return 'An error occurred while analyzing the scenario. Please check the server logs and try again.';
  }
}
