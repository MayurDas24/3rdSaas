"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
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

  // Determine mode
  const mode = searchParams.get("mode");
  const isFreeMode = mode === "free" || !session?.user?.isPremium;

  // ---------- STATE ----------
  const [activeTab, setActiveTab] = useState("scenarios");
  const [selectedScenario, setSelectedScenario] = useState("Base Case");
  const [expanded, setExpanded] = useState<string | null>("Base Case");
  const [currency, setCurrency] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);

  // ---------- DATA ----------
  const [scenarios, setScenarios] = useState([
    { scenario: "Base Case", exitMultiple: 2, winners: 6, neutrals: 9, writeOffs: 5, tvpi: 1.05, irr: 0.6 },
    { scenario: "Upside Case", exitMultiple: 5, winners: 8, neutrals: 7, writeOffs: 5, tvpi: 2.35, irr: 13 },
    { scenario: "Downside Case", exitMultiple: 1.2, winners: 4, neutrals: 6, writeOffs: 10, tvpi: 0.54, irr: -6.6 },
  ]);

  const [benchmarks, setBenchmarks] = useState([
    { metric: "IRR (%)", fundPerformance: 15, peerMedian: 12, topQuartile: 20 },
    { metric: "TVPI", fundPerformance: 2.2, peerMedian: 2.0, topQuartile: 2.8 },
    { metric: "DPI", fundPerformance: 1.5, peerMedian: 1.3, topQuartile: 2.0 },
    { metric: "Burn Multiple", fundPerformance: 1.2, peerMedian: 1.6, topQuartile: 1.3 },
  ]);

  const [waterfall, setWaterfall] = useState([
    { year: 5, lpDistribution: 40000000, gpDistribution: 0, lpCumulative: 40000000, gpCumulative: 0 },
    { year: 6, lpDistribution: 32327476, gpDistribution: 17672524, lpCumulative: 72327476, gpCumulative: 17672524 },
    { year: 7, lpDistribution: 50938020, gpDistribution: 29061980, lpCumulative: 123265495, gpCumulative: 46734505 },
    { year: 8, lpDistribution: 48000000, gpDistribution: 12000000, lpCumulative: 171265495, gpCumulative: 58734505 },
  ]);

  // ---------- UTILS ----------
  const COLORS = {
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
      { name: "Winners", value: s.winners },
      { name: "Neutrals", value: s.neutrals },
      { name: "Write-offs", value: s.writeOffs },
    ];
  };

  // ---------- HANDLERS ----------
  const updateScenario = (i: number, field: string, value: any) => {
    const updated = [...scenarios];
    updated[i][field] = parseFloat(value) || 0;
    setScenarios(updated);
  };

  const updateBenchmark = (i: number, field: string, value: any) => {
    const updated = [...benchmarks];
    updated[i][field] = parseFloat(value) || 0;
    setBenchmarks(updated);
  };

  const updateWaterfall = (i: number, field: string, value: any) => {
    const updated = [...waterfall];
    updated[i][field] = parseFloat(value) || 0;
    let lpC = 0,
      gpC = 0;
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
    pdf.save(`${activeTab}_Report.pdf`);
  };

  // ---------- RENDER ----------
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
            { id: "scenarios", label: "Scenario Modeling", icon: TrendingUp },
            { id: "benchmarking", label: "Benchmarking", icon: Target },
            { id: "waterfall", label: "Waterfall Distribution", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
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

      {/* MAIN CONTENT */}
      <div ref={pdfRef} className="container mx-auto px-6 py-8 space-y-10">
        {/* SCENARIO MODELING */}
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
              {/* Parameters */}
              <div className="bg-white rounded-xl p-6 border">
                <h2 className="text-xl font-semibold mb-6">Scenario Parameters</h2>
                {scenarios.map((s, i) => (
                  <div key={i} className="border-b pb-4 mb-4 last:border-none">
                    <button
                      onClick={() =>
                        setExpanded(expanded === s.scenario ? null : s.scenario)
                      }
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
                    Portfolio Composition - {selectedScenario}
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPortfolioComposition()}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, value }) => `${name}: ${value}`}
                          dataKey="value"
                        >
                          {getPortfolioComposition().map((e, i) => (
                            <Cell key={i} fill={COLORS[e.name.toLowerCase() as keyof typeof COLORS]} />
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
                      <BarChart data={scenarios}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="scenario" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tvpi" fill="#1e3a8a" />
                        <Bar dataKey="irr" fill="#10b981" />
                      </BarChart>
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
                            value={b[f as keyof typeof b]}
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
                    <BarChart data={benchmarks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fundPerformance" fill="#1e3a8a" />
                      <Bar dataKey="peerMedian" fill="#6b7280" />
                      <Bar dataKey="topQuartile" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WATERFALL */}
        {activeTab === "waterfall" && (
          <div className="space-y-8">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default VCScenarioApp;
