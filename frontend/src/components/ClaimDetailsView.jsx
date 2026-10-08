import React, { useState } from 'react';
import { FileText, Search, FileDown, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert, Sparkles, Filter, Activity } from 'lucide-react';
import { generateSIUInvestigationPDF } from '../utils/pdfGenerator';

export default function ClaimDetailsView({ setActiveTab }) {
  const [selectedClaimId, setSelectedClaimId] = useState('CLM-101-0082');
  const [searchTerm, setSearchTerm] = useState('');

  const claimsList = [
    {
      id: 'CLM-101-0082',
      caseId: 'Ring-07',
      providerId: 'P101',
      providerName: 'Metro Internal Medicine Assoc',
      memberId: 'M0501',
      morbidityIndex: '1.02 (Standard)',
      dos: '2026-03-02',
      pos: '11 (Office)',
      cpt: '99215',
      cptDesc: 'Office Visit, Level 5, High Complexity (40+ mins)',
      units: 1,
      charged: '$350.00',
      paid: '$210.00',
      twinExpected: '$95.00',
      overpaymentGap: '+$115.00',
      confidence: '0.94 / 1.00',
      severity: 'CRITICAL',
      triggers: [
        'Deterministic Upcoding Flag: Level-5 billed on 92% of total encounters vs 18% peer baseline.',
        'Velocity Outlier: 38 Level-5 encounters billed in a single 24-hr day on 2026-03-02.',
        'Referral Syndicate: Patient referred to P102 in circular loop under owner OWN-77.'
      ],
      innocentDefenseStatus: 'Sicker patient population tested and RULED OUT (Morbidity Index: 1.02)'
    },
    {
      id: 'CLM-101-0091',
      caseId: 'Ring-07',
      providerId: 'P101',
      providerName: 'Metro Internal Medicine Assoc',
      memberId: 'M0502',
      morbidityIndex: '0.98 (Standard)',
      dos: '2026-03-02',
      pos: '11 (Office)',
      cpt: '99215',
      cptDesc: 'Office Visit, Level 5, High Complexity (40+ mins)',
      units: 1,
      charged: '$350.00',
      paid: '$210.00',
      twinExpected: '$95.00',
      overpaymentGap: '+$115.00',
      confidence: '0.94 / 1.00',
      severity: 'CRITICAL',
      triggers: [
        'Impossible Timing Spike: Part of 38 Level-5 encounters billed on same day.',
        'Member Hop: Member M0502 rotates P101 -> P102 -> P103 weekly.'
      ],
      innocentDefenseStatus: 'Organic ramp-up tested and RULED OUT by PELT change-point detection'
    },
    {
      id: 'CLM-301-0014',
      caseId: 'DME-112',
      providerId: 'P301',
      providerName: 'Apex DME Suppliers',
      memberId: 'M1209',
      morbidityIndex: '1.05 (Standard)',
      dos: '2026-03-11',
      pos: '12 (Home Delivery)',
      cpt: 'E0601',
      cptDesc: 'Continuous Positive Airway Pressure (CPAP) Device',
      units: 1,
      charged: '$1,200.00',
      paid: '$850.00',
      twinExpected: '$0.00',
      overpaymentGap: '+$850.00',
      confidence: '0.91 / 1.00',
      severity: 'HIGH',
      triggers: [
        'Phantom Delivery: Zero courier tracking delivery logs or patient signature confirmation found.',
        'Sudden Volume Jump: CPAP distribution spike with no prior diagnostic sleep study claim.'
      ],
      innocentDefenseStatus: 'Telemedicine distribution untested; records request in flight'
    },
    {
      id: 'CLM-307-0052',
      caseId: 'BH-054',
      providerId: 'P307',
      providerName: 'Dr. Evelyn Vance Psychiatry',
      memberId: 'M0844',
      morbidityIndex: '1.01 (Standard)',
      dos: '2026-02-28',
      pos: '11 (Office)',
      cpt: '90837',
      cptDesc: 'Psychotherapy, 60 minutes with patient',
      units: 4,
      charged: '$480.00',
      paid: '$320.00',
      twinExpected: '$110.00',
      overpaymentGap: '+$210.00',
      confidence: '0.88 / 1.00',
      severity: 'HIGH',
      triggers: [
        'Impossible Duration: 4 consecutive hours billed for single patient on consecutive days.',
        'Practitioner Velocity: Total daily billed hours exceeded 24 hours for solo practitioner.'
      ],
      innocentDefenseStatus: 'Crisis stabilization program tested; clinical chart notes requested'
    },
    {
      id: 'CLM-303-0019',
      caseId: 'Lab-031',
      providerId: 'P303',
      providerName: 'Metro Diagnostics Lab',
      memberId: 'M0432',
      morbidityIndex: '0.95 (Standard)',
      dos: '2026-03-05',
      pos: '81 (Independent Lab)',
      cpt: '80053-UNB',
      cptDesc: 'Unbundled Comprehensive Metabolic Component Panels',
      units: 7,
      charged: '$280.00',
      paid: '$185.00',
      twinExpected: '$65.00',
      overpaymentGap: '+$120.00',
      confidence: '0.84 / 1.00',
      severity: 'MEDIUM',
      triggers: [
        'Lab Component Splitting: Billed 7 separate metabolic components instead of single 80053 panel.'
      ],
      innocentDefenseStatus: 'EDI translation glitch tested; clearinghouse logs requested'
    }
  ];

  const filteredClaims = claimsList.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.id.toLowerCase().includes(term) ||
      c.providerName.toLowerCase().includes(term) ||
      c.memberId.toLowerCase().includes(term) ||
      c.cpt.includes(term) ||
      c.caseId.toLowerCase().includes(term)
    );
  });

  const activeClaim = claimsList.find((c) => c.id === selectedClaimId) || claimsList[0];

  const handleExportClaimPDF = () => {
    generateSIUInvestigationPDF({
      id: `${activeClaim.caseId}_${activeClaim.id}`,
      title: `Single Claim Dossier: ${activeClaim.id} (${activeClaim.providerName})`,
      risk: activeClaim.confidence.split('/')[0].trim(),
      dollars: activeClaim.paid,
      members: 1,
      repeat: '61%'
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#6366f1]" /> Single Claim Inspector
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            Examine detailed claim information, check peer comparison amounts, and download claim reports.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Claim ID, Provider, CPT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-700 text-xs text-[#0f172a] dark:text-white rounded-xl pl-9 pr-3 py-2 w-64 focus:outline-none focus:border-[#6366f1]"
          />
        </div>
      </div>

      {/* Grid: Claim Selector (Left) & Deep Dive Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Claim Selector List */}
        <div className="lg:col-span-4 app-card p-5 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Select Claim</h3>
            <span className="text-xs font-mono text-[#8458B3] font-bold">{filteredClaims.length} Claims</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredClaims.map((clm) => {
              const isSelected = selectedClaimId === clm.id;
              return (
                <div
                  key={clm.id}
                  onClick={() => setSelectedClaimId(clm.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#8458B3] bg-[#f8f5fd] dark:bg-[#8458B3]/25 shadow-sm'
                      : 'border-[#f1f5f9] dark:border-slate-800 hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#0f172a] dark:text-white">{clm.id}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      clm.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : clm.severity === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {clm.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748b] dark:text-slate-400 mt-1">
                    {clm.providerName}
                  </div>
                  <div className="text-[10px] font-mono text-[#8458B3] mt-0.5 flex items-center justify-between">
                    <span>CPT {clm.cpt}</span>
                    <span className="font-bold text-[#16a34a]">{clm.paid}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claim Dossier Detail (Right) */}
        <div className="lg:col-span-8 app-card p-6 bg-white dark:bg-slate-900 space-y-6">
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9] dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#8458B3] bg-[#E5EAF5] dark:bg-[#8458B3]/30 px-2 py-0.5 rounded-md">
                  {activeClaim.id}
                </span>
                <span className="text-[11px] font-mono text-[#64748b]">Case: {activeClaim.caseId}</span>
                <span className="text-[11px] font-mono text-[#64748b]">DOS: {activeClaim.dos}</span>
              </div>
              <h3 className="text-lg font-black text-[#0f172a] dark:text-white mt-1">
                {activeClaim.cptDesc}
              </h3>
              <div className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                Rendering Provider: <strong>{activeClaim.providerName} ({activeClaim.providerId})</strong> • Member: <strong>{activeClaim.memberId}</strong>
              </div>
            </div>

            <button
              onClick={handleExportClaimPDF}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download Claim PDF</span>
            </button>
          </div>

          {/* 4 Financial & Calculation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Amount Charged</span>
              <div className="text-base font-black text-[#0f172a] dark:text-white mt-0.5">{activeClaim.charged}</div>
            </div>

            <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Amount Paid</span>
              <div className="text-base font-black text-[#16a34a] mt-0.5">{activeClaim.paid}</div>
            </div>

            <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Peer Twin Expected</span>
              <div className="text-base font-black text-[#8458B3] mt-0.5">{activeClaim.twinExpected}</div>
            </div>

            <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Overpayment Gap</span>
              <div className="text-base font-black text-[#e11d48] mt-0.5">{activeClaim.overpaymentGap}</div>
            </div>
          </div>

          {/* Field Level Triggers Card */}
          <div className="p-5 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#e11d48] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Why This Claim Was Flagged:
            </h4>
            <div className="space-y-2 text-xs">
              {activeClaim.triggers.map((trig, idx) => (
                <div key={idx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-[#e2e8f0] dark:border-slate-800 text-[#0f172a] dark:text-slate-200">
                  {trig}
                </div>
              ))}
            </div>
          </div>

          {/* Innocent Defense & Clinical Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-[#e2e8f0] dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1.5">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Patient Health Status</span>
              <div className="text-xs font-bold text-[#0f172a] dark:text-white">Index: {activeClaim.morbidityIndex}</div>
              <p className="text-[11px] text-[#64748b] dark:text-slate-400">
                Patient health risk falls within standard population norms, isolating excess billing from clinical severity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 dark:text-emerald-400">Innocent Explanation Check</span>
              <div className="text-[11px] font-semibold leading-relaxed">
                {activeClaim.innocentDefenseStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
