export type Scenario = {
  scenario: string;
  exitMultiple: number;
  winners: number;
  neutrals: number;
  writeOffs: number;
  tvpi: number;
  irr: number;
};

export type Benchmark = {
  metric: string;
  fundPerformance: number;
  peerMedian: number;
  topQuartile: number;
};

export type Waterfall = {
  year: number;
  lpDistribution: number;
  gpDistribution: number;
  lpCumulative: number;
  gpCumulative: number;
};
