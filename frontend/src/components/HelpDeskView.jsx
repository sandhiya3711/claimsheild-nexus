import React, { useState } from 'react';
import { HelpCircle, BookOpen, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Cpu, Scale } from 'lucide-react';

export default function HelpDeskView() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does ClaimShield Nexus avoid false accusations and automatic claim denials?',
      a: 'ClaimShield Nexus operates strictly as human-in-the-loop decision support under a "Zero Automatic Denial" policy. Every output is framed as a prioritized recommendation for clinical desk audit or medical record requests, not an accusation. All flagged cases undergo testing by our 5-hypothesis Innocent Explanation Engine before ranking.'
    },
    {
      q: 'What is the Phoenix Entity Resolution engine?',
      a: 'The Phoenix engine identifies shuttered medical entities that reincarnate under new NPIs/billing IDs to evade audit clawbacks. It computes an 8-factor similarity score (incorporating shared beneficial owners, physical address coordinates, patient overlap, and 90%+ cosine similarity of CPT billing fingerprints) with a default alert threshold of 0.70.'
    },
    {
      q: 'How does the Peer Twin Counterfactual adjust for sicker patients?',
      a: 'Rather than comparing a physician to an aggregate specialty average, ClaimShield matches each provider against k=12 synthetic twins who practice in the same sub-specialty and geographic market with identical patient morbidity risk distributions. The overpayment gap is only calculated after adjusting for legitimate illness severity.'
    },
    {
      q: 'What triggers a Safe-Fail condition?',
      a: 'When an anomaly signal is weak (e.g. risk score < 0.60) and all five innocent clinical hypotheses (such as regional health surges, new clinic ramp-up, or high-acuity demographics) remain plausible, the Safe-Fail guardrail triggers INSUFFICIENT_EVIDENCE to prevent alert escalation and protect innocent providers.'
    },
    {
      q: 'How is the SIU queue optimized for capacity constraints?',
      a: 'The queue runs an exact 0/1 Knapsack optimization using our transparent multi-criteria formula (w_risk * Risk + w_dollars * $ + w_member * Members + w_severity * Severity + w_evidence * Evidence). Investigators can drag the capacity slider to see exact dollar coverage and backlog risk.'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-[#1e1b2e] dark:text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#9333ea]" /> SIU Help Desk & Governance Documentation
        </h2>
        <p className="text-xs text-[#6b7280] dark:text-slate-400 mt-0.5">
          Standard operating procedures, algorithmic specifications, and Responsible AI model card references.
        </p>
      </div>

      {/* 3 Core Architecture Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-[#9333ea]">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1e1b2e] dark:text-white">Triangulated Detection</h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
            Deterministic rules + Isolation Forest SHAP + NetworkX Louvain communities + PELT change-point detection.
          </p>
        </div>

        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-[#ec4899]">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1e1b2e] dark:text-white">Responsible AI & Safe-Fail</h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
            5 innocent explanations tested per case; safe-fail guardrail prevents false-positive escalation on weak signals.
          </p>
        </div>

        <div className="app-card p-5 bg-white dark:bg-slate-900 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-[#16a34a]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1e1b2e] dark:text-white">Transparent SIU Queue</h3>
          <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed">
            Calibrated 30/60/90-day HistGradientBoosting forecasts + 0/1 Knapsack investigator capacity optimization.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="app-card p-6 bg-white dark:bg-slate-900 space-y-4">
        <h3 className="text-sm font-bold text-[#1e1b2e] dark:text-white pb-3 border-b border-[#f1f0f7] dark:border-slate-800">
          Frequently Asked Questions & Methodological Details
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#e9e5f0] dark:border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 bg-[#fbf9fd] dark:bg-slate-800/40 hover:bg-[#faf5ff] transition-colors"
                >
                  <span className="text-xs font-bold text-[#1e1b2e] dark:text-slate-200">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#9333ea] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748b] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white dark:bg-slate-900 border-t border-[#f1f0f7] dark:border-slate-800 text-xs text-[#475569] dark:text-slate-300 leading-relaxed animate-fadeIn">
                    {faq.a}
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
