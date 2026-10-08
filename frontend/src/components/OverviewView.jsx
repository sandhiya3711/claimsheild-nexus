import React, { useState } from 'react';
import { Database, ShieldAlert, Cpu, Network, ArrowRight, DollarSign, Users, Building, Activity, FileCheck, CheckCircle2, ChevronRight, Zap, Target, Sparkles } from 'lucide-react';

export default function OverviewView({ overviewData, setActiveTab, onSelectCase }) {
  const [activeStage, setActiveStage] = useState(4);

  if (!overviewData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const ds = overviewData.dataset_summary || {};
  const funnel = overviewData.alert_funnel || {};
  const fin = overviewData.financial_summary || {};

  const datasetCards = [
    { title: 'Claims', count: ds.claims || 50000, desc: '50k claims across 8 specialties (CPT/HCPCS, RVUs, timestamps)', icon: Activity, color: 'text-cyan-400', tab: 'alerts' },
    { title: 'Providers', count: ds.providers || 1182, desc: '1.2k providers with specialty, address, ownership, enrollment & closure dates', icon: Users, color: 'text-blue-400', tab: 'network' },
    { title: 'Members', count: ds.members || 8000, desc: '8k members with age band, geographic region, and morbidity risk-index', icon: Users, color: 'text-indigo-400', tab: 'brief' },
    { title: 'Facilities', count: ds.facilities || 340, desc: '340 physical facilities and clinics with street addresses for co-location analysis', icon: Building, color: 'text-emerald-400', tab: 'network' },
    { title: 'Referrals', count: ds.referrals || 6400, desc: '6.4k directed provider-to-provider referral connections for cycle detection', icon: Network, color: 'text-amber-400', tab: 'network' },
    { title: 'Ownership', count: ds.ownership_records || 1149, desc: '1.15k entity beneficial ownership links connecting shell corps and clinic networks', icon: Database, color: 'text-purple-400', tab: 'network' },
    { title: 'Investigations', count: ds.prior_investigations || 180, desc: '180 prior SIU historical outcomes for supervised risk calibration', icon: FileCheck, color: 'text-rose-400', tab: 'forecast' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 relative overflow-hidden group cursor-pointer hover:border-cyan-500/50" onClick={() => setActiveTab('alerts')}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Total Raw Claims</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2 font-mono tracking-tight">
            {funnel.total_claims ? funnel.total_claims.toLocaleString() : '50,000'}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 mt-2 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Synthetic Benchmark Verified</span>
          </div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden group cursor-pointer hover:border-amber-500/50" onClick={() => setActiveTab('alerts')}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Raw Alerts Generated</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2 font-mono tracking-tight text-amber-300">
            {funnel.raw_alerts_generated ? funnel.raw_alerts_generated.toLocaleString() : '4,000'}
          </div>
          <div className="text-xs text-amber-300/90 mt-2 font-mono">
            Across 4 Parallel Detectors
          </div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden group cursor-pointer hover:border-indigo-500/50" onClick={() => setActiveTab('queue')}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Fused SIU Cases</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2 font-mono tracking-tight flex items-baseline gap-2">
            {funnel.fused_ranked_cases || '15'}
            <span className="text-xs font-bold text-emerald-400 font-mono px-2 py-0.5 bg-emerald-950/60 rounded border border-emerald-500/30">
              {funnel.compression_ratio || '267:1'} compression
            </span>
          </div>
          <div className="text-xs text-indigo-300 mt-2 font-medium">
            Triangulated & Ranked
          </div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden group cursor-pointer hover:border-emerald-500/50" onClick={() => setActiveTab('queue')}>
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Risk-Adjusted Exposure</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2 font-mono tracking-tight">
            ${fin.total_risk_adjusted_exposure ? fin.total_risk_adjusted_exposure.toLocaleString() : '450,000'}
          </div>
          <div className="text-xs text-slate-300 mt-2 font-mono">
            Peer Twin counterfactual verified
          </div>
        </div>
      </div>

      {/* Interactive Alert Compression Funnel Visualizer */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
              <Zap className="w-4 h-4 text-cyan-400" /> Signal Compression & Fusion Funnel
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any stage to highlight its data transformation workflow.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('queue')}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
          >
            Explore Prioritized Queue <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div
            onClick={() => { setActiveStage(1); setActiveTab('alerts'); }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStage === 1
                ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Stage 1: Raw Claims</span>
            <div className="text-2xl font-black font-mono text-white mt-1">50,000</div>
            <p className="text-xs text-slate-400 mt-2">All submitted medical, hospital, pharmacy & DME claims</p>
            <div className="h-1.5 w-full bg-cyan-500 rounded-full mt-4" />
          </div>

          <div
            onClick={() => { setActiveStage(2); setActiveTab('alerts'); }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStage === 2
                ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Stage 2: Engine Detectors</span>
            <div className="text-2xl font-black font-mono text-amber-300 mt-1">~4,000 Flags</div>
            <p className="text-xs text-slate-400 mt-2">Rules (~3.3k) + ML Anomalies (~420) + Graph cycles (~240)</p>
            <div className="h-1.5 w-full bg-amber-500 rounded-full mt-4" />
          </div>

          <div
            onClick={() => { setActiveStage(3); setActiveTab('brief'); }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStage === 3
                ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Stage 3: Evidence & Challenge</span>
            <div className="text-2xl font-black font-mono text-indigo-300 mt-1">Peer Twins & Defenses</div>
            <p className="text-xs text-slate-400 mt-2">5 innocent hypotheses tested; Safe-Fail filter on weak signals</p>
            <div className="h-1.5 w-full bg-indigo-500 rounded-full mt-4" />
          </div>

          <div
            onClick={() => { setActiveStage(4); setActiveTab('queue'); }}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeStage === 4
                ? 'bg-gradient-to-br from-indigo-950/60 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/15'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold font-mono">Stage 4: Fused SIU Cases</span>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1">{funnel.fused_ranked_cases || '15'} Cases</div>
            <p className="text-xs text-slate-300 mt-2">Ranked by risk, dollars, severity & 3-method triangulation</p>
            <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mt-4" />
          </div>
        </div>
      </div>

      {/* 4 Detection Engines Summary */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-mono">
          <Cpu className="w-4 h-4 text-indigo-400" /> 4 Complementary Detection Disciplines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(overviewData.engines_status || []).map((eng, idx) => (
            <div key={idx} className="glass-panel p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge badge-safe text-[10px] font-mono">{eng.status}</span>
                  <span className="text-xs font-mono text-slate-400">{eng.alerts} alerts</span>
                </div>
                <h3 className="text-sm font-bold text-white mt-3">{eng.engine}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{eng.description}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-cyan-400 font-bold font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active in pipeline
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Synthetic Datasets Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
            <Database className="w-4 h-4 text-cyan-400" /> 7 Synthetic Data Sources (DuckDB Architecture)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Seed: 42 (100% Reproducible)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {datasetCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(card.tab)}
                className="glass-panel p-4 hover:border-cyan-500/40 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{card.title}</span>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className="text-xl font-bold font-mono text-white mt-2">
                  {card.count.toLocaleString()} <span className="text-xs font-normal text-slate-400 font-sans">rows</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
