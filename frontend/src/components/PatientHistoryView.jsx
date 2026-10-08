import React, { useState } from 'react';
import { Users, Calendar, ArrowRight, Activity, Search } from 'lucide-react';

export default function PatientHistoryView({ setActiveTab }) {
  const [selectedPatient, setSelectedPatient] = useState('M0501');
  const [searchFilter, setSearchFilter] = useState('');

  const cohortPatients = [
    { id: 'M0501', age: '67', region: 'IL-Metro', risk: 1.02, claims: 34, primaryCondition: 'Chronic Pain & Physical Rehab' },
    { id: 'M0502', age: '71', region: 'IL-Metro', risk: 0.98, claims: 31, primaryCondition: 'Degenerative Joint Disease' },
    { id: 'M0503', age: '64', region: 'IL-Metro', risk: 1.05, claims: 29, primaryCondition: 'Lumbosacral Radiculopathy' },
    { id: 'M0504', age: '58', region: 'IL-Metro', risk: 0.94, claims: 28, primaryCondition: 'Post-Traumatic Pain Syndrome' },
    { id: 'M0505', age: '73', region: 'IL-Metro', risk: 1.10, claims: 32, primaryCondition: 'Osteoarthritis' },
  ];

  const rotatingEncounters = [
    { date: '2026-02-16', provider: 'P101 (Metro Internal Med)', code: '99215 (Level 5 E/M)', paid: '$210.00', note: 'First post-step change Level 5 visit billed.' },
    { date: '2026-02-23', provider: 'P102 (Metro Rehab & Physio)', code: 'G0300 (Skilled PT)', paid: '$180.00', note: 'Referred from P101 in circular cycle.' },
    { date: '2026-03-02', provider: 'P101 (Metro Internal Med)', code: '99215 (Level 5 E/M)', paid: '$210.00', note: 'Part of 38 Level-5 visits billed on impossible spike day.' },
    { date: '2026-03-09', provider: 'P103 (Metro Comprehensive Pain)', code: '99214 (Level 4 Pain)', paid: '$140.00', note: 'Referred to Pain clinic under shared owner OWN-77.' },
    { date: '2026-03-16', provider: 'P105 (Metro Diagnostic Imaging)', code: '73721 (MRI Joint)', paid: '$440.00', note: 'High-intensity imaging scan ordered.' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#1e1b2e] dark:text-white tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-[#9333ea]" /> Patient History & Rotating Cohort Tracking
        </h2>
        <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">
          Audits the 40 shared rotating members (M0501 - M0540) passed sequentially through the syndicate ring.
        </p>
      </div>

      {/* Grid: Cohort Selection (Left) & Patient Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cohort Selector (Left) */}
        <div className="lg:col-span-4 app-card p-5 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f0f7] dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Shared Rotating Members</h3>
            <span className="badge-pink-pill text-[9px] font-mono">40 Members</span>
          </div>

          <div className="space-y-2">
            {cohortPatients.map((p) => {
              const isSelected = selectedPatient === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#9333ea] bg-[#faf5ff] dark:bg-purple-950/30 shadow-sm'
                      : 'border-[#f1f0f7] dark:border-slate-800 hover:border-[#d8b4fe]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1e1b2e] dark:text-white font-mono">{p.id}</span>
                    <span className="text-[10px] text-[#64748b] font-mono">Risk: {p.risk}</span>
                  </div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400 mt-0.5">{p.primaryCondition}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chronological Encounter Timeline (Right) */}
        <div className="lg:col-span-8 app-card p-6 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f1f0f7] dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-[#1e1b2e] dark:text-white">
                Member {selectedPatient} · Sequential Syndicate Encounter Timeline
              </h3>
              <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                Shows circular referral hopping across P101, P102, P103, and P105 under owner OWN-77.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('brief')}
              className="btn-brief-pill text-xs font-bold"
            >
              View Brief
            </button>
          </div>

          <div className="space-y-3.5 mt-4">
            {rotatingEncounters.map((enc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#fbf9fd] dark:bg-slate-800/70 border border-[#e9e5f0] dark:border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#1e1b2e] dark:text-white">{enc.date}</span>
                  <span className="font-mono font-extrabold text-[#16a34a]">{enc.paid}</span>
                </div>
                <div className="text-xs font-bold text-[#9333ea]">{enc.provider}</div>
                <div className="text-[11px] text-[#475569] dark:text-slate-300 font-mono">CPT: {enc.code}</div>
                <p className="text-[11px] text-[#64748b] dark:text-slate-400 italic pt-0.5">{enc.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
