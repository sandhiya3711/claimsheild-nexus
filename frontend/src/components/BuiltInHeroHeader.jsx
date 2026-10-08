import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Activity, 
  Building2, 
  Award,
  TrendingUp,
  Sparkles,
  Stethoscope
} from 'lucide-react';

export default function BuiltInHeroHeader({ setActiveTab, onSelectCase }) {
  const [selectedCaseId, setSelectedCaseId] = useState('Ring-07');
  const [selectedFocus, setSelectedFocus] = useState('upcoding');

  const cases = [
    { id: 'Ring-07', label: 'Dr. Arthur Vance, MD · Ring-07 (Upcoding Loop)', doctor: 'Dr. Arthur Vance, MD', specialty: 'Internal Medicine', dollars: '$1.82M', risk: '0.93' },
    { id: 'DME-112', label: 'Apex DME Supplies Depot · DME-112 (Phantom CPAP)', doctor: 'Apex DME Distribution LLC', specialty: 'DME Supplier', dollars: '$640K', risk: '0.88' },
    { id: 'BH-054', label: 'Dr. Evelyn Vance, MD · BH-054 (Psychotherapy Velocity)', doctor: 'Dr. Evelyn Vance, MD', specialty: 'Psychiatry', dollars: '$455K', risk: '0.81' },
    { id: 'P104-Tenant', label: 'Dr. Clara Evans, MD · P104 (Innocent Control Tenant)', doctor: 'Dr. Clara Evans, MD', specialty: 'Dermatology', dollars: '$0', risk: '0.12' }
  ];

  const handleInspect = () => {
    if (onSelectCase) {
      const match = cases.find((c) => c.id === selectedCaseId);
      if (match) onSelectCase(match);
    }
    setActiveTab('unified_brief');
  };

  return (
    <div className="builtin-hero-banner p-8 text-white relative shadow-2xl mb-8">
      {/* Top Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-4 text-[#A0D2EB]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="uppercase tracking-widest font-bold">HEALTHCARE FWA INTELLIGENCE & SIU DECISION SUPPORT</span>
        </div>
        <div className="text-[11px] text-[#D0BDF4] bg-[#494D5F]/60 px-3 py-1 rounded-full border border-[#8458B3]/40">
          TLS-1.3 Encrypted · Human-In-The-Loop Governance
        </div>
      </div>

      {/* Main Hero Title & Tagline (BuiltIn Style) */}
      <div className="space-y-2 max-w-3xl mb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
          Audit. Detect. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#A0D2EB] via-[#D0BDF4] to-white bg-clip-text text-transparent">
            Protect Healthcare Claims.
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[#E5EAF5] font-medium leading-relaxed">
          Triangulate billing anomalies across 4 deterministic engines, verify doctor board legitimacy, and calculate risk-adjusted peer twin recovery targets.
        </p>
      </div>

      {/* Live Verified Stat Counter (BuiltIn Metric Bar) */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono font-bold text-[#E5EAF5] mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-sm">50,000</span>
          <span className="text-[#A0D2EB]">CLAIMS AUDITED</span>
        </div>
        <span className="text-white/30">•</span>
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-sm">1,182</span>
          <span className="text-[#D0BDF4]">PROVIDERS MONITORED</span>
        </div>
        <span className="text-white/30">•</span>
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-sm">4</span>
          <span className="text-[#A0D2EB]">DETECTION ENGINES</span>
        </div>
        <span className="text-white/30">•</span>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-black text-sm">$3.34M</span>
          <span className="text-[#E5EAF5]">RECOVERY POOL</span>
        </div>
      </div>

      {/* FLOATING WHITE SEARCH & ACTION BAR (Exact BuiltIn Layout) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/20 text-[#1e293b] dark:text-white max-w-5xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Action Prompt */}
          <div className="lg:w-1/4 shrink-0">
            <span className="text-xs uppercase font-mono font-bold text-[#8458B3] block mb-0.5">SIU Quick Search</span>
            <h3 className="text-base sm:text-lg font-black text-[#1e293b] dark:text-white leading-tight">
              Investigate a case or doctor.
            </h3>
          </div>

          {/* Select Case Dropdown */}
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-mono font-bold text-[#64748b] dark:text-slate-400 mb-1">
              Select Provider / Case:
            </label>
            <div className="relative">
              <select
                value={selectedCaseId}
                onChange={(e) => setSelectedCaseId(e.target.value)}
                className="w-full appearance-none bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#1e293b] dark:text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#8458B3] cursor-pointer"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} ({c.dollars})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748b] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Select Focus Dropdown */}
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-mono font-bold text-[#64748b] dark:text-slate-400 mb-1">
              Investigation Focus:
            </label>
            <div className="relative">
              <select
                value={selectedFocus}
                onChange={(e) => setSelectedFocus(e.target.value)}
                className="w-full appearance-none bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#1e293b] dark:text-white rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-[#8458B3] cursor-pointer"
              >
                <option value="upcoding">8-Point Fraud Check & Cost Difference</option>
                <option value="doctor_legitimacy">Doctor License & Clinic Check</option>
                <option value="network_ring">Doctor Referral Network & Reopened Clinics</option>
                <option value="safe_fail">5 Innocent Explanations Check</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#64748b] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Primary Action Button (Vibrant BuiltIn Style Button) */}
          <button
            onClick={handleInspect}
            className="lg:self-end px-6 py-3 rounded-xl bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white text-xs font-black hover:opacity-95 shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>OPEN INVESTIGATION</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Quick Action Links with Icons (BuiltIn Bottom Bar) */}
      <div className="flex flex-wrap items-center gap-6 mt-6 text-xs text-[#E5EAF5] font-semibold">
        <button
          onClick={() => setActiveTab('provider_profile')}
          className="flex items-center gap-2 hover:text-[#A0D2EB] transition-colors cursor-pointer"
        >
          <UserCheck className="w-4 h-4 text-[#A0D2EB]" />
          <span className="underline underline-offset-4 decoration-[#A0D2EB]/50">Verify Doctor License & Clinic</span>
        </button>

        <button
          onClick={() => setActiveTab('unified_brief')}
          className="flex items-center gap-2 hover:text-[#D0BDF4] transition-colors cursor-pointer"
        >
          <TrendingUp className="w-4 h-4 text-[#D0BDF4]" />
          <span className="underline underline-offset-4 decoration-[#D0BDF4]/50">Compare with 12 Peer Doctors</span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className="flex items-center gap-2 hover:text-[#A0D2EB] transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-[#A0D2EB]" />
          <span className="underline underline-offset-4 decoration-[#A0D2EB]/50">Check 5 Innocent Explanations</span>
        </button>
      </div>
    </div>
  );
}
