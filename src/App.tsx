import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { HeroSection } from './components/HeroSection';
import { MythExplorer } from './components/MythExplorer';
import { AiScanner } from './components/AiScanner';
import { TruthQuiz } from './components/TruthQuiz';
import { MythModal } from './components/MythModal';
import { NotificationModal } from './components/NotificationModal';
import { MethodologyModal } from './components/MethodologyModal';
import { ToastNotification } from './components/ToastNotification';
import { HEALTH_MYTHS } from './data/mythsData';
import { HealthMyth } from './types/myth';
import { getStoredNotificationPreferences } from './services/notificationService';
import { ShieldCheck, BookOpen, Sparkles, BrainCircuit } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'repository' | 'scanner' | 'quiz' | 'methodology'>('repository');
  const [selectedMyth, setSelectedMyth] = useState<HealthMyth | null>(null);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState<boolean>(false);
  const [scannerInitialClaim, setScannerInitialClaim] = useState<string>('');

  // Notification permission state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
    return getStoredNotificationPreferences().permission;
  });

  // Bookmarks saved in localStorage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('veritas_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('veritas_bookmarks', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleNavigateToScanner = (suggestedClaim?: string) => {
    if (suggestedClaim) {
      setScannerInitialClaim(suggestedClaim);
    }
    setActiveTab('scanner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuiz = () => {
    setActiveTab('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync browser notification permission state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar with Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'methodology') {
            setIsMethodologyModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        notificationPermission={notificationPermission}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'repository' && (
          <>
            <HeroSection
              onExplore={() => {
                const el = document.getElementById('repository-catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenScanner={() => handleNavigateToScanner()}
              onOpenQuiz={handleOpenQuiz}
            />

            <div id="repository-catalog" className="scroll-mt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Verified Health & Biomedical Myth Repository
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Comprehensive clinical dossiers cross-referenced against Cochrane, NEJM, Lancet, and JAMA studies.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigateToScanner()}
                    className="flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3.5 py-2 text-xs font-medium text-teal-300 hover:bg-teal-500/20 transition-colors"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Scan Custom Claim with AI</span>
                  </button>
                </div>
              </div>

              <MythExplorer
                myths={HEALTH_MYTHS}
                onSelectMyth={(myth) => setSelectedMyth(myth)}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
                onNavigateToScanner={handleNavigateToScanner}
              />
            </div>
          </>
        )}

        {activeTab === 'scanner' && (
          <div className="py-4">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('repository')}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Myth Repository
              </button>
            </div>
            <AiScanner initialClaim={scannerInitialClaim} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="py-4">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('repository')}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Myth Repository
              </button>
            </div>
            <TruthQuiz />
          </div>
        )}
      </main>

      {/* Modals & Dialogs */}
      <MythModal
        myth={selectedMyth}
        onClose={() => setSelectedMyth(null)}
        isBookmarked={selectedMyth ? bookmarks.includes(selectedMyth.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        currentPermission={notificationPermission}
        onPermissionChange={(perm) => setNotificationPermission(perm)}
      />

      <MethodologyModal
        isOpen={isMethodologyModalOpen}
        onClose={() => setIsMethodologyModalOpen(false)}
      />

      {/* Floating In-App Toast for Dispatched Alerts */}
      <ToastNotification />

      {/* Quiet Clinical Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#080B11] py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span className="font-semibold text-slate-300">Veritas Evidence Engine</span>
            <span aria-hidden="true">·</span>
            <span>Biomedical Myth Debunker & AI Claim Adjudication</span>
          </div>

          <div className="flex items-center gap-5 text-slate-400">
            <button
              onClick={() => setIsMethodologyModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Evidence Hierarchy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Notification Settings
            </button>
            <span aria-hidden="true">·</span>
            <span>Educational Use Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
