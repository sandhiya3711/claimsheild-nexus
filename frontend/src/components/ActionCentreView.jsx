import React, { useState } from 'react';
import { CheckSquare, Clock, AlertTriangle, FileCheck, Send, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ActionCentreView({ setActiveTab }) {
  const [filter, setFilter] = useState('all');
  const [actionList, setActionList] = useState([
    {
      id: 'ACT-401',
      caseId: 'Ring-07',
      title: 'Request Medical Records & Itemized Invoices',
      target: 'Metro Internal Medicine (P101) & Metro Rehab (P102)',
      priority: 'CRITICAL',
      status: 'In Flight',
      dueDate: '2026-10-15',
      summary: 'Request 40 complete medical charts for Level-5 visits billed between 2026-02-16 and 2026-03-31.',
      category: 'Records Request'
    },
    {
      id: 'ACT-402',
      caseId: 'Ring-07',
      title: 'Issue Subpoena for Beneficial Ownership Filings',
      target: 'OWN-77 Holding Syndicate (12 MG Road)',
      priority: 'HIGH',
      status: 'Pending SIU Lead',
      dueDate: '2026-10-18',
      summary: 'Verify Secretary of State corporate registration documents for predecessor Harborview (P090) and successor P101.',
      category: 'Legal Review'
    },
    {
      id: 'ACT-403',
      caseId: 'DME-112',
      title: 'Proof of Delivery Verification for CPAP Devices',
      target: 'Apex DME Suppliers (P301)',
      priority: 'HIGH',
      status: 'Drafted',
      dueDate: '2026-10-20',
      summary: 'Cross-reference 84 CPAP billing codes (E0601) against courier tracking signatures and patient confirmations.',
      category: 'Records Request'
    },
    {
      id: 'ACT-404',
      caseId: 'BH-054',
      title: 'Desk Audit of Daily Psychotherapy Velocity',
      target: 'Dr. Evelyn Vance (P307)',
      priority: 'MEDIUM',
      status: 'Under Review',
      dueDate: '2026-10-22',
      summary: 'Audit 112 consecutive days of 4-hour daily individual psychotherapy for sole practitioner.',
      category: 'Desk Audit'
    },
    {
      id: 'ACT-405',
      caseId: 'P203',
      title: 'Safe-Fail Dismissal Log Entry',
      target: 'Eastgate Podiatry (P203)',
      priority: 'LOW',
      status: 'Dismissed',
      dueDate: '2026-10-08',
      summary: 'Safe-fail guardrail confirmed insufficient evidence under innocent explanations test. Closed with no action.',
      category: 'Safe-Fail'
    }
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setActionList((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status: newStatus } : act))
    );
  };

  const filteredActions = actionList.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return a.status === 'Drafted' || a.status === 'Pending SIU Lead';
    if (filter === 'inflight') return a.status === 'In Flight' || a.status === 'Under Review';
    if (filter === 'closed') return a.status === 'Completed' || a.status === 'Dismissed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#1e1b2e] dark:text-white tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-[#9333ea]" /> Action Centre & SIU Workflow
        </h2>
        <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">
          Execute, track, and manage desk audits, medical records demands, and regulatory subpoenas.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="app-card p-4 bg-white dark:bg-slate-900">
          <div className="text-2xl font-black text-[#1e1b2e] dark:text-white">{actionList.length}</div>
          <div className="text-xs text-[#64748b] dark:text-slate-400">Total Action Items</div>
        </div>
        <div className="app-card p-4 bg-white dark:bg-slate-900">
          <div className="text-2xl font-black text-[#e11d48]">2</div>
          <div className="text-xs text-[#64748b] dark:text-slate-400">Critical & High Priority</div>
        </div>
        <div className="app-card p-4 bg-white dark:bg-slate-900">
          <div className="text-2xl font-black text-[#3b82f6]">2</div>
          <div className="text-xs text-[#64748b] dark:text-slate-400">Active In Flight</div>
        </div>
        <div className="app-card p-4 bg-white dark:bg-slate-900">
          <div className="text-2xl font-black text-[#16a34a]">1</div>
          <div className="text-xs text-[#64748b] dark:text-slate-400">Safe-Fail Dismissed</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['all', 'pending', 'inflight', 'closed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === f
                ? 'bg-[#9333ea] text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-[#64748b] dark:text-slate-300 border border-[#e2e8f0] dark:border-slate-800'
            }`}
          >
            {f === 'all' ? 'All Actions' : f === 'inflight' ? 'In Flight' : f}
          </button>
        ))}
      </div>

      {/* Action List Items */}
      <div className="space-y-3.5">
        {filteredActions.map((item) => (
          <div
            key={item.id}
            className="app-card p-5 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-[#9333ea]">{item.id}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  item.priority === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-700'
                    : item.priority === 'HIGH'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {item.priority}
                </span>
                <span className="text-xs font-bold text-[#1e1b2e] dark:text-white">{item.title}</span>
              </div>

              <div className="text-xs text-[#475569] dark:text-slate-300">
                <strong>Target:</strong> {item.target} · <span className="text-[#64748b]">Due {item.dueDate}</span>
              </div>

              <p className="text-xs text-[#64748b] dark:text-slate-400">
                {item.summary}
              </p>
            </div>

            {/* Action Buttons & Status */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                item.status === 'In Flight'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  : item.status === 'Pending SIU Lead'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                  : item.status === 'Dismissed'
                  ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
              }`}>
                {item.status}
              </span>

              {item.status !== 'Dismissed' && item.status !== 'Completed' && (
                <button
                  onClick={() => handleUpdateStatus(item.id, 'Completed')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Mark Done
                </button>
              )}

              <button
                onClick={() => setActiveTab('brief')}
                className="p-1.5 text-[#9333ea] hover:bg-purple-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="View Case Brief"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
