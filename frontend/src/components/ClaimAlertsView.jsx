import React, { useState, useEffect } from 'react';
import { ShieldAlert, Filter, Search, ChevronDown, ChevronUp, Eye, CheckCircle2, AlertTriangle, Clock, Layers } from 'lucide-react';

export default function ClaimAlertsView({ onSelectProvider }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAlert, setExpandedAlert] = useState(null);

  const ruleChips = [
    { id: '', label: 'All 6 Behaviors' },
    { id: 'RULE_UPCODING', label: 'Upcoding (Level 5)' },
    { id: 'RULE_DUPLICATE_BILLING', label: 'Duplicate Billing' },
    { id: 'RULE_UNBUNDLING', label: 'Unbundling (Imaging)' },
    { id: 'RULE_IMPOSSIBLE_TIMING', label: 'Impossible Timing (>24h/Overlaps)' },
    { id: 'RULE_EXCESSIVE_UTILIZATION', label: 'Excessive Utilization' },
    { id: 'RULE_PHANTOM_SERVICES', label: 'Phantom DME' },
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
      setAlerts(data.alerts || []);
    } catch (e) {
      console.error('Error fetching alerts:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (a.provider_id && a.provider_id.toLowerCase().includes(term)) ||
      (a.member_id && a.member_id.toLowerCase().includes(term)) ||
      (a.rule_name && a.rule_name.toLowerCase().includes(term)) ||
      (a.claim_ids && a.claim_ids.some((c) => c.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" /> Claim-Level Rule Detectors
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic detection of 6 specific billing anomalies with field-level trigger evidence.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search provider, member, or claim ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg pl-9 pr-3 py-2 w-64 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
        </div>
      </div>

      {/* Behavior Chips */}
      <div className="flex flex-wrap gap-2">
        {ruleChips.map((chip) => {
          const isActive = selectedRule === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setSelectedRule(chip.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Alerts Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Behavior Rule</th>
                <th className="py-3 px-4">Provider ID</th>
                <th className="py-3 px-4">Member(s)</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Flagged Claims</th>
                <th className="py-3 px-4">Exposure ($)</th>
                <th className="py-3 px-4 text-right">Trigger Fields</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
                    Scanning claims dataset...
                  </td>
                </tr>
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No matching alerts found for current filter.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert, idx) => {
                  const isExpanded = expandedAlert === idx;
                  const sev = alert.severity;
                  const sevBadge =
                    sev === 'CRITICAL'
                      ? 'badge-critical'
                      : sev === 'HIGH'
                      ? 'badge-high'
                      : 'badge-medium';

                  return (
                    <React.Fragment key={idx}>
                      <tr className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          {alert.rule_name}
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{alert.rule_id}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-cyan-400">{alert.provider_id}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{alert.member_id}</td>
                        <td className="py-3 px-4">
                          <span className={`badge ${sevBadge}`}>{sev}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {alert.claim_ids ? alert.claim_ids.length : 1} claim(s)
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                          ${alert.flagged_dollars ? alert.flagged_dollars.toLocaleString() : '0.00'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setExpandedAlert(isExpanded ? null : idx)}
                            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                          >
                            {isExpanded ? 'Hide Fields' : 'Inspect'}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Trigger Fields Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80 border-t border-b border-slate-800">
                          <td colSpan="7" className="p-4">
                            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                                  Trigger Criteria & Audit Parameters
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  Sample Claim IDs: {(alert.claim_ids || []).slice(0, 5).join(', ')}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                {Object.entries(alert.trigger_fields || {}).map(([key, val]) => (
                                  <div key={key} className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                                    <span className="text-[10px] text-slate-400 uppercase font-mono">{key.replace(/_/g, ' ')}</span>
                                    <div className="text-xs font-bold font-mono text-cyan-300 mt-0.5">
                                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
