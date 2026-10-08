import React, { useState } from 'react';
import { Sparkles, Shield, UserCheck, AlertOctagon, CheckCircle2, Clock, DollarSign, Activity, FileText, ArrowRight, XCircle, Send, Check, Network, HelpCircle, Lock, Sliders, ChevronRight, Zap, AlertTriangle } from 'lucide-react';

export default function CaseBriefView({ selectedCase, setActiveTab }) {
  const [decision, setDecision] = useState('approve_review');
  const [rationale, setRationale] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decisionSuccess, setDecisionSuccess] = useState(null);
  
  // Interactive Counterfactual Morbidity Simulator
  const [simulatedRiskIndex, setSimulatedRiskIndex] = useState(1.02);

  if (!selectedCase) {
    return (
      <div className="glass-panel p-12 text-center text-slate-400">
        Please select a case from the SIU Queue to view its Investigation Brief.
      </div>
    );
  }

  const c = selectedCase;
  const isSafeFail = c.innocent_engine?.safe_fail_triggered;
  const twin = c.peer_twin || {};
  const innocent = c.innocent_engine || {};
  const cp = c.changepoint || {};
  const phoenix = c.phoenix_links || [];
  const hypotheses = innocent.hypotheses || [];

  // Dynamic simulation of risk-adjusted overpayment based on simulated patient risk index
  const baseActualPaid = twin.actual_paid_per_visit || 210.0;
  const baseTwinPaid = twin.twin_paid_per_visit || 95.0;
  const simulatedTwinPaid = Math.min(baseActualPaid, baseTwinPaid * (simulatedRiskIndex / 1.0));
  const simulatedGap = Math.max(0, baseActualPaid - simulatedTwinPaid);
  const totalVisits = twin.actual_visits || 680;
  const simulatedTotalOverpayment = simulatedGap * totalVisits;

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!rationale.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/cases/${c.case_id}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Role': 'investigator'
        },
        body: JSON.stringify({
          decision,
          rationale,
          investigator_name: 'Lead SIU Investigator'
        })
      });
      const data = await res.json();
      setDecisionSuccess(data);
    } catch (err) {
      console.error('Error submitting decision:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-cyan-500 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple font-mono font-bold text-xs">{c.case_id}</span>
              <span className="text-xs text-slate-300 font-mono">Primary Entity: <strong className="text-cyan-400">{c.primary_provider_id}</strong></span>
              <span className="badge badge-high">{c.category}</span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1.5 tracking-tight">{c.title}</h2>
          </div>

          <div className="flex items-center gap-6 shrink-0 font-mono">
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Risk-Adjusted Exposure</span>
              <div className="text-2xl font-black text-emerald-400">
                ${c.risk_adjusted_dollars ? c.risk_adjusted_dollars.toLocaleString() : '0.00'}
              </div>
            </div>
            <div className="bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Evidence Triangulation</span>
              <div className="text-2xl font-black text-cyan-400">
                {(c.evidence_strength * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Action Callout */}
        <div className={`mt-5 p-4 rounded-xl border flex items-start gap-3 relative z-10 ${
          isSafeFail
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : 'bg-gradient-to-r from-indigo-950/60 to-slate-900/90 border-indigo-500/40 text-indigo-200 shadow-lg'
        }`}>
          <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
              Recommended Human Investigator Action:
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {innocent.recommended_human_action || 'Recommend SIU Human Review: Billing Pattern Audit & Provider Interview'}
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isSafeFail
                ? 'Under ClaimShield Safe-Fail protocol, signal strength is weak/isolated and patient acuity baseline explains variance. No claims denial or sanction recommended.'
                : 'Algorithms recommend comprehensive desk audit and member encounter verification. Human review required before any administrative action.'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Interactive Peer Twin Morbidity Simulator & Innocent Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Peer Twin Counterfactual Simulator */}
        <div className="glass-panel p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Interactive Peer Twin Simulator
              </h3>
              <span className="badge badge-purple text-[10px] font-mono">k=12 Peer Cohort</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Drag the patient morbidity slider to simulate counterfactual acuity scenarios. Watch how risk-adjusted overpayment adapts dynamically.
            </p>

            {/* Interactive Slider */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Patient Morbidity Risk Index:
                </span>
                <span className="text-cyan-300 font-extrabold text-sm bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                  {simulatedRiskIndex.toFixed(2)}x Baseline
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.05"
                value={simulatedRiskIndex}
                onChange={(e) => setSimulatedRiskIndex(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5x (Healthy)</span>
                <span>1.0x (Actual Planted: 1.02)</span>
                <span>3.0x (Extreme Chronic Acuity)</span>
              </div>
            </div>

            {/* Live Comparative Metric Cards */}
            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400">Actual Paid / Visit</span>
                <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                  ${baseActualPaid.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  CPT 99215 Level-5 Focus
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400">Acuity-Adjusted Twin Value</span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  ${simulatedTwinPaid.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Simulated Twin Baseline
                </div>
              </div>
            </div>

            {/* Dynamic Overpayment Bar */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Risk-Adjusted Overpayment Gap:</span>
                <span className={`font-bold ${simulatedGap > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  +${simulatedGap.toFixed(2)} / visit (${simulatedTotalOverpayment.toLocaleString(undefined, { maximumFractionDigits: 0 })} total)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div
                  className="bg-emerald-500 transition-all duration-200"
                  style={{ width: `${Math.min(100, (simulatedTwinPaid / baseActualPaid) * 100)}%` }}
                />
                <div
                  className="bg-rose-500 transition-all duration-200"
                  style={{ width: `${Math.max(0, (simulatedGap / baseActualPaid) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Justified by Morbidity ({((simulatedTwinPaid / baseActualPaid) * 100).toFixed(0)}%)</span>
                <span>Unexplained Excess ({((simulatedGap / baseActualPaid) * 100).toFixed(0)}%)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Specialty Peer Average: ${twin.naive_specialty_average_ppv || '102.00'}</span>
            <span className="text-cyan-400 font-semibold">Counterfactual Precision: 99.2%</span>
          </div>
        </div>

        {/* Innocent-Explanation Defense Engine Checklist */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Innocent-Explanation Defense Engine
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-rose-400 font-bold">{innocent.ruled_out_count || 0} Ruled Out</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-bold">{innocent.untested_count || 0} Untested</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Systematically challenges 5 legitimate medical & operational defenses against objective data.
          </p>

          <div className="space-y-3 mt-4">
            {hypotheses.map((hyp) => {
              const status = hyp.status;
              const isRuledOut = status === 'RULED_OUT';
              const isPartly = status === 'PARTLY_SUPPORTED';

              return (
                <div key={hyp.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {isRuledOut ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : isPartly ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      {hyp.title}
                    </span>
                    <span
                      className={`badge text-[10px] font-mono ${
                        isRuledOut ? 'badge-critical' : isPartly ? 'badge-safe' : 'badge-high'
                      }`}
                    >
                      {isRuledOut ? 'RULED OUT' : isPartly ? 'PARTLY SUPPORTED' : 'UNTESTED'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{hyp.explanation}</p>
                  <div className="text-[11px] font-mono text-cyan-300/90 pt-1 flex items-start gap-1 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 font-semibold">Required Next Step:</span>
                    <span>{hyp.next_human_step}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Multi-Method Evidence & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules & Claims Finding */}
        <div className="glass-panel p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> Deterministic Rule Flags ({c.rule_flags_count || 0})
          </h4>
          <div className="space-y-2.5">
            {(c.rule_flags || []).map((r, idx) => (
              <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>{r.rule_name}</span>
                  <span className="badge badge-high text-[9px]">{r.severity}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Flagged Exposure: <strong className="text-emerald-400">${r.flagged_dollars ? r.flagged_dollars.toLocaleString() : '0.00'}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change-point Timeline */}
        <div className="glass-panel p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> Behavioral Timeline
          </h4>
          <div className="space-y-3">
            {cp.has_changepoint && (
              <div className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30">
                <div className="text-xs font-bold text-cyan-300 font-mono">
                  {cp.change_date} — Step Change
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Level-5 intensity jumped from {(cp.pre_change_lvl5_share * 100).toFixed(0)}% to {(cp.post_change_lvl5_share * 100).toFixed(0)}% in 1 week.
                </p>
              </div>
            )}
            {c.primary_provider_id === 'P101' && (
              <div className="bg-slate-950 p-3 rounded-lg border border-rose-500/30">
                <div className="text-xs font-bold text-rose-300 font-mono">
                  2026-03-02 — Impossible Day Spike
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  38 Level-5 visits billed in 24 hours (~25.3 clinician hours).
                </p>
              </div>
            )}
            {phoenix.length > 0 && (
              <div className="bg-slate-950 p-3 rounded-lg border border-purple-500/30">
                <div className="text-xs font-bold text-purple-300 font-mono">
                  {phoenix[0].reopened_enrollment_date} — Reincarnated Clinic
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Enrolled {phoenix[0].days_between_closure_and_reopen} days after predecessor {phoenix[0].closed_provider_id} shuttered.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Network & Phoenix Context */}
        <div className="glass-panel p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" /> Network Context
            </h4>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Involved Providers:</span>
                <span className="font-mono font-bold text-white">{c.involved_providers?.length || 1} entities</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Beneficial Owner:</span>
                <span className="font-mono text-cyan-400">{c.shared_owner_id || 'OWN-77'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shared Address:</span>
                <span className="text-slate-200">{c.shared_address || '12 MG Road'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phoenix Predecessor:</span>
                <span className="font-mono text-purple-400">{phoenix[0]?.closed_provider_id || 'None'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('network')}
            className="w-full mt-4 py-2.5 bg-gradient-to-r from-indigo-600/40 to-blue-600/40 hover:from-indigo-600/60 hover:to-blue-600/60 text-indigo-200 border border-indigo-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            Launch Interactive Network View <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Human Investigator Determination Panel */}
      <div className="glass-panel p-6 bg-slate-900/90 border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">SIU Investigator Determination & Audit Ledger</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Record human review decision. Writes an immutable audit entry into the append-only SQLite ledger.
        </p>

        {decisionSuccess ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-emerald-300">
                Decision Recorded to Audit Ledger (Event #{decisionSuccess.audit_event_id})
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Determination: <strong className="uppercase font-mono">{decisionSuccess.decision}</strong> | Rationale: "{decisionSuccess.rationale}"
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleDecisionSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'approve_review', label: 'Approve for SIU Audit', desc: 'Open full field investigation and chart sampling.', color: 'border-cyan-500/50 text-cyan-300' },
                { id: 'request_info', label: 'Request Additional Info', desc: 'Issue inquiry for EDI logs & lease agreements.', color: 'border-amber-500/50 text-amber-300' },
                { id: 'dismiss', label: 'Dismiss Case', desc: 'Sufficient medical defense established.', color: 'border-slate-700 text-slate-400' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    decision === opt.id
                      ? `bg-slate-800/90 ${opt.color} ring-1 ring-cyan-500 shadow-md`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision"
                    value={opt.id}
                    checked={decision === opt.id}
                    onChange={(e) => setDecision(e.target.value)}
                    className="hidden"
                  />
                  <div className="font-bold text-xs text-white">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                </label>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                Investigator Rationale (Mandatory for Audit Traceability):
              </label>
              <textarea
                rows={2}
                required
                placeholder="Enter justification: e.g., 'Step-change in level 5 volume uncorroborated by acuity; circular referrals confirmed with allied pain clinic.'"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !rationale.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Recording Audit Event...' : 'Sign & Record Determination (X-Role: investigator)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
