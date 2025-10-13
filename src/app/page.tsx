'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, CheckCircle, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <BarChart className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold">VC-scenario</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center">
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="py-24 text-center">
          <div className="container">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
              The Future of Fund Forecasting is Here
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              VC-scenario provides institutional-grade tools for venture capitalists to model, benchmark, and visualize fund performance with unparalleled precision.
            </p>
            <div className="mt-8">
              <Link href="/dashboard">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-20">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold font-headline">Powerful Features for Data-Driven Decisions</h2>
              <p className="mt-2 text-muted-foreground">Everything you need to build and analyze your fund strategy.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Scenario Modeling</h3>
                <p className="mt-2 text-muted-foreground">
                  Input and adjust key parameters to simulate different investment outcomes.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Real-time Visualization</h3>
                <p className="mt-2 text-muted-foreground">
                  Automatically visualize results with live-updating charts and graphs.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-headline">Benchmark Comparison</h3>
                <p className="mt-2 text-muted-foreground">
                  Compare fund performance against peer medians and top quartile benchmarks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

       {/* Footer */}
       <footer className="border-t py-6">
          <div className="container flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VC-scenario. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                </Link>
                 <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                </Link>
            </div>
          </div>
        </footer>
    </div>
  );
}
