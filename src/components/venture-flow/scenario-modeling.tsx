import type { Scenario } from '@/lib/types';
import ScenarioSelector from '@/components/venture-flow/scenario-selector';
import ScenarioParameters from '@/components/venture-flow/scenario-parameters';
import PortfolioCompositionChart from '@/components/venture-flow/portfolio-composition-chart';
import PerformanceComparisonChart from '@/components/venture-flow/performance-comparison-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ScenarioModelingProps = {
  scenarios: Scenario[];
  selectedScenario: string;
  setSelectedScenario: (scenario: string) => void;
  updateScenario: (index: number, field: keyof Scenario, value: string) => void;
};

export default function ScenarioModeling({
  scenarios,
  selectedScenario,
  setSelectedScenario,
  updateScenario,
}: ScenarioModelingProps) {
  return (
    <div className="space-y-8">
      <ScenarioSelector
        scenarios={scenarios.map(s => s.scenario)}
        selectedScenario={selectedScenario}
        setSelectedScenario={setSelectedScenario}
      />
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <ScenarioParameters scenarios={scenarios} updateScenario={updateScenario} />
        </div>
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Portfolio Composition - {selectedScenario}</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioCompositionChart scenarios={scenarios} selectedScenario={selectedScenario} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceComparisonChart scenarios={scenarios} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
