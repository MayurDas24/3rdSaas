"use client";

import Link from "next/link";
import { ArrowRight, LineChart, BarChart3, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col text-gray-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <LineChart className="w-6 h-6 text-blue-800" />
          <h1 className="font-semibold text-lg text-gray-900">VC-scenario</h1>
        </div>
        <Link
          href="/dashboard"
          className="bg-blue-800 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-900 transition"
        >
          Go to Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          The Future of Fund Forecasting is Here
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-10">
          VC-scenario provides institutional-grade tools for venture capitalists
          to model, benchmark, and visualize fund performance with unparalleled
          precision.
        </p>
        <Link
          href="/signup"
          className="flex items-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-blue-900 transition"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 mt-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Data-Driven Decisions
          </h2>
          <p className="text-gray-600 mb-16">
            Everything you need to build and analyze your fund strategy.
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-6">
                <LineChart className="w-8 h-8 text-blue-800" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Scenario Modeling</h3>
              <p className="text-gray-600 max-w-xs">
                Input and adjust key parameters to simulate different investment
                outcomes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-6">
                <BarChart3 className="w-8 h-8 text-blue-800" />
              </div>
              <h3 className="font-semibold text-xl mb-3">
                Real-time Visualization
              </h3>
              <p className="text-gray-600 max-w-xs">
                Automatically visualize results with live-updating charts and
                graphs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-blue-100 rounded-full mb-6">
                <CheckCircle2 className="w-8 h-8 text-blue-800" />
              </div>
              <h3 className="font-semibold text-xl mb-3">
                Benchmark Comparison
              </h3>
              <p className="text-gray-600 max-w-xs">
                Compare fund performance against peer medians and top quartile
                benchmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-auto text-center text-sm text-gray-500">
        <p>© 2025 VC-scenario. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-2">
          <Link href="#" className="hover:text-blue-800 transition">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-blue-800 transition">
            Terms of Service
          </Link>
        </div>
      </footer>
    </main>
  );
}
