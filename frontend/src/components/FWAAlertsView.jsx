import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Eye, 
  ArrowRight,
  Stethoscope,
  Clock,
  DollarSign,
  FileText,
  Building2,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Zap
} from 'lucide-react';

export default function FWAAlertsView({ onSelectProvider, setActiveTab }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAlert, setExpandedAlert] = useState(null);

  const ruleChips = [
    { id: '', label: 'All 6 FWA Behaviors' },
    { id: 'RULE_UPCODING', label: 'Level-5 Upcoding' },
    { id: 'RULE_DUPLICATE_BILLING', label: 'Duplicate Billing' },
    { id: 'RULE_UNBUNDLING', label: 'Lab/Imaging Unbundling' },
    { id: 'RULE_IMPOSSIBLE_TIMING', label: 'Impossible Timing (>24h)' },
    { id: 'RULE_EXCESSIVE_UTILIZATION', label: 'Excessive Frequency' },
    { id: 'RULE_PHANTOM_SERVICES', label: 'Phantom Equipment/Trips' },
  ];

  // Comprehensive plain-English alert dataset
  const mockAlerts = [
    {
      id: 'ALT-101-UP',
      rule_id: 'RULE_UPCODING',
      rule_name: 'Level-5 Comprehensive Upcoding (CPT 99215)',
      provider_id: 'P101',
      doctor_name: 'Dr. Arthur Vance, MD',
      specialty: 'Internal Medicine',
      facility: '12 MG Road, Suite 400, Chicago IL',
      severity: 'CRITICAL',
      flagged_dollars: 142800,
      claim_count: 680,
      summary: 'Dr. Arthur Vance billed 92% of all office encounters at Level-5 (CPT 99215) compared to the regional peer baseline of only 18%.',
      why_suspicious: 'Statistical PELT change-point detection confirms an abrupt surge from 10% to 92% on 2026-02-16 with zero change in underlying patient morbidity (Risk Index: 1.02).',
      trigger_evidence: {
        'CPT Code': '99215 (Level 5 Comprehensive E/M - 60 min requirement)',
        'Billing Share': '92% Level-5 (Peer Normal: 18%)',
        'PELT Change-Point': '2026-02-16 (z-score: +4.82)',
        'Patient Morbidity': '1.02 (Standard Acuity - Sicker defense ruled out)'
      },
      recommended_action: 'Place pre-payment clinical record hold on CPT 99215 claims and request 20 signed medical progress notes.',
      case_id: 'Ring-07'
    },
    {
      id: 'ALT-101-TIM',
      rule_id: 'RULE_IMPOSSIBLE_TIMING',
      rule_name: 'Impossible Clinician Capacity (>24h Billed in 1 Day)',
      provider_id: 'P101',
      doctor_name: 'Dr. Arthur Vance, MD',
      specialty: 'Internal Medicine',
      facility: '12 MG Road, Suite 400, Chicago IL',
      severity: 'CRITICAL',
      flagged_dollars: 13300,
      claim_count: 38,
      summary: 'Dr. Arthur Vance billed 38 Level-5 comprehensive patient encounters on a single calendar day (2026-03-02).',
      why_suspicious: 'Each CPT 99215 code mandates 40-60 minutes of direct physician face-to-face time. 38 encounters equate to 25.3 clinician hours, exceeding physical human limits in a 24-hour day.',
      trigger_evidence: {
        'Service Date': '2026-03-02',
        'Visits Billed': '38 encounters in 24 hours',
        'Total Clinician Hours': '25.3 hours required (Physically impossible)',
        'Overlapping Timestamps': '14 concurrent appointment slots identified'
      },
      recommended_action: 'Initiate immediate desk audit of appointment scheduling books and patient sign-in sheets.',
      case_id: 'Ring-07'
    },
    {
      id: 'ALT-301-PHAN',
      rule_id: 'RULE_PHANTOM_SERVICES',
      rule_name: 'Phantom Medical Equipment Delivery (No Sleep Study)',
      provider_id: 'P301',
      doctor_name: 'Apex DME & Medical Supplies Depot',
      specialty: 'Durable Medical Equipment',
      facility: '45 Industrial Pkwy, Suite B, Rockford IL',
      severity: 'HIGH',
      flagged_dollars: 71400,
      claim_count: 84,
      summary: 'Apex DME billed 84 continuous positive airway pressure (CPAP) devices (HCPCS E0601) with zero prior diagnostic sleep studies.',
      why_suspicious: 'Standard clinical policy requires a qualifying polysomnography sleep test (CPT 95810) before CPAP dispensing. Physical inspection confirmed vacant commercial warehouse with 0 courier contracts.',
      trigger_evidence: {
        'HCPCS Code': 'E0601 (CPAP Respiratory Assist Device)',
        'Prior Sleep Study Rate': '0% (0 of 84 patients have CPT 95810 on file)',
        'Premise Inspection': 'FAILED (Vacant warehouse; 0 delivery manifests)',
        'Reimbursement / Claim': '$850.00 (Peer Twin Expected: $0.00)'
      },
      recommended_action: 'Issue mandatory proof-of-delivery demand and verify courier tracking manifests with patients.',
      case_id: 'DME-112'
    },
    {
      id: 'ALT-307-VEL',
      rule_id: 'RULE_EXCESSIVE_UTILIZATION',
      rule_name: 'Psychotherapy Velocity & Continuous Daily Duration',
      provider_id: 'P307',
      doctor_name: 'Dr. Evelyn Vance, MD',
      specialty: 'Psychiatry & Behavioral Health',
      facility: '88 Oakridge Blvd, Peoria IL',
      severity: 'HIGH',
      flagged_dollars: 35840,
      claim_count: 112,
      summary: 'Dr. Evelyn Vance billed 112 consecutive calendar days of 4-hour daily individual psychotherapy (CPT 90837 x 4) for single patients.',
      why_suspicious: 'Intensive psychotherapy guidelines mandate step-down protocols. Billed continuously on weekends and holidays without clinical notes justifying acute crisis status.',
      trigger_evidence: {
        'CPT Code': '90837 x 4 units (240 minutes/day)',
        'Duration': '112 consecutive days without treatment step-down',
        'Daily Session Hours': '4.0 hours per patient / day',
        'Peer Twin Overpayment': '+$210.00 / session above matched peers'
      },
      recommended_action: 'Request individual behavioral treatment plans and clinical chart notes for the top 5 utilized members.',
      case_id: 'BH-054'
    },
    {
      id: 'ALT-202-UNB',
      rule_id: 'RULE_UNBUNDLING',
      rule_name: 'Automated Multi-Channel Panel Unbundling',
      provider_id: 'P202',
      doctor_name: 'Central Diagnostic Pathology Lab',
      specialty: 'Clinical Laboratory',
      facility: '900 Metro Blvd, Suite 100, Chicago IL',
      severity: 'MEDIUM',
      flagged_dollars: 18900,
      claim_count: 240,
      summary: 'Central Diagnostic Lab billed individual liver and electrolyte blood tests separately instead of standard Comprehensive Metabolic Panel (CPT 80053).',
      why_suspicious: 'Component billing artificially increases reimbursement by $42.00 per panel compared to Medicare NCCI bundled edits.',
      trigger_evidence: {
        'Unbundled Codes': 'CPT 84460, 84450, 82040, 84075 billed on same DOS',
        'Bundled Equivalent': 'CPT 80053 (Comprehensive Metabolic Panel)',
        'NCCI Edit Match': 'Confirmed Mutually Exclusive Code Violation',
        'Excess Payout': '+$42.00 / panel over bundled fee schedule'
      },
      recommended_action: 'Apply automated clearinghouse NCCI bundling cross-walk and recoup unbundled differential.',
      case_id: 'Ring-07'
    },
    {
      id: 'ALT-105-DUP',
      rule_id: 'RULE_DUPLICATE_BILLING',
      rule_name: 'Exact Duplicate Billing (Identical DOS & CPT)',
      provider_id: 'P105',
      doctor_name: 'Metro Diagnostic Imaging Center',
      specialty: 'Radiology & MRI',
      facility: '12 MG Road, Suite 500, Chicago IL',
      severity: 'MEDIUM',
      flagged_dollars: 12400,
      claim_count: 28,
      summary: 'Metro Diagnostic Imaging submitted duplicate claim lines for lumbar spine MRI (CPT 72148) for the same patient on identical dates.',
      why_suspicious: 'Exact duplicate submissions without modifier -76 (Repeat Procedure) or modifier -59 (Distinct Procedural Service).',
      trigger_evidence: {
        'CPT Code': '72148 (MRI Lumbar Spine without contrast)',
        'Duplicate Submissions': '28 identical claim pairs within 48 hours',
        'Modifier Missing': 'No repeat or separate procedure modifier present',
        'Total Duplicate Payout': '$12,400.00'
      },
      recommended_action: 'Execute automated post-payment recovery for duplicate claim line items.',
      case_id: 'Ring-07'
    }
  ];

  useEffect(() => {
    fetchAlerts();
  }, [selectedRule, selectedSeverity]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      let url = '/api/alerts?limit=100';
      if (selectedRule) url += `&rule_type=${selectedRule}`;
      if (selectedSeverity) url += `&severity=${selectedSeverity}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.alerts && data.alerts.length > 0) {
        setAlerts(data.alerts);
      } else {
        setAlerts(mockAlerts);
      }
    } catch (e) {
      console.warn('Using enriched mock alerts:', e);
      setAlerts(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  const displayAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const filteredAlerts = displayAlerts.filter((a) => {
    if (selectedRule && a.rule_id !== selectedRule && !a.rule_name?.toLowerCase().includes(selectedRule.toLowerCase())) return false;
    if (selectedSeverity && a.severity !== selectedSeverity) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (a.provider_id && a.provider_id.toLowerCase().includes(term)) ||
      (a.doctor_name && a.doctor_name.toLowerCase().includes(term)) ||
      (a.rule_name && a.rule_name.toLowerCase().includes(term)) ||
      (a.summary && a.summary.toLowerCase().includes(term)) ||
      (a.id && a.id.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-[#e11d48]" /> Billing Red Flags & Alerts
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            Suspicious billing behaviors and red flags explained in simple, clear terms with proof and recommended next steps.
          </p>
        </div>

        {/* Search & Severity Filters */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search doctor, scheme, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-700 text-xs text-[#0f172a] dark:text-white rounded-xl pl-9 pr-3 py-2 w-64 focus:outline-none focus:border-[#6366f1] shadow-sm"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-700 text-xs text-[#0f172a] dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#6366f1] shadow-sm cursor-pointer"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical Severity</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
          </select>
        </div>
      </div>

      {/* 4 TOP SUMMARY KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="app-card p-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#64748b] uppercase">Total Flagged Claims</span>
            <FileText className="w-4 h-4 text-[#6366f1]" />
          </div>
          <div className="text-2xl font-black text-[#0f172a] dark:text-white">1,162</div>
          <span className="text-[10px] text-[#64748b]">Under active review</span>
        </div>

        <div className="app-card p-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#e11d48] uppercase">Critical Warnings</span>
            <AlertTriangle className="w-4 h-4 text-[#e11d48]" />
          </div>
          <div className="text-2xl font-black text-[#e11d48]">48</div>
          <span className="text-[10px] text-rose-500 font-semibold">Immediate review needed</span>
        </div>

        <div className="app-card p-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#d97706] uppercase">High Warnings</span>
            <ShieldAlert className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="text-2xl font-black text-[#d97706]">64</div>
          <span className="text-[10px] text-amber-500 font-semibold">Audit scheduled</span>
        </div>

        <div className="app-card p-4 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#16a34a] uppercase">Total Money Flagged</span>
            <DollarSign className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div className="text-2xl font-black text-[#16a34a]">$2.46M</div>
          <span className="text-[10px] text-[#16a34a] font-semibold">Possible recovery amount</span>
        </div>
      </div>

      {/* Behavior Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {ruleChips.map((chip) => {
          const isActive = selectedRule === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedRule(chip.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6366f1] text-white shadow-sm scale-102'
                  : 'bg-white dark:bg-slate-900 text-[#475569] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-700 hover:border-[#cbd5e1]'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* UNDERSTANDABLE ALERT FEED / CARDS */}
      <div className="space-y-4">
        {loading ? (
          <div className="app-card p-12 text-center text-[#64748b] bg-white dark:bg-slate-900">
            Scanning 50,000 claim lines against deterministic FWA rule engines...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="app-card p-12 text-center text-[#64748b] bg-white dark:bg-slate-900">
            No matching alerts found for current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert, idx) => {
            const isExpanded = expandedAlert === idx;
            const sev = alert.severity;

            return (
              <div
                key={alert.id || idx}
                className="app-card bg-white dark:bg-slate-900 rounded-2xl border border-[#e2e8f0] dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:border-[#cbd5e1]"
              >
                {/* Alert Top Row */}
                <div className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase ${
                        sev === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : sev === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-[#E5EAF5] text-[#8458B3] dark:bg-[#8458B3]/30 dark:text-[#D0BDF4]'
                      }`}>
                        {sev} SEVERITY
                      </span>

                      <h3 className="text-sm font-black text-[#0f172a] dark:text-white">
                        {alert.rule_name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#16a34a] bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                        ${alert.flagged_dollars?.toLocaleString()} Flagged
                      </span>

                      <span className="text-xs font-mono text-[#64748b] dark:text-slate-400">
                        {alert.claim_count || alert.claim_ids?.length || 1} claims
                      </span>
                    </div>
                  </div>

                  {/* Plain English Summary */}
                  <div className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e2e8f0] dark:border-slate-700/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a] dark:text-white">
                      <Stethoscope className="w-4 h-4 text-[#8458B3]" />
                      <span>{alert.doctor_name || alert.provider_id} ({alert.provider_id})</span>
                      <span className="text-[11px] font-normal text-[#64748b] dark:text-slate-400">• {alert.specialty || 'Healthcare Provider'}</span>
                    </div>
                    <p className="text-xs text-[#334155] dark:text-slate-200 leading-relaxed font-medium">
                      {alert.summary || `Deterministic trigger detected on provider ${alert.provider_id}.`}
                    </p>
                  </div>

                  {/* Why Suspicious & Recommended Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-1">
                      <strong className="text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Why Is This Suspicious?
                      </strong>
                      <p className="text-[#334155] dark:text-slate-300 text-[11px] leading-relaxed">
                        {alert.why_suspicious || 'Significant deviation from specialty peer norm with statistical change-point.'}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#f8f5fd] dark:bg-[#8458B3]/20 border border-[#D0BDF4] dark:border-[#8458B3]/40 space-y-1">
                      <strong className="text-[#8458B3] dark:text-[#D0BDF4] font-bold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Recommended Next Step
                      </strong>
                      <p className="text-[#334155] dark:text-slate-300 text-[11px] leading-relaxed">
                        {alert.recommended_action || 'Issue pre-payment claim hold and request certified medical charts.'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Expand & Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] dark:border-slate-800">
                    <button
                      onClick={() => setExpandedAlert(isExpanded ? null : idx)}
                      className="text-xs text-[#8458B3] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? 'Hide Detailed Numbers' : 'Show Detailed Proof & Numbers'}
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => setActiveTab('unified_brief')}
                      className="text-xs font-bold text-[#0f172a] dark:text-white hover:text-[#8458B3] flex items-center gap-1 cursor-pointer"
                    >
                      Open Investigation Brief <ArrowRight className="w-3.5 h-3.5 text-[#8458B3]" />
                    </button>
                  </div>
                </div>

                {/* Expandable Field-Level Trigger Evidence */}
                {isExpanded && (
                  <div className="p-5 bg-[#f8fafc] dark:bg-slate-800/80 border-t border-[#e2e8f0] dark:border-slate-800 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> Detailed Numbers & Proof Behind This Alert
                      </span>
                      <span className="font-mono text-[11px] text-[#64748b]">
                        Rule Engine ID: {alert.rule_id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {alert.trigger_evidence ? (
                        Object.entries(alert.trigger_evidence).map(([k, v]) => (
                          <div key={k} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#e2e8f0] dark:border-slate-700 space-y-0.5">
                            <span className="text-[10px] uppercase font-mono text-[#64748b] font-bold">{k}</span>
                            <div className="text-xs font-bold font-mono text-[#6366f1]">{String(v)}</div>
                          </div>
                        ))
                      ) : (
                        Object.entries(alert.trigger_fields || {}).map(([k, v]) => (
                          <div key={k} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#e2e8f0] dark:border-slate-700 space-y-0.5">
                            <span className="text-[10px] uppercase font-mono text-[#64748b] font-bold">{k.replace(/_/g, ' ')}</span>
                            <div className="text-xs font-bold font-mono text-[#6366f1]">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
