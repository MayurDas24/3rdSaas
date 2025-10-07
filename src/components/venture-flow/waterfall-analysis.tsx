import type { Waterfall } from '@/lib/types';
import DistributionSchedule from '@/components/venture-flow/distribution-schedule';
import CumulativeDistributionsChart from '@/components/venture-flow/cumulative-distributions-chart';
import AnnualDistributionsChart from '@/components/venture-flow/annual-distributions-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type WaterfallAnalysisProps = {
  waterfall: Waterfall[];
};

export default function WaterfallAnalysis({ waterfall }: WaterfallAnalysisProps) {
  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <DistributionSchedule waterfall={waterfall} />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Cumulative Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <CumulativeDistributionsChart waterfall={waterfall} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Annual Distribution Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <AnnualDistributionsChart waterfall={waterfall} />
        </CardContent>
      </Card>
    </div>
  );
}
