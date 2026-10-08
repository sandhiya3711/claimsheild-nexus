import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  FileDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Network, 
  ShieldAlert, 
  ListFilter, 
  Cpu, 
  TrendingUp, 
  Building2, 
  Activity, 
  DollarSign, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { generateSIUInvestigationPDF } from '../utils/pdfGenerator';

export default function DatasetHubView({ setActiveTab, onSelectCase }) {
  const [selectedClaimId, setSelectedClaimId] = useState('CLM-101-0082');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  // Full dataset of claims with explicit 8-dimension data and multi-engine detection facts
  const datasetClaims = [
    {
      claimId: 'CLM-101-0082',
      caseId: 'Ring-07',
      caseTitle: 'Ring-07 Coordinated Referral Syndicate & Level-5 Upcoding',
      providerId: 'P101',
      providerName: 'Metro Internal Medicine Assoc',
      doctorName: 'Dr. Arthur Vance, MD',
      doctorStatus: 'VERIFIED REAL PRACTITIONER (Medical Board License: IL-MD-19482701 • NPI Active)',
      memberId: 'M0501',
      morbidityIndex: '1.02 (Standard Acuity)',
      cptCode: '99215',
      cptDesc: 'Office Visit, Level 5 Comprehensive (40+ mins)',
      serviceDate: '2026-03-02',
      billedAmt: '$350.00',
      paidAmt: '$210.00',
      twinExpectedAmt: '$95.00',
      overpaymentGap: '+$115.00',
      riskScore: '0.93 / 1.00',
      severity: 'CRITICAL',

      // 8 Explicit Dimensions
      providerBehavior: 'Level-5 E/M (CPT 99215) billed on 92% of total encounters vs 18% specialty peer average. Peer z-score: +4.82.',
      memberUtilization: '40 shared rotating members (M0501-M0540) passed sequentially in circular loop. Patient Morbidity Risk Index: 1.02 (healthy baseline).',
      facilityLocations: '12 MG Road, Suite 400, Chicago IL (Co-located multi-specialty building housing all 5 ring entities).',
      referrals: 'Circular referral loop confirmed: P101 -> P102 (Rehab) -> P103 (Pain) -> P101 under shared owner.',
      ownershipIndicators: '100% owned by Apex Syndicate Group LLC (OWN-77, Beneficial Owner: Vincent Sterling).',
      serviceTiming: 'Statistical PELT change-point on 2026-02-16; 38 Level-5 visits in 1 calendar day on 2026-03-02 (~25.3 clinician hours).',
      paymentPatterns: 'Actual Paid: $210.00/visit vs Peer Twin Expected: $95.00/visit -> Net Risk-Adjusted Overpayment Gap: +$115.00/claim.',
      previousInvestigations: 'Predecessor clinic P090 (Harborview) closed under payer audit on 2025-11-30; reincarnated as P101 on 2025-12-12.',

      // Detection Facts & Engine Findings
      detectionFacts: [
        { engine: 'Deterministic Rule Engine', fact: 'Flagged extreme Level-5 upcoding (CPT 99215 on 92% of visits) exceeding 99th percentile specialty threshold.' },
        { engine: 'Temporal Change-Point (PELT)', fact: 'Confirmed sudden statistical step-change jump on 2026-02-16 (p < 0.001) with zero prior ramp-up.' },
        { engine: 'Velocity Outlier Check', fact: 'Billed 38 Level-5 encounters in a single 24-hr day on 2026-03-02, requiring 25.3 continuous clinician hours.' },
        { engine: 'NetworkX Louvain Graph', fact: 'Circular referral loop detected (P101 -> P102 -> P103 -> P101) with 100% common beneficial ownership (OWN-77).' },
        { engine: 'Phoenix Entity Resolution', fact: 'Matched shuttered clinic P090 (Harborview) to successor P101 with 0.88 match score and 28 overlapping patients.' },
        { engine: 'Peer Twin (k=12) Counterfactual', fact: 'Calculated exact risk-adjusted overpayment discrepancy: +$115.00/claim ($159,000+ total exposure).' },
        { engine: 'Innocent Defense Auditing', fact: 'Sicker patient population hypothesis RULED OUT because patient morbidity risk index is 1.02 (standard baseline).' }
      ]
    },
    {
      claimId: 'CLM-301-0014',
      caseId: 'DME-112',
      caseTitle: 'DME-112 Phantom CPAP Equipment Volume Spike',
      providerId: 'P301',
      providerName: 'Apex DME & Medical Supplies',
      doctorName: 'Apex Distribution LLC (DME Depot)',
      doctorStatus: 'NON-EXISTING / UNREGISTERED GHOST CLINIC (Vacant warehouse inspection; Zero courier tracking logs)',
      memberId: 'M1209',
      morbidityIndex: '1.05 (Standard Acuity)',
      cptCode: 'E0601',
      cptDesc: 'Continuous Positive Airway Pressure (CPAP) Device',
      serviceDate: '2026-03-11',
      billedAmt: '$1,200.00',
      paidAmt: '$850.00',
      twinExpectedAmt: '$0.00',
      overpaymentGap: '+$850.00',
      riskScore: '0.88 / 1.00',
      severity: 'HIGH',

      providerBehavior: '84 CPAP device claims billed with zero prior diagnostic sleep study (CPT 95810) claims in history.',
      memberUtilization: '188 members billed for continuous high-value supplies without patient receipt signatures.',
      facilityLocations: '45 Industrial Pkwy, Suite B, Rockford IL (Commercial warehouse depot).',
      referrals: 'Billed from external telemedicine shell clinics without direct doctor-patient encounter.',
      ownershipIndicators: 'Apex Distribution LLC (OWN-92).',
      serviceTiming: 'Sudden burst of 84 device claims billed within 14 calendar days.',
      paymentPatterns: 'Actual Paid: $850.00/claim vs Peer Twin Expected: $0.00 (No Delivery) -> Overpayment Gap: +$850.00/claim.',
      previousInvestigations: 'No prior audit history; newly enrolled entity.',

      detectionFacts: [
        { engine: 'Deterministic Phantom Rule', fact: 'Flagged 84 CPAP device claims with zero matching courier tracking logs or patient delivery signatures.' },
        { engine: 'Volume Anomaly Detector', fact: 'Unprecedented volume spike for newly enrolled DME depot without clinical referral history.' },
        { engine: 'Peer Twin Benchmark', fact: 'Twin expected reimbursement is $0.00 due to unverified delivery, yielding $850.00/claim net exposure.' }
      ]
    },
    {
      claimId: 'CLM-307-0052',
      caseId: 'BH-054',
      caseTitle: 'BH-054 Behavioral Health Psychotherapy Velocity Overutilization',
      providerId: 'P307',
      providerName: 'Dr. Evelyn Vance Psychiatry',
      doctorName: 'Dr. Evelyn Vance, MD',
      doctorStatus: 'VERIFIED REAL PRACTITIONER (Medical Board License: IL-MD-15483920 • Board Certified)',
      memberId: 'M0844',
      morbidityIndex: '1.01 (Standard Acuity)',
      cptCode: '90837',
      cptDesc: 'Psychotherapy, 60 minutes with patient (4 units)',
      serviceDate: '2026-02-28',
      billedAmt: '$480.00',
      paidAmt: '$320.00',
      twinExpectedAmt: '$110.00',
      overpaymentGap: '+$210.00',
      riskScore: '0.81 / 1.00',
      severity: 'HIGH',

      providerBehavior: '112 consecutive days of 4-hour daily intensive psychotherapy for single members.',
      memberUtilization: '260 members billed for daily continuous psychotherapy without treatment step-downs.',
      facilityLocations: '88 Oakridge Blvd, Peoria IL (Solo practitioner medical suite).',
      referrals: 'Self-referred continuous treatment sequences.',
      ownershipIndicators: 'Dr. Evelyn Vance MD LLC (OWN-64).',
      serviceTiming: 'Exceeded 24 clinician hours in a single calendar day across patient rosters.',
      paymentPatterns: 'Actual Paid: $320.00/session vs Peer Twin Expected: $110.00/session -> Overpayment Gap: +$210.00/session.',
      previousInvestigations: 'Prior educational reminder letter issued in 2024 for documentation standards.',

      detectionFacts: [
        { engine: 'Impossible Velocity Detector', fact: 'Daily billed duration exceeded 24 face-to-face clinician hours for solo practitioner.' },
        { engine: 'Frequency Outlier Engine', fact: '112 consecutive daily sessions for single patients exceeds 99.5th percentile norm.' },
        { engine: 'Innocent Defense Auditing', fact: 'Crisis stabilization defense untested; desk audit action generated for chart notes.' }
      ]
    },
    {
      claimId: 'CLM-303-0019',
      caseId: 'Lab-031',
      caseTitle: 'Lab-031 Component Lab Panel Unbundling',
      providerId: 'P303',
      providerName: 'Metro Diagnostics Lab',
      doctorName: 'Metro Diagnostics Group LLC',
      doctorStatus: 'VERIFIED CLINICAL LAB (CLIA License: 14D0982711 • State Lab Registry Active)',
      memberId: 'M0432',
      morbidityIndex: '0.95 (Standard Acuity)',
      cptCode: '80053-UNB',
      cptDesc: 'Unbundled Comprehensive Metabolic Component Panels (7 separate claims)',
      serviceDate: '2026-03-05',
      billedAmt: '$280.00',
      paidAmt: '$185.00',
      twinExpectedAmt: '$65.00',
      overpaymentGap: '+$120.00',
      riskScore: '0.76 / 1.00',
      severity: 'MEDIUM',

      providerBehavior: 'Component panel codes billed separately instead of bundled panel CPT 80053.',
      memberUtilization: '97 members billed with split lab panels on same date of service.',
      facilityLocations: '120 West Lab Way, Suite 10, Chicago IL.',
      referrals: 'Referred by multi-specialty clinics for routine blood testing.',
      ownershipIndicators: 'Metro Diagnostics Group LLC (OWN-55).',
      serviceTiming: 'Billed simultaneously on same electronic batch transmission.',
      paymentPatterns: 'Actual Paid: $185.00 vs Peer Twin Expected: $65.00 -> Overpayment Gap: +$120.00/panel.',
      previousInvestigations: 'Clean prior audit history.',

      detectionFacts: [
        { engine: 'Deterministic Unbundling Rule', fact: 'Flagged 7 component metabolic lab codes submitted separately instead of single 80053 panel.' },
        { engine: 'Peer Twin Benchmark', fact: 'Twin expected reimbursement is $65.00 for bundled panel, yielding +$120.00/claim overpayment.' }
      ]
    },
    {
      claimId: 'CLM-104-0012',
      caseId: 'P104-Tenant',
      caseTitle: 'P104 Dr. Clara Evans Dermatology (Innocent Control Benchmark)',
      providerId: 'P104',
      providerName: 'Dr. Clara Evans Dermatology',
      doctorName: 'Dr. Clara Evans, MD',
      doctorStatus: 'VERIFIED REAL PRACTITIONER (Medical Board License: IL-MD-17283940 • Clean Audit History)',
      memberId: 'M0311',
      morbidityIndex: '1.00 (Standard Acuity)',
      cptCode: '99213',
      cptDesc: 'Office Visit, Level 3 Low-Moderate Complexity',
      serviceDate: '2026-03-10',
      billedAmt: '$150.00',
      paidAmt: '$110.00',
      twinExpectedAmt: '$110.00',
      overpaymentGap: '$0.00 (Normal)',
      riskScore: '0.12 / 1.00',
      severity: 'CLEARED',

      providerBehavior: 'Normal 14% Level-5 billing share, perfectly aligned with dermatology specialty peer baseline (16%).',
      memberUtilization: 'Independent patient population with zero circular rotation.',
      facilityLocations: '12 MG Road, Suite 200, Chicago IL (Independent tenant in same medical building).',
      referrals: 'Zero referral loop links with P101, P102, P103.',
      ownershipIndicators: 'Dr. Clara Evans Medical Corp (OWN-78, completely separate owner).',
      serviceTiming: 'Stable organic billing volume across all months.',
      paymentPatterns: 'Actual Paid: $110.00 vs Twin Expected: $110.00 -> Net Gap: $0.00 (Normal).',
      previousInvestigations: 'Clean regulatory record; zero prior SIU flags.',

      detectionFacts: [
        { engine: 'Innocent Tenant Segregation', fact: 'Safe-fail confirmed: Separate beneficial owner OWN-78 and zero circular referrals with syndicate.' },
        { engine: 'Peer Normalizer Engine', fact: 'Billing distribution falls squarely within healthy peer control bounds (z-score: -0.21).' }
      ]
    }
  ];

  const filteredClaims = datasetClaims.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.claimId.toLowerCase().includes(term) ||
      c.caseId.toLowerCase().includes(term) ||
      c.providerName.toLowerCase().includes(term) ||
      c.cptCode.includes(term) ||
      c.doctorName.toLowerCase().includes(term)
    );
  });

  const activeClaim = datasetClaims.find((c) => c.claimId === selectedClaimId) || datasetClaims[0];

  const handleDownloadPDF = () => {
    generateSIUInvestigationPDF({
      id: `${activeClaim.caseId}_${activeClaim.claimId}`,
      title: `${activeClaim.caseTitle} • Claim ${activeClaim.claimId}`,
      risk: activeClaim.riskScore.split('/')[0].trim(),
      dollars: activeClaim.paidAmt,
      members: 1,
      repeat: '61%',
      doctorStatus: activeClaim.doctorStatus
    });
    setNotification(`Official SIU Dossier PDF for Claim ${activeClaim.claimId} generated & downloaded!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-[#6366f1]" /> Upload & Explore Claims
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            Select any claim to view doctor license verification, 8 key claim details, and fraud check results.
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

      {/* Action Notification Banner */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Claim Selector (Left) & Comprehensive 8-Dimension Intelligence + Detection Facts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Claim Selector List */}
        <div className="lg:col-span-4 app-card p-5 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9] dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Select Claim / Statement</h3>
            <span className="text-xs font-mono text-[#6366f1] font-bold">{filteredClaims.length} Claims</span>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredClaims.map((clm) => {
              const isSelected = selectedClaimId === clm.claimId;
              return (
                <div
                  key={clm.claimId}
                  onClick={() => setSelectedClaimId(clm.claimId)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#8458B3] bg-[#f8f5fd] dark:bg-[#8458B3]/25 shadow-sm'
                      : 'border-[#f1f5f9] dark:border-slate-800 hover:border-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#0f172a] dark:text-white">{clm.claimId}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      clm.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : clm.severity === 'HIGH'
                        ? 'bg-orange-100 text-orange-700'
                        : clm.severity === 'CLEARED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {clm.severity}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 mt-1">
                    {clm.providerName}
                  </div>

                  <div className="text-[11px] text-[#64748b] dark:text-slate-400 mt-0.5">
                    {clm.caseTitle}
                  </div>

                  <div className="text-[10px] font-mono text-[#8458B3] mt-1 pt-1 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between">
                    <span>CPT {clm.cptCode} • {clm.serviceDate}</span>
                    <span className="font-bold text-[#16a34a]">{clm.paidAmt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 8-Dimension Intelligence Attributes & Multi-Engine Detection Facts */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card with Doctor Board Verification */}
          <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f5f9] dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#8458B3] bg-[#E5EAF5] dark:bg-[#8458B3]/30 px-2 py-0.5 rounded-md">
                    {activeClaim.claimId}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748b]">Case: {activeClaim.caseId}</span>
                  <span className="text-[11px] font-mono text-[#64748b]">DOS: {activeClaim.serviceDate}</span>
                </div>

                <h3 className="text-lg font-black text-[#0f172a] dark:text-white mt-1">
                  {activeClaim.cptDesc}
                </h3>

                <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                  Rendering: <strong>{activeClaim.doctorName}</strong> ({activeClaim.providerName}) • Member: <strong>{activeClaim.memberId}</strong>
                </p>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-[#ec4899]" />
                <span>Download Dossier PDF</span>
              </button>
            </div>

            {/* Doctor Legitimacy Status Banner */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
              activeClaim.doctorStatus.includes('VERIFIED')
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
                : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-300'
            }`}>
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4" /> Doctor Medical Board Status:
              </span>
              <span className="font-semibold">{activeClaim.doctorStatus}</span>
            </div>

            {/* Financial Overview Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Amount Charged</span>
                <div className="text-base font-black text-[#0f172a] dark:text-white mt-0.5">{activeClaim.billedAmt}</div>
              </div>

              <div className="p-3 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Amount Paid</span>
                <div className="text-base font-black text-[#16a34a] mt-0.5">{activeClaim.paidAmt}</div>
              </div>

              <div className="p-3 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Peer Twin Expected</span>
                <div className="text-base font-black text-[#6366f1] mt-0.5">{activeClaim.twinExpectedAmt}</div>
              </div>

              <div className="p-3 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
                <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Overpayment Gap</span>
                <div className="text-base font-black text-[#e11d48] mt-0.5">{activeClaim.overpaymentGap}</div>
              </div>
            </div>
          </div>

          {/* Complete 8-Dimension Intelligence Section (EXPLICIT DATA) */}
          <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4">
            <h3 className="text-sm font-bold text-[#0f172a] dark:text-white pb-3 border-b border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between">
              <span>8 Key Fraud Check Details for Claim {activeClaim.claimId}</span>
              <span className="text-xs font-mono text-[#6366f1] font-bold">8 Audit Factors</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* 1. Provider Behavior */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#6366f1] uppercase font-mono text-[10px] block">1. Doctor Billing Pattern</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.providerBehavior}
                </p>
              </div>

              {/* 2. Member Utilization */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#6366f1] uppercase font-mono text-[10px] block">2. Patient Visit Pattern</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.memberUtilization}
                </p>
              </div>

              {/* 3. Facility Locations */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#6366f1] uppercase font-mono text-[10px] block">3. Clinic Location & Address</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.facilityLocations}
                </p>
              </div>

              {/* 4. Referral Pathways */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#6366f1] uppercase font-mono text-[10px] block">4. Doctor Referral Links</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.referrals}
                </p>
              </div>

              {/* 5. Ownership Indicators */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#d97706] uppercase font-mono text-[10px] block">5. Company Owner & Links</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.ownershipIndicators}
                </p>
              </div>

              {/* 6. Service Timing */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#d97706] uppercase font-mono text-[10px] block">6. Timing & Sudden Spikes</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.serviceTiming}
                </p>
              </div>

              {/* 7. Payment Patterns */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#16a34a] uppercase font-mono text-[10px] block">7. Payment & Cost Differences</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.paymentPatterns}
                </p>
              </div>

              {/* 8. Previous Investigations */}
              <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                <strong className="text-[#e11d48] uppercase font-mono text-[10px] block">8. Past Clinic & Audit History</strong>
                <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                  {activeClaim.previousInvestigations}
                </p>
              </div>
            </div>
          </div>

          {/* Detection of the Selected Statement & Multi-Engine Detection Facts */}
          <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] dark:border-slate-800">
              <h3 className="text-sm font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e11d48]" /> Why This Claim Was Flagged (Detection Facts)
              </h3>
              <div className="flex items-center gap-2">
                <span className="badge-pink-pill text-[10px] font-mono">Risk {activeClaim.riskScore}</span>
                <span className="text-xs font-bold text-[#16a34a]">High Calibrated</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              {activeClaim.detectionFacts.map((df, idx) => (
                <div key={idx} className="p-3 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#6366f1] font-mono text-[11px]">{df.engine}</strong>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ Evidence Verified</span>
                  </div>
                  <p className="text-[#0f172a] dark:text-slate-200 font-medium leading-relaxed">
                    {df.fact}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-[#f1f5f9] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('network')}
                  className="px-3 py-1.5 rounded-lg border border-[#8458B3] text-[#8458B3] hover:bg-[#E5EAF5] dark:hover:bg-[#8458B3]/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Network className="w-3.5 h-3.5" /> View Doctor Network
                </button>
                <button
                  onClick={() => setActiveTab('queue')}
                  className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] dark:border-slate-700 text-[#475569] dark:text-slate-300 hover:bg-[#f8fafc] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ListFilter className="w-3.5 h-3.5" /> View Priority List
                </button>
              </div>

              <button
                onClick={handleDownloadPDF}
                className="px-4 py-1.5 btn-primary-gradient text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download Claim Summary (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
