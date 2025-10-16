"use client";

import React, { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Target,
} from "lucide-react";
import { signOut } from "next-auth/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const VCScenarioApp = () => {
  // ---- Data ----
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

  const [activeTab, setActiveTab] = useState("scenarios");
  const [selectedScenario, setSelectedScenario] = useState("Base Case");

  const pdfRef = useRef<HTMLDivElement>(null);

  // ---- Utils ----
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const getPortfolioComposition = () => {
    const s = scenarios.find((x) => x.scenario === selectedScenario);
    if (!s) return [];
    const total = s.winners + s.neutrals + s.writeOffs;
    return [
      { name: "Winners", value: s.winners, percentage: ((s.winners / total) * 100).toFixed(1) },
      { name: "Neutrals", value: s.neutrals, percentage: ((s.neutrals / total) * 100).toFixed(1) },
      { name: "Write-offs", value: s.writeOffs, percentage: ((s.writeOffs / total) * 100).toFixed(1) },
    ];
  };

  const COLORS = {
    winners: "#10b981",
    neutrals: "#f59e0b",
    writeOffs: "#ef4444",
    fundPerformance: "#1e3a8a",
    peerMedian: "#6b7280",
    topQuartile: "#10b981",
  };

  const updateScenario = (index: number, field: string, value: any) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = parseFloat(value) || 0;
    setScenarios(newScenarios);
  };

  const updateBenchmark = (index: number, field: string, value: any) => {
    const newBenchmarks = [...benchmarks];
    newBenchmarks[index][field] = parseFloat(value) || 0;
    setBenchmarks(newBenchmarks);
  };

  // ---- Export Full PDF ----
  const exportFullPDF = async () => {
    const pdfContent = pdfRef.current;
    if (!pdfContent) return;

    const canvas = await html2canvas(pdfContent, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190;
    const pageHeight = 280;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("VC_Investment_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#e8ecf8]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1e3a8a] rounded-lg shadow">
              <Calculator className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                VC Scenario Benchmarking Tool
              </h1>
              <p className="text-sm text-gray-600">
                Analyze scenarios, benchmark performance, and visualize returns
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportFullPDF}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Download Full PDF
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-[#1e3a8a] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#243b8a] transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
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
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-[#1e3a8a] text-[#1e3a8a]"
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
      </div>

      {/* Full PDF Capture */}
      <div ref={pdfRef} className="container mx-auto px-6 py-8 space-y-16">
        {/* Scenario Section */}
        <div id="scenarios" className={`${activeTab === "scenarios" ? "block" : "hidden"} print:block`}>
          <h2 className="text-2xl font-bold mb-4 text-[#1e3a8a]">Scenario Modeling</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              {scenarios.map((s, i) => (
                <div key={i} className="mb-6 border-b pb-4 last:border-none">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{s.scenario}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(s).filter((k) => k !== "scenario").map((field) => (
                      <div key={field}>
                        <label className="block text-sm text-gray-600 capitalize">{field}</label>
                        <input
                          type="number"
                          value={s[field as keyof typeof s]}
                          onChange={(e) => updateScenario(i, field, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Portfolio Composition</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPortfolioComposition()}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {getPortfolioComposition().map((entry, i) => (
                          <Cell key={i} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tvpi" fill="#1e3a8a" name="TVPI" />
                      <Bar dataKey="irr" fill="#10b981" name="IRR (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benchmarking Section */}
        <div id="benchmarking" className={`${activeTab === "benchmarking" ? "block" : "hidden"} print:block`}>
          <h2 className="text-2xl font-bold mb-4 text-[#1e3a8a]">Benchmarking</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              {benchmarks.map((b, i) => (
                <div key={i} className="border-b pb-4 mb-4 last:border-none">
                  <h4 className="font-medium">{b.metric}</h4>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {["fundPerformance", "peerMedian", "topQuartile"].map((f) => (
                      <div key={f}>
                        <label className="block text-xs text-gray-600">{f}</label>
                        <input
                          type="number"
                          value={b[f as keyof typeof b]}
                          onChange={(e) => updateBenchmark(i, f, e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#1e3a8a]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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

        {/* Waterfall Section */}
        <div id="waterfall" className={`${activeTab === "waterfall" ? "block" : "hidden"} print:block`}>
          <h2 className="text-2xl font-bold mb-4 text-[#1e3a8a]">Waterfall Distribution</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Year</th>
                      <th className="text-right">LP Distribution</th>
                      <th className="text-right">GP Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterfall.map((w, i) => (
                      <tr key={i} className="border-b last:border-none">
                        <td className="py-2">{w.year}</td>
                        <td className="text-right">{formatCurrency(w.lpDistribution)}</td>
                        <td className="text-right">{formatCurrency(w.gpDistribution)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waterfall}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="lpCumulative" stroke="#1e3a8a" strokeWidth={3} />
                    <Line type="monotone" dataKey="gpCumulative" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VCScenarioApp;
