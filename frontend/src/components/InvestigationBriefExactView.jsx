import React, { useState } from 'react';
import { FileText, CheckCircle2, ShieldAlert, ArrowRight, Download, FileDown, Search, Activity, Sparkles } from 'lucide-react';
import { generateSIUInvestigationPDF } from '../utils/pdfGenerator';

export default function InvestigationBriefExactView({ setActiveTab }) {
  const [activeCase, setActiveCase] = useState('Ring-07');
  const [actionNotice, setActionNotice] = useState(null);
  const [selectedClaimId, setSelectedClaimId] = useState('CLM-101-0082');

  const caseChips = ['Ring-07', 'DME-112', 'BH-054', 'Lab-031', 'HH-220', 'Amb-009'];

  const caseData = {
    'Ring-07': {
      id: 'Ring-07',
      title: 'Ring-07 Coordinated Referral Ring & Level-5 Upcoding',
      risk: '0.93',
      dollars: '$1.82M',
      members: 412,
      repeat: '61%',
      headerSub: 'Ring-07 · 3 providers, shared owner · risk 0.93 · $1.82M at risk · 60-day repeat 61%',
      evidence: '206 flagged claims linked to Ring-07. Level-5 E/M on 91% of visits vs 18% peers. Fields: claim_id, cpt, npi, dos.',
      timeline: 'Day 0 ownership change · Day 12 billing burst · Day 30 referral loop forms · Day 45 member overlap grows',
      network: '3 provider(s), 1 shared owner, 1 shared facility, 412 members affected',
      confidenceText: '0.87 (High), calibrated. Drivers: peer deviation, referral loop, burst.',
      confidenceProgress: 87,
      limitations: 'Synthetic data only. No clinical records. A new clinic ramp-up is a benign explanation.',
      recommendedAction: 'Human review: request medical records and interview. No automatic denial.',
      claims: [
        { id: 'CLM-101-0082', provider: 'P101 (Metro Internal Med)', cpt: '99215 (Level 5 E/M)', dos: '2026-03-02', paid: '$210.00', twinPaid: '$95.00', gap: '+$115.00', confidence: '0.94', reason: 'Impossible velocity & step-change jump' },
        { id: 'CLM-101-0091', provider: 'P101 (Metro Internal Med)', cpt: '99215 (Level 5 E/M)', dos: '2026-03-02', paid: '$210.00', twinPaid: '$95.00', gap: '+$115.00', confidence: '0.94', reason: '38 Level-5 visits in single day' },
        { id: 'CLM-102-0044', provider: 'P102 (Metro Rehab)', cpt: 'G0300 (Skilled PT)', dos: '2026-03-09', paid: '$180.00', twinPaid: '$85.00', gap: '+$95.00', confidence: '0.89', reason: 'Circular referral loop trigger' },
        { id: 'CLM-103-0051', provider: 'P103 (Metro Comprehensive Pain)', cpt: '99214 (Level 4 Pain)', dos: '2026-03-16', paid: '$140.00', twinPaid: '$70.00', gap: '+$70.00', confidence: '0.86', reason: 'Shared owner OWN-77 rotation' }
      ]
    },
    'DME-112': {
      id: 'DME-112',
      title: 'DME-112 Phantom CPAP Equipment Volume Spike',
      risk: '0.88',
      dollars: '$640K',
      members: 188,
      repeat: '55%',
      headerSub: 'DME-112 · Durable equipment spike · risk 0.88 · $640K at risk · 60-day repeat 55%',
      evidence: '84 CPAP device claims with zero corresponding delivery confirmation. Fields: claim_id, cpt (E0601), pos, dos.',
      timeline: 'Day 0 supplier enrollment · Day 15 volume spike · Day 40 patient cluster overlap',
      network: '1 DME depot facility, 2 referring physicians, 188 members affected',
      confidenceText: '0.84 (High), calibrated. Drivers: phantom distribution, no delivery log.',
      confidenceProgress: 84,
      limitations: 'Synthetic benchmark. Remote telemedicine orders could provide legitimate explanation.',
      recommendedAction: 'Human review: request proof of delivery and patient signature logs.',
      claims: [
        { id: 'CLM-301-0014', provider: 'P301 (Apex DME Suppliers)', cpt: 'E0601 (CPAP System)', dos: '2026-03-11', paid: '$850.00', twinPaid: '$0.00', gap: '+$850.00', confidence: '0.91', reason: 'Zero delivery signature log found' },
        { id: 'CLM-301-0022', provider: 'P301 (Apex DME Suppliers)', cpt: 'A7030 (CPAP Mask)', dos: '2026-03-18', paid: '$240.00', twinPaid: '$40.00', gap: '+$200.00', confidence: '0.88', reason: 'Unverified accessory billing spike' }
      ]
    },
    'BH-054': {
      id: 'BH-054',
      title: 'BH-054 Behavioral Health Impossible Velocity Overutilization',
      risk: '0.81',
      dollars: '$455K',
      members: 260,
      repeat: '50%',
      headerSub: 'BH-054 · Behavioral health, impossible timing · risk 0.81 · $455K at risk · 60-day repeat 50%',
      evidence: '112 consecutive days of 4-hour daily intensive psychotherapy for single members. Fields: claim_id, cpt (90837), units.',
      timeline: 'Day 0 service initiation · Day 20 continuous daily billing · Day 60 audit trigger',
      network: '1 solo practitioner, 260 members affected',
      confidenceText: '0.81 (High), calibrated. Drivers: impossible velocity, frequency outlier.',
      confidenceProgress: 81,
      limitations: 'Crisis stabilization programs may show intensive sessions.',
      recommendedAction: 'Human review: request treatment plans and psychotherapy clinical notes.',
      claims: [
        { id: 'CLM-307-0052', provider: 'P307 (Dr. Evelyn Vance)', cpt: '90837 (60min Psychotherapy)', dos: '2026-02-28', paid: '$320.00', twinPaid: '$110.00', gap: '+$210.00', confidence: '0.88', reason: 'Exceeded 24 clinician hours in single day' }
      ]
    },
    'Lab-031': {
      id: 'Lab-031',
      title: 'Lab-031 Component Lab Panel Unbundling',
      risk: '0.76',
      dollars: '$210K',
      members: 97,
      repeat: '44%',
      headerSub: 'Lab-031 · Lab unbundling · risk 0.76 · $210K at risk · 60-day repeat 44%',
      evidence: 'Component panel codes billed separately instead of bundled panel 80053. Fields: claim_id, cpt, modifier.',
      timeline: 'Day 0 software update · Day 10 unbundled billing commences',
      network: '1 reference lab facility, 97 members affected',
      confidenceText: '0.76 (Moderate), calibrated. Drivers: component coding frequency.',
      confidenceProgress: 76,
      limitations: 'Billing clearinghouse translation glitch may account for split claims.',
      recommendedAction: 'Human review: request clearinghouse EDI batch transmission logs.',
      claims: [
        { id: 'CLM-303-0019', provider: 'P303 (Metro Diagnostics Lab)', cpt: '80053-UNB (Unbundled Panels)', dos: '2026-03-05', paid: '$185.00', twinPaid: '$65.00', gap: '+$120.00', confidence: '0.84', reason: 'Unbundled 7 blood tests into individual claims' }
      ]
    },
    'HH-220': {
      id: 'HH-220',
      title: 'HH-220 Home Health Direct Nursing Upcoding',
      risk: '0.59',
      dollars: '$120K',
      members: 63,
      repeat: '29%',
      headerSub: 'HH-220 · Home health utilization · risk 0.59 · $120K at risk · 60-day repeat 29%',
      evidence: 'Direct skilled nursing home visits above 95th percentile. Fields: claim_id, cpt (G0299/G0300).',
      timeline: 'Day 0 nursing contract · Day 30 visit volume expansion',
      network: '1 home health agency, 63 members affected',
      confidenceText: '0.59 (Moderate), calibrated. Drivers: visit frequency variance.',
      confidenceProgress: 59,
      limitations: 'High patient acuity in hospice setting may explain visit density.',
      recommendedAction: 'Human review: verify OASIS assessment forms and plan of care.',
      claims: [
        { id: 'CLM-306-0031', provider: 'P306 (Serenity Home Health)', cpt: 'G0300 (Skilled Nursing)', dos: '2026-03-15', paid: '$160.00', twinPaid: '$90.00', gap: '+$70.00', confidence: '0.72', reason: 'Daily skilled visit density outlier' }
      ]
    },
    'Amb-009': {
      id: 'Amb-009',
      title: 'Amb-009 Ambulance Simultaneous Timestamp Overlap',
      risk: '0.54',
      dollars: '$95K',
      members: 41,
      repeat: '32%',
      headerSub: 'Amb-009 · Ambulance, possible phantom trips · risk 0.54 · $95K at risk · 60-day repeat 32%',
      evidence: 'Overlapping emergency transport runs on same timestamp. Fields: claim_id, cpt (A0427), start_time.',
      timeline: 'Day 0 transport contract · Day 14 timestamp overlap recorded',
      network: '1 ambulance operator, 41 members affected',
      confidenceText: '0.54 (Weak: needs data), calibrated. Drivers: timestamp concurrency.',
      confidenceProgress: 54,
      limitations: 'Fleet multi-vehicle dispatch could account for concurrent run logs.',
      recommendedAction: 'Human review: request vehicle GPS trip logs and dispatch records.',
      claims: [
        { id: 'CLM-304-0012', provider: 'P304 (Express Ambulance)', cpt: 'A0427 (ALS Transport)', dos: '2026-03-07', paid: '$420.00', twinPaid: '$190.00', gap: '+$230.00', confidence: '0.65', reason: 'Simultaneous overlapping run timestamps' }
      ]
    }
  };

  const current = caseData[activeCase] || caseData['Ring-07'];
  const activeClaim = (current.claims || []).find((c) => c.id === selectedClaimId) || (current.claims && current.claims[0]) || {
    id: 'CLM-101-0082',
    provider: 'P101 (Metro Internal Med)',
    cpt: '99215 (Level 5 E/M)',
    dos: '2026-03-02',
    paid: '$210.00',
    twinPaid: '$95.00',
    gap: '+$115.00',
    confidence: '0.94',
    reason: 'Impossible velocity & step-change jump'
  };

  const handleDownloadPDF = () => {
    generateSIUInvestigationPDF(current);
    setActionNotice(`Official SIU Dossier PDF for ${current.id} downloaded successfully!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e1b2e] dark:text-white tracking-tight">Investigation brief</h2>
          <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">
            {current.headerSub}
          </p>
        </div>

        {/* Big Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#9333ea] text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Download SIU Dossier PDF</span>
        </button>
      </div>

      {/* Case Switcher Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {caseChips.map((chip) => {
          const isActive = activeCase === chip;
          return (
            <button
              key={chip}
              onClick={() => {
                setActiveCase(chip);
                const firstClaim = caseData[chip]?.claims?.[0];
                if (firstClaim) setSelectedClaimId(firstClaim.id);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#ec4899] text-white shadow-md shadow-pink-500/20'
                  : 'bg-white dark:bg-slate-900 text-[#475569] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-800 hover:border-[#d8b4fe]'
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 6 Section Cards (2 Columns x 3 Rows Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Evidence */}
        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2">
          <h3 className="text-xs font-bold text-[#e11d48] uppercase tracking-wider">
            Evidence
          </h3>
          <p className="text-xs text-[#1e1b2e] dark:text-slate-200 leading-relaxed">
            {current.evidence}
          </p>
        </div>

        {/* Card 2: Timeline */}
        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2">
          <h3 className="text-xs font-bold text-[#e11d48] uppercase tracking-wider">
            Timeline
          </h3>
          <p className="text-xs text-[#1e1b2e] dark:text-slate-200 leading-relaxed">
            {current.timeline}
          </p>
        </div>

        {/* Card 3: Network context */}
        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2">
          <h3 className="text-xs font-bold text-[#e11d48] uppercase tracking-wider">
            Network context
          </h3>
          <p className="text-xs text-[#1e1b2e] dark:text-slate-200 leading-relaxed">
            {current.network}
          </p>
        </div>

        {/* Card 4: Confidence */}
        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2">
          <h3 className="text-xs font-bold text-[#e11d48] uppercase tracking-wider">
            Confidence
          </h3>
          <p className="text-xs text-[#1e1b2e] dark:text-slate-200 leading-relaxed">
            {current.confidenceText}
          </p>
          <div className="w-full bg-[#f1f0f7] dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] via-[#ec4899] to-[#9333ea] rounded-full"
              style={{ width: `${current.confidenceProgress}%` }}
            />
          </div>
        </div>

        {/* Card 5: Limitations */}
        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2">
          <h3 className="text-xs font-bold text-[#e11d48] uppercase tracking-wider">
            Limitations
          </h3>
          <p className="text-xs text-[#1e1b2e] dark:text-slate-200 leading-relaxed">
            {current.limitations}
          </p>
        </div>

        {/* Card 6: Recommended action */}
        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2">
          <h3 className="text-xs font-bold text-[#ea580c] uppercase tracking-wider">
            Recommended action
          </h3>
          <p className="text-xs text-[#1e1b2e] dark:text-slate-200 leading-relaxed">
            {current.recommendedAction}
          </p>
        </div>
      </div>

      {/* Single Claim Deep-Dive & PDF Evaluation Section */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f1f0f7] dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-[#1e1b2e] dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#9333ea]" /> Single Claim Intelligence & Multi-Engine Evaluation
            </h3>
            <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
              Select any claim linked to {activeCase} to inspect multi-engine confidence, overpayment calculations, and export an individual PDF report.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#9333ea] text-[#9333ea] hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-bold transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Claim Dossier PDF</span>
          </button>
        </div>

        {/* Claim Selector Chips */}
        <div className="flex flex-wrap gap-2">
          {(current.claims || []).map((clm) => (
            <button
              key={clm.id}
              onClick={() => setSelectedClaimId(clm.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                selectedClaimId === clm.id
                  ? 'bg-[#9333ea] text-white shadow-sm'
                  : 'bg-[#fbf9fd] dark:bg-slate-800 text-[#475569] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700 hover:border-[#d8b4fe]'
              }`}
            >
              {clm.id}
            </button>
          ))}
        </div>

        {/* Selected Claim Deep Dive Card */}
        {activeClaim && (
          <div className="p-4 rounded-2xl bg-[#fbf9fd] dark:bg-slate-800/70 border border-[#e9e5f0] dark:border-slate-700/80 space-y-4 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-[#9ca3af] uppercase font-bold">Claim Reference</span>
                <div className="font-mono font-bold text-sm text-[#1e1b2e] dark:text-white mt-0.5">{activeClaim.id}</div>
                <div className="text-[11px] text-[#64748b] dark:text-slate-400">Date: {activeClaim.dos}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#9ca3af] uppercase font-bold">Rendering Provider</span>
                <div className="font-bold text-xs text-[#9333ea] mt-0.5">{activeClaim.provider}</div>
                <div className="text-[11px] font-mono text-[#475569] dark:text-slate-300">CPT: {activeClaim.cpt}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#9ca3af] uppercase font-bold">Peer Twin Benchmark</span>
                <div className="font-mono font-bold text-xs text-[#1e1b2e] dark:text-white mt-0.5">
                  Paid: <span className="text-[#16a34a]">{activeClaim.paid}</span> · Twin: {activeClaim.twinPaid}
                </div>
                <div className="text-[11px] font-mono font-bold text-[#e11d48]">
                  Overpayment Gap: {activeClaim.gap}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#9ca3af] uppercase font-bold">Model Confidence & Score</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="badge-pink-pill text-[10px] font-mono">{activeClaim.confidence} / 1.00</span>
                  <span className="text-[11px] font-bold text-[#16a34a]">High Calibrated</span>
                </div>
                <div className="text-[11px] text-[#64748b] dark:text-slate-400 mt-0.5">{activeClaim.reason}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => setActionNotice(`Action logged: Medical records request drafted for ${activeCase}. Logged to SQLite ledger.`)}
          className="px-6 py-2.5 btn-primary-gradient text-xs font-bold shadow-md"
        >
          Request records
        </button>

        <button
          onClick={() => setActionNotice(`Action logged: Case ${activeCase} escalated to SIU Lead for subpoena review.`)}
          className="px-5 py-2.5 rounded-full border border-[#cbd5e1] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-[#475569] dark:text-slate-200 hover:bg-[#f8fafc] transition-all"
        >
          Escalate to SIU lead
        </button>

        <button
          onClick={() => setActionNotice(`Action logged: Case ${activeCase} closed with no administrative action.`)}
          className="px-5 py-2.5 rounded-full border border-[#cbd5e1] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-[#475569] dark:text-slate-200 hover:bg-[#f8fafc] transition-all"
        >
          Close: no action
        </button>
      </div>
    </div>
  );
}
