import React from 'react';
import { Shield, Database, Sparkles, RefreshCw, Layers, Radio, Lock, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, guidedDemo, setGuidedDemo, isRefreshing, onRefresh }) {
  const navTabs = [
    { id: 'overview', label: 'Overview & Funnel', icon: Layers },
    { id: 'alerts', label: 'Claim-Level Alerts', icon: Radio },
    { id: 'queue', label: 'SIU Prioritization Queue', icon: Shield },
    { id: 'brief', label: 'Investigation Brief', icon: Sparkles },
    { id: 'network', label: 'Network & Ring Graph', icon: Database },
    { id: 'forecast', label: '30/60/90-Day Forecast', icon: Sparkles },
    { id: 'responsible', label: 'Responsible AI & Audit', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                ClaimShield <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Nexus</span>
              </h1>
              <span className="badge badge-purple text-[10px] uppercase font-mono px-1.5 py-0.5">v1.0 FWA</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Healthcare FWA Intelligence & SIU Prioritization</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Indicators */}
        <div className="flex items-center gap-3">
          {/* Guided Demo Button */}
          <button
            onClick={() => setGuidedDemo(!guidedDemo)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              guidedDemo
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-2 ring-amber-500/20'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${guidedDemo ? 'text-amber-400' : 'text-slate-400'}`} />
            {guidedDemo ? 'Guided Demo: ON' : 'Guided Demo'}
          </button>

          {/* Synthetic Guardrail Badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-lg text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Synthetic Ground Truth</span>
          </div>

          {/* Refresh Pipeline Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Re-run Detection Pipeline"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex lg:hidden overflow-x-auto gap-1 mt-3 pt-2 border-t border-slate-800 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
