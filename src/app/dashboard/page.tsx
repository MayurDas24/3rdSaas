"use client";

import React, { useState } from 'react';
import { Calculator, TrendingUp, Target, DollarSign } from 'lucide-react';
import { initialScenarios, initialBenchmarks, initialWaterfall } from '@/app/data';
import type { Scenario, Benchmark, Waterfall } from '@/lib/types';
import Header from '@/components/venture-flow/header';
import ScenarioModeling from '@/components/venture-flow/scenario-modeling';
import Benchmarking from '@/components/venture-flow/benchmarking';
import WaterfallAnalysis from '@/components/venture-flow/waterfall-analysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { id: 'scenarios', label: 'Scenario Modeling', icon: TrendingUp },
  { id: 'benchmarking', label: 'Benchmarking', icon: Target },
  { id: 'waterfall', label: 'Waterfall Distribution', icon: DollarSign }
];

export default function VentureFlowPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>(initialBenchmarks);
  const [waterfall, setWaterfall] = useState<Waterfall[]>(initialWaterfall);
  const [selectedScenario, setSelectedScenario] = useState<string>('Base Case');

  const updateScenario = (index: number, field: keyof Scenario, value: string) => {
    const newScenarios = [...scenarios];
    const parsedValue = field === 'scenario' ? value : parseFloat(value) || 0;
    (newScenarios[index] as any)[field] = parsedValue;
    setScenarios(newScenarios);
  };

  const updateBenchmark = (index: number, field: keyof Benchmark, value: string) => {
    const newBenchmarks = [...benchmarks];
    const parsedValue = field === 'metric' ? value : parseFloat(value) || 0;
    (newBenchmarks[index] as any)[field] = parsedValue;
    setBenchmarks(newBenchmarks);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Header />
        <Tabs defaultValue="scenarios" className="w-full mt-8">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-2xl mx-auto h-auto sm:h-12">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="py-2.5 gap-2 text-sm">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          <TabsContent value="scenarios" className="mt-8">
            <ScenarioModeling
              scenarios={scenarios}
              selectedScenario={selectedScenario}
              setSelectedScenario={setSelectedScenario}
              updateScenario={updateScenario}
            />
          </TabsContent>

          <TabsContent value="benchmarking" className="mt-8">
            <Benchmarking
              benchmarks={benchmarks}
              updateBenchmark={updateBenchmark}
            />
          </TabsContent>

          <TabsContent value="waterfall" className="mt-8">
            <WaterfallAnalysis waterfall={waterfall} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
