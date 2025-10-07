"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import type { Benchmark } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  benchmarks: Benchmark[];
};

const chartConfig = {
  fundPerformance: {
    label: 'Fund Performance',
    color: 'hsl(var(--chart-1))',
  },
  peerMedian: {
    label: 'Peer Median',
    color: 'hsl(var(--muted-foreground))',
  },
  topQuartile: {
    label: 'Top Quartile',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const BenchmarkChart = ({ benchmarks }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Performance vs Benchmarks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart data={benchmarks} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="metric"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="fundPerformance" fill="var(--color-fundPerformance)" radius={4} />
              <Bar dataKey="peerMedian" fill="var(--color-peerMedian)" radius={4} />
              <Bar dataKey="topQuartile" fill="var(--color-topQuartile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BenchmarkChart;
