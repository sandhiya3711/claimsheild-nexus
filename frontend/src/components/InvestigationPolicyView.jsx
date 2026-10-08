import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BookOpen, 
  Scale, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  FileText, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Network,
  Stethoscope,
  TrendingUp,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';

export default function InvestigationPolicyView({ setActiveTab }) {
  const [openSection, setOpenSection] = useState(0);

  const fwaSchemes = [
    {
      title: 'Scheme 1: Coordinated Circular Referral Ring & Upcoding',
      code: 'SCHEME-RING-07',
      severity: 'CRITICAL',
      icon: Network,
      color: 'from-rose-500 to-red-600',
      definition: 'A group of co-located or affiliated clinics rotate the same cohort of patients sequentially in a closed loop (e.g., Primary Care -> Rehab -> Pain Management -> Primary Care). Concurrently, the primary clinic abruptly surges Level-5 comprehensive visit billing to 90%+ without a change in patient acuity.',
      detectionEngines: 'Deterministic Upcoding Rule + PELT Change-Point (+4.82 z-score) + NetworkX Louvain Graph + Phoenix Match',
      redFlags: 'Circular referral cycles, >90% CPT 99215 billing, common beneficial ownership (OWN-77), overlapping patient rosters.',
      standardAction: 'Issue comprehensive desk audit for all entities sharing common beneficial ownership and request 20 chart progress notes.'
    },
    {
      title: 'Scheme 2: Phantom Medical Equipment Supply (Ghost Clinic)',
      code: 'SCHEME-DME-112',
      severity: 'HIGH',
      icon: ShieldAlert,
      color: 'from-amber-500 to-orange-600',
      definition: 'Durable Medical Equipment (DME) supplier bills for high-value respiratory or orthopedic items (e.g. CPAP machines E0601) with zero prior qualifying diagnostic sleep studies and zero courier delivery tracking receipts.',
      detectionEngines: 'Volume Anomaly Detector + Delivery Verification Cross-Match + Prior Sleep Study Rule',
      redFlags: '84 CPAP claims in 14 days, 0 diagnostic sleep tests (CPT 95810), vacant commercial warehouse on physical inspection.',
      standardAction: 'Issue mandatory proof-of-delivery records request and courier tracking manifest subpoena.'
    },
    {
      title: 'Scheme 3: Impossible Clinician Velocity & Daily Duration',
      code: 'SCHEME-VEL-054',
      severity: 'HIGH',
      icon: Activity,
      color: 'from-indigo-500 to-purple-600',
      definition: 'A solo clinician bills for more than 24 hours of face-to-face clinical care in a single calendar day (e.g., 38 Level-5 encounters in 24 hours or 112 consecutive days of 4-hour psychotherapy).',
      detectionEngines: 'Impossible Timing Detector + Velocity Threshold Rule (>24h in 1 day)',
      redFlags: '25.3 clinician hours billed on 2026-03-02, continuous weekend/holiday billing without clinical crisis notes.',
      standardAction: 'Request clinical appointment scheduling books, patient sign-in sheets, and individual treatment plans.'
    },
    {
      title: 'Scheme 4: Laboratory & Diagnostic Component Unbundling',
      code: 'SCHEME-LAB-031',
      severity: 'MEDIUM',
      icon: Layers,
      color: 'from-blue-500 to-cyan-600',
      definition: 'Diagnostic laboratory separates standard bundled multi-test panels (e.g. Comprehensive Metabolic Panel 80053) into individual component tests to artificially inflate fee-for-service reimbursement.',
      detectionEngines: 'NCCI Bundling Rule Engine + Modifier Audit',
      redFlags: 'Simultaneous billing of CPT 84460, 84450, 82040, 84075 on identical date of service without modifier -59.',
      standardAction: 'Apply automated clearinghouse NCCI bundling cross-walk and recoup unbundled differential ($42/panel).'
    },
    {
      title: 'Scheme 5: Emergency Transport & Vehicle Concurrency',
      code: 'SCHEME-AMB-009',
      severity: 'MEDIUM',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      definition: 'An ambulance or emergency transport company submits overlapping timestamps for emergency runs using a single registered transport vehicle.',
      detectionEngines: 'Timestamp Overlap Rule + Fleet Concurrency Cross-Check',
      redFlags: 'Concurrent emergency transport runs spanning identical GPS coordinates at conflicting timestamps.',
      standardAction: 'Request GPS dispatch CAD telemetry, vehicle run sheets, and hospital receiving logs.'
    },
    {
      title: 'Scheme 6: Phoenix Clinic Reincarnation & Asset Laundering',
      code: 'SCHEME-PHX-090',
      severity: 'CRITICAL',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
      definition: 'A clinic shuttered under active SIU audit or clawback demand abruptly re-enrolls as a new NPI entity at the same location, retaining the same patient roster and beneficial ownership.',
      detectionEngines: 'Entity Resolution Jaccard Patient Overlap + Lease/Address Match + Owner Registry',
      redFlags: '0.88 Phoenix Match between shuttered P090 (Harborview) and newly enrolled P101 with 28 overlapping patients.',
      standardAction: 'Link corporate predecessor liability, freeze pending disbursements, and refer to state licensing board.'
    }
  ];

  const innocentHypotheses = [
    { 
      num: '1', 
      title: 'Sicker Patient Population (High Clinical Acuity)', 
      desc: 'Evaluates the patient-level morbidity risk index. If morbidity index is normal (0.95 - 1.05), the hypothesis is disproven.',
      howTested: 'Cross-checks chronic disease registry and Hierarchical Condition Category (HCC) risk scores.',
      passCriteria: 'Morbidity Index > 1.40 indicates genuinely sicker patient population.'
    },
    { 
      num: '2', 
      title: 'Independent Shared Medical Plaza', 
      desc: 'Checks Secretary of State beneficial ownership filings and referral patterns. Disproven if entities share common beneficial owners.',
      howTested: 'Scans corporate registrar records (OWN-xx) and graph community connections.',
      passCriteria: 'Distinct beneficial owners with zero circular referral cycles.'
    },
    { 
      num: '3', 
      title: 'Organic Practice Growth Ramp-Up', 
      desc: 'Evaluates billing volume timelines via PELT change-point detection. Disproven if billing exhibits an unnatural step-change spike.',
      howTested: 'Runs PELT change-point algorithm to calculate statistical z-score jump.',
      passCriteria: 'Gradual linear slope over 6+ months without sudden vertical discontinuities.'
    },
    { 
      num: '4', 
      title: 'EDI / Clearinghouse Software Glitch', 
      desc: 'Verifies raw electronic 835 remittance batch transmission files before initiating formal clawback actions.',
      howTested: 'Audits clearinghouse translator logs for duplicated 837 transaction IDs.',
      passCriteria: 'Identified translator software defect with vendor remediation patch on file.'
    },
    { 
      num: '5', 
      title: 'Regional Epidemic or Specialty Surge', 
      desc: 'Compares the target provider against regional peer controls. Disproven if neighboring specialty peers show a flat baseline.',
      howTested: 'Matches provider against 12 specialty peer twins within 25 miles.',
      passCriteria: 'Regional peer group simultaneously exhibits equivalent volume increase.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
          <Scale className="w-6 h-6 text-[#6366f1]" /> Rules, Playbooks & Fraud Types
        </h2>
        <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
          Step-by-step investigation guidelines, 6 common billing trick types, and 5 innocent explanation checks.
        </p>
      </div>

      {/* 3 CORE STATUTORY POLICY PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="app-card p-5 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E5EAF5] dark:bg-[#8458B3]/25 flex items-center justify-center text-[#8458B3]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-[#0f172a] dark:text-white">No Automatic Denials (Human Review)</h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
            ClaimShield Nexus assists human investigators. No claim is automatically rejected; every flag must be reviewed by a certified human analyst.
          </p>
        </div>

        <div className="app-card p-5 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#16a34a]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-[#0f172a] dark:text-white">Protection for Innocent Doctors</h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
            Weak warning signals with valid medical reasons are automatically marked as INSUFFICIENT_EVIDENCE to protect honest doctors.
          </p>
        </div>

        <div className="app-card p-5 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-[#8458B3]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-black text-[#0f172a] dark:text-white">Permanent Audit History Record</h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
            Every risk calculation and investigator action is permanently recorded in a secure audit log for full transparency.
          </p>
        </div>
      </div>

      {/* THE 5 INNOCENT DEFENSE HYPOTHESES MATRIX */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4 shadow-sm border border-[#e2e8f0] dark:border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] dark:border-slate-800">
          <div>
            <h3 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#8458B3]" /> 5 Innocent Explanations We Check For Every Case
            </h3>
            <p className="text-[11px] text-[#64748b] dark:text-slate-400">
              ClaimShield Nexus systematically audits 5 innocent clinical explanations before any fraud flag is confirmed.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
            Fairness Guardrail
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {innocentHypotheses.map((h) => (
            <div key={h.num} className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#8458B3] bg-[#E5EAF5] dark:bg-[#8458B3]/30 px-2 py-0.5 rounded-md">
                  Hypothesis {h.num}
                </span>
                <span className="text-[10px] text-[#64748b] font-mono font-bold">Safe-Fail Test</span>
              </div>
              <div className="font-bold text-[#0f172a] dark:text-white text-xs">{h.title}</div>
              <p className="text-[11px] text-[#475569] dark:text-slate-300 leading-relaxed">{h.desc}</p>
              
              <div className="pt-2 border-t border-[#e2e8f0] dark:border-slate-700 space-y-1 text-[10px]">
                <div className="text-[#64748b] dark:text-slate-400">
                  <strong>How Tested:</strong> {h.howTested}
                </div>
                <div className="text-emerald-700 dark:text-emerald-300 font-semibold">
                  <strong>Pass Criteria:</strong> {h.passCriteria}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6 FWA SCHEME TAXONOMY ACCORDION */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4 shadow-sm border border-[#e2e8f0] dark:border-slate-800">
        <div className="pb-3 border-b border-[#f1f5f9] dark:border-slate-800">
          <h3 className="text-sm font-black text-[#0f172a] dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#e11d48]" /> 6 Common Suspicious Billing Schemes Explained
          </h3>
          <p className="text-[11px] text-[#64748b] dark:text-slate-400">
            Click any scheme to see how it works, what warning signs it triggers, and the recommended next step.
          </p>
        </div>

        <div className="space-y-3">
          {fwaSchemes.map((scheme, idx) => {
            const isOpen = openSection === idx;
            const IconComponent = scheme.icon;

            return (
              <div
                key={scheme.code}
                className="border border-[#e2e8f0] dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => setOpenSection(isOpen ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 bg-[#f8fafc] dark:bg-slate-800/40 hover:bg-[#f1f5f9] dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E5EAF5] dark:bg-[#8458B3]/30 flex items-center justify-center text-[#8458B3] shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                          scheme.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {scheme.severity}
                        </span>
                        <span className="text-xs font-mono text-[#64748b]">{scheme.code}</span>
                      </div>
                      <span className="text-xs font-black text-[#0f172a] dark:text-white block mt-0.5">{scheme.title}</span>
                    </div>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#6366f1] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748b] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 bg-white dark:bg-slate-900 border-t border-[#f1f5f9] dark:border-slate-800 space-y-4 text-xs leading-relaxed animate-fadeIn">
                    <div>
                      <strong className="text-[#0f172a] dark:text-white block mb-1 font-bold">
                        📌 What Is This Scheme? (Plain-English Definition)
                      </strong>
                      <p className="text-[#475569] dark:text-slate-300 font-medium">{scheme.definition}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                      <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700 space-y-1">
                        <strong className="text-[#6366f1] block font-bold">🔍 Detection Triangulation:</strong>
                        <p className="text-[11px] text-[#475569] dark:text-slate-300 font-mono">{scheme.detectionEngines}</p>
                      </div>

                      <div className="p-3.5 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800/40 space-y-1">
                        <strong className="text-rose-800 dark:text-rose-300 block font-bold">🚩 Concrete Red Flags:</strong>
                        <p className="text-[11px] text-[#475569] dark:text-slate-300">{scheme.redFlags}</p>
                      </div>

                      <div className="p-3.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                        <strong className="text-[#16a34a] dark:text-emerald-300 block font-bold">🛡️ Standard SIU Action:</strong>
                        <p className="text-[11px] text-[#475569] dark:text-slate-300">{scheme.standardAction}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
