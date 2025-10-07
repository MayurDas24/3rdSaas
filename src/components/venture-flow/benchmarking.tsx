import type { Benchmark } from '@/lib/types';
import BenchmarkParameters from '@/components/venture-flow/benchmark-parameters';
import BenchmarkChart from '@/components/venture-flow/benchmark-chart';
import PerformanceSummaryCards from '@/components/venture-flow/performance-summary-cards';

type BenchmarkingProps = {
  benchmarks: Benchmark[];
  updateBenchmark: (index: number, field: keyof Benchmark, value: string) => void;
};

export default function Benchmarking({ benchmarks, updateBenchmark }: BenchmarkingProps) {
  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <BenchmarkParameters benchmarks={benchmarks} updateBenchmark={updateBenchmark} />
        <BenchmarkChart benchmarks={benchmarks} />
      </div>
      <PerformanceSummaryCards benchmarks={benchmarks} />
    </div>
  );
}
