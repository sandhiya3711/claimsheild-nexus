import React, { useState } from 'react';
import { Lock, ShieldCheck, UserCheck, Key, LogIn, LogOut, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

export default function LoginBoard({ isOpen, onClose, currentUser, onLogin }) {
  if (!isOpen) return null;

  const personas = [
    {
      id: 'usr-01',
      name: 'Krish Kaalidass',
      role: 'Lead SIU Investigator',
      clearance: 'Level 3 (Senior Director)',
      department: 'Special Investigations Unit (SIU)',
      twoFactor: true,
      initials: 'KK',
      avatarColor: 'from-[#6366f1] to-[#ec4899]'
    },
    {
      id: 'usr-02',
      name: 'Dr. Sarah Lin, MD',
      role: 'Chief Medical Reviewer',
      clearance: 'Level 3 (Clinical Auditor)',
      department: 'Clinical Quality & Utilization Review',
      twoFactor: true,
      initials: 'SL',
      avatarColor: 'from-[#10b981] to-[#06b6d4]'
    },
    {
      id: 'usr-03',
      name: 'Marcus Vance, JD',
      role: 'Regulatory Compliance Counsel',
      clearance: 'Level 2 (Legal & Recovery)',
      department: 'Healthcare Fraud Enforcement Legal',
      twoFactor: true,
      initials: 'MV',
      avatarColor: 'from-[#f59e0b] to-[#ea580c]'
    }
  ];

  const [selectedPersona, setSelectedPersona] = useState(currentUser.id || 'usr-01');
  const [passcode, setPasscode] = useState('●●●●●●');

  const handleSelect = (p) => {
    setSelectedPersona(p.id);
    onLogin(p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-[#131b2e] border border-[#e2e8f0] dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9] dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0f172a] dark:text-white">SIU Security & Credential Board</h3>
              <p className="text-[11px] text-[#64748b]">Role-Based Access Control (RBAC) & Audit Certification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748b] hover:text-[#0f172a] dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Clearance Banner */}
        <div className="p-3 bg-[#f8fafc] dark:bg-slate-900/60 rounded-xl border border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" /> 2FA Active • TLS-1.3 Encrypted
          </span>
          <span className="text-[#64748b] font-semibold">HIPAA Synthetic Sandbox</span>
        </div>

        {/* Persona Switcher List */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
            Select Authenticated Investigator Persona:
          </span>

          {personas.map((p) => {
            const isSelected = selectedPersona === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-[#6366f1] bg-[#f5f3ff] dark:bg-indigo-950/30 shadow-sm'
                    : 'border-[#f1f5f9] dark:border-slate-800 hover:border-[#cbd5e1]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${p.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                    {p.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#0f172a] dark:text-white flex items-center gap-1.5">
                      <span>{p.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#6366f1]" />}
                    </div>
                    <div className="text-[11px] text-[#6366f1] font-semibold">{p.role}</div>
                    <div className="text-[10px] text-[#64748b]">{p.department}</div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 text-[#0f172a] dark:text-white font-bold block">
                    {p.clearance}
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-1">2FA Verified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 btn-primary-gradient text-xs font-bold flex items-center justify-center gap-2 shadow-md"
        >
          <UserCheck className="w-4 h-4" />
          <span>Confirm Active Session</span>
        </button>
      </div>
    </div>
  );
}
