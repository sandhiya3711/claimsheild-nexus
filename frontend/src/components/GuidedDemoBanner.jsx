import React from 'react';
import { Sparkles, ChevronRight, ChevronLeft, Check, Compass, Play } from 'lucide-react';

export const DEMO_STEPS = [
  {
    step: 1,
    tab: 'overview',
    title: '1. Ingestion & Alert Compression Funnel',
    script: 'We ingest 50,000 synthetic claims across 1,200 providers. Instead of overwhelming investigators with 4,000 raw flags, ClaimShield fuses signals to compress noise down to ~15 high-confidence cases.',
    actionNote: 'Notice the 267:1 alert-to-case compression ratio and 4 active detection engines.'
  },
  {
    step: 2,
    tab: 'alerts',
    title: '2. Claim-Level Behavior Detectors',
    script: 'The deterministic rules engine scans 6 distinct claim anomalies including duplicate billing, unbundling, ambulance impossible overlaps, and high-intensity upcoding.',
    actionNote: 'Filter by behavior chip or inspect the exact trigger fields that fired each alert.'
  },
  {
    step: 3,
    tab: 'queue',
    title: '3. Prioritized SIU Queue & Defenses Checked',
    script: 'The SIU Queue ranks cases transparently by Risk, Risk-Adjusted Dollars, Member Impact, Severity, and Multi-Method Evidence. Each row highlights which defenses have been ruled out.',
    actionNote: 'Note Case 1 at the top with $159k+ at stake and Eastgate Podiatry with Safe-Fail protection.'
  },
  {
    step: 4,
    tab: 'brief',
    title: '4. Evidence-Backed Investigation Brief',
    script: 'Case 1 includes an auto-generated brief with Peer Twin risk-adjusted overpayment ($210 vs $95 twin), innocent-explanation testing, and changepoint step detection.',
    actionNote: 'Check the 5 hypotheses: Sicker patients is RULED OUT because patient risk is normal (1.0).'
  },
  {
    step: 5,
    tab: 'network',
    title: '5. Network Graph & Phoenix Resolution',
    script: 'Graph analytics reveals a 5-provider ring sharing address 12 MG Road with a circular referral loop (P101->P102->P103). It also catches Phoenix clinic P090 reincarnated as P101.',
    actionNote: 'Crucially, tenant P104 (owned by OWN-78) is correctly excluded as an innocent neighbor.'
  },
  {
    step: 6,
    tab: 'forecast',
    title: '6. 30 / 60 / 90-Day Risk Forecast',
    script: 'Our calibrated HistGradientBoosting model forecasts future risk trajectories across 30, 60, and 90-day horizons with SHAP drivers, giving SIU managers strategic timing insight.',
    actionNote: 'Click between 30d, 60d, and 90d buttons to watch probability progression.'
  },
  {
    step: 7,
    tab: 'queue',
    title: '7. Dynamic Capacity Slider & Live Re-ranking',
    script: 'Investigators can drag the team capacity slider to simulate knapsack recovery yield or adjust priority formula weights with immediate live re-ranking.',
    actionNote: 'Drag the capacity slider to see how top cases capture 85%+ of exposed dollars.'
  },
  {
    step: 8,
    tab: 'responsible',
    title: '8. Responsible AI, Safe-Fail & Audit Trail',
    script: 'ClaimShield enforces ethical AI: 100% synthetic validation, zero automated denials, safe-fail protection on weak alerts, and an append-only SQLite audit trail for every human decision.',
    actionNote: 'View the live audit log and the auto-generated Model Card summary.'
  }
];

export default function GuidedDemoBanner({ currentStep, setCurrentStep, setActiveTab, onClose }) {
  const stepInfo = DEMO_STEPS[currentStep - 1] || DEMO_STEPS[0];

  const goToStep = (stepNum) => {
    if (stepNum >= 1 && stepNum <= DEMO_STEPS.length) {
      setCurrentStep(stepNum);
      setActiveTab(DEMO_STEPS[stepNum - 1].tab);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-indigo-500/30 px-6 py-3 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Step Info */}
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold font-mono text-sm shrink-0 mt-0.5">
            {currentStep}/8
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Guided Pitch Tour
              </span>
              <span className="text-slate-500">•</span>
              <h3 className="text-sm font-bold text-white">{stepInfo.title}</h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-3xl leading-relaxed">
              <strong className="text-cyan-300 font-semibold">Presenter Script:</strong> "{stepInfo.script}"
            </p>
            <p className="text-[11px] text-amber-300/90 font-mono mt-0.5">
              💡 {stepInfo.actionNote}
            </p>
          </div>
        </div>

        {/* Right: Step Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium disabled:opacity-40"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <div className="flex items-center gap-1">
            {DEMO_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => goToStep(s.step)}
                className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center transition-all ${
                  currentStep === s.step
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400/40 scale-110'
                    : currentStep > s.step
                    ? 'bg-indigo-600/40 text-indigo-300 border border-indigo-500/30'
                    : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                }`}
              >
                {currentStep > s.step ? <Check className="w-2.5 h-2.5" /> : s.step}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === DEMO_STEPS.length}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
