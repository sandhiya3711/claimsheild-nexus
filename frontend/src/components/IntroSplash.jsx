import React, { useState, useEffect, useRef } from 'react';
import { Shield, Sparkles, CheckCircle2, Cpu, ArrowRight, Lock, Activity } from 'lucide-react';

export default function IntroSplash({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing ClaimShield Nexus Core...');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onFinishRef = useRef(onFinish);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const steps = [
      { at: 15, text: 'Scanning 50,000 healthcare claims across DuckDB...' },
      { at: 40, text: 'Calibrating 4 multi-engine detection modules...' },
      { at: 65, text: 'Cross-matching State Medical Board & NPI licenses...' },
      { at: 85, text: 'Computing k=12 peer twin counterfactual benchmarks...' },
      { at: 100, text: 'All detection engines synchronized • System ready' },
    ];

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              if (onFinishRef.current) onFinishRef.current();
            }, 500);
          }, 250);
          return 100;
        }

        const next = Math.min(100, prev + 5);
        const currentStep = steps.find((s) => next >= s.at && prev < s.at);
        if (currentStep) {
          setStatusText(currentStep.text);
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onFinishRef.current) onFinishRef.current();
    }, 200);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#0e121e] via-[#1a1f33] to-[#2b2244] text-white select-none transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radiant Glow Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8458B3]/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#A0D2EB]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Center Intro Card */}
      <div className="relative z-10 max-w-lg w-full px-6 text-center space-y-6 animate-fadeIn">
        {/* Animated Brand Emblem */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8458B3] via-[#D0BDF4] to-[#A0D2EB] p-0.5 shadow-2xl shadow-[#8458B3]/40">
          <div className="w-full h-full bg-[#121626] rounded-2xl flex items-center justify-center">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#A0D2EB] via-white to-[#D0BDF4]">
              CS
            </span>
          </div>
          {/* Subtle spinning glow ring */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#8458B3] to-[#A0D2EB] opacity-40 blur-sm animate-pulse" />
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            ClaimShield <span className="bg-gradient-to-r from-[#A0D2EB] via-[#D0BDF4] to-[#8458B3] bg-clip-text text-transparent">Nexus</span>
          </h1>
          <p className="text-xs text-[#E5EAF5] font-medium tracking-wide">
            Healthcare Fraud, Waste & Abuse Decision Support Suite
          </p>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="w-full bg-slate-800/80 rounded-full h-2.5 p-0.5 border border-slate-700/60 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8458B3] via-[#D0BDF4] to-[#A0D2EB] transition-all duration-100 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#D0BDF4]">
            <span className="truncate pr-2 font-medium">{statusText}</span>
            <span className="font-bold text-[#A0D2EB] shrink-0">{progress}%</span>
          </div>
        </div>

        {/* 3 Verified Indicators */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono text-[#E5EAF5]/80">
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
            <span>50,000 Claims</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-1.5">
            <Activity className="w-3 h-3 text-[#A0D2EB]" />
            <span>4 Engines</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-[#D0BDF4]" />
            <span>TLS-1.3 Secure</span>
          </div>
        </div>

        {/* Skip Intro Button */}
        <div className="pt-2">
          <button
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer font-medium"
          >
            Skip Intro & Jump to Dashboard ➔
          </button>
        </div>
      </div>
    </div>
  );
}
