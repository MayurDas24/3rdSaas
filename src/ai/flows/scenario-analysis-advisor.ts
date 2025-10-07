'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing explanations on unlikely portfolio performance scenarios.
 *
 * It takes investment allocations (winners/neutrals/write-offs) and projected portfolio performance (TVPI/IRR) as input,
 * and uses an AI model to suggest possible explanations for unlikely scenarios.
 *
 * - `analyzeScenario` - An async function that takes `ScenarioAnalysisInput` and returns a `string`.
 * - `ScenarioAnalysisInput` - The input type for the `analyzeScenario` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScenarioAnalysisInputSchema = z.object({
  scenario: z.string().describe('The name of the scenario being analyzed.'),
  exitMultiple: z.number().describe('The exit multiple for the scenario.'),
  winners: z.number().describe('The number of winning investments in the scenario.'),
  neutrals: z.number().describe('The number of neutral investments in the scenario.'),
  writeOffs: z.number().describe('The number of write-off investments in the scenario.'),
  tvpi: z.number().describe('The Total Value to Paid-In (TVPI) for the scenario.'),
  irr: z.number().describe('The Internal Rate of Return (IRR) for the scenario.'),
});
export type ScenarioAnalysisInput = z.infer<typeof ScenarioAnalysisInputSchema>;

const ScenarioAnalysisOutputSchema = z.string();
export type ScenarioAnalysisOutput = z.infer<typeof ScenarioAnalysisOutputSchema>;

export async function analyzeScenario(input: ScenarioAnalysisInput): Promise<string> {
  return scenarioAnalysisFlow(input);
}

const scenarioAnalysisPrompt = ai.definePrompt({
  name: 'scenarioAnalysisPrompt',
  input: {schema: ScenarioAnalysisInputSchema},
  output: {schema: ScenarioAnalysisOutputSchema},
  prompt: `You are a venture capital investment advisor.

You are analyzing a scenario with the following parameters:
Scenario Name: {{scenario}}
Exit Multiple: {{exitMultiple}}
Number of Winners: {{winners}}
Number of Neutrals: {{neutrals}}
Number of Write-offs: {{writeOffs}}
TVPI: {{tvpi}}
IRR: {{irr}}

Provide a brief explanation of why the projected portfolio performance (TVPI/IRR) might be unlikely based on the investment allocations (winners/neutrals/write-offs). Consider factors such as market conditions, investment strategy, and potential risks.
`,
});

const scenarioAnalysisFlow = ai.defineFlow(
  {
    name: 'scenarioAnalysisFlow',
    inputSchema: ScenarioAnalysisInputSchema,
    outputSchema: ScenarioAnalysisOutputSchema,
  },
  async input => {
    const {text} = await scenarioAnalysisPrompt(input);
    return text!;
  }
);
