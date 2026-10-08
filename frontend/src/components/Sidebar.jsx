import React from 'react';
import { 
  LayoutDashboard, 
  Database,
  FileText,
  ShieldAlert, 
  ListFilter, 
  UserCheck, 
  Search,
  Network, 
  Scale, 
  Calendar as CalendarIcon, 
  Bot, 
  SunMoon, 
  ShieldCheck, 
  Lock,
  User 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isDark, toggleTheme, currentUser, onOpenLogin }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard (Overview)', icon: LayoutDashboard },
    { id: 'unified_brief', label: 'Case & Claim Brief', icon: FileText },
    { id: 'dataset_hub', label: 'Upload & Explore Claims', icon: Database },
    { id: 'fwa_alerts', label: 'Billing Red Flags & Alerts', icon: ShieldAlert },
    { id: 'queue', label: 'Priority Investigation List', icon: ListFilter },
    { id: 'provider_profile', label: 'Doctor & Clinic Check', icon: UserCheck },
    { id: 'claim_details', label: 'Single Claim Inspector', icon: Search },
    { id: 'network', label: 'Doctor Referral Network', icon: Network },
    { id: 'policy', label: 'Rules & Playbooks', icon: Scale },
    { id: 'calendar', label: 'Calendar & Deadlines', icon: CalendarIcon },
    { id: 'ai_assistant', label: 'AI Assistant & Helper', icon: Bot },
  ];

  return (
    <aside className="w-72 shrink-0 p-5 flex flex-col justify-between min-h-screen border-r border-[#e2e8f0] dark:border-slate-800 bg-[#ffffff] dark:bg-[#0b0f19] transition-colors overflow-y-auto">
      <div>
        {/* Brand Logo & Tagline */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8458B3] to-[#A0D2EB] flex items-center justify-center text-white font-black text-sm shadow-sm">
              CS
            </div>
            <div>
              <h1 className="text-base font-black text-[#1e293b] dark:text-white tracking-tight leading-none">
                ClaimShield <span className="text-[#8458B3]">Nexus</span>
              </h1>
              <p className="text-[10px] text-[#64748b] font-medium mt-0.5">Healthcare FWA Intelligence</p>
            </div>
          </div>

          <div className="mt-2">
            <span className="text-[9px] font-bold tracking-wider text-[#ea580c] dark:text-[#fb923c] font-mono uppercase bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
              <ShieldCheck className="w-3 h-3" /> SYNTHETIC BENCHMARK
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${
                  isActive
                    ? 'nav-active-pill'
                    : 'text-[#475569] dark:text-slate-300 hover:text-[#6366f1] hover:bg-[#f1f5f9] dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#64748b] dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info Credentials & Interactive Login Board Button */}
      <div className="pt-4 mt-4 border-t border-[#e2e8f0] dark:border-slate-800 space-y-3">
        {/* Clickable User Card -> Opens Login Board */}
        <div
          onClick={onOpenLogin}
          className="p-3 bg-[#f8fafc] dark:bg-slate-800/60 rounded-xl border border-[#e2e8f0] dark:border-slate-700/80 hover:border-[#6366f1] cursor-pointer transition-all flex items-center gap-2.5"
          title="Click to Switch Credentials / Log In"
        >
          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${currentUser.avatarColor || 'from-[#6366f1] to-[#ec4899]'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
            {currentUser.initials || 'KK'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-[#0f172a] dark:text-white truncate flex items-center justify-between">
              <span>{currentUser.name || 'Krish Kaalidass'}</span>
              <span className="text-[9px] text-[#6366f1] font-mono">Switch</span>
            </div>
            <div className="text-[10px] text-[#6366f1] font-semibold truncate">
              {currentUser.role || 'Lead SIU Investigator'}
            </div>
          </div>
        </div>

        {/* Security & Clearance Indicators */}
        <div className="px-1 text-[10px] text-[#64748b] space-y-1 font-mono">
          <div className="flex items-center justify-between">
            <span>Clearance:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentUser.clearance || 'Level 3'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Session:</span>
            <span className="text-[#6366f1] flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> 2FA Active • TLS-1.3
            </span>
          </div>
        </div>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[#e2e8f0] dark:border-slate-700 text-xs font-semibold text-[#64748b] dark:text-slate-400 hover:text-[#6366f1] hover:bg-[#f8fafc] dark:hover:bg-slate-800 transition-colors"
        >
          <SunMoon className="w-3.5 h-3.5" />
          <span>Toggle theme</span>
        </button>
      </div>
    </aside>
  );
}
