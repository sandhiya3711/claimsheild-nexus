import React from 'react';
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Layers, Award } from 'lucide-react';
import BuiltInHeroHeader from './BuiltInHeroHeader';

export default function MissionControlView({ setActiveTab, onSelectCase }) {
  const topCases = [
    { id: 'Ring-07', name: 'Ring-07 (Coordinated Referral Syndicate)', risk: '0.93', dollars: '$1.82M', repeat: '61%' },
    { id: 'DME-112', name: 'DME-112 (Phantom CPAP Equipment Spike)', risk: '0.88', dollars: '$640K', repeat: '55%' },
    { id: 'BH-054', name: 'BH-054 (Psychotherapy Velocity Overutilization)', risk: '0.81', dollars: '$455K', repeat: '50%' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* BuiltIn-Style Professional Hero Header */}
      <BuiltInHeroHeader setActiveTab={setActiveTab} onSelectCase={onSelectCase} />

      {/* Friendly Section Header */}
      <div>
        <h2 className="text-xl font-black text-[#1e293b] dark:text-white tracking-tight">Daily Claims & Investigation Overview</h2>
        <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
          Summary of scanned healthcare claims, flagged warning signs, and prioritized cases for investigation.
        </p>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="app-card p-5 bg-white dark:bg-slate-900 border border-[#DFE5F2] dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">
            4,812
          </div>
          <div className="text-xs text-[#64748b] dark:text-slate-400 mt-1 font-medium flex items-center justify-between">
            <span>Flagged Warnings Found</span>
            <span className="text-[10px] font-mono font-bold text-[#8458B3] bg-[#E5EAF5] dark:bg-purple-950/60 px-2 py-0.5 rounded-full">Scanned</span>
          </div>
        </div>

        <div className="app-card p-5 bg-white dark:bg-slate-900 border border-[#DFE5F2] dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">
            311
          </div>
          <div className="text-xs text-[#64748b] dark:text-slate-400 mt-1 font-medium flex items-center justify-between">
            <span>Grouped Suspicious Cases</span>
            <span className="text-[10px] font-mono font-bold text-[#8458B3] bg-[#E5EAF5] dark:bg-purple-950/60 px-2 py-0.5 rounded-full">35% Volume</span>
          </div>
        </div>

        <div className="app-card p-5 bg-white dark:bg-slate-900 border border-[#DFE5F2] dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-black text-[#1e293b] dark:text-white tracking-tight">
            32
          </div>
          <div className="text-xs text-[#64748b] dark:text-slate-400 mt-1 font-medium flex items-center justify-between">
            <span>Investigator Monthly Capacity</span>
            <span className="text-[10px] font-mono font-bold text-[#10b981] bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">Within Limit</span>
          </div>
        </div>

        <div className="app-card p-5 bg-white dark:bg-slate-900 border border-[#DFE5F2] dark:border-slate-800 shadow-sm">
          <div className="text-3xl font-black text-[#e11d48] tracking-tight">
            $3.34M
          </div>
          <div className="text-xs text-[#64748b] dark:text-slate-400 mt-1 font-medium flex items-center justify-between">
            <span>Total Money at Risk</span>
            <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">Target Pool</span>
          </div>
        </div>
      </div>

      {/* SIU Financial ROI & Cost-Benefit Bar */}
      <div className="app-card p-5 bg-gradient-to-r from-[#181c2b] via-[#2f3549] to-[#8458B3] text-white rounded-2xl shadow-xl border border-[#8458B3]/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#8458B3] px-2.5 py-0.5 rounded-full text-white">
                SIU Financial Impact & Savings Model
              </span>
              <span className="text-xs font-mono text-[#A0D2EB] font-bold">18.5x Recovery ROI</span>
            </div>
            <h3 className="text-base font-black text-white">
              Estimated Net Value Recovered: <span className="text-[#A0D2EB]">$3.16M</span> after all investigation expenses
            </h3>
            <p className="text-xs text-[#E5EAF5] font-medium">
              Smart triage removes 85% of false alarms, focusing investigator time on the top 15 highest-value fraud rings.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center shrink-0">
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Total Protected</div>
              <div className="text-base font-black text-[#A0D2EB] mt-0.5">$3.34M</div>
            </div>
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Audit Cost</div>
              <div className="text-base font-black text-[#D0BDF4] mt-0.5">$180K</div>
            </div>
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
              <div className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Net Multiple</div>
              <div className="text-base font-black text-[#10b981] mt-0.5">18.5x ROI</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Main Cards: Alert Filter Funnel & Top Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* How We Filter False Alarms Card (Left) */}
        <div className="lg:col-span-7 app-card p-6 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-black text-[#1e293b] dark:text-white pb-3 border-b border-[#e5eaf5] dark:border-slate-800 flex items-center justify-between">
              <span>How We Filter Out False Alarms</span>
              <span className="text-xs font-mono text-[#8458B3] font-bold">Smart Noise Filtering</span>
            </h3>

            <div className="space-y-4 mt-5">
              {/* Stage 1: Alerts */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#494D5F] dark:text-slate-300 mb-1.5">
                  <span>1. All Raw Ingested Claims</span>
                  <span className="font-mono font-bold text-[#1e293b] dark:text-white">4,812 claims (100%)</span>
                </div>
                <div className="w-full bg-[#f1f5f9] dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#8458B3] via-[#D0BDF4] to-[#A0D2EB] w-full" />
                </div>
              </div>

              {/* Stage 2: Grouped cases */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#494D5F] dark:text-slate-300 mb-1.5">
                  <span>2. Combined Patterns & Doctor Groups</span>
                  <span className="font-mono font-bold text-[#8458B3]">311 cases (35% volume)</span>
                </div>
                <div className="w-full bg-[#f1f5f9] dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] w-[35%]" />
                </div>
              </div>

              {/* Stage 3: Within capacity */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#494D5F] dark:text-slate-300 mb-1.5">
                  <span>3. High-Priority Actionable Cases</span>
                  <span className="font-mono font-bold text-[#10b981]">15 top priority cases (85% recovery target)</span>
                </div>
                <div className="w-full bg-[#f1f5f9] dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#10b981] to-[#059669] w-[15%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e5eaf5] dark:border-slate-800 text-xs text-[#64748b] dark:text-slate-400 font-medium flex items-center justify-between">
            <span>4 Checks: Rules • Anomaly • Time Patterns • Doctor Network</span>
            <span className="text-[#10b981] font-bold">100% Tested & Verified</span>
          </div>
        </div>

        {/* Top Priority Cases to Investigate (Right) */}
        <div className="lg:col-span-5 app-card p-6 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-black text-[#1e293b] dark:text-white pb-3 border-b border-[#e5eaf5] dark:border-slate-800">
              Top Priority Cases to Investigate
            </h3>

            <div className="space-y-3 mt-4">
              {topCases.map((tc) => (
                <div
                  key={tc.id}
                  onClick={() => setActiveTab('claim_details')}
                  className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e5eaf5] dark:border-slate-700 hover:border-[#8458B3] cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1e293b] dark:text-white">{tc.name}</span>
                    <span className="badge-pink-pill text-[10px] font-mono">Risk {tc.risk}</span>
                  </div>
                  <div className="text-xs font-bold text-[#64748b] dark:text-slate-300 font-mono mt-1 flex items-center justify-between">
                    <span>{tc.dollars} at risk</span>
                    <span className="text-[#8458B3] font-semibold">{tc.repeat} Repeat Risk</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('queue')}
            className="w-full py-3.5 btn-primary-gradient text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <span>Open Priority Investigation List</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
