"use client";

import { Pie, PieChart, Cell } from 'recharts';
import type { Scenario } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

type Props = {
  scenarios: Scenario[];
  selectedScenario: string;
};

const PortfolioCompositionChart = ({ scenarios, selectedScenario }: Props) => {
  const scenario = scenarios.find(s => s.scenario === selectedScenario);

  if (!scenario) return null;

  const total = scenario.winners + scenario.neutrals + scenario.writeOffs;
  const portfolioComposition = [
    { name: 'Winners', value: scenario.winners, percentage: (scenario.winners / total * 100), fill: 'var(--color-winners)' },
    { name: 'Neutrals', value: scenario.neutrals, percentage: (scenario.neutrals / total * 100), fill: 'var(--color-neutrals)' },
    { name: 'Write-offs', value: scenario.writeOffs, percentage: (scenario.writeOffs / total * 100), fill: 'var(--color-writeoffs)' },
  ];

  const chartConfig = {
    value: {
      label: 'Value',
    },
    winners: {
      label: 'Winners',
      color: 'hsl(var(--chart-2))',
    },
    neutrals: {
      label: 'Neutrals',
      color: 'hsl(var(--chart-4))',
    },
    writeoffs: {
      label: 'Write-offs',
      color: 'hsl(var(--chart-3))',
    },
  } satisfies ChartConfig;

  return (
    <div className="h-64 w-full">
      <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
              hideLabel 
              formatter={(value, name, item) => (
                <>
                  <div className="flex items-center gap-2 font-medium leading-none">
                     <span className="flex h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{backgroundColor: item.payload.fill}}/>
                     {item.payload.name}
                  </div>
                  <div className="pl-4">
                    Count: {value} <br/>
                    Percent: {item.payload.percentage.toFixed(1)}%
                  </div>
                </>
            )}
            />}
          />
          <Pie
            data={portfolioComposition}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            label={({ name, percentage }) => `${name.slice(0,1)}: ${percentage.toFixed(0)}%`}
            labelLine={false}
          >
             {portfolioComposition.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default PortfolioCompositionChart;
