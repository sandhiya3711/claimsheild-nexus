import React, { useState } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, FileText, Search, AlertCircle, CheckCircle2, ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export default function CalendarView({ onSelectCase, setActiveTab }) {
  const [selectedDay, setSelectedDay] = useState(8);
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [inputDate, setInputDate] = useState('08-10-2026');

  // Daily events and Insurance Claim Deadlines map
  const dayEvents = {
    1: { 
      reports: 1, 
      queries: 0, 
      title: 'Initial Claims Ingestion & Statutory Cutoff Notice', 
      claimDeadline: 'Timely filing cutoff for Q2-2026 commercial payer claims.' 
    },
    2: { 
      reports: 2, 
      queries: 1, 
      title: 'Specialty Peer Normalizer Run (Internal Medicine & Pain z-scores)', 
      claimDeadline: 'EDI 837 batch transmission window closes 5:00 PM.' 
    },
    3: { 
      reports: 1, 
      queries: 0, 
      title: 'Decoy Baseline Cleared (Highland Family Health P201)', 
      claimDeadline: 'Standard 30-day prompt-pay adjudication milestone.' 
    },
    5: { 
      reports: 3, 
      queries: 0, 
      title: 'Deterministic Rules Flagged 12 Duplicate Lab Claims for P303', 
      claimDeadline: 'CRITICAL: Lab unbundling appeal window expires in 7 days.' 
    },
    6: { 
      reports: 0, 
      queries: 1, 
      title: 'SIU Query: Provider licensing verification for 12 MG Road', 
      claimDeadline: 'State medical board credential renewal audit deadline.' 
    },
    7: { 
      reports: 2, 
      queries: 0, 
      title: 'Ambulance Simultaneous Transport Flags Flagged for P304', 
      claimDeadline: 'Emergency transport Medicare Part B cutoff date.' 
    },
    8: { 
      reports: 2, 
      queries: 1, 
      title: 'Major Milestone: Coordinated Ring-07 & Phoenix Link Flagged',
      claimDeadline: 'URGENT INSURANCE CUTOFF: Mandatory clawback demand notice must be served by October 15, 2026 to prevent statutory claim expiration.',
      details: [
        { type: 'claim_deadline', time: '08:30 AM', title: 'Statutory Claim Filing Cutoff: Ring-07 claims billed in March 2026 must be audited before October 15.', severity: 'CRITICAL', caseId: 'Ring-07' },
        { type: 'report', time: '09:15 AM', title: 'Ring-07 Circular Referral Loop Flagged (P101 -> P102 -> P103 -> P101)', severity: 'CRITICAL', caseId: 'Ring-07' },
        { type: 'report', time: '11:30 AM', title: 'Phoenix Resolution Match Confirmed: P090 shuttered -> P101 enrolled (Score 0.88)', severity: 'HIGH', caseId: 'Ring-07' },
        { type: 'query', time: '02:45 PM', title: 'Investigator Lead: Issued internal desk audit request for OWN-77 ownership registry', author: 'Senior SIU Analyst' }
      ]
    },
    10: { 
      reports: 0, 
      queries: 2, 
      title: 'EDI 835 Remittance Logs Audit Query Initiated', 
      claimDeadline: 'Payer clearinghouse 835 electronic remittance reconciliation due.' 
    },
    11: { 
      reports: 3, 
      queries: 0, 
      title: 'DME-112 Unverified CPAP Distribution Flags Flagged for P301', 
      claimDeadline: 'DME supplier proof-of-delivery 45-day statutory response deadline.' 
    },
    12: { 
      reports: 0, 
      queries: 1, 
      title: 'Patient Morbidity Risk Index Recalculation Query Executed', 
      claimDeadline: 'Annual risk adjustment CMS HCC submission window.' 
    },
    13: { 
      reports: 2, 
      queries: 0, 
      title: 'Behavioral Health Psychotherapy Volume Spike for P307', 
      claimDeadline: 'Mental health parity documentation review filing.' 
    },
    15: { 
      reports: 1, 
      queries: 0, 
      title: 'Home Health Skilled Nursing G0300 Upcoding Alert for P306', 
      claimDeadline: 'STATUTORY DEADLINE: 180-day post-payment recovery notice cutoff for March claims.' 
    },
    17: { 
      reports: 3, 
      queries: 0, 
      title: 'Impossible Timing Spike: 38 Level-5 Visits in 1 Day on 2026-03-02', 
      claimDeadline: 'Provider dispute resolution hearing filing deadline.' 
    },
    20: { 
      reports: 2, 
      queries: 1, 
      title: 'Innocent Explanation Engine Disproved Sicker-Patient Defense', 
      claimDeadline: 'Quarterly SIU recovery reconciliation with state DOI.' 
    },
    25: { 
      reports: 1, 
      queries: 0, 
      title: 'HistGradientBoosting 60-Day Forecast Verified (0.89 Probability)', 
      claimDeadline: 'Upcoming fiscal quarter loss-prevention reserve allocation.' 
    },
    31: { 
      reports: 2, 
      queries: 0, 
      title: 'End-of-Month Synthetic Benchmark Integrity Seal Verified', 
      claimDeadline: 'Monthly claims reconciliation ledger lock.' 
    }
  };

  const calendarDays = [
    [null, null, null, null, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31],
  ];

  const currentEvent = dayEvents[selectedDay];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#0f172a] dark:text-white tracking-tight flex items-center gap-2">
            <CalIcon className="w-6 h-6 text-[#6366f1]" /> Calendar & Deadlines
          </h2>
          <p className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5">
            Track important insurance cutoff dates, filing deadlines, and daily audit milestones.
          </p>
        </div>

        {/* Date Input */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-sm">
          <input
            type="text"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="text-xs font-mono font-medium text-[#0f172a] dark:text-slate-200 bg-transparent focus:outline-none w-24"
          />
          <CalIcon className="w-4 h-4 text-[#6366f1]" />
        </div>
      </div>

      {/* Grid: Calendar View (Left) & Date Event Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Left Card */}
        <div className="lg:col-span-7 app-card p-6 bg-white dark:bg-slate-900">
          {/* Month Header with Prev / Next Buttons */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedDay(Math.max(1, selectedDay - 7))}
              className="px-4 py-1.5 rounded-xl border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#475569] dark:text-slate-300 hover:bg-[#f8fafc] dark:hover:bg-slate-800 transition-all"
            >
              Prev
            </button>

            <h3 className="text-base font-bold text-[#0f172a] dark:text-white">
              {currentMonth}
            </h3>

            <button
              onClick={() => setSelectedDay(Math.min(31, selectedDay + 7))}
              className="px-4 py-1.5 rounded-xl border border-[#e2e8f0] dark:border-slate-700 text-xs font-bold text-[#475569] dark:text-slate-300 hover:bg-[#f8fafc] dark:hover:bg-slate-800 transition-all"
            >
              Next
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center mb-3 text-xs font-bold text-[#64748b] dark:text-slate-400">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-2.5">
            {calendarDays.flat().map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-16" />;
              }

              const isSelected = selectedDay === day;
              const ev = dayEvents[day];
              const reportDots = ev ? Array(ev.reports).fill('report') : [];
              const queryDots = ev ? Array(ev.queries).fill('query') : [];
              const allDots = [...reportDots, ...queryDots];

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => {
                    setSelectedDay(day);
                    setInputDate(`${String(day).padStart(2, '0')}-10-2026`);
                  }}
                  className={`h-16 p-2 rounded-2xl flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-[#6366f1] bg-[#f5f3ff] dark:bg-indigo-950/40 shadow-md shadow-indigo-500/10 scale-105'
                      : 'border border-[#f1f5f9] dark:border-slate-800 hover:border-[#cbd5e1] hover:bg-[#faf5ff]'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-[#6366f1]' : 'text-[#334155] dark:text-slate-300'}`}>
                    {day}
                  </span>

                  {/* Dots indicator */}
                  <div className="flex items-center gap-1">
                    {allDots.slice(0, 3).map((dotType, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          dotType === 'report' ? 'bg-[#16a34a]' : 'bg-[#ea580c]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-[#f1f5f9] dark:border-slate-800 text-xs font-semibold text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16a34a]" /> FWA Report Flagged
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> SIU Audit Query
            </span>
          </div>
        </div>

        {/* Right Event & Insurance Claim Deadline Detail Panel */}
        <div className="lg:col-span-5 app-card p-6 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] dark:border-slate-800">
              <h3 className="text-sm font-bold text-[#0f172a] dark:text-white">
                October {selectedDay}, 2026
              </h3>
              <span className="text-xs font-mono text-[#6366f1] font-semibold">
                {currentEvent ? `${currentEvent.reports} Reports • ${currentEvent.queries} Queries` : 'No Activity'}
              </span>
            </div>

            {currentEvent ? (
              <div className="space-y-4 mt-4 animate-fadeIn">
                {/* Insurance Claim Deadline Callout Box */}
                <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                    <Clock className="w-4 h-4" /> Insurance Claim Deadline Alert:
                  </div>
                  <p className="text-xs text-[#0f172a] dark:text-slate-200 leading-relaxed font-medium">
                    {currentEvent.claimDeadline}
                  </p>
                </div>

                <div className="p-3.5 bg-[#f8fafc] dark:bg-slate-800/60 rounded-2xl border border-[#e2e8f0] dark:border-slate-700">
                  <div className="text-xs font-bold text-[#0f172a] dark:text-white">
                    {currentEvent.title}
                  </div>
                </div>

                {currentEvent.details && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] uppercase font-bold text-[#94a3b8] font-mono tracking-wider block">
                      Activity Logs for this Date:
                    </span>
                    {currentEvent.details.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-[#e2e8f0] dark:border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#0f172a] dark:text-slate-200">{item.time}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            item.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748b] dark:text-slate-400">{item.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-[#94a3b8] text-xs">
                Pick a date to see statutory insurance claim cutoffs and reports.
              </div>
            )}
          </div>

          {selectedDay === 8 && (
            <button
              onClick={() => setActiveTab('unified_brief')}
              className="w-full mt-6 py-3 btn-primary-gradient text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Open Case Investigation Brief</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
