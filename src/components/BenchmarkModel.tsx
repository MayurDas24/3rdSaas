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
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, AlertTriangle } from "lucide-react";

export default function BenchmarkModel({ data }: any) {
  const [benchmarks, setBenchmarks] = useState(data);

  const COLORS = {
    fundPerformance: "#3b82f6",
    peerMedian: "#6b7280",
    topQuartile: "#10b981",
  };

  const updateBenchmark = (index: number, field: string, value: string) => {
    const newData = [...benchmarks];
    newData[index] = { ...newData[index], [field]: parseFloat(value) || 0 };
    setBenchmarks(newData);
  };

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Input Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Benchmark Data</h2>
          <div className="space-y-4">
            {benchmarks.map((benchmark: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium mb-3">{benchmark.metric}</h4>
                <div className="grid grid-cols-3 gap-3">
                  {["fundPerformance", "peerMedian", "topQuartile"].map((field) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {field === "fundPerformance"
                          ? "Fund Performance"
                          : field === "peerMedian"
                          ? "Peer Median"
                          : "Top Quartile"}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={benchmark[field]}
                        onChange={(e) => updateBenchmark(index, field, e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Performance vs Benchmarks</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={benchmarks}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="fundPerformance"
                  fill={COLORS.fundPerformance}
                  name="Fund Performance"
                />
                <Bar
                  dataKey="peerMedian"
                  fill={COLORS.peerMedian}
                  name="Peer Median"
                />
                <Bar
                  dataKey="topQuartile"
                  fill={COLORS.topQuartile}
                  name="Top Quartile"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {benchmarks.map((benchmark: any, index: number) => {
          const outperformsPeer = benchmark.fundPerformance > benchmark.peerMedian;

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{benchmark.metric}</h4>
                {outperformsPeer ? (
                  <div className="p-1 bg-green-100 rounded">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                ) : (
                  <div className="p-1 bg-red-100 rounded">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {benchmark.metric.includes("%")
                  ? `${benchmark.fundPerformance}%`
                  : benchmark.fundPerformance}
              </div>
              <div className="text-sm text-gray-600">
                {outperformsPeer ? "Above" : "Below"} peer median
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
