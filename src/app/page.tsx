// PASTE THIS ENTIRE CODE INTO a single file like App.jsx or page.jsx
'use client';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, TrendingUp, DollarSign, Users, AlertTriangle, Target, Briefcase, BarChart2, CheckCircle, ArrowRight } from 'lucide-react';

// --- MENTOR'S DASHBOARD CODE (UNCHANGED) ---
const VCScenarioApp = () => {
  // ... (The entire VCScenarioApp component code from your mentor goes here)
  // Initial data from Excel
  const [scenarios, setScenarios] = useState([
    { scenario: 'Base Case', exitMultiple: 2, winners: 6, neutrals: 9, writeOffs: 5, tvpi: 1.05, irr: 0.6 },
    { scenario: 'Upside Case', exitMultiple: 5, winners: 8, neutrals: 7, writeOffs: 5, tvpi: 2.35, irr: 13 },
    { scenario: 'Downside Case', exitMultiple: 1.2, winners: 4, neutrals: 6, writeOffs: 10, tvpi: 0.54, irr: -6.6 }
  ]);

  const [benchmarks, setBenchmarks] = useState([
    { metric: 'IRR (%)', fundPerformance: 15, peerMedian: 12, topQuile: 20 },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900 font-sans">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg shadow-md">
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

        {/* Tab Content */}
        {activeTab === 'scenarios' && (
          // ... Scenario Modeling JSX ...
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
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {scenario.scenario}
                    </button>
                    ))}
                </div>
             </div>
             <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold mb-6">Scenario Parameters</h2>
                    <div className="space-y-6">
                        {scenarios.map((scenario, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-lg mb-4 text-gray-800">{scenario.scenario}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {Object.keys(scenario).filter(k => k !== 'scenario').map(field => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                                            <input
                                                type="number"
                                                step={field === 'tvpi' || field === 'irr' ? "0.01" : "1"}
                                                value={scenario[field]}
                                                onChange={(e) => updateScenario(index, field, e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold mb-4">Portfolio Composition - {selectedScenario}</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={getPortfolioComposition()} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percentage }) => `${name}: ${percentage}%`}>
                                        {getPortfolioComposition().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase().replace('-', '')]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
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
        {activeTab === 'benchmarking' && (
           // ... Benchmarking JSX ...
           <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-6">Benchmark Data</h2>
                        <div className="space-y-4">
                            {benchmarks.map((benchmark, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium mb-3">{benchmark.metric}</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {Object.keys(benchmark).filter(k => k !== 'metric').map(field => (
                                         <div key={field}>
                                            <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {benchmarks.map((benchmark, index) => {
                        const outperformsPeer = benchmark.fundPerformance > benchmark.peerMedian;
                        return (
                            <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{benchmark.metric}</h4>
                                {outperformsPeer ? (
                                    <div className="p-1 bg-green-100 rounded"><TrendingUp className="w-4 h-4 text-green-600" /></div>
                                ) : (
                                    <div className="p-1 bg-red-100 rounded"><AlertTriangle className="w-4 h-4 text-red-600" /></div>
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
        {activeTab === 'waterfall' && (
          // ... Waterfall Distribution JSX ...
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
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
                     <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3">
                                <div className="text-sm font-medium text-blue-700">Total LP Distribution</div>
                                <div className="text-xl font-bold text-blue-900">{formatCurrency(waterfall[waterfall.length - 1]?.lpCumulative || 0)}</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3">
                                <div className="text-sm font-medium text-green-700">Total GP Distribution</div>
                                <div className="text-xl font-bold text-green-900">{formatCurrency(waterfall[waterfall.length - 1]?.gpCumulative || 0)}</div>
                            </div>
                        </div>
                     </div>
                </div>
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
                                <Line type="monotone" dataKey="lpCumulative" stroke="#3b82f6" strokeWidth={3} name="LP Cumulative" dot={{ r: 6 }}/>
                                <Line type="monotone" dataKey="gpCumulative" stroke="#10b981" strokeWidth={3} name="GP Cumulative" dot={{ r: 6 }}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
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
                            <Bar dataKey="lpDistribution" stackId="a" fill="#3b82f6" name="LP Distribution" />
                            <Bar dataKey="gpDistribution" stackId="a" fill="#10b981" name="GP Distribution" />
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


// --- LANDING PAGE COMPONENT ---
const HomePage = ({ setPage }) => {
  const Feature = ({ icon, title, children }) => (
    <div className="text-center p-6 bg-white/50 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  );

  return (
    <div className="w-full bg-slate-50 text-gray-800">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-gray-200 z-10">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">VC-scenario</span>
          </div>
          <button onClick={() => setPage('dashboard')} className="px-5 py-2.5 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            Go to Dashboard
          </button>
        </nav>
      </header>

      <main>
        <section className="text-center py-20 md:py-32 bg-slate-50">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              The Future of Fund Forecasting is Here
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              VC-scenario provides institutional-grade tools for venture capitalists to model, benchmark, and visualize fund performance with unparalleled precision.
            </p>
            <button onClick={() => setPage('signup')} className="inline-flex items-center gap-2 px-8 py-4 font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg">
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful Features for Data-Driven Decisions</h2>
              <p className="text-lg text-gray-600 mt-2">Everything you need to build and analyze your fund strategy.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Feature icon={<TrendingUp size={32} />} title="Scenario Modeling">
                Input and adjust key parameters to simulate different investment outcomes.
              </Feature>
              <Feature icon={<BarChart2 size={32} />} title="Real-time Visualization">
                Automatically visualize results with live-updating charts and graphs.
              </Feature>
              <Feature icon={<CheckCircle size={32} />} title="Benchmark Comparison">
                Compare fund performance against peer medians and top quartile benchmarks.
              </Feature>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 border-t border-gray-200">
        <div className="container mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600">&copy; 2025 VC-scenario. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};


// --- SIGN UP PAGE COMPONENT ---
const SignUpPage = ({ setPage }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual sign-up logic with Prisma/PostgreSQL
        console.log("Form submitted");
        alert("Sign-up successful! Redirecting to dashboard.");
        setPage('dashboard');
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Get Started</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="First Name" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input placeholder="Last Name" type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <input placeholder="Phone Number" type="tel" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input placeholder="Email address" type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input placeholder="Password" type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">Sign Up</button>
                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500">Or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <button type="button" className="w-full py-3 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.02,35.622,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                        Continue with Google
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <button onClick={() => setPage('signin')} className="font-semibold text-blue-600 hover:underline">Sign In</button>
                </p>
            </div>
        </div>
    );
};

// --- SIGN IN PAGE COMPONENT ---
const SignInPage = ({ setPage }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual sign-in logic with Prisma/PostgreSQL
        console.log("Sign-in attempt");
        alert("Sign-in successful! Redirecting to dashboard.");
        setPage('dashboard');
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Sign In</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                     <input placeholder="Email address" type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input placeholder="Password" type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">Sign In</button>
                     <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500">Or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                     <button type="button" className="w-full py-3 px-4 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.02,35.622,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                        Continue with Google
                    </button>
                </form>
                 <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account? <button onClick={() => setPage('signup')} className="font-semibold text-blue-600 hover:underline">Sign Up</button>
                </p>
            </div>
        </div>
    );
};

// --- MAIN APP CONTROLLER ---
export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'signin', 'signup', 'dashboard'

  // This component will dynamically render the correct page based on the 'page' state.
  const CurrentPage = () => {
    switch (page) {
      case 'signin':
        return <SignInPage setPage={setPage} />;
      case 'signup':
        return <SignUpPage setPage={setPage} />;
      case 'dashboard':
        return <VCScenarioApp />;
      case 'home':
      default:
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      {/* This ensures Tailwind styles are loaded */}
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style>{`
          body { font-family: 'Inter', sans-serif; }
        `}</style>
      </head>
      <main>
        <CurrentPage />
      </main>
    </>
  );
}
