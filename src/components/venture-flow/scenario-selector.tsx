import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ScenarioSelectorProps = {
  scenarios: string[];
  selectedScenario: string;
  setSelectedScenario: (scenario: string) => void;
};

export default function ScenarioSelector({
  scenarios,
  selectedScenario,
  setSelectedScenario,
}: ScenarioSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl">Select Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <Button
              key={scenario}
              onClick={() => setSelectedScenario(scenario)}
              variant={selectedScenario === scenario ? 'default' : 'secondary'}
              size="sm"
            >
              {scenario}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
