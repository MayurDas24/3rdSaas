"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Scenario } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

type Props = {
  scenarios: Scenario[];
};

const chartConfig = {
  tvpi: {
    label: 'TVPI',
    color: 'hsl(var(--chart-1))',
  },
  irr: {
    label: 'IRR (%)',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const PerformanceComparisonChart = ({ scenarios }: Props) => {
  return (
    <div className="h-64 w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <BarChart data={scenarios} margin={{ top: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="scenario"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [
                  name === 'irr' ? `${value}%` : value,
                  name.toString().toUpperCase(),
                ]}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="tvpi" fill="var(--color-tvpi)" radius={4} />
          <Bar dataKey="irr" fill="var(--color-irr)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default PerformanceComparisonChart;
