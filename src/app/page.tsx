"use client";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-200 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-blue-600" />
            <span className="font-bold text-xl">VC-scenario</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/signin"
              className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <main className="text-center py-24 md:py-36">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
          The Future of Fund Forecasting is Here
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Model scenarios, benchmark performance, and visualize distributions with precision.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </Link>
      </main>
    </div>
  );
}
