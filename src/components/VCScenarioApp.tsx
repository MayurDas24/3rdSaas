import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, DollarSign, Users, AlertTriangle, Target } from 'lucide-react';


const VCScenarioApp = () => {
  // Initial data from Excel
  const [scenarios, setScenarios] = useState([
    { scenario: 'Base Case', exitMultiple: 2, winners: 6, neutrals: 9, writeOffs: 5, tvpi: 1.05, irr: 0.6 },
    { scenario: 'Upside Case', exitMultiple: 5, winners: 8, neutrals: 7, writeOffs: 5, tvpi: 2.35, irr: 13 },
    { scenario: 'Downside Case', exitMultiple: 1.2, winners: 4, neutrals: 6, writeOffs: 10, tvpi: 0.54, irr: -6.6 }
  ]);


  const [benchmarks, setBenchmarks] = useState([
    { metric: 'IRR (%)', fundPerformance: 15, peerMedian: 12, topQuartile: 20 },
    { metric: 'TVPI', fundPerformance: 2.2, peerMedian: 2.0, topQuartile: 2.8 },
    { metric: 'DPI', fundPerformance: 1.5, peerMedian: 1.3, topQuartile: 2.0 },
    { metric: 'Burn Multiple', fundPerformance: 1.2, peerMedian: 1.6, topQuartile: 1.3 }
  ]);


  const [waterfall, setWaterfall] = useState([
    { year: 5, lpDistribution: 40000000, gpDistribution: 0, lpCumulative: 40000000, gpCumulative: 0 },
    { year: 6, lpDistribution: 32327476, gpDistribution: 17672524, lpCumulative: 72327476, gpCumulative: 17672524 },
    { year: 7, lpDistribution: 50938020, gpDistribution: 29061980, lpCumulative: 123265495, gpCumulative: 46734505 },
    { year: 8, lpDistribution: 48000000, gpDistribution: 12000000, lpCumulative: 171265495, gpCumulative: 58734505 }
  ]);


  const [activeTab, setActiveTab] = useState('scenarios');
  const [selectedScenario, setSelectedScenario] = useState('Base Case');


  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };


  // Format percentage
  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };


  // Calculate portfolio composition for selected scenario
  const getPortfolioComposition = () => {
    const scenario = scenarios.find(s => s.scenario === selectedScenario);
    if (!scenario) return [];
   
    const total = scenario.winners + scenario.neutrals + scenario.writeOffs;
    return [
      { name: 'Winners', value: scenario.winners, percentage: (scenario.winners / total * 100).toFixed(1) },
      { name: 'Neutrals', value: scenario.neutrals, percentage: (scenario.neutrals / total * 100).toFixed(1) },
      { name: 'Write-offs', value: scenario.writeOffs, percentage: (scenario.writeOffs / total * 100).toFixed(1) }
    ];
  };


  const COLORS = {
    winners: '#10b981',
    neutrals: '#f59e0b',
    writeOffs: '#ef4444',
    fundPerformance: '#3b82f6',
    peerMedian: '#6b7280',
    topQuartile: '#10b981'
  };


  const updateScenario = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: parseFloat(value) || 0 };
    setScenarios(newScenarios);
  };


  const updateBenchmark = (index, field, value) => {
    const newBenchmarks = [...benchmarks];
    newBenchmarks[index] = { ...newBenchmarks[index], [field]: parseFloat(value) || 0 };
    setBenchmarks(newBenchmarks);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Calculator className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VC Scenario Benchmarking Tool</h1>
              <p className="text-gray-600">Analyze investment scenarios, benchmark performance, and model distributions</p>
            </div>
          </div>
        </div>


        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'scenarios', label: 'Scenario Modeling', icon: TrendingUp },
                { id: 'benchmarking', label: 'Benchmarking', icon: Target },
                { id: 'waterfall', label: 'Waterfall Distribution', icon: DollarSign }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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


        {/* Scenario Modeling Tab */}
        {activeTab === 'scenarios' && (
          <div className="space-y-8">
            {/* Scenario Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Select Scenario</h2>
              <div className="flex gap-4">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.scenario}
                    onClick={() => setSelectedScenario(scenario.scenario)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedScenario === scenario.scenario
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {scenario.scenario}
                  </button>
                ))}
              </div>
            </div>


            <div className="grid lg:grid-cols-2 gap-8">
              {/* Scenario Parameters */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Scenario Parameters</h2>
                <div className="space-y-6">
                  {scenarios.map((scenario, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-4 text-gray-800">{scenario.scenario}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Exit Multiple</label>
                          <input
                            type="number"
                            step="0.1"
                            value={scenario.exitMultiple}
                            onChange={(e) => updateScenario(index, 'exitMultiple', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Winners</label>
                          <input
                            type="number"
                            value={scenario.winners}
                            onChange={(e) => updateScenario(index, 'winners', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Neutrals</label>
                          <input
                            type="number"
                            value={scenario.neutrals}
                            onChange={(e) => updateScenario(index, 'neutrals', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Write-offs</label>
                          <input
                            type="number"
                            value={scenario.writeOffs}
                            onChange={(e) => updateScenario(index, 'writeOffs', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">TVPI</label>
                          <input
                            type="number"
                            step="0.01"
                            value={scenario.tvpi}
                            onChange={(e) => updateScenario(index, 'tvpi', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">IRR (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={scenario.irr}
                            onChange={(e) => updateScenario(index, 'irr', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Visualizations */}
              <div className="space-y-6">
                {/* Portfolio Composition */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Portfolio Composition - {selectedScenario}</h3>
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
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {getPortfolioComposition().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase().replace('-', '')]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>


                {/* Performance Metrics */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Performance Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scenarios}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="scenario" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [name === 'irr' ? `${value}%` : value, name.toUpperCase()]} />
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


        {/* Benchmarking Tab */}
        {activeTab === 'benchmarking' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Benchmark Parameters */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Benchmark Data</h2>
                <div className="space-y-4">
                  {benchmarks.map((benchmark, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium mb-3">{benchmark.metric}</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Fund Performance</label>
                          <input
                            type="number"
                            step="0.1"
                            value={benchmark.fundPerformance}
                            onChange={(e) => updateBenchmark(index, 'fundPerformance', e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Peer Median</label>
                          <input
                            type="number"
                            step="0.1"
                            value={benchmark.peerMedian}
                            onChange={(e) => updateBenchmark(index, 'peerMedian', e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Top Quartile</label>
                          <input
                            type="number"
                            step="0.1"
                            value={benchmark.topQuartile}
                            onChange={(e) => updateBenchmark(index, 'topQuartile', e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              {/* Benchmark Visualization */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Performance vs Benchmarks</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarks} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fundPerformance" fill={COLORS.fundPerformance} name="Fund Performance" />
                      <Bar dataKey="peerMedian" fill={COLORS.peerMedian} name="Peer Median" />
                      <Bar dataKey="topQuartile" fill={COLORS.topQuartile} name="Top Quartile" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>


            {/* Performance Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benchmarks.map((benchmark, index) => {
                const outperformsPeer = benchmark.fundPerformance > benchmark.peerMedian;
                const outperformsTop = benchmark.fundPerformance > benchmark.topQuartile;
                return (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
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
                      {benchmark.metric.includes('%') ? `${benchmark.fundPerformance}%` : benchmark.fundPerformance}
                    </div>
                    <div className="text-sm text-gray-600">
                      {outperformsPeer ? 'Above' : 'Below'} peer median
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* Waterfall Distribution Tab */}
        {activeTab === 'waterfall' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Distribution Data */}
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
                      {waterfall.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 font-medium">{item.year}</td>
                          <td className="py-3 text-right">{formatCurrency(item.lpDistribution)}</td>
                          <td className="py-3 text-right">{formatCurrency(item.gpDistribution)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>


                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-blue-700">Total LP Distribution</div>
                      <div className="text-xl font-bold text-blue-900">
                        {formatCurrency(waterfall[waterfall.length - 1]?.lpCumulative || 0)}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-green-700">Total GP Distribution</div>
                      <div className="text-xl font-bold text-green-900">
                        {formatCurrency(waterfall[waterfall.length - 1]?.gpCumulative || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Waterfall Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Cumulative Distributions</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waterfall}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
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


            {/* Annual Distributions Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-6">Annual Distribution Breakdown</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfall}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="lpDistribution" fill="#3b82f6" name="LP Distribution" />
                    <Bar dataKey="gpDistribution" fill="#10b981" name="GP Distribution" />
                  </BarChart>
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
