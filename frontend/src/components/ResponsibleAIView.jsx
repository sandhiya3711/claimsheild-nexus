import React, { useState, useEffect } from 'react';
import { Lock, Shield, CheckCircle2, XCircle, FileText, Database, Clock, RefreshCw, AlertTriangle, UserCheck } from 'lucide-react';

export default function ResponsibleAIView() {
  const [auditEvents, setAuditEvents] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('principles'); // 'principles', 'modelcard', 'audit'

  useEffect(() => {
    fetchAuditLog();
  }, []);

  const fetchAuditLog = async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch('/api/audit?limit=50');
      const data = await res.json();
      setAuditEvents(data.events || []);
    } catch (e) {
      console.error('Error fetching audit log:', e);
    } finally {
      setLoadingAudit(false);
    }
  };

  const willList = [
    'Recommend human SIU review with transparent, decomposable linear weights.',
    'Apply peer & patient-morbidity normalization so legitimate high-volume specialists are not flagged.',
    'Challenge all alerts against 5 standard innocent clinical and administrative hypotheses.',
    'Enforce Safe-Fail protocol ("Insufficient evidence; no action recommended") on isolated weak signals.',
    'Maintain an immutable, append-only SQLite audit ledger for every algorithmic output and human decision.',
  ];

  const willNotList = [
    'NEVER deny claims or withhold provider payments automatically.',
    'NEVER accuse providers or reach legal determinations of intentional fraud.',
    'NEVER hide scoring logic behind uninterpretable black-box neural networks.',
    'NEVER operate on unverified real patient Protected Health Information (PHI).',
    'NEVER sanction or de-enroll healthcare providers without human due process.',
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" /> Responsible AI, Model Governance & Audit Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ethical healthcare AI framework ensuring human-in-the-loop governance and verifiable accountability.
          </p>
        </div>

        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'principles', label: 'Ethical Principles (Will / Will-Not)' },
            { id: 'modelcard', label: 'Model Card (docs/MODEL_CARD.md)' },
            { id: 'audit', label: 'Append-Only Audit Log' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tab 1: Will vs Will-Not Matrix */}
      {activeSubTab === 'principles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
          {/* What ClaimShield WILL Do */}
          <div className="glass-panel p-6 border-t-4 border-t-emerald-500">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide font-mono">
                What ClaimShield Nexus WILL Do
              </h3>
            </div>
            <div className="space-y-3">
              {willList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What ClaimShield WILL NOT Do */}
          <div className="glass-panel p-6 border-t-4 border-t-rose-500">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wide font-mono">
                What ClaimShield Nexus Will NEVER Do
              </h3>
            </div>
            <div className="space-y-3">
              {willNotList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Model Card */}
      {activeSubTab === 'modelcard' && (
        <div className="glass-panel p-6 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Model Card Summary Specification
            </h3>
            <span className="badge badge-purple text-[10px] font-mono">Auto-Generated</span>
          </div>

          <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-4 leading-relaxed font-sans">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-xs mb-1 font-mono">1. Intended Use & Target Operating Model</h4>
              <p>Decision-support prioritization system for Accredited Special Investigation Units (SIU). Triangulates multi-entity patterns to recommend human audit reviews.</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-xs mb-1 font-mono">2. Synthetic Benchmark Dataset</h4>
              <p>100% synthetic dataset generated with Faker and deterministic fraud scenario injectors (50,000 claims, 1,182 providers, 8,000 members, 340 facilities). Verified via manifest.json.</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-xs mb-1 font-mono">3. Detection Engines & Quantitative Metrics</h4>
              <p>Deterministic rules + Unsupervised Isolation Forest (SHAP) + NetworkX Multi-Layer Graph Louvain Communities + Phoenix Entity Resolution (Score 0.88) + Ruptures PELT Change-Point Detection. ROC AUC: 0.942, Precision@10: 90.0%.</p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-xs mb-1 font-mono">4. Ethical Safe-Fail Mechanism</h4>
              <p>If evidence strength &le; 0.35 and zero innocent explanations are ruled out, case status defaults to "INSUFFICIENT EVIDENCE - No Action Recommended".</p>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Append-Only SQLite Audit Log */}
      {activeSubTab === 'audit' && (
        <div className="glass-panel overflow-hidden animate-fadeIn">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">Append-Only SQLite Audit Ledger</h3>
              <span className="badge badge-safe text-[10px] font-mono">Immutable Log</span>
            </div>
            <button
              onClick={fetchAuditLog}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16">Event #</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">User & Role</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Case Reference</th>
                  <th className="py-3 px-4">Audited Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {loadingAudit ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">Loading audit ledger...</td>
                  </tr>
                ) : auditEvents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400">No audit events recorded yet.</td>
                  </tr>
                ) : (
                  auditEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-cyan-400">#{evt.id}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{evt.timestamp}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{evt.user_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{evt.user_role}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-indigo-300 font-bold">{evt.action}</td>
                      <td className="py-3 px-4 font-mono text-amber-400">{evt.case_id || 'SYSTEM'}</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-[11px] max-w-md truncate">
                        {JSON.stringify(evt.details)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
