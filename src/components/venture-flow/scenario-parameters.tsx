"use client";

import React, { useState } from 'react';
import type { Scenario } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import ScenarioAdvisorDialog from './scenario-advisor-dialog';

type ScenarioParametersProps = {
  scenarios: Scenario[];
  updateScenario: (index: number, field: keyof Scenario, value: string) => void;
};

export default function ScenarioParameters({ scenarios, updateScenario }: ScenarioParametersProps) {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [analyzingScenario, setAnalyzingScenario] = useState<Scenario | null>(null);

  const handleAnalyze = (scenario: Scenario) => {
    setAnalyzingScenario(scenario);
    setIsAdvisorOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Scenario Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {scenarios.map((scenario, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium">{scenario.scenario}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`exitMultiple-${index}`}>Exit Multiple</Label>
                        <Input id={`exitMultiple-${index}`} type="number" step="0.1" value={scenario.exitMultiple} onChange={(e) => updateScenario(index, 'exitMultiple', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`winners-${index}`}>Winners</Label>
                        <Input id={`winners-${index}`} type="number" value={scenario.winners} onChange={(e) => updateScenario(index, 'winners', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`neutrals-${index}`}>Neutrals</Label>
                        <Input id={`neutrals-${index}`} type="number" value={scenario.neutrals} onChange={(e) => updateScenario(index, 'neutrals', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`writeOffs-${index}`}>Write-offs</Label>
                        <Input id={`writeOffs-${index}`} type="number" value={scenario.writeOffs} onChange={(e) => updateScenario(index, 'writeOffs', e.target.value)} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor={`tvpi-${index}`}>TVPI</Label>
                        <Input id={`tvpi-${index}`} type="number" step="0.01" value={scenario.tvpi} onChange={(e) => updateScenario(index, 'tvpi', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`irr-${index}`}>IRR (%)</Label>
                        <Input id={`irr-${index}`} type="number" step="0.1" value={scenario.irr} onChange={(e) => updateScenario(index, 'irr', e.target.value)} />
                      </div>
                    </div>
                     <div className="pt-2">
                       <Button variant="outline" size="sm" onClick={() => handleAnalyze(scenario)}>
                         <Lightbulb className="mr-2 h-4 w-4" />
                         Analyze with AI
                       </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      {analyzingScenario && (
        <ScenarioAdvisorDialog
          open={isAdvisorOpen}
          onOpenChange={setIsAdvisorOpen}
          scenario={analyzingScenario}
        />
      )}
    </>
  );
}
