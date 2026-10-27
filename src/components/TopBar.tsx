import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';

interface TopBarProps {
  activeTab: 'repository' | 'scanner' | 'quiz' | 'methodology';
  onSelectTab: (tab: 'repository' | 'scanner' | 'quiz' | 'methodology') => void;
  onOpenNotifications: () => void;
  notificationPermission: NotificationPermission;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onOpenNotifications,
  notificationPermission,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand wordmark */}
        <button
          onClick={() => onSelectTab('repository')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400">
            <ShieldCheck className="h-4.5 w-4.5" />
          </div>
          <span>Veritas</span>
        </button>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('repository')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'repository'
                ? 'text-teal-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Myth Repository
          </button>
          <button
            onClick={() => onSelectTab('scanner')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'scanner'
                ? 'text-teal-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            AI Claim Scanner
          </button>
          <button
            onClick={() => onSelectTab('quiz')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'quiz'
                ? 'text-teal-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Truth Quiz
          </button>
          <button
            onClick={() => onSelectTab('methodology')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'methodology'
                ? 'text-teal-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Methodology
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNotifications}
            className="flex items-center gap-2 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-teal-500/20 active:scale-95"
          >
            <Bell className="h-3.5 w-3.5" />
            <span>
              {notificationPermission === 'granted'
                ? 'Alerts: Active'
                : 'Enable Daily Alerts'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile nav sub-bar for accessibility */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/60 px-4 py-2 text-xs text-slate-400">
        <button
          onClick={() => onSelectTab('repository')}
          className={`py-1 ${activeTab === 'repository' ? 'text-teal-400 font-medium' : ''}`}
        >
          Repository
        </button>
        <button
          onClick={() => onSelectTab('scanner')}
          className={`py-1 ${activeTab === 'scanner' ? 'text-teal-400 font-medium' : ''}`}
        >
          AI Scanner
        </button>
        <button
          onClick={() => onSelectTab('quiz')}
          className={`py-1 ${activeTab === 'quiz' ? 'text-teal-400 font-medium' : ''}`}
        >
          Quiz
        </button>
        <button
          onClick={() => onSelectTab('methodology')}
          className={`py-1 ${activeTab === 'methodology' ? 'text-teal-400 font-medium' : ''}`}
        >
          Evidence
        </button>
      </div>
    </header>
  );
};
