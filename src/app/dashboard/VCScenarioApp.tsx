"use client";

import React, { useState } from "react";
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

const VCScenarioApp = () => {
  // ---- Initial data ----
  const [scenarios, setScenarios] = useState([
    {
      scenario: "Base Case",
      exitMultiple: 2,
      winners: 6,
      neutrals: 9,
      writeOffs: 5,
      tvpi: 1.05,
      irr: 0.6,
    },
    {
      scenario: "Upside Case",
      exitMultiple: 5,
      winners: 8,
      neutrals: 7,
      writeOffs: 5,
      tvpi: 2.35,
      irr: 13,
    },
    {
      scenario: "Downside Case",
      exitMultiple: 1.2,
      winners: 4,
      neutrals: 6,
      writeOffs: 10,
      tvpi: 0.54,
      irr: -6.6,
    },
  ]);

  const [benchmarks, setBenchmarks] = useState([
    { metric: "IRR (%)", fundPerformance: 15, peerMedian: 12, topQuartile: 20 },
    { metric: "TVPI", fundPerformance: 2.2, peerMedian: 2.0, topQuartile: 2.8 },
    { metric: "DPI", fundPerformance: 1.5, peerMedian: 1.3, topQuartile: 2.0 },
    {
      metric: "Burn Multiple",
      fundPerformance: 1.2,
      peerMedian: 1.6,
      topQuartile: 1.3,
    },
  ]);

  const [waterfall, setWaterfall] = useState([
    {
      year: 5,
      lpDistribution: 40000000,
      gpDistribution: 0,
      lpCumulative: 40000000,
      gpCumulative: 0,
    },
    {
      year: 6,
      lpDistribution: 32327476,
      gpDistribution: 17672524,
      lpCumulative: 72327476,
      gpCumulative: 17672524,
    },
    {
      year: 7,
      lpDistribution: 50938020,
      gpDistribution: 29061980,
      lpCumulative: 123265495,
      gpCumulative: 46734505,
    },
    {
      year: 8,
      lpDistribution: 48000000,
      gpDistribution: 12000000,
      lpCumulative: 171265495,
      gpCumulative: 58734505,
    },
  ]);

  const [activeTab, setActiveTab] = useState("scenarios");
  const [selectedScenario, setSelectedScenario] = useState("Base Case");

  // ---- Utility functions ----
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const getPortfolioComposition = () => {
    const scenario = scenarios.find((s) => s.scenario === selectedScenario);
    if (!scenario) return [];
    const total = scenario.winners + scenario.neutrals + scenario.writeOffs;
    return [
      {
        name: "Winners",
        value: scenario.winners,
        percentage: ((scenario.winners / total) * 100).toFixed(1),
      },
      {
        name: "Neutrals",
        value: scenario.neutrals,
        percentage: ((scenario.neutrals / total) * 100).toFixed(1),
      },
      {
        name: "Write-offs",
        value: scenario.writeOffs,
        percentage: ((scenario.writeOffs / total) * 100).toFixed(1),
      },
    ];
  };

  const COLORS = {
    winners: "#10b981",
    neutrals: "#f59e0b",
    writeOffs: "#ef4444",
    fundPerformance: "#3b82f6",
    peerMedian: "#6b7280",
    topQuartile: "#10b981",
  };

  const updateScenario = (index: number, field: string, value: any) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = {
      ...newScenarios[index],
      [field]: parseFloat(value) || 0,
    };
    setScenarios(newScenarios);
  };

  const updateBenchmark = (index: number, field: string, value: any) => {
    const newBenchmarks = [...benchmarks];
    newBenchmarks[index] = {
      ...newBenchmarks[index],
      [field]: parseFloat(value) || 0,
    };
    setBenchmarks(newBenchmarks);
  };

  // ---- Main UI ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Calculator className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              VC Scenario Benchmarking Tool
            </h1>
            <p className="text-gray-600">
              Analyze investment scenarios, benchmark performance, and model
              distributions
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
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
                      ? "border-blue-500 text-blue-600"
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

        {/* Scenario Modeling */}
        {activeTab === "scenarios" && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Select Scenario</h2>
              <div className="flex gap-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.scenario}
                    onClick={() => setSelectedScenario(scenario.scenario)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedScenario === scenario.scenario
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {scenario.scenario}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left: Input fields */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">
                  Scenario Parameters
                </h2>
                <div className="space-y-6">
                  {scenarios.map((scenario, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h3 className="font-semibold text-lg mb-4 text-gray-800">
                        {scenario.scenario}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.keys(scenario).map((field) =>
                          field !== "scenario" ? (
                            <div key={field}>
                              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                {field}
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={scenario[field as keyof typeof scenario]}
                                onChange={(e) =>
                                  updateScenario(index, field, e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Charts */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
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
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percentage }) =>
                            `${name}: ${percentage}%`
                          }
                        >
                          {getPortfolioComposition().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                COLORS[
                                  entry.name.toLowerCase().replace("-", "")
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

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">
                    Performance Comparison
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scenarios}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="scenario" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tvpi" fill="#3b82f6" name="TVPI" />
                        <Bar dataKey="irr" fill="#10b981" name="IRR (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benchmarking */}
        {activeTab === "benchmarking" && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Benchmark Data</h2>
                <div className="space-y-4">
                  {benchmarks.map((benchmark, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <h4 className="font-medium mb-3">{benchmark.metric}</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {["fundPerformance", "peerMedian", "topQuartile"].map(
                          (field) => (
                            <div key={field}>
                              <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                                {field}
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={benchmark[field as keyof typeof benchmark]}
                                onChange={(e) =>
                                  updateBenchmark(index, field, e.target.value)
                                }
                                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">
                  Performance vs Benchmarks
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="fundPerformance"
                        fill={COLORS.fundPerformance}
                      />
                      <Bar dataKey="peerMedian" fill={COLORS.peerMedian} />
                      <Bar dataKey="topQuartile" fill={COLORS.topQuartile} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Waterfall */}
        {activeTab === "waterfall" && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">
                  Distribution Schedule
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium">Year</th>
                        <th className="text-right py-2 font-medium">
                          LP Distribution
                        </th>
                        <th className="text-right py-2 font-medium">
                          GP Distribution
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {waterfall.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{item.year}</td>
                          <td className="py-3 text-right">
                            {formatCurrency(item.lpDistribution)}
                          </td>
                          <td className="py-3 text-right">
                            {formatCurrency(item.gpDistribution)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">
                  Cumulative Distributions
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterfall}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="lpCumulative"
                        stroke="#3b82f6"
                        name="LP Cumulative"
                      />
                      <Line
                        type="monotone"
                        dataKey="gpCumulative"
                        stroke="#10b981"
                        name="GP Cumulative"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VCScenarioApp;
