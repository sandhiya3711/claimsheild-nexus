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
  MessageSquare,
  Maximize2,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function TopHeader({ 
  activeTab, 
  setActiveTab, 
  isDark, 
  toggleTheme, 
  currentUser, 
  onOpenLogin,
  selectedHorizon, 
  setSelectedHorizon, 
  onOpenChat 
}) {
  const horizons = [
    { id: '30_day', label: '30 days' },
    { id: '60_day', label: '60 days' },
    { id: '90_day', label: '90 days' },
  ];

  const navModules = [
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
    <header className="sticky top-0 z-30 bg-[#EEF2F8]/95 dark:bg-[#0d111d]/95 backdrop-blur-md border-b border-[#DFE5F2] dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Utility & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-[#DFE5F2]/80 dark:border-slate-800/80">
        {/* Brand Logo & Platform Title */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8458B3] to-[#A0D2EB] flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
            CS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-[#1e293b] dark:text-white tracking-tight leading-none">
                ClaimShield <span className="text-[#8458B3]">Nexus</span>
              </h1>
              <span className="text-[9px] font-bold tracking-wider text-[#ea580c] dark:text-[#fb923c] font-mono uppercase bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> SYNTHETIC BENCHMARK
              </span>
            </div>
            <p className="text-[10px] text-[#64748b] font-medium mt-0.5">Healthcare FWA Intelligence & SIU Decision Support</p>
          </div>
        </div>

        {/* Right Tools & User Credentials */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* + Assistant Button */}
          <button
            onClick={() => setActiveTab('ai_assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D0BDF4] dark:border-slate-700 text-xs font-bold text-[#8458B3] dark:text-[#A0D2EB] hover:bg-[#E5EAF5] dark:hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#8458B3]" />
            <span>+ Assistant</span>
          </button>

          {/* Time Horizon Pills */}
          <div className="flex items-center bg-[#f1f0f7] dark:bg-slate-800/80 p-1 rounded-xl border border-[#e2e8f0] dark:border-slate-700">
            {horizons.map((h) => {
              const isActive = selectedHorizon === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHorizon(h.id)}
                  className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'horizon-active'
                      : 'text-[#64748b] dark:text-slate-400 hover:text-[#1e1b2e] dark:hover:text-white'
                  }`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="p-2 rounded-xl border border-[#e5eaf5] dark:border-slate-700 text-[#64748b] hover:bg-[#f8fafc] dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Fullscreen toggle"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-[#e5eaf5] dark:border-slate-700 text-[#64748b] hover:text-[#8458B3] hover:bg-[#f8fafc] dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Toggle Light/Dark Theme"
          >
            <SunMoon className="w-3.5 h-3.5" />
          </button>

          {/* User Profile Card (Click to open Login Board) */}
          <div
            onClick={onOpenLogin}
            className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#f8fafc] dark:bg-slate-800/80 rounded-xl border border-[#e5eaf5] dark:border-slate-700 hover:border-[#8458B3] cursor-pointer transition-all shadow-sm"
            title="Click to Switch User Credentials / Role"
          >
            <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${currentUser.avatarColor || 'from-[#6366f1] to-[#ec4899]'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
              {currentUser.initials || 'KK'}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#0f172a] dark:text-white leading-none">
                {currentUser.name || 'Krish Kaalidass'}
              </div>
              <div className="text-[9px] text-[#8458B3] font-semibold mt-0.5">
                {currentUser.role || 'Lead SIU Investigator'}
              </div>
            </div>
            <span className="text-[9px] font-mono text-[#8458B3] font-bold bg-[#E5EAF5] dark:bg-[#8458B3]/30 px-1.5 py-0.5 rounded ml-1">
              Switch
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Navigation Modules Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1.5 min-w-max">
          {navModules.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all duration-150 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#8458B3] to-[#6d3ea6] text-white shadow-md font-bold'
                    : 'text-[#475569] dark:text-slate-300 hover:text-[#8458B3] hover:bg-[#f1f5f9] dark:hover:bg-slate-800/70 font-semibold'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8458B3] dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
