import React, { useState } from 'react';
import { ArrowRight, FileDown } from 'lucide-react';
import { generateSIUInvestigationPDF } from '../utils/pdfGenerator';

export default function SIUQueueExactView({ setActiveTab, onSelectCase }) {
  const [capacity, setCapacity] = useState(4);

  const queueRows = [
    { rank: 1, id: 'Ring-07', title: 'Ring-07', subtitle: '3 providers, shared owner', risk: '0.93', dollars: '$1.82M', members: 412, repeat: '61%', evidence: 'Strong', evidenceType: 'green' },
    { rank: 2, id: 'DME-112', title: 'DME-112', subtitle: 'Durable equipment spike', risk: '0.88', dollars: '$640K', members: 188, repeat: '55%', evidence: 'Strong', evidenceType: 'green' },
    { rank: 3, id: 'BH-054', title: 'BH-054', subtitle: 'Behavioral health, impossible timing', risk: '0.81', dollars: '$455K', members: 260, repeat: '50%', evidence: 'Strong', evidenceType: 'green' },
    { rank: 4, id: 'Lab-031', title: 'Lab-031', subtitle: 'Lab unbundling', risk: '0.76', dollars: '$210K', members: 97, repeat: '44%', evidence: 'Moderate', evidenceType: 'amber' },
    { rank: 5, id: 'HH-220', title: 'HH-220', subtitle: 'Home health utilization', risk: '0.59', dollars: '$120K', members: 63, repeat: '29%', evidence: 'Moderate', evidenceType: 'amber' },
    { rank: 6, id: 'Amb-009', title: 'Amb-009', subtitle: 'Ambulance, possible phantom trips', risk: '0.54', dollars: '$95K', members: 41, repeat: '32%', evidence: 'Weak: needs data', evidenceType: 'weak' },
  ];

  // Calculate uncovered dollars dynamically based on capacity
  const uncoveredDollars = queueRows.slice(capacity).reduce((acc, row) => {
    if (row.dollars.includes('M')) return acc + parseFloat(row.dollars.replace('$', '').replace('M', '')) * 1000;
    if (row.dollars.includes('K')) return acc + parseFloat(row.dollars.replace('$', '').replace('K', ''));
    return acc;
  }, 0);

  const handleDownloadRowPDF = (row, e) => {
    e.stopPropagation();
    generateSIUInvestigationPDF(row);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#1e1b2e] dark:text-white tracking-tight">Priority Investigation List</h2>
          <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">
            Ranked by risk level, dollars at risk, number of patients affected, and strength of evidence.
          </p>
        </div>

        <button
          onClick={() => generateSIUInvestigationPDF(queueRows[0])}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Top Case PDF</span>
        </button>
      </div>

      {/* Capacity Slider & Workload Card */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4 border border-[#DFE5F2] dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#1e1b2e] dark:text-white flex items-center gap-2">
            <span>Investigator Capacity (Cases My Team Can Review This Week):</span>
            <span className="font-mono text-sm px-2.5 py-0.5 rounded-lg bg-[#E5EAF5] dark:bg-[#8458B3]/30 text-[#8458B3] dark:text-[#D0BDF4] font-black">{capacity} Cases</span>
          </div>
          <div className="text-xs font-semibold text-[#475569] dark:text-slate-300">
            Uncovered Exposure: <span className="text-[#e11d48] font-bold font-mono">${uncoveredDollars}K</span>
          </div>
        </div>

        <div className="relative py-1">
          <input
            type="range"
            min="1"
            max="6"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#8458B3] bg-gradient-to-r from-[#8458B3] via-[#A0D2EB] to-slate-200 dark:to-slate-700"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#64748b] dark:text-slate-400 mt-1">
            <span>1 Case (High Priority Only)</span>
            <span>3 Cases (Standard SIU Shift)</span>
            <span>6 Cases (Full Team Audit)</span>
          </div>
        </div>
      </div>

      {/* Main Queue Table Card */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 overflow-hidden border border-[#DFE5F2] dark:border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f1f0f7] dark:border-slate-800 text-[11px] text-[#9ca3af] font-semibold">
                <th className="pb-3 px-3 w-8">#</th>
                <th className="pb-3 px-4">Case</th>
                <th className="pb-3 px-4">Risk</th>
                <th className="pb-3 px-4">$ at risk</th>
                <th className="pb-3 px-4">Members</th>
                <th className="pb-3 px-4">60d repeat</th>
                <th className="pb-3 px-4">Evidence</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f8fafc] dark:divide-slate-800/60 font-medium">
              {queueRows.map((row) => {
                const isWithinCapacity = row.rank <= capacity;

                return (
                  <tr
                    key={row.id}
                    className={`transition-colors ${
                      row.rank === 1
                        ? 'bg-[#f8f5fd] dark:bg-[#8458B3]/15'
                        : isWithinCapacity
                        ? 'hover:bg-[#f8f5fd] dark:hover:bg-slate-800/40'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-3 text-[#64748b] font-mono font-bold">
                      {row.rank}
                    </td>

                    {/* Case Title & Subtitle */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-[#1e1b2e] dark:text-white">
                        {row.title}
                      </div>
                      <div className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
                        {row.subtitle}
                      </div>
                    </td>

                    {/* Risk Badge */}
                    <td className="py-4 px-4 font-mono">
                      <span className={`${parseFloat(row.risk) >= 0.8 ? 'badge-pink-pill' : 'badge-amber-pill'}`}>
                        {row.risk}
                      </span>
                    </td>

                    {/* Dollars at risk */}
                    <td className="py-4 px-4 font-mono font-bold text-[#1e1b2e] dark:text-white">
                      {row.dollars}
                    </td>

                    {/* Members */}
                    <td className="py-4 px-4 font-mono text-[#64748b] dark:text-slate-300">
                      {row.members}
                    </td>

                    {/* 60d repeat */}
                    <td className="py-4 px-4 font-mono text-[#64748b] dark:text-slate-300">
                      {row.repeat}
                    </td>

                    {/* Evidence */}
                    <td className="py-4 px-4">
                      <span
                        className={`${
                          row.evidenceType === 'green'
                            ? 'badge-green-pill'
                            : row.evidenceType === 'amber'
                            ? 'badge-amber-pill'
                            : 'badge-weak-pill'
                        }`}
                      >
                        {row.evidence}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isWithinCapacity ? (
                          <>
                            <button
                              onClick={() => {
                                onSelectCase && onSelectCase(row);
                                setActiveTab('unified_brief');
                              }}
                              className="btn-brief-pill shadow-sm"
                            >
                              Brief
                            </button>
                            <button
                              onClick={(e) => handleDownloadRowPDF(row, e)}
                              className="p-1.5 rounded-lg border border-[#e2e8f0] dark:border-slate-700 text-[#9333ea] hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors"
                              title="Download PDF Dossier"
                            >
                              <FileDown className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button className="btn-beyond-pill cursor-default">
                            Beyond capacity
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
