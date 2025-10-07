"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Waterfall } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { formatCurrency, formatMillion } from '@/lib/formatters';

type Props = {
  waterfall: Waterfall[];
};

const chartConfig = {
  lpDistribution: {
    label: 'LP Distribution',
    color: 'hsl(var(--chart-1))',
  },
  gpDistribution: {
    label: 'GP Distribution',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const AnnualDistributionsChart = ({ waterfall }: Props) => {
  return (
    <div className="h-64 w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <BarChart data={waterfall}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="year"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickFormatter={formatMillion} />
          <ChartTooltip
            content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="lpDistribution" stackId="a" fill="var(--color-lpDistribution)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="gpDistribution" stackId="a" fill="var(--color-gpDistribution)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AnnualDistributionsChart;
