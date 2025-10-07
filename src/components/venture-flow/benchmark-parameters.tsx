import type { Benchmark } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type BenchmarkParametersProps = {
  benchmarks: Benchmark[];
  updateBenchmark: (index: number, field: keyof Benchmark, value: string) => void;
};

export default function BenchmarkParameters({ benchmarks, updateBenchmark }: BenchmarkParametersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Benchmark Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {benchmarks.map((benchmark, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <h4 className="font-medium">{benchmark.metric}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={`fundPerformance-${index}`} className="text-xs text-muted-foreground">Fund Performance</Label>
                <Input
                  id={`fundPerformance-${index}`}
                  type="number"
                  step="0.1"
                  value={benchmark.fundPerformance}
                  onChange={(e) => updateBenchmark(index, 'fundPerformance', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`peerMedian-${index}`} className="text-xs text-muted-foreground">Peer Median</Label>
                <Input
                  id={`peerMedian-${index}`}
                  type="number"
                  step="0.1"
                  value={benchmark.peerMedian}
                  onChange={(e) => updateBenchmark(index, 'peerMedian', e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`topQuartile-${index}`} className="text-xs text-muted-foreground">Top Quartile</Label>
                <Input
                  id={`topQuartile-${index}`}
                  type="number"
                  step="0.1"
                  value={benchmark.topQuartile}
                  onChange={(e) => updateBenchmark(index, 'topQuartile', e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
