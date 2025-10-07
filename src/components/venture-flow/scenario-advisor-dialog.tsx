'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { getScenarioAnalysis } from '@/app/actions';
import type { Scenario } from '@/lib/types';
import { Loader2, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenario: Scenario;
};

export default function ScenarioAdvisorDialog({ open, onOpenChange, scenario }: Props) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        const result = await getScenarioAnalysis({
          scenario: scenario.scenario,
          exitMultiple: scenario.exitMultiple,
          winners: scenario.winners,
          neutrals: scenario.neutrals,
          writeOffs: scenario.writeOffs,
          tvpi: scenario.tvpi,
          irr: scenario.irr,
        });
        setAnalysis(result);
        setIsLoading(false);
      };

      fetchAnalysis();
    }
  }, [open, scenario]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl flex items-center gap-2">
            <Lightbulb className="text-accent" />
            AI Scenario Analysis
          </DialogTitle>
          <DialogDescription>
            AI-powered explanation for the "{scenario.scenario}" scenario.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p>Analyzing scenario...</p>
            </div>
          )}
          {analysis && (
             <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="font-headline">Advisor's Explanation</AlertTitle>
              <AlertDescription className="prose prose-sm max-w-none">
                {analysis.split('\n').map((line, index) => <p key={index}>{line}</p>)}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
