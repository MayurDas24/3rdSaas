import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Waterfall } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';

type DistributionScheduleProps = {
  waterfall: Waterfall[];
};

export default function DistributionSchedule({ waterfall }: DistributionScheduleProps) {
  const totalLp = waterfall[waterfall.length - 1]?.lpCumulative || 0;
  const totalGp = waterfall[waterfall.length - 1]?.gpCumulative || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Distribution Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">Year</TableHead>
                <TableHead className="text-right font-medium">LP Distribution</TableHead>
                <TableHead className="text-right font-medium">GP Distribution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waterfall.map((item) => (
                <TableRow key={item.year}>
                  <TableCell className="font-medium">{item.year}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.lpDistribution)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.gpDistribution)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-primary/10 rounded-lg p-4">
              <div className="text-sm font-medium text-primary">Total LP Distribution</div>
              <div className="text-xl font-bold font-headline text-primary">
                {formatCurrency(totalLp)}
              </div>
            </div>
            <div className="bg-accent/10 rounded-lg p-4">
              <div className="text-sm font-medium text-accent">Total GP Distribution</div>
              <div className="text-xl font-bold font-headline text-accent">
                {formatCurrency(totalGp)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
