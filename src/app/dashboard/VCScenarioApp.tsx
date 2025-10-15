"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Calculator, TrendingUp, DollarSign, AlertTriangle, Target, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

function useDebouncedEffect(effect: () => void, deps: any[], delay = 800) {
  useEffect(() => {
    const handler = setTimeout(effect, delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

export default function VCScenarioApp({ initialData }: any) {
  const [scenarios, setScenarios] = useState(initialData.scenarios);
  const [benchmarks, setBenchmarks] = useState(initialData.benchmarks);
  const [waterfall, setWaterfall] = useState(initialData.waterfalls);
  const [activeTab, setActiveTab] = useState("scenarios");
  const [selectedScenario, setSelectedScenario] = useState("Base Case");

  const COLORS = useMemo(() => ({
    winners: "#10b981",
    neutrals: "#f59e0b",
    writeOffs: "#ef4444",
    fundPerformance: "#3b82f6",
    peerMedian: "#6b7280",
    topQuartile: "#059669",
  }), []);

  useDebouncedEffect(() => {
    (async () => {
      await Promise.all([
        fetch("/api/scenario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenarios }),
        }),
        fetch("/api/benchmark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ benchmarks }),
        }),
        fetch("/api/waterfall", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ waterfalls: waterfall }),
        }),
      ]);
    })();
  }, [scenarios, benchmarks, waterfall]);

  const scenarioDistribution = () => {
    const s = scenarios.find((x: any) => x.scenario === selectedScenario);
    if (!s) return [];
    const total = s.winners + s.neutrals + s.writeOffs;
    return [
      { name: "Winners", value: s.winners, percentage: ((s.winners / total) * 100).toFixed(1) },
      { name: "Neutrals", value: s.neutrals, percentage: ((s.neutrals / total) * 100).toFixed(1) },
      { name: "Write-offs", value: s.writeOffs, percentage: ((s.writeOffs / total) * 100).toFixed(1) },
    ];
  };

  const updateScenario = (i: number, field: string, value: any) => {
    const arr = [...scenarios];
    arr[i][field] = parseFloat(value) || 0;
    setScenarios(arr);
  };

  const tabs = [
    { id: "scenarios", label: "Scenario Modeling", icon: Calculator },
    { id: "benchmarks", label: "Benchmarking", icon: TrendingUp },
    { id: "waterfall", label: "Waterfall Analysis", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 rounded-lg"><Calculator className="text-white w-8 h-8" /></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VC Scenario Benchmarking Tool</h1>
              <p className="text-gray-600">Analyze investment scenarios, benchmark performance, and model distributions</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => {
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === "scenarios" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Parameters</h3>
              <div className="space-y-4">
                {scenarios.map((s: any, i: number) => (
                  <div key={s.scenario} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{s.scenario}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-sm text-gray-600">Exit Multiple</label>
                      <input
                        className="border rounded px-2 py-1"
                        defaultValue={s.exitMultiple}
                        onChange={(e) => updateScenario(i, "exitMultiple", e.target.value)}
                      />
                      <label className="text-sm text-gray-600">Winners</label>
                      <input
                        className="border rounded px-2 py-1"
                        defaultValue={s.winners}
                        onChange={(e) => updateScenario(i, "winners", e.target.value)}
                      />
                      <label className="text-sm text-gray-600">Neutrals</label>
                      <input
                        className="border rounded px-2 py-1"
                        defaultValue={s.neutrals}
                        onChange={(e) => updateScenario(i, "neutrals", e.target.value)}
                      />
                      <label className="text-sm text-gray-600">Write-offs</label>
                      <input
                        className="border rounded px-2 py-1"
                        defaultValue={s.writeOffs}
                        onChange={(e) => updateScenario(i, "writeOffs", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Distribution by Outcome</h3>
                <select
                  className="border rounded px-2 py-1"
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                >
                  {scenarios.map((s: any) => (
                    <option key={s.scenario} value={s.scenario}>{s.scenario}</option>
                  ))}
                </select>
              </div>
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={scenarioDistribution()}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label
                    >
                      {scenarioDistribution().map((entry: any, idx: number) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={idx === 0 ? COLORS.winners : idx === 1 ? COLORS.neutrals : COLORS.writeOffs}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "benchmarks" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Performance vs Peers</h3>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <BarChart data={benchmarks}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fundPerformance" fill={COLORS.fundPerformance} name="Fund" />
                  <Bar dataKey="peerMedian" fill={COLORS.peerMedian} name="Median" />
                  <Bar dataKey="topQuartile" fill={COLORS.topQuartile} name="Top Quartile" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "waterfall" && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Distribution Schedule</h3>
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={waterfall}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lpDistribution" stroke="#3b82f6" name="LP" />
                  <Line type="monotone" dataKey="gpDistribution" stroke="#f59e0b" name="GP" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


