import React, { useState } from 'react';
import { X, Bell, CheckCircle2, AlertCircle, ShieldAlert, Sparkles, Send } from 'lucide-react';
import {
  requestNotificationPermission,
  triggerMythNotification,
  getStoredNotificationPreferences,
  saveNotificationPreferences,
} from '../services/notificationService';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPermission: NotificationPermission;
  onPermissionChange: (perm: NotificationPermission) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  currentPermission,
  onPermissionChange,
}) => {
  const [prefs, setPrefs] = useState(() => getStoredNotificationPreferences());
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [requesting, setRequesting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    setRequesting(true);
    setDispatchStatus(null);
    try {
      const result = await requestNotificationPermission();
      onPermissionChange(result.permission);
      setPrefs(getStoredNotificationPreferences());

      if (result.permission === 'granted') {
        setDispatchStatus(
          result.isIframeFallback
            ? 'Daily Health Briefings Enabled! You will receive scheduled clinical alerts in your active feed.'
            : 'Permission granted! Native system notifications are now active.'
        );
      }
    } finally {
      setRequesting(false);
    }
  };

  const handleSendTestNotification = () => {
    const result = triggerMythNotification();
    setDispatchStatus(result.message);
  };

  const handleTimeChange = (time: string) => {
    const updated = { ...prefs, alertTime: time };
    setPrefs(updated);
    saveNotificationPreferences(updated);
  };

  const handleToggleDaily = () => {
    const updated = { ...prefs, dailyEnabled: !prefs.dailyEnabled };
    setPrefs(updated);
    saveNotificationPreferences(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-800 bg-[#0E131F] p-6 md:p-8 text-slate-100 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Daily Myth Buster Alerts</h3>
              <p className="text-xs text-slate-400">Browser Notification Permissions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700/60 p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Permission Status Pill */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              System Permission Status
            </span>
            {currentPermission === 'granted' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/40 px-2.5 py-1 rounded">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Active & Granted
              </span>
            ) : currentPermission === 'denied' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-rose-400 bg-rose-950/40 border border-rose-500/40 px-2.5 py-1 rounded">
                <ShieldAlert className="h-3.5 w-3.5" />
                Blocked by Browser
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400 bg-amber-950/40 border border-amber-500/40 px-2.5 py-1 rounded">
                <AlertCircle className="h-3.5 w-3.5" />
                Not Yet Prompted
              </span>
            )}
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Veritas dispatches exactly one clinically vetted health myth debrief every morning. We never send commercial promotions, third-party marketing, or clickbait.
          </p>

          {currentPermission !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              disabled={requesting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-teal-400 transition-colors shadow-sm disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {requesting
                  ? 'Requesting Browser Permission...'
                  : 'Allow Daily Myth-Busting Notifications'}
              </span>
            </button>
          )}
        </div>

        {/* Dispatch status feedback message */}
        {dispatchStatus && (
          <div className="rounded-lg border border-teal-500/30 bg-teal-950/20 p-3 text-xs text-teal-300 leading-relaxed">
            {dispatchStatus}
          </div>
        )}

        {/* Schedule Preferences */}
        <div className="space-y-4 border-t border-slate-800/80 pt-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Daily Scheduled Alert</span>
              <span className="text-slate-400 text-[11px]">Receive an evidence brief at your chosen hour</span>
            </div>
            <button
              onClick={handleToggleDaily}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                prefs.dailyEnabled ? 'bg-teal-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-slate-950 transition-transform ${
                  prefs.dailyEnabled ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-slate-400 block text-[11px] uppercase tracking-wider">
              Preferred Delivery Window
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Morning (8:00 AM)', value: '08:00' },
                { label: 'Midday (1:00 PM)', value: '13:00' },
                { label: 'Evening (7:00 PM)', value: '19:00' },
              ].map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => handleTimeChange(slot.value)}
                  className={`rounded-lg border p-2 text-center text-xs transition-colors ${
                    prefs.alertTime === slot.value
                      ? 'border-teal-500 bg-teal-950/30 text-teal-300 font-semibold'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Alert Dispatcher */}
        <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block text-xs">
                Test Notification Engine
              </span>
              <span className="text-[11px] text-slate-400">
                Dispatches a live sample myth to your desktop or device right now
              </span>
            </div>
            <button
              onClick={handleSendTestNotification}
              className="flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-500/20 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Sample Alert</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
