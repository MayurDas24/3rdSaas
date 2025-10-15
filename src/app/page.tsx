"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 text-gray-900">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold text-lg">📈 VC-scenario</span>
        </div>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-24 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
          The Future of Fund Forecasting is Here
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          VC-scenario provides institutional-grade tools for venture capitalists to
          model, benchmark, and visualize fund performance with unparalleled precision.
        </p>
        <Link
          href="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition flex items-center gap-2"
        >
          Get Started →
        </Link>
      </section>

      {/* Features Section */}
      <section className="mt-32 bg-white py-16 shadow-inner">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Powerful Features for Data-Driven Decisions
          </h2>
          <p className="text-gray-600 mb-12">
            Everything you need to build and analyze your fund strategy.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Scenario Modeling",
                desc: "Model upside, base, and downside cases dynamically with real-time data.",
              },
              {
                title: "Benchmarking Tools",
                desc: "Compare fund performance against peers and top quartile benchmarks.",
              },
              {
                title: "Waterfall Distributions",
                desc: "Visualize LP and GP distributions with clear, interactive charts.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 bg-slate-50 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-3 text-blue-700">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500 text-sm mt-20">
        © {new Date().getFullYear()} VC-scenario. All rights reserved.
      </footer>
    </main>
  );
}
