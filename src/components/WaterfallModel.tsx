"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function WaterfallModel({ data }: any) {
  const [waterfall] = useState(data);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Distribution Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium">Year</th>
                  <th className="text-right py-2 font-medium">LP Distribution</th>
                  <th className="text-right py-2 font-medium">GP Distribution</th>
                </tr>
              </thead>
              <tbody>
                {waterfall.map((item: any, index: number) => (
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

          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-700">
                  Total LP Distribution
                </div>
                <div className="text-xl font-bold text-blue-900">
                  {formatCurrency(
                    waterfall[waterfall.length - 1]?.lpCumulative || 0
                  )}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm font-medium text-green-700">
                  Total GP Distribution
                </div>
                <div className="text-xl font-bold text-green-900">
                  {formatCurrency(
                    waterfall[waterfall.length - 1]?.gpCumulative || 0
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Cumulative Distributions</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waterfall}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip formatter={(value: any) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="lpCumulative"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="LP Cumulative"
                  dot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="gpCumulative"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="GP Cumulative"
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6">Annual Distribution Breakdown</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={waterfall}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Legend />
              <Bar
                dataKey="lpDistribution"
                fill="#3b82f6"
                name="LP Distribution"
              />
              <Bar
                dataKey="gpDistribution"
                fill="#10b981"
                name="GP Distribution"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
