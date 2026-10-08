import React, { useState } from 'react';
import { Shield, Sliders, Sparkles, AlertCircle, ArrowUpRight, DollarSign, Users, CheckCircle2, ChevronRight, RefreshCw, BarChart2, ShieldAlert, Filter, ArrowRight, Zap, Target } from 'lucide-react';

export default function SIUQueueView({
  cases,
  selectedHorizon,
  setSelectedHorizon,
  capacity,
  setCapacity,
  weights,
  setWeights,
  onUpdateWeights,
  onSelectCase,
  setActiveTab
}) {
  const [showWeightsDrawer, setShowWeightsDrawer] = useState(false);
  const [tempWeights, setTempWeights] = useState({ ...weights });
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const totalExposure = (cases || []).reduce((acc, c) => acc + (c.risk_adjusted_dollars || 0), 0);
  
  const filteredCases = (cases || []).filter((c) => {
    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'RING') return c.category?.includes('Ring') || c.category?.includes('Network');
    if (categoryFilter === 'UPCODE') return c.category?.includes('Upcoding');
    if (categoryFilter === 'SAFE_FAIL') return c.innocent_engine?.safe_fail_triggered;
    return true;
  });

  const topCases = filteredCases.slice(0, capacity);
  const coveredDollars = topCases.reduce((acc, c) => acc + (c.risk_adjusted_dollars || 0), 0);
  const coveredPct = totalExposure > 0 ? (coveredDollars / totalExposure) * 100 : 0;

  const handleWeightSliderChange = (key, val) => {
    setTempWeights((prev) => ({
      ...prev,
      [key]: parseFloat(val)
    }));
  };

  const applyWeights = () => {
    onUpdateWeights(tempWeights);
  };

  const resetWeights = () => {
    const defaultW = {
      w_risk: 0.30,
      w_dollars: 0.20,
      w_member: 0.15,
      w_severity: 0.15,
      w_evidence: 0.20
    };
    setTempWeights(defaultW);
    onUpdateWeights(defaultW);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Capacity Slider & Horizon Selector */}
      <div className="glass-panel p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Capacity Slider & Knapsack Visualizer */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-2 tracking-wide uppercase font-mono">
                <Users className="w-4 h-4 text-cyan-400" /> SIU Team Capacity Constraint:
                <span className="font-mono text-cyan-300 text-base font-black px-2 py-0.5 bg-cyan-950 rounded border border-cyan-500/40">
                  {capacity} Cases
                </span>
              </span>
              <span className="text-xs font-mono text-emerald-400 font-extrabold flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                ${coveredDollars.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({coveredPct.toFixed(1)}% of total exposure)
              </span>
            </div>

            <input
              type="range"
              min="1"
              max={Math.min(cases.length || 15, 20)}
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value))}
              className="w-full"
            />

            {/* Knapsack Progress Bar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/30"
                style={{ width: `${Math.min(100, coveredPct)}%` }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 Case (High Precision Desk Audit)</span>
              <span>10 Cases (Standard Sized SIU Squad)</span>
              <span>20 Cases (Full Enterprise Sweep)</span>
            </div>
          </div>

          {/* Horizon Buttons & Weight Toggle */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Horizon Selector */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {['30_day', '60_day', '90_day'].map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedHorizon === h
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {h.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>

            {/* Weights Drawer Toggle */}
            <button
              onClick={() => setShowWeightsDrawer(!showWeightsDrawer)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all ${
                showWeightsDrawer
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Priority Formula Weights
            </button>
          </div>
        </div>

        {/* Priority Weights Adjustment Drawer */}
        {showWeightsDrawer && (
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Linear Priority Scoring Formula
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Priority = w₁·Risk + w₂·Dollars + w₃·Member_Impact + w₄·Severity + w₅·Evidence_Strength
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetWeights}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors font-mono"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={applyWeights}
                  className="px-3.5 py-1 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg shadow-md transition-colors"
                >
                  Apply & Re-Rank Live
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { key: 'w_risk', label: 'Risk Score (w₁)', val: tempWeights.w_risk },
                { key: 'w_dollars', label: 'Dollars ($) (w₂)', val: tempWeights.w_dollars },
                { key: 'w_member', label: 'Member Impact (w₃)', val: tempWeights.w_member },
                { key: 'w_severity', label: 'Severity (w₄)', val: tempWeights.w_severity },
                { key: 'w_evidence', label: 'Evidence (w₅)', val: tempWeights.w_evidence },
              ].map((item) => (
                <div key={item.key} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 shadow-sm">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-semibold">{item.label}</span>
                    <span className="text-cyan-400 font-bold">{(item.val * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.05"
                    value={item.val}
                    onChange={(e) => handleWeightSliderChange(item.key, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'ALL', label: 'All Cases in Queue' },
          { id: 'RING', label: 'Coordinated Rings & Networks' },
          { id: 'UPCODE', label: 'High-Intensity Upcoding' },
          { id: 'SAFE_FAIL', label: 'Safe-Fail Protected' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setCategoryFilter(chip.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              categoryFilter === chip.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* SIU Queue Ranked Table */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Prioritized Investigative Queue</h3>
            <span className="badge badge-purple text-[10px] font-mono">{topCases.length} Cases Selected</span>
          </div>
          <span className="text-xs text-slate-400">
            Click any row to open the full <strong className="text-cyan-300 font-bold">Investigation Brief</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3.5 px-3 w-12 text-center">Rank</th>
                <th className="py-3.5 px-4">Case Entity & Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Defenses Ruled Out</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4 text-right">Risk-Adjusted Exposure</th>
                <th className="py-3.5 px-4 text-center">Evidence Strength</th>
                <th className="py-3.5 px-4 text-center">{selectedHorizon.replace('_', ' ')} Forecast</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {topCases.map((c, idx) => {
                const isSafeFail = c.innocent_engine?.safe_fail_triggered;
                const innocent = c.innocent_engine || {};
                const ruledOutCount = innocent.ruled_out_count || 0;

                return (
                  <tr
                    key={c.case_id}
                    onClick={() => {
                      onSelectCase(c);
                      setActiveTab('brief');
                    }}
                    className={`hover:bg-slate-800/60 cursor-pointer transition-colors ${
                      idx === 0 ? 'bg-cyan-500/5' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3.5 px-3 text-center">
                      <div
                        className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center font-bold font-mono text-xs ${
                          idx === 0
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : idx < 3
                            ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        #{c.queue_rank || idx + 1}
                      </div>
                    </td>

                    {/* Title & Entities */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {c.title}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span className="text-cyan-400 font-bold">{c.case_id}</span>
                        <span>•</span>
                        <span>Primary: {c.primary_provider_id}</span>
                        {c.involved_providers && c.involved_providers.length > 1 && (
                          <span className="badge badge-purple text-[10px]">
                            +{c.involved_providers.length - 1} co-conspirators
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`badge ${
                          isSafeFail
                            ? 'badge-safe'
                            : c.severity === 'CRITICAL'
                            ? 'badge-critical'
                            : 'badge-high'
                        }`}
                      >
                        {isSafeFail ? 'Safe-Fail Protected' : c.category}
                      </span>
                    </td>

                    {/* Defenses Ruled Out */}
                    <td className="py-3.5 px-4">
                      {isSafeFail ? (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Normal Acuity Baseline
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-mono">
                          <span className="text-rose-400 font-bold">{ruledOutCount}/5</span>
                          <span className="text-slate-400">Ruled Out</span>
                        </div>
                      )}
                    </td>

                    {/* Risk Score */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`font-black ${c.risk_score >= 0.8 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {(c.risk_score * 100).toFixed(0)}%
                      </span>
                    </td>

                    {/* Risk-Adjusted Dollars */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="text-sm font-black text-emerald-400">
                        ${c.risk_adjusted_dollars ? c.risk_adjusted_dollars.toLocaleString() : '0.00'}
                      </div>
                      {c.raw_overpayment_dollars && c.raw_overpayment_dollars !== c.risk_adjusted_dollars && (
                        <div className="text-[10px] text-slate-500 line-through">
                          Raw: ${c.raw_overpayment_dollars.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Evidence Strength (3 Disciplines) */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <div
                          title="Rules Engine"
                          className={`w-2.5 h-2.5 rounded-full ${
                            c.rule_flags_count > 0 ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-slate-700'
                          }`}
                        />
                        <div
                          title="Anomaly ML (Isolation Forest)"
                          className={`w-2.5 h-2.5 rounded-full ${
                            c.anomaly_score >= 0.65 ? 'bg-indigo-400 shadow-sm shadow-indigo-400' : 'bg-slate-700'
                          }`}
                        />
                        <div
                          title="Network Graph & Rings"
                          className={`w-2.5 h-2.5 rounded-full ${
                            c.involved_providers?.length > 1 || c.phoenix_links?.length > 0
                              ? 'bg-cyan-400 shadow-sm shadow-cyan-400'
                              : 'bg-slate-700'
                          }`}
                        />
                        <span className="text-[11px] font-mono text-slate-200 ml-1 font-bold">
                          {(c.evidence_strength * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>

                    {/* Forecast Probability */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-300">
                      {((c.forecast_probability || c.risk_score * 0.85) * 100).toFixed(0)}%
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(c);
                          setActiveTab('brief');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 font-bold text-xs transition-all shadow-sm"
                      >
                        Brief <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
