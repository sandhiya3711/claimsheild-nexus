import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Building2, 
  MapPin, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  FileDown, 
  Award, 
  DollarSign, 
  Clock, 
  ShieldAlert,
  Stethoscope,
  FileBadge,
  BadgeAlert,
  BarChart3,
  Network
} from 'lucide-react';
import { generateSIUInvestigationPDF } from '../utils/pdfGenerator';

export default function ProviderProfileView({ setActiveTab, onSelectCase }) {
  const [selectedProviderId, setSelectedProviderId] = useState('P101');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  const providers = [
    {
      id: 'P101',
      name: 'Metro Internal Medicine Associates',
      doctorName: 'Dr. Arthur Vance, MD',
      specialty: 'Internal Medicine & Primary Care',
      npi: '1948271012',
      npiType: 'Type 1 (Individual Clinician) & Type 2 (Group Entity)',
      licenseId: 'IL-MD-19482701',
      stateBoardStatus: 'ACTIVE & CERTIFIED (Illinois State Medical Board)',
      deaStatus: 'Active DEA License (Schedule II-V Controlled Substances)',
      physicalPremises: 'VERIFIED PHYSICAL CLINIC (12 MG Road, Suite 400, Chicago IL)',
      isRealDoctor: true,
      owner: 'OWN-77 (Apex Syndicate Group LLC • Beneficial Owner: Vincent Sterling)',
      totalClaims: 680,
      totalPaid: '$142,800',
      riskScore: '0.93',
      status: 'HIGH RISK SYNDICATE FLAG',
      level5Share: 92,
      peerAvgLevel5: 18,
      twinExpectedPaid: '$95.00',
      actualPaid: '$210.00',
      overpaymentGap: '+$115.00 / visit',
      changePointDate: '2026-02-16',
      changePointNote: 'Sudden statistical step-change jump from 10% to 92% Level-5 billing (PELT z-score: +4.82)',
      affiliations: ['P102 (Metro Physical Rehab)', 'P103 (Metro Interventional Pain)', 'P105 (Metro Diagnostic Imaging)', 'P090 (Harborview Predecessor - Shuttered)'],
      innocentDefense: 'Sicker patient defense tested & disproven (Patient Morbidity Index: 1.02 vs 1.00 baseline)'
    },
    {
      id: 'P301',
      name: 'Apex DME & Medical Supplies Depot',
      doctorName: 'Apex Distribution LLC (Corporate DME Depot)',
      specialty: 'Durable Medical Equipment Supplier',
      npi: '1625348920',
      npiType: 'Type 2 (Organizational Entity Only - No Prescribing Doctor)',
      licenseId: 'DME-UNREGISTERED-84 (Non-Compliant)',
      stateBoardStatus: 'NON-EXISTING / UNREGISTERED CLINICAL ENTITY',
      deaStatus: 'No DEA License on file (Not Authorized)',
      physicalPremises: 'FAILED INSPECTION (Vacant commercial warehouse with 0 courier contracts on file)',
      isRealDoctor: false,
      owner: 'OWN-92 (Apex Distribution LLC • Beneficial Owner: Marcus Vance)',
      totalClaims: 84,
      totalPaid: '$71,400',
      riskScore: '0.88',
      status: 'PHANTOM SERVICES FLAG',
      level5Share: 0,
      peerAvgLevel5: 0,
      twinExpectedPaid: '$0.00 (No Delivery)',
      actualPaid: '$850.00',
      overpaymentGap: '+$850.00 / claim',
      changePointDate: '2026-03-01',
      changePointNote: 'Volume burst of 84 CPAP units with zero courier delivery tracking or signed receipts',
      affiliations: ['Solo DME distribution shell entity'],
      innocentDefense: 'Telehealth distribution defense pending proof of delivery logs & signed patient manifests'
    },
    {
      id: 'P307',
      name: 'Dr. Evelyn Vance Psychiatry Practice',
      doctorName: 'Dr. Evelyn Vance, MD',
      specialty: 'Behavioral Health & Psychiatry',
      npi: '1548392011',
      npiType: 'Type 1 (Individual Physician)',
      licenseId: 'IL-MD-15483920',
      stateBoardStatus: 'ACTIVE & CERTIFIED (American Board of Psychiatry & Neurology)',
      deaStatus: 'Active DEA Registered (DEA-EV1548392)',
      physicalPremises: 'VERIFIED PRACTICE (88 Oakridge Blvd, Peoria IL)',
      isRealDoctor: true,
      owner: 'OWN-64 (Dr. Evelyn Vance MD LLC)',
      totalClaims: 112,
      totalPaid: '$35,840',
      riskScore: '0.81',
      status: 'IMPOSSIBLE VELOCITY FLAG',
      level5Share: 88,
      peerAvgLevel5: 22,
      twinExpectedPaid: '$110.00',
      actualPaid: '$320.00',
      overpaymentGap: '+$210.00 / session',
      changePointDate: '2026-02-01',
      changePointNote: '112 consecutive days of 4-hour daily individual psychotherapy without step-down',
      affiliations: ['Solo Behavioral Health Medical Suite'],
      innocentDefense: 'Crisis stabilization defense under medical records review & chart note audit'
    },
    {
      id: 'P104',
      name: 'Dr. Clara Evans Dermatology Clinic',
      doctorName: 'Dr. Clara Evans, MD (Board Certified)',
      specialty: 'Dermatology & Skin Surgery',
      npi: '1728394015',
      npiType: 'Type 1 (Individual Physician)',
      licenseId: 'IL-MD-17283940',
      stateBoardStatus: 'ACTIVE & CERTIFIED (Illinois State Medical Board • Clean Record)',
      deaStatus: 'Active DEA Registered (DEA-CE1728394)',
      physicalPremises: 'VERIFIED PHYSICAL OFFICE (12 MG Road, Suite 200, Chicago IL)',
      isRealDoctor: true,
      owner: 'OWN-78 (Dr. Clara Evans Medical Corp • Independent Owner)',
      totalClaims: 180,
      totalPaid: '$24,500',
      riskScore: '0.12',
      status: 'INNOCENT TENANT BENCHMARK',
      level5Share: 14,
      peerAvgLevel5: 16,
      twinExpectedPaid: '$135.00',
      actualPaid: '$136.00',
      overpaymentGap: '$0.00 / visit (Normal)',
      changePointDate: 'None (Stable)',
      changePointNote: 'Stable organic billing volume across all months perfectly aligned with peer norms',
      affiliations: ['Independent Practice (Zero syndicate referral overlap with P101/P102/P103)'],
      innocentDefense: 'Safe-fail confirmed: Separate beneficial owner OWN-78 & zero circular referral links'
    },
    {
      id: 'P203',
      name: 'Eastgate Podiatry Care Group',
      doctorName: 'Dr. Robert Miller, DPM',
      specialty: 'Podiatric Medicine & Surgery',
      npi: '1439201844',
      npiType: 'Type 1 (Individual Specialist)',
      licenseId: 'IL-DPM-1439201',
      stateBoardStatus: 'ACTIVE & CERTIFIED (Podiatric Medical Licensing Board)',
      deaStatus: 'Active DEA Registered',
      physicalPremises: 'VERIFIED PRACTICE (77 Eastgate Plaza, Naperville IL)',
      isRealDoctor: true,
      owner: 'OWN-31 (Eastgate Medical LLC)',
      totalClaims: 95,
      totalPaid: '$12,350',
      riskScore: '0.34',
      status: 'SAFE-FAIL DISMISSED',
      level5Share: 16,
      peerAvgLevel5: 15,
      twinExpectedPaid: '$130.00',
      actualPaid: '$130.00',
      overpaymentGap: '$0.00 (Normal)',
      changePointDate: 'None',
      changePointNote: 'Minor volume uptick aligned with seasonal winter demand trends',
      affiliations: ['Independent Podiatry Office'],
      innocentDefense: 'Safe-Fail triggered: Signal weak (<0.40) and clinical explanations fully plausible'
    }
  ];

  const filteredProviders = providers.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.specialty.toLowerCase().includes(term) ||
      p.doctorName.toLowerCase().includes(term) ||
      p.npi.includes(term)
    );
  });

  const activeProvider = providers.find((p) => p.id === selectedProviderId) || providers[0];

  const handleExportPDF = () => {
    generateSIUInvestigationPDF({
      id: activeProvider.id,
      title: `${activeProvider.name} - Provider Legitimacy Dossier`,
      doctorName: activeProvider.doctorName,
      npi: activeProvider.npi,
      risk: activeProvider.riskScore,
      dollars: activeProvider.totalPaid,
      members: activeProvider.totalClaims,
      repeat: activeProvider.isRealDoctor ? '61%' : 'N/A (Ghost)',
      doctorStatus: activeProvider.stateBoardStatus,
      isReal: activeProvider.isRealDoctor,
      behavior: `Level-5 Upcoding Share: ${activeProvider.level5Share}% vs Peer Baseline: ${activeProvider.peerAvgLevel5}%.`,
      utilization: `${activeProvider.totalClaims} total claims audited across reporting period.`,
      facility: activeProvider.physicalPremises,
      referrals: activeProvider.affiliations.join('; '),
      ownership: activeProvider.owner,
      timing: activeProvider.changePointNote,
      payment: `Actual Paid: ${activeProvider.actualPaid} vs Expected Twin: ${activeProvider.twinExpectedPaid} (Gap: ${activeProvider.overpaymentGap})`,
      investigations: `Audit Status: ${activeProvider.status}. Defense tested: ${activeProvider.innocentDefense}`,
      phoenixMatch: activeProvider.id === 'P101' ? '0.88' : 'None',
      twinGapDollars: activeProvider.overpaymentGap,
      defenses: [
        { name: 'Sicker Patient Population', status: activeProvider.riskScore > 0.8 ? 'RULED OUT' : 'CONFIRMED INNOCENT', reason: activeProvider.innocentDefense }
      ]
    });
    setNotification(`Regulatory Legitimacy Dossier PDF for ${activeProvider.doctorName} downloaded successfully!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e293b] dark:text-white tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#8458B3]" /> Doctor License & Clinic Check
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            Audit medical board licenses, NPI credentials, physical office inspections, and compare billing against peer doctors.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search doctor, NPI, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-[#e5eaf5] dark:border-slate-700 text-xs text-[#1e293b] dark:text-white rounded-xl pl-9 pr-3 py-2 w-64 focus:outline-none focus:border-[#8458B3] shadow-sm"
          />
        </div>
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

      {/* Grid: Doctor Selector List (Left) & Highlighted Profile (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Doctor Selector */}
        <div className="lg:col-span-4 app-card p-5 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#e5eaf5] dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748b] dark:text-slate-400">Select Doctor or Clinic</h3>
            <span className="text-xs font-mono text-[#8458B3] font-bold">{filteredProviders.length} Providers</span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredProviders.map((p) => {
              const isSelected = selectedProviderId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProviderId(p.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#8458B3] bg-[#f8f5fd] dark:bg-[#8458B3]/20 shadow-md ring-2 ring-[#8458B3]/25 scale-102'
                      : 'border-[#f1f5f9] dark:border-slate-800 hover:border-[#cbd5e1] dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0f172a] dark:text-white line-clamp-1">{p.doctorName}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      p.isRealDoctor ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
                    }`}>
                      {p.isRealDoctor ? 'VERIFIED' : 'GHOST CLINIC'}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#64748b] dark:text-slate-400 mt-1 line-clamp-1">
                    {p.name}
                  </div>

                  <div className="text-[10px] font-mono text-[#8458B3] mt-1 pt-1 border-t border-[#f1f5f9] dark:border-slate-800 flex items-center justify-between">
                    <span>{p.specialty}</span>
                    <span className="font-bold text-[#0f172a] dark:text-white">{p.id} • Risk {p.riskScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Regulatory & Clinical Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {/* BOLD HERO DOCTOR LEGITIMACY & CREDENTIALS BANNER */}
          <div className="app-card p-6 bg-gradient-to-r from-[#181c2b] via-[#2f3549] to-[#8458B3] text-white rounded-2xl shadow-xl space-y-4 border border-[#8458B3]/40 relative overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
              {activeProvider.isRealDoctor ? (
                <ShieldCheck className="w-48 h-48 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-48 h-48 text-rose-500" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[11px] font-black uppercase font-mono px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${
                    activeProvider.isRealDoctor ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white animate-pulse'
                  }`}>
                    {activeProvider.isRealDoctor ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        STATE MEDICAL BOARD VERIFIED
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        GHOST FACILITY / FAILED INSPECTION
                      </>
                    )}
                  </span>
                  <span className="text-xs font-mono text-[#A0D2EB] font-bold bg-[#494D5F]/80 px-2.5 py-1 rounded-lg border border-[#A0D2EB]/40">
                    NPI: {activeProvider.npi}
                  </span>
                  <span className="text-xs font-mono text-[#D0BDF4] font-bold bg-[#494D5F]/80 px-2.5 py-1 rounded-lg border border-[#D0BDF4]/40">
                    ID: {activeProvider.id}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <Stethoscope className="w-6 h-6 text-[#A0D2EB]" />
                  {activeProvider.doctorName}
                </h3>

                <p className="text-xs text-[#E5EAF5]">
                  Billing Facility: <strong className="text-white">{activeProvider.name}</strong> • Specialty: <strong className="text-white">{activeProvider.specialty}</strong>
                </p>
              </div>

              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white text-xs font-black hover:opacity-95 shadow-lg transition-all shrink-0 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Dossier PDF</span>
              </button>
            </div>

            {/* 3 Detailed Regulatory Proof Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-700/80 text-xs font-mono relative z-10">
              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <FileBadge className="w-3.5 h-3.5 text-emerald-400" /> State Medical Board
                </span>
                <div className="text-xs font-bold text-emerald-400">{activeProvider.stateBoardStatus}</div>
                <div className="text-[10px] text-slate-300">License: {activeProvider.licenseId}</div>
              </div>

              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D0BDF4]" /> NPI & DEA Registry
                </span>
                <div className="text-xs font-bold text-[#D0BDF4]">{activeProvider.deaStatus}</div>
                <div className="text-[10px] text-slate-300">{activeProvider.npiType}</div>
              </div>

              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A0D2EB]" /> Physical Premises
                </span>
                <div className={`text-xs font-bold ${activeProvider.isRealDoctor ? 'text-emerald-300' : 'text-rose-400'}`}>
                  {activeProvider.isRealDoctor ? 'Verified Physical Office' : 'Failed On-Site Inspection'}
                </div>
                <div className="text-[10px] text-slate-300 truncate">{activeProvider.physicalPremises}</div>
              </div>
            </div>
          </div>

          {/* 4 Financial & Anomaly KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-[#e5eaf5] dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Total Claims Billed</span>
              <div className="text-xl font-black text-[#1e293b] dark:text-white mt-0.5">{activeProvider.totalClaims}</div>
              <span className="text-[10px] text-[#64748b]">Audited batch claims</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-[#e5eaf5] dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Insurance Payout</span>
              <div className="text-xl font-black text-[#10b981] mt-0.5">{activeProvider.totalPaid}</div>
              <span className="text-[10px] text-[#10b981] font-semibold">Total dollars paid</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-[#e5eaf5] dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">High-Cost Visit %</span>
              <div className="text-xl font-black text-[#e11d48] mt-0.5">
                {activeProvider.level5Share}%
              </div>
              <span className="text-[10px] text-[#64748b]">Peer baseline: {activeProvider.peerAvgLevel5}%</span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-[#e5eaf5] dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-mono text-[#64748b] uppercase font-bold">Extra Billed vs Peers</span>
              <div className="text-sm font-black text-[#e11d48] mt-0.5">{activeProvider.overpaymentGap}</div>
              <span className="text-[10px] text-rose-500 font-semibold">Recovery target</span>
            </div>
          </div>

          {/* Upcoding Visual Progress Comparison */}
          {activeProvider.level5Share > 0 && (
            <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1e293b] dark:text-white flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#8458B3]" />
                  High-Cost Visit Share vs 12 Normal Peer Doctors
                </span>
                <span className="font-mono text-[11px] font-bold text-[#e11d48]">
                  +{activeProvider.level5Share - activeProvider.peerAvgLevel5}% Higher Than Normal
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#1e293b] dark:text-white">{activeProvider.doctorName} (Target Provider)</span>
                    <span className="font-bold text-[#e11d48]">{activeProvider.level5Share}% High-Cost</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-500"
                      style={{ width: `${activeProvider.level5Share}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#64748b] dark:text-slate-400">Normal Specialty Peer Average (12 Neighboring Doctors)</span>
                    <span className="font-bold text-[#10b981]">{activeProvider.peerAvgLevel5}% Baseline</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                      style={{ width: `${activeProvider.peerAvgLevel5}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Peer Comparison & Sudden Jump Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#8458B3]">
                <TrendingUp className="w-4 h-4" /> Comparison with 12 Peer Doctors
              </div>
              <p className="text-[#494D5F] dark:text-slate-300 leading-relaxed font-medium">
                Matched against 12 honest doctors in the same specialty and city with equal patient sickness levels.
              </p>
              <div className="pt-2 border-t border-[#e5eaf5] dark:border-slate-800 text-[11px] space-y-1">
                <div>• Actual Paid / Visit: <strong className="text-[#1e293b] dark:text-white">{activeProvider.actualPaid}</strong></div>
                <div>• Expected Honest Cost / Visit: <strong className="text-[#10b981]">{activeProvider.twinExpectedPaid}</strong></div>
                <div className="text-[#e11d48] font-bold">• Extra Overpayment Difference: {activeProvider.overpaymentGap}</div>
              </div>
            </div>

            <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#f59e0b]">
                <Activity className="w-4 h-4" /> Timeline of Sudden Billing Spike
              </div>
              <p className="text-[#494D5F] dark:text-slate-300 leading-relaxed font-medium">
                Date of Sudden Billing Jump: <strong className="font-mono text-[#1e293b] dark:text-white">{activeProvider.changePointDate}</strong>
              </p>
              <p className="text-[11px] text-[#64748b] dark:text-slate-400 italic pt-1">
                "{activeProvider.changePointNote}"
              </p>
            </div>
          </div>

          {/* Parent Company & Connected Clinics */}
          <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2 text-xs shadow-sm">
            <div className="font-bold text-[#1e293b] dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Network className="w-4 h-4 text-[#8458B3]" />
                Parent Company & Connected Clinics:
              </span>
              <span className="font-mono text-[#8458B3] font-semibold">{activeProvider.owner}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeProvider.affiliations.map((aff, i) => (
                <span key={i} className="text-[11px] font-mono font-medium px-3 py-1 rounded-lg bg-[#f8fafc] dark:bg-slate-800 border border-[#e2e8f0] dark:border-slate-700 text-[#475569] dark:text-slate-300">
                  {aff}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
