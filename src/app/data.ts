import type { Scenario, Benchmark, Waterfall } from '@/lib/types';

export const initialScenarios: Scenario[] = [
  { scenario: 'Base Case', exitMultiple: 2, winners: 6, neutrals: 9, writeOffs: 5, tvpi: 1.05, irr: 0.6 },
  { scenario: 'Upside Case', exitMultiple: 5, winners: 8, neutrals: 7, writeOffs: 5, tvpi: 2.35, irr: 13 },
  { scenario: 'Downside Case', exitMultiple: 1.2, winners: 4, neutrals: 6, writeOffs: 10, tvpi: 0.54, irr: -6.6 }
];

export const initialBenchmarks: Benchmark[] = [
  { metric: 'IRR (%)', fundPerformance: 15, peerMedian: 12, topQuartile: 20 },
  { metric: 'TVPI', fundPerformance: 2.2, peerMedian: 2.0, topQuartile: 2.8 },
  { metric: 'DPI', fundPerformance: 1.5, peerMedian: 1.3, topQuartile: 2.0 },
  { metric: 'Burn Multiple', fundPerformance: 1.2, peerMedian: 1.6, topQuartile: 1.3 }
];

export const initialWaterfall: Waterfall[] = [
  { year: 5, lpDistribution: 40000000, gpDistribution: 0, lpCumulative: 40000000, gpCumulative: 0 },
  { year: 6, lpDistribution: 32327476, gpDistribution: 17672524, lpCumulative: 72327476, gpCumulative: 17672524 },
  { year: 7, lpDistribution: 50938020, gpDistribution: 29061980, lpCumulative: 123265495, gpCumulative: 46734505 },
  { year: 8, lpDistribution: 48000000, gpDistribution: 12000000, lpCumulative: 171265495, gpCumulative: 58734505 }
];
