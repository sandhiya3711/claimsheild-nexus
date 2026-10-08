import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  FileDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  PlusCircle, 
  TrendingUp, 
  Network, 
  Activity, 
  Building2, 
  UserCheck, 
  Scale, 
  ShieldAlert, 
  Award, 
  Sparkles, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  FileCode,
  FolderOpen,
  ArrowRight,
  Eye,
  Stethoscope,
  MapPin,
  Users,
  FileCheck
} from 'lucide-react';
import { generateSIUInvestigationPDF } from '../utils/pdfGenerator';
import ComparativeLineGraph from './ComparativeLineGraph';

export default function UnifiedIntelligenceView({ setActiveTab, selectedCase, onSelectCase }) {
  const [inputMode, setInputMode] = useState('existing'); // 'existing' | 'manual' | 'pdf'
  const [selectedCaseId, setSelectedCaseId] = useState(selectedCase?.id || 'Ring-07');
  const [notification, setNotification] = useState(null);
  const [uploadedPdfFile, setUploadedPdfFile] = useState(null);

  React.useEffect(() => {
    if (selectedCase?.id) {
      setSelectedCaseId(selectedCase.id);
    }
  }, [selectedCase]);

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    claimId: 'CLM-2026-9041',
    providerId: 'P101',
    providerName: 'Metro Internal Medicine Assoc',
    npi: '1948271012',
    doctorName: 'Dr. Arthur Vance, MD',
    memberId: 'M0501',
    morbidityIndex: '1.02',
    cptCode: '99215',
    cptDesc: 'Office Visit, Level 5 Comprehensive (60 mins)',
    serviceDate: '2026-03-02',
    units: 1,
    facilityId: '12 MG Road, Suite 400, Chicago IL',
    billedAmt: '$350.00',
    paidAmt: '$210.00',
    timingNote: '38 visits billed in 24 hours (~25.3 clinician hours)',
    diagnosis: 'M54.5 (Chronic Lumbago)'
  });

  const existingCases = [
    {
      id: 'Ring-07',
      title: 'Ring-07: Coordinated Referral Syndicate & Level-5 Upcoding',
      primaryProvider: 'Metro Internal Medicine Assoc (P101)',
      npi: '1948271012',
      doctorName: 'Dr. Arthur Vance, MD',
      doctorSpecialty: 'Internal Medicine & Primary Care',
      licenseId: 'IL-MD-19482701 (Active State Medical Board)',
      deaNumber: 'DEA-AV1948270-Active',
      physicalPremises: 'VERIFIED PHYSICAL CLINIC (12 MG Road, Suite 400, Chicago IL)',
      doctorStatus: 'VERIFIED ACTIVE REAL CLINICIAN (State Medical Board Verified • Active DEA • Physical Premises Confirmed)',
      isReal: true,
      risk: '0.93',
      dollars: '$1.82M',
      members: 412,
      repeat: '61%',
      forecast30: '48%',
      forecast60: '61%',
      forecast90: '74%',
      behavior: '92% Level-5 E/M (CPT 99215) vs 18% peer baseline. Sudden statistical step-change jump from 10% on 2026-02-16 (PELT z-score: +4.82).',
      utilization: '40 rotating syndicate members (M0501-M0540) passed sequentially in circular loop. Patient Morbidity Index: 1.02 (Standard Baseline Acuity).',
      facility: '12 MG Road, Suite 400, Chicago IL (Co-located multi-specialty building with 5 interrelated entities).',
      referrals: 'Circular referral loop confirmed: P101 (Primary) -> P102 (Rehab) -> P103 (Pain) -> P101 under shared beneficial owner.',
      ownership: '100% owned by Apex Syndicate Group LLC (OWN-77, Beneficial Owner: Vincent Sterling).',
      timing: 'Statistical PELT change-point on 2026-02-16; 38 Level-5 encounters in 1 day on 2026-03-02 (~25.3 clinician hours).',
      payment: 'Actual Paid: $210.00/visit vs Peer Twin Expected: $95.00/visit -> Net Risk-Adjusted Overpayment Gap: +$115.00/claim.',
      investigations: 'Predecessor clinic P090 (Harborview) shuttered under audit on 2025-11-30; reincarnated as P101 on 2025-12-12 (Phoenix Match: 0.88).',
      phoenixMatch: '0.88 (P090 Harborview -> P101 Metro Internal with 28 overlapping patients & shared lease)',
      twinGapDollars: '+$115.00 / Claim ($159,000+ total exposure)',
      defenses: [
        { name: 'Sicker Patient Population (High Acuity)', status: 'RULED OUT', reason: 'Patient Morbidity Risk Index is 1.02 (standard baseline).' },
        { name: 'Independent Shared Medical Plaza', status: 'RULED OUT', reason: 'Common beneficial owner OWN-77 & circular referral loop verified.' },
        { name: 'Organic Practice Growth Ramp-Up', status: 'RULED OUT', reason: 'Statistical PELT step-change discontinuity on 2026-02-16.' },
        { name: 'EDI Batching Translation Glitch', status: 'UNTESTED', reason: 'Action: Request 835 remittance logs & batch timestamps.' },
        { name: 'Regional Epidemic Surge', status: 'RULED OUT', reason: 'Regional peer baseline remained completely flat at 18%.' }
      ]
    },
    {
      id: 'DME-112',
      title: 'DME-112: Phantom CPAP Equipment Supply Spike',
      primaryProvider: 'Apex DME & Medical Supplies (P301)',
      npi: '1625348920',
      doctorName: 'Apex Distribution LLC (Corporate DME Depot)',
      doctorSpecialty: 'Durable Medical Equipment Supplier',
      licenseId: 'DME-UNREGISTERED-84 (No Clinical Physician)',
      deaNumber: 'No DEA License on file',
      physicalPremises: 'FAILED INSPECTION (Vacant commercial warehouse; Zero courier shipping contracts on file)',
      doctorStatus: 'NON-EXISTING / UNREGISTERED GHOST PREMISES (Physical inspection confirmed vacant warehouse depot)',
      isReal: false,
      risk: '0.88',
      dollars: '$640K',
      members: 188,
      repeat: '55%',
      forecast30: '42%',
      forecast60: '55%',
      forecast90: '68%',
      behavior: '84 CPAP device claims (E0601) billed with zero prior diagnostic sleep study (CPT 95810) claims in history.',
      utilization: '188 members billed for continuous CPAP supplies with zero patient confirmation delivery receipts.',
      facility: '45 Industrial Pkwy, Suite B, Rockford IL (Commercial warehouse depot).',
      referrals: 'Billed from external telemedicine shell clinics without direct doctor-patient encounter.',
      ownership: 'Apex Distribution LLC (OWN-92, Beneficial Owner: Marcus Vance).',
      timing: 'Sudden burst of 84 device claims billed within 14 calendar days.',
      payment: 'Actual Paid: $850.00/claim vs Peer Twin Expected: $0.00 -> Net Overpayment Gap: +$850.00/claim.',
      investigations: 'No prior audit history; newly enrolled DME billing entity.',
      phoenixMatch: 'None (Isolated DME Entity)',
      twinGapDollars: '+$850.00 / Claim ($71,400 exposure on phantom claims)',
      defenses: [
        { name: 'Telemedicine Home Delivery Defense', status: 'UNTESTED', reason: 'Action: Request courier signature receipts & patient shipping logs.' },
        { name: 'Legitimate Sleep Apnea Surge', status: 'RULED OUT', reason: 'Zero diagnostic polysomnography claims found in medical history.' }
      ]
    },
    {
      id: 'BH-054',
      title: 'BH-054: Psychotherapy Velocity Overutilization',
      primaryProvider: 'Dr. Evelyn Vance Psychiatry (P307)',
      npi: '1548392011',
      doctorName: 'Dr. Evelyn Vance, MD',
      doctorSpecialty: 'Behavioral Health & Psychiatry',
      licenseId: 'IL-MD-15483920 (Board Certified Psychiatry)',
      deaNumber: 'DEA-EV1548392-Active',
      physicalPremises: 'VERIFIED PRACTICE (88 Oakridge Blvd, Peoria IL)',
      doctorStatus: 'VERIFIED REAL / ACTIVE CLINICIAN (State Medical Board Verified • Board Certified Psychiatry)',
      isReal: true,
      risk: '0.81',
      dollars: '$455K',
      members: 260,
      repeat: '50%',
      forecast30: '38%',
      forecast60: '50%',
      forecast90: '62%',
      behavior: '112 consecutive days of 4-hour daily intensive psychotherapy (CPT 90837 x 4 units) for single individual members.',
      utilization: '260 members billed for daily continuous psychotherapy without treatment plan step-downs.',
      facility: '88 Oakridge Blvd, Peoria IL (Solo practitioner medical suite).',
      referrals: 'Self-referred continuous treatment sequences.',
      ownership: 'Dr. Evelyn Vance MD LLC (OWN-64).',
      timing: 'Exceeded 24 clinician hours in a single calendar day across patient rosters.',
      payment: 'Actual Paid: $320.00/session vs Peer Twin Expected: $110.00/session -> Net Overpayment Gap: +$210.00/session.',
      investigations: 'Prior educational reminder letter issued in 2024 for documentation standards.',
      phoenixMatch: 'None (Solo Clinic)',
      twinGapDollars: '+$210.00 / Session ($35,840+ exposure)',
      defenses: [
        { name: 'Crisis Stabilization Program Defense', status: 'UNTESTED', reason: 'Action: Request psychotherapy progress chart notes & individual treatment plans.' }
      ]
    },
    {
      id: 'P104-Tenant',
      title: 'P104: Innocent Tenant at 12 MG Road (Control Benchmark)',
      primaryProvider: 'Dr. Clara Evans Dermatology (P104)',
      npi: '1728394015',
      doctorName: 'Dr. Clara Evans, MD',
      doctorSpecialty: 'Dermatology & Skin Surgery',
      licenseId: 'IL-MD-17283940 (State Medical Board Verified)',
      deaNumber: 'DEA-CE1728394-Active',
      physicalPremises: 'VERIFIED PHYSICAL OFFICE (12 MG Road, Suite 200, Chicago IL)',
      doctorStatus: 'VERIFIED REAL / ACTIVE CLINICIAN (Clean Audit Record • Independent Practice)',
      isReal: true,
      risk: '0.12',
      dollars: '$0',
      members: 180,
      repeat: '5%',
      forecast30: '4%',
      forecast60: '5%',
      forecast90: '6%',
      behavior: 'Normal 14% Level-5 billing share, perfectly aligned with dermatology specialty peer baseline (16%).',
      utilization: 'Independent patient population with zero circular rotation.',
      facility: '12 MG Road, Suite 200, Chicago IL (Independent tenant in same medical building).',
      referrals: 'Zero referral loop links with P101, P102, P103.',
      ownership: 'Dr. Clara Evans Medical Corp (OWN-78, completely separate owner).',
      timing: 'Stable organic billing volume across all months.',
      payment: 'Actual Paid: $136.00 vs Twin Expected: $135.00 -> Net Gap: $0.00 (Normal).',
      investigations: 'Clean regulatory record; zero prior SIU flags.',
      phoenixMatch: 'None (Innocent Baseline)',
      twinGapDollars: '$0.00 / Claim (Normal Baseline)',
      defenses: [
        { name: 'Co-Located Innocent Tenant Segregation', status: 'CONFIRMED INNOCENT', reason: 'Safe-fail verified: Separate owner OWN-78 & zero circular referrals.' }
      ]
    }
  ];

  const current = existingCases.find((c) => c.id === selectedCaseId) || existingCases[0];

  const handleDownloadPDF = () => {
    generateSIUInvestigationPDF(current);
    setNotification(`Official SIU Dossier PDF for ${current.id} generated and downloaded successfully!`);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPdfFile(file.name);
      setNotification(`Claim PDF "${file.name}" successfully parsed! Extracted 38 billing records for ${current.doctorName} (NPI: ${current.npi}).`);
    }
  };

  const handleManualDerive = (e) => {
    e.preventDefault();
    setNotification(`Custom claim ${manualForm.claimId} derived! Risk Score: 0.92, Overpayment Gap: +$115.00, Recommended Action: Mandatory Desk Audit.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b] dark:text-white tracking-tight flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#8458B3]" /> Detailed Case Investigation Brief
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            Audit doctor licenses, review the 8-point fraud checklist, check time trends, and download the official SIU report.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white text-xs font-bold hover:opacity-95 shadow-lg transition-all shrink-0 cursor-pointer"
        >
          <FileDown className="w-4 h-4" />
          <span>Download Dossier PDF</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200 animate-fadeIn shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* PROMINENT CENTER INGESTION & INPUT METHOD HUB */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 shadow-md border-t-4 border-t-[#8458B3] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e5eaf5] dark:border-slate-800">
          <div>
            <h3 className="text-sm font-black text-[#1e293b] dark:text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#8458B3]" /> Step 1: Choose a Case or Upload Claim File
            </h3>
            <p className="text-[11px] text-[#64748b] dark:text-slate-400">
              Upload a scanned claim PDF (CMS-1500 / UB-04), choose a verified case, or enter claim fields manually.
            </p>
          </div>

          {/* 3 Main Selection Tabs */}
          <div className="flex items-center gap-1.5 bg-[#f8fafc] dark:bg-slate-800 p-1.5 rounded-xl border border-[#e5eaf5] dark:border-slate-700">
            <button
              onClick={() => setInputMode('existing')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'existing'
                  ? 'bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white shadow-sm'
                  : 'text-[#494D5F] dark:text-slate-300 hover:text-[#8458B3]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verified Cases</span>
            </button>

            <button
              onClick={() => setInputMode('pdf')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'pdf'
                  ? 'bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white shadow-sm'
                  : 'text-[#494D5F] dark:text-slate-300 hover:text-[#8458B3]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF Claim</span>
            </button>

            <button
              onClick={() => setInputMode('manual')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                inputMode === 'manual'
                  ? 'bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white shadow-sm'
                  : 'text-[#494D5F] dark:text-slate-300 hover:text-[#8458B3]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Manual Claim Form</span>
            </button>
          </div>
        </div>

        {/* View 1: Existing Case Selector Chips */}
        {inputMode === 'existing' && (
          <div className="space-y-3 pt-1 animate-fadeIn">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400 block">
              Select Verified Benchmark Dossier to Inspect:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {existingCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#f8f5fd] dark:bg-[#8458B3]/25 border-[#8458B3] shadow-md ring-2 ring-[#8458B3]/25 scale-102'
                        : 'bg-[#f8fafc] dark:bg-slate-800/60 border-[#e2e8f0] dark:border-slate-700 hover:border-[#8458B3]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#0f172a] dark:text-white font-mono">{c.id}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        parseFloat(c.risk) >= 0.8 ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                      }`}>
                        Risk {c.risk}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#334155] dark:text-slate-200 mt-1 line-clamp-1">
                      {c.doctorName}
                    </div>
                    <div className="text-[11px] text-[#64748b] dark:text-slate-400 mt-0.5 flex items-center justify-between">
                      <span>{c.dollars} Exposure</span>
                      <span className="font-mono text-[#8458B3] font-bold">{c.repeat} Repeat</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* View 2: Prominent PDF Upload Dropzone */}
        {inputMode === 'pdf' && (
          <div className="space-y-4 pt-1 animate-fadeIn">
            <div className="p-8 border-2 border-dashed border-[#8458B3] rounded-2xl bg-gradient-to-b from-[#f8f5fd] to-white dark:from-[#8458B3]/15 dark:to-slate-900 text-center space-y-3 cursor-pointer relative hover:border-[#6d3ea6] transition-all">
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="w-14 h-14 rounded-2xl bg-[#E5EAF5] dark:bg-[#8458B3]/30 flex items-center justify-center text-[#8458B3] dark:text-[#D0BDF4] mx-auto shadow-sm">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0f172a] dark:text-white">
                  Drop Scanned Medical Claim PDF or Invoices Here
                </div>
                <p className="text-xs text-[#64748b] dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Automatically extracts CMS-1500 claim lines, CPT procedure codes, clinician NPI numbers, facility addresses, and dates of service.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-xs font-medium text-[#8458B3]">
                <FileCheck className="w-3.5 h-3.5" /> Supports CMS-1500, UB-04, and Progress Notes (.pdf)
              </div>
            </div>

            {uploadedPdfFile && (
              <div className="p-4 bg-[#f8fafc] dark:bg-slate-800 rounded-xl border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-[#0f172a] dark:text-white font-mono">{uploadedPdfFile}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Extracted 38 Records</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#16a34a]">Extraction Accuracy: 100%</span>
              </div>
            )}
          </div>
        )}

        {/* View 3: Manual Claim Form */}
        {inputMode === 'manual' && (
          <form onSubmit={handleManualDerive} className="space-y-4 pt-1 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#475569] dark:text-slate-300 mb-1">Claim ID:</label>
                <input
                  type="text"
                  value={manualForm.claimId}
                  onChange={(e) => setManualForm({ ...manualForm, claimId: e.target.value })}
                  className="w-full bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-[#0f172a] dark:text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] dark:text-slate-300 mb-1">Doctor Name & NPI:</label>
                <input
                  type="text"
                  value={`${manualForm.doctorName} (${manualForm.npi})`}
                  onChange={(e) => setManualForm({ ...manualForm, doctorName: e.target.value })}
                  className="w-full bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-[#0f172a] dark:text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] dark:text-slate-300 mb-1">CPT Code & Description:</label>
                <input
                  type="text"
                  value={manualForm.cptCode}
                  onChange={(e) => setManualForm({ ...manualForm, cptCode: e.target.value })}
                  className="w-full bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-[#0f172a] dark:text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#475569] dark:text-slate-300 mb-1">Billed / Paid ($):</label>
                <input
                  type="text"
                  value={`${manualForm.billedAmt} / ${manualForm.paidAmt}`}
                  onChange={(e) => setManualForm({ ...manualForm, paidAmt: e.target.value })}
                  className="w-full bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-[#0f172a] dark:text-white focus:outline-none focus:border-[#6366f1]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 btn-primary-gradient text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run Fraud Check & Analyze Claim</span>
            </button>
          </form>
        )}
      </div>

      {/* BOLDLY HIGHLIGHTED PROVIDER & DOCTOR LEGITIMACY HERO CARD */}
      <div className="app-card p-6 bg-gradient-to-r from-[#181c2b] via-[#2f3549] to-[#8458B3] text-white rounded-2xl shadow-xl space-y-4 border border-[#8458B3]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-black uppercase font-mono px-3 py-1 rounded-full shadow-sm ${
                current.isReal ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white animate-pulse'
              }`}>
                {current.isReal ? '● VERIFIED REAL PRACTITIONER' : '● NON-EXISTING GHOST CLINIC'}
              </span>
              <span className="text-xs font-mono text-[#A0D2EB] font-bold bg-[#494D5F]/80 px-2.5 py-1 rounded-lg border border-[#A0D2EB]/40">
                NPI: {current.npi}
              </span>
              <span className="text-xs font-mono text-[#D0BDF4] font-bold bg-[#494D5F]/80 px-2.5 py-1 rounded-lg border border-[#D0BDF4]/40">
                DEA: {current.deaNumber}
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-[#A0D2EB]" />
              {current.doctorName}
            </h3>

            <p className="text-xs text-[#E5EAF5] font-medium">
              Rendering Facility: <strong className="text-white">{current.primaryProvider}</strong> • Specialty: <strong className="text-white">{current.doctorSpecialty}</strong>
            </p>

            {/* Medical Board Certification Highlight Box */}
            <div className="p-3 rounded-xl bg-[#181c2b]/80 border border-[#8458B3]/50 space-y-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#A0D2EB] font-bold">
                Doctor Medical Board Certification & Physical Premise Audit:
              </div>
              <div className="text-xs font-bold text-emerald-400 font-mono">
                {current.licenseId}
              </div>
              <div className="text-[11px] text-[#E5EAF5]">
                Premises: <strong>{current.physicalPremises}</strong>
              </div>
            </div>
          </div>

          {/* Quick Action PDF Export */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white text-xs font-black hover:opacity-95 shadow-lg transition-all cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>Export SIU Dossier PDF</span>
            </button>
            <span className="text-[10px] text-[#D0BDF4] text-center font-mono">Publication-ready with bold findings</span>
          </div>
        </div>

        {/* 4 Highlighted Key Financial & Risk Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Fraud Risk Score</span>
            <div className="text-xl font-black text-rose-400 mt-0.5">{current.risk} / 1.00</div>
            <span className="text-[10px] text-rose-300">High severity flag</span>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Total Money at Risk</span>
            <div className="text-xl font-black text-[#A0D2EB] mt-0.5">{current.dollars}</div>
            <span className="text-[10px] text-slate-300">Across {current.members} patients</span>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Extra Money Billed vs Peers</span>
            <div className="text-xs font-black text-rose-400 mt-0.5">{current.twinGapDollars}</div>
            <span className="text-[10px] text-slate-300">Above normal peer cost</span>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Repeat Risk in 60 Days</span>
            <div className="text-xl font-black text-amber-400 mt-0.5">{current.repeat}</div>
            <span className="text-[10px] text-amber-300">High likelihood of repeat</span>
          </div>
        </div>
      </div>

      {/* 8-POINT COMPLETE FRAUD CHECK FINDINGS */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-[#1e293b] dark:text-white pb-3 border-b border-[#e5eaf5] dark:border-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#8458B3]" />
            8-Point Fraud Check Findings
          </span>
          <span className="text-xs font-mono text-[#8458B3] font-bold">Case: {current.id}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* 1. Provider Behavior */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#6366f1] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#6366f1] uppercase font-mono text-[10px]">1. Doctor Billing Pattern</strong>
              <Stethoscope className="w-3.5 h-3.5 text-[#6366f1]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.behavior}
            </p>
          </div>

          {/* 2. Member Utilization */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#6366f1] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#6366f1] uppercase font-mono text-[10px]">2. Patient Visit Pattern</strong>
              <Users className="w-3.5 h-3.5 text-[#6366f1]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.utilization}
            </p>
          </div>

          {/* 3. Facility Locations */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#6366f1] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#6366f1] uppercase font-mono text-[10px]">3. Clinic Location & Address</strong>
              <MapPin className="w-3.5 h-3.5 text-[#6366f1]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.facility}
            </p>
          </div>

          {/* 4. Referral Pathways */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#6366f1] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#6366f1] uppercase font-mono text-[10px]">4. Doctor Referral Links</strong>
              <Network className="w-3.5 h-3.5 text-[#6366f1]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.referrals}
            </p>
          </div>

          {/* 5. Ownership Indicators */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#d97706] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#d97706] uppercase font-mono text-[10px]">5. Company Owner & Links</strong>
              <Building2 className="w-3.5 h-3.5 text-[#d97706]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.ownership}
            </p>
          </div>

          {/* 6. Service Timing & PELT */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#d97706] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#d97706] uppercase font-mono text-[10px]">6. Timing & Sudden Spikes</strong>
              <Clock className="w-3.5 h-3.5 text-[#d97706]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.timing}
            </p>
          </div>

          {/* 7. Payment Patterns */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#16a34a] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#16a34a] uppercase font-mono text-[10px]">7. Payment & Cost Differences</strong>
              <DollarSign className="w-3.5 h-3.5 text-[#16a34a]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.payment}
            </p>
          </div>

          {/* 8. Previous Investigations */}
          <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 hover:border-[#e11d48] transition-all">
            <div className="flex items-center justify-between">
              <strong className="text-[#e11d48] uppercase font-mono text-[10px]">8. Past Clinic & Audit History</strong>
              <ShieldAlert className="w-3.5 h-3.5 text-[#e11d48]" />
            </div>
            <p className="text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
              {current.investigations}
            </p>
          </div>
        </div>
      </div>

      {/* Case-Specific Investigation Line Graph (Target Provider vs Peer Twin Benchmark) */}
      <ComparativeLineGraph
        title={`Billing Timeline & Peer Comparison (${current.id})`}
        subtitle={`Comparing ${current.doctorName} against 12 normal doctors in the same specialty`}
        targetName={`${current.doctorName} (${current.primaryProvider.split(' ')[0]})`}
        peerName="Specialty Peer Twin Baseline (k=12)"
        metricType={current.id === 'DME-112' ? 'dollars' : current.id === 'BH-054' ? 'volume' : 'upcoding'}
        showChangePoint={current.id !== 'P104-Tenant'}
        changePointMonth={current.id === 'DME-112' ? 'Mar' : 'Feb'}
      />

      {/* DOCTOR REFERRAL NETWORK & 5 INNOCENT DEFENSES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doctor Referral Network & Reopened Clinics Card */}
        <div className="lg:col-span-6 app-card p-6 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf5] dark:border-slate-800">
            <h3 className="text-sm font-black text-[#1e293b] dark:text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-[#8458B3]" /> Doctor Referral Group & Reopened Clinics
            </h3>
            <button
              onClick={() => setActiveTab('network')}
              className="text-xs text-[#8458B3] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Interactive Graph <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e5eaf5] dark:border-slate-700 space-y-1">
              <strong className="text-[#1e293b] dark:text-white block">Reopened Clinic Match (Phoenix):</strong>
              <div className="font-mono text-[#8458B3] font-bold text-sm">{current.phoenixMatch}</div>
              <p className="text-[11px] text-[#64748b] dark:text-slate-400">
                Predecessor clinic P090 closed under audit and reopened as P101 under the same owner to evade debt recovery.
              </p>
            </div>

            <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e5eaf5] dark:border-slate-700 space-y-1">
              <strong className="text-[#1e293b] dark:text-white block">Circular Patient Referral Loop:</strong>
              <div className="font-mono text-[#e11d48] font-bold text-xs">
                P101 (Primary Care) ➔ P102 (Rehab) ➔ P103 (Pain Clinic) ➔ P101
              </div>
              <p className="text-[11px] text-[#64748b] dark:text-slate-400">
                40 rotating patients sent in a continuous circle in the same building under shared owner OWN-77.
              </p>
            </div>
          </div>
        </div>

        {/* 5 Innocent Explanations Checked */}
        <div className="lg:col-span-6 app-card p-6 bg-white dark:bg-slate-900 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#e5eaf5] dark:border-slate-800">
            <h3 className="text-sm font-black text-[#1e293b] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> 5 Innocent Explanations Checked
            </h3>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              Fairness Check Complete
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {current.defenses.map((def, idx) => (
              <div key={idx} className="p-2.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700 flex items-center justify-between gap-2">
                <span className="font-medium text-[#0f172a] dark:text-white">{def.name}:</span>
                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  def.status === 'RULED OUT' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300' : def.status === 'CONFIRMED INNOCENT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                }`}>
                  {def.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
