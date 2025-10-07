import { Calculator } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex items-center justify-center">
        <div className="p-3 bg-primary rounded-lg mr-4">
          <Calculator className="text-primary-foreground w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
            VC Scenario Benchmarking Tool
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze investment scenarios, benchmark performance, and model distributions
          </p>
        </div>
      </div>
    </div>
  );
}
