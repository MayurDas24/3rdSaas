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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Scenario {
  scenario: string;
  exitMultiple: number;
  winners: number;
  neutrals: number;
  writeOffs: number;
  tvpi: number;
  irr: number;
}

export default function ScenarioModel({ data }: { data: Scenario[] }) {
  const [scenarios, setScenarios] = useState<Scenario[]>(data);
  const [selectedScenario, setSelectedScenario] = useState<string>("Base Case");

  const COLORS: Record<string, string> = {
    winners: "#10b981",
    neutrals: "#f59e0b",
    writeoffs: "#ef4444", // lowercase, no hyphen to match cleaned keys
  };

  // update field value dynamically
  const updateScenario = (i: number, field: keyof Scenario, value: string) => {
    const copy = [...scenarios];
    const parsed = parseFloat(value);
    (copy[i] as any)[field] = isNaN(parsed) ? 0 : parsed;
    setScenarios(copy);
  };

  const scenario = scenarios.find((s) => s.scenario === selectedScenario);
  const composition =
    scenario && scenario.winners + scenario.neutrals + scenario.writeOffs > 0
      ? [
          { name: "Winners", value: scenario.winners },
          { name: "Neutrals", value: scenario.neutrals },
          { name: "Write-offs", value: scenario.writeOffs },
        ]
      : [];

  return (
    <div className="space-y-8">
      {/* Scenario Selection Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Select Scenario</h2>
        <div className="flex gap-4 flex-wrap">
          {scenarios.map((s) => (
            <button
              key={s.scenario}
              onClick={() => setSelectedScenario(s.scenario)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6">Scenario Parameters</h2>
          <div className="space-y-6">
            {scenarios.map((s, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">{s.scenario}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(s)
                    .filter((k) => k !== "scenario")
                    .map((field) => (
                      <div key={field}>
                        <label className="block text-sm mb-2 capitalize">
                          {field}
                        </label>
                        <input
                          type="number"
                          value={(s as any)[field]}
                          onChange={(e) =>
                            updateScenario(i, field as keyof Scenario, e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Portfolio Composition Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              Portfolio Composition - {selectedScenario}
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={composition}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {composition.map((entry, index) => {
                      const key = entry.name
                        .toLowerCase()
                        .replace(/[-\s]/g, ""); // remove hyphens/spaces
                      const color = COLORS[key] || "#9ca3af"; // fallback gray
                      return <Cell key={index} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart for TVPI & IRR */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
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
  );
}
