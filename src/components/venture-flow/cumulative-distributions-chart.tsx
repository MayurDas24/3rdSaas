"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';
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
  lpCumulative: {
    label: 'LP Cumulative',
    color: 'hsl(var(--chart-1))',
  },
  gpCumulative: {
    label: 'GP Cumulative',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const CumulativeDistributionsChart = ({ waterfall }: Props) => {
  return (
    <div className="h-80 w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <LineChart data={waterfall} margin={{ top: 20 }}>
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
          <Line
            type="monotone"
            dataKey="lpCumulative"
            stroke="var(--color-lpCumulative)"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="gpCumulative"
            stroke="var(--color-gpCumulative)"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default CumulativeDistributionsChart;
