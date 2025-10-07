import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Benchmark } from '@/lib/types';

type PerformanceSummaryCardsProps = {
  benchmarks: Benchmark[];
};

export default function PerformanceSummaryCards({ benchmarks }: PerformanceSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {benchmarks.map((benchmark) => {
        const outperformsPeer = benchmark.fundPerformance > benchmark.peerMedian;
        return (
          <Card key={benchmark.metric}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{benchmark.metric}</CardTitle>
              {outperformsPeer ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">
                {benchmark.metric.includes('%') ? `${benchmark.fundPerformance}%` : benchmark.fundPerformance}
              </div>
              <p className={`text-xs ${outperformsPeer ? 'text-green-500' : 'text-red-500'}`}>
                {outperformsPeer ? 'Above' : 'Below'} peer median of {benchmark.peerMedian}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
