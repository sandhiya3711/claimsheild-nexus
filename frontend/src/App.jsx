import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import IntroSplash from './components/IntroSplash';
import MissionControlView from './components/MissionControlView';
import UnifiedIntelligenceView from './components/UnifiedIntelligenceView';
import DatasetHubView from './components/DatasetHubView';
import FWAAlertsView from './components/FWAAlertsView';
import SIUQueueExactView from './components/SIUQueueExactView';
import ProviderProfileView from './components/ProviderProfileView';
import ClaimDetailsView from './components/ClaimDetailsView';
import InvestigationPolicyView from './components/InvestigationPolicyView';
import NetworkView from './components/NetworkView';
import CalendarView from './components/CalendarView';
import AIAssistantView from './components/AIAssistantView';
import LoginBoard from './components/LoginBoard';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedHorizon, setSelectedHorizon] = useState('60_day');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-01',
    name: 'Krish Kaalidass',
    role: 'Lead SIU Investigator',
    clearance: 'Level 3 (Senior Director)',
    department: 'Special Investigations Unit (SIU)',
    twoFactor: true,
    initials: 'KK',
    avatarColor: 'from-[#6366f1] to-[#ec4899]'
  });

  const [selectedCase, setSelectedCase] = useState({
    id: 'Ring-07',
    title: 'Ring-07 Coordinated Referral Ring & Upcoding',
    subtitle: '3 providers, shared owner',
    risk: '0.93',
    dollars: '$1.82M',
    members: 412,
    repeat: '61%',
    evidence: 'Strong'
  });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleFinishIntro = React.useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-[#EEF2F8] dark:bg-[#0d111d] text-[#0f172a] dark:text-slate-100 antialiased font-sans transition-colors duration-200 relative`}>
      {/* Intro Splash & Boot Transition */}
      {showIntro && <IntroSplash onFinish={handleFinishIntro} />}
      {/* Top Navigation Suite */}
      <TopHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        selectedHorizon={selectedHorizon}
        setSelectedHorizon={setSelectedHorizon}
        onOpenChat={() => setActiveTab('ai_assistant')}
      />

      {/* Main Full-Width Content View */}
      <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
        {activeTab === 'dashboard' && (
          <MissionControlView
            setActiveTab={setActiveTab}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        )}

        {activeTab === 'unified_brief' && (
          <UnifiedIntelligenceView
            setActiveTab={setActiveTab}
            selectedCase={selectedCase}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        )}

        {activeTab === 'dataset_hub' && (
          <DatasetHubView
            setActiveTab={setActiveTab}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        )}

        {activeTab === 'fwa_alerts' && (
          <FWAAlertsView
            setActiveTab={setActiveTab}
            onSelectProvider={() => setActiveTab('provider_profile')}
          />
        )}

        {activeTab === 'queue' && (
          <SIUQueueExactView
            setActiveTab={setActiveTab}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        )}

        {activeTab === 'provider_profile' && (
          <ProviderProfileView
            setActiveTab={setActiveTab}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        )}

        {activeTab === 'claim_details' && (
          <ClaimDetailsView
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'policy' && (
          <InvestigationPolicyView
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'network' && (
          <NetworkView
            selectedCase={selectedCase}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            setActiveTab={setActiveTab}
            onSelectCase={(c) => setSelectedCase(c)}
          />
        )}

        {activeTab === 'ai_assistant' && (
          <AIAssistantView
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Interactive Login & Credential Board Modal */}
      <LoginBoard
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={(p) => {
          setCurrentUser(p);
          setIsLoginOpen(false);
        }}
      />
    </div>
  );
}

