"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef } from "react";
import {
  BarChart as RBChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const VCScenarioApp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Free explore when ?mode=free OR when user not premium.
  const mode = searchParams.get("mode");
  const isFreeMode = mode === "free" || !session?.user?.isPremium;

  // ---------- STATE ----------
  const [activeTab, setActiveTab] = useState<"scenarios" | "benchmarking" | "waterfall">("scenarios");
  const [selectedScenario, setSelectedScenario] = useState("Base Case");
  const [expanded, setExpanded] = useState<string | null>("Base Case");
  const [currency, setCurrency] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);

  // ---------- DATA (mentor defaults so it looks alive) ----------
  const [scenarios, setScenarios] = useState([
    { scenario: "Base Case",     exitMultiple: 2,   winners: 6, neutrals: 9,  writeOffs: 5,  tvpi: 1.05, irr: 0.6 },
    { scenario: "Upside Case",   exitMultiple: 5,   winners: 8, neutrals: 7,  writeOffs: 5,  tvpi: 2.35, irr: 13  },
    { scenario: "Downside Case", exitMultiple: 1.2, winners: 4, neutrals: 6,  writeOffs: 10, tvpi: 0.54, irr: -6.6 },
  ]);

  const [benchmarks, setBenchmarks] = useState([
    { metric: "IRR (%)",        fundPerformance: 15, peerMedian: 12, topQuartile: 20 },
    { metric: "TVPI",           fundPerformance: 2.2, peerMedian: 2.0, topQuartile: 2.8 },
    { metric: "DPI",            fundPerformance: 1.5, peerMedian: 1.3, topQuartile: 2.0 },
    { metric: "Burn Multiple",  fundPerformance: 1.2, peerMedian: 1.6, topQuartile: 1.3 },
  ]);

  const [waterfall, setWaterfall] = useState([
    { year: 5, lpDistribution: 40000000, gpDistribution:     0, lpCumulative:  40000000, gpCumulative:         0 },
    { year: 6, lpDistribution: 32327476, gpDistribution: 17672524, lpCumulative:  72327476, gpCumulative:  17672524 },
    { year: 7, lpDistribution: 50938020, gpDistribution: 29061980, lpCumulative: 123265495, gpCumulative:  46734505 },
    { year: 8, lpDistribution: 48000000, gpDistribution: 12000000, lpCumulative: 171265495, gpCumulative:  58734505 },
  ]);

  // ---------- UTILS ----------
  const COLORS: Record<string, string> = {
    winners: "#10b981",
    neutrals: "#f59e0b",
    writeOffs: "#ef4444",
    fundPerformance: "#3b82f6",
    peerMedian: "#6b7280",
    topQuartile: "#10b981",
  };

  const currencySymbols: Record<string, string> = {
    USD: "$",
    INR: "₹",
    GBP: "£",
    AED: "د.إ",
    EUR: "€",
  };
  const getSymbol = () => currencySymbols[currency] || "$";
  const formatCurrency = (v: number) =>
    `${getSymbol()}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v)}`;

  const getPortfolioComposition = () => {
    const s = scenarios.find((x) => x.scenario === selectedScenario);
    if (!s) return [];
    const total = s.winners + s.neutrals + s.writeOffs;
    if (total === 0) return [];
    return [
      { name: "Winners",   value: s.winners   },
      { name: "Neutrals",  value: s.neutrals  },
      { name: "Write-offs", value: s.writeOffs },
    ];
  };

  // ---------- HANDLERS ----------
  const updateScenario = (i: number, field: string, value: any) => {
    const updated = [...scenarios];
    // @ts-ignore
    updated[i][field] = parseFloat(value) || 0;
    setScenarios(updated);
  };

  const updateBenchmark = (i: number, field: string, value: any) => {
    const updated = [...benchmarks];
    // @ts-ignore
    updated[i][field] = parseFloat(value) || 0;
    setBenchmarks(updated);
  };

  const updateWaterfall = (i: number, field: string, value: any) => {
    const updated = [...waterfall];
    // @ts-ignore
    updated[i][field] = parseFloat(value) || 0;

    // recompute cumulatives
    let lpC = 0, gpC = 0;
    updated.forEach((w) => {
      lpC += w.lpDistribution;
      gpC += w.gpDistribution;
      w.lpCumulative = lpC;
      w.gpCumulative = gpC;
    });

    setWaterfall(updated);
  };

  const exportPDF = async () => {
    if (isFreeMode) {
      router.push("/checkout");
      return;
    }
    const content = pdfRef.current;
    if (!content) return;

    const canvas = await html2canvas(content, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = 190;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, width, height);
    const file =
      activeTab === "scenarios"
        ? "Scenario_Report.pdf"
        : activeTab === "benchmarking"
        ? "Benchmark_Report.pdf"
        : "Waterfall_Report.pdf";
    pdf.save(file);
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* HEADER */}
      <div className="sticky top-0 bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition"
          onClick={() => router.push("/")}
        >
          <div className="p-3 bg-blue-600 rounded-lg">
            <Calculator className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            VC Scenario Benchmarking Tool
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportPDF}
            disabled={isFreeMode}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              isFreeMode
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {isFreeMode ? "Upgrade to Download" : "Download Report"}
          </button>

          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-blue-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-900"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 container mx-auto px-6">
          {[
            { id: "scenarios",   label: "Scenario Modeling",      icon: TrendingUp },
            { id: "benchmarking",label: "Benchmarking",           icon: Target     },
            { id: "waterfall",   label: "Waterfall Distribution", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon as any;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === (tab.id as any)
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* MAIN */}
      <div ref={pdfRef} className="container mx-auto px-6 py-8 space-y-10">
        {/* SCENARIOS */}
        {activeTab === "scenarios" && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Select Scenario</h2>
              <div className="flex gap-3">
                {scenarios.map((s) => (
                  <button
                    key={s.scenario}
                    onClick={() => setSelectedScenario(s.scenario)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedScenario === s.scenario
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {s.scenario}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Inputs */}
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-6">Scenario Parameters</h2>
                {scenarios.map((s, i) => (
                  <div key={i} className="border-b pb-4 mb-4 last:border-none">
                    <button
                      onClick={() => setExpanded(expanded === s.scenario ? null : s.scenario)}
                      className="flex justify-between w-full font-semibold text-lg"
                    >
                      {s.scenario}
                      <span>{expanded === s.scenario ? "▲" : "▼"}</span>
                    </button>
                    {expanded === s.scenario && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {Object.entries(s)
                          .filter(([key]) => key !== "scenario")
                          .map(([f, v]) => (
                            <div key={f}>
                              <label className="block text-sm text-gray-600 capitalize mb-1">
                                {f}
                              </label>
                              <input
                                type="number"
                                value={v as number}
                                onChange={(e) => updateScenario(i, f, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4">
                    Portfolio Composition — {selectedScenario}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPortfolioComposition()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {getPortfolioComposition().map((e, i) => (
                            <Cell
                              key={i}
                              fill={
                                COLORS[
                                  e.name.toLowerCase().replace("-", "") as keyof typeof COLORS
                                ]
                              }
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RBChart data={scenarios}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="scenario" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tvpi" fill="#3b82f6" name="TVPI" />
                        <Bar dataKey="irr"  fill="#10b981" name="IRR (%)" />
                      </RBChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BENCHMARKING */}
        {activeTab === "benchmarking" && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-6">Benchmark Data</h2>
                {benchmarks.map((b, i) => (
                  <div key={i} className="border rounded-lg p-4 mb-4">
                    <h4 className="font-medium mb-3">{b.metric}</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {["fundPerformance", "peerMedian", "topQuartile"].map((f) => (
                        <div key={f}>
                          <label className="block text-xs text-gray-600 mb-1 capitalize">
                            {f.replace(/([A-Z])/g, " $1")}
                          </label>
                          <input
                            type="number"
                            value={(b as any)[f]}
                            onChange={(e) => updateBenchmark(i, f, e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-6">Performance vs Benchmarks</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RBChart data={benchmarks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fundPerformance" fill={COLORS.fundPerformance} name="Fund Performance" />
                      <Bar dataKey="peerMedian"      fill={COLORS.peerMedian}      name="Peer Median" />
                      <Bar dataKey="topQuartile"     fill={COLORS.topQuartile}     name="Top Quartile" />
                    </RBChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benchmarks.map((b, i) => {
                const up = b.fundPerformance > b.peerMedian;
                return (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{b.metric}</h4>
                      {up ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="text-2xl font-bold">
                      {b.metric.includes("%") ? `${b.fundPerformance}%` : b.fundPerformance}
                    </div>
                    <p className={`text-sm ${up ? "text-green-600" : "text-red-600"}`}>
                      {up ? `Above peer median of ${b.peerMedian}` : `Below peer median of ${b.peerMedian}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* WATERFALL */}
        {activeTab === "waterfall" && (
          <div className="space-y-8">
            {/* Currency Selector */}
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4">Select Currency</h2>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="p-3 border rounded w-64 focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Choose Currency --</option>
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="GBP">Pound (£)</option>
                <option value="AED">Dirham (د.إ)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            {/* Table + Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Table */}
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-6">Distribution Schedule</h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Year</th>
                      <th className="text-right py-2">LP Distribution</th>
                      <th className="text-right py-2">GP Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterfall.map((w, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 font-medium">{w.year}</td>
                        <td className="text-right py-2">
                          {currency ? (
                            <input
                              type="number"
                              value={w.lpDistribution}
                              onChange={(e) => updateWaterfall(i, "lpDistribution", e.target.value)}
                              className="text-right p-1 border border-gray-300 rounded w-28"
                            />
                          ) : (
                            formatCurrency(w.lpDistribution)
                          )}
                        </td>
                        <td className="text-right py-2">
                          {currency ? (
                            <input
                              type="number"
                              value={w.gpDistribution}
                              onChange={(e) => updateWaterfall(i, "gpDistribution", e.target.value)}
                              className="text-right p-1 border border-gray-300 rounded w-28"
                            />
                          ) : (
                            formatCurrency(w.gpDistribution)
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-700">Total LP Distribution</div>
                    <div className="text-xl font-bold text-blue-900">
                      {formatCurrency(waterfall[waterfall.length - 1]?.lpCumulative || 0)}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-700">Total GP Distribution</div>
                    <div className="text-xl font-bold text-green-900">
                      {formatCurrency(waterfall[waterfall.length - 1]?.gpCumulative || 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cumulative Chart */}
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-6">Cumulative Distributions</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterfall}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(v) => `${getSymbol()}${(Number(v) / 1_000_000).toFixed(0)}M`} />
                      <Tooltip formatter={(v) => formatCurrency(v as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="lpCumulative" stroke="#3b82f6" strokeWidth={3} name="LP Cumulative" dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="gpCumulative" stroke="#10b981" strokeWidth={3} name="GP Cumulative" dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Annual Breakdown */}
            <div className="bg-white rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-6">Annual Distribution Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RBChart data={waterfall}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(v) => `${getSymbol()}${(Number(v) / 1_000_000).toFixed(0)}M`} />
                    <Tooltip formatter={(v) => formatCurrency(v as number)} />
                    <Legend />
                    <Bar dataKey="lpDistribution" fill="#3b82f6" name="LP Distribution" />
                    <Bar dataKey="gpDistribution" fill="#10b981" name="GP Distribution" />
                  </RBChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VCScenarioApp;
