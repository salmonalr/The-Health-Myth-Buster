import React, { useEffect, useState } from 'react';
import { Bell, X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Verdict } from '../types/myth';

interface ToastData {
  id: number;
  title: string;
  body: string;
  verdict?: Verdict;
}

export const ToastNotification: React.FC = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; body: string; verdict?: Verdict }>;
      const newToast: ToastData = {
        id: Date.now(),
        title: customEvent.detail.title,
        body: customEvent.detail.body,
        verdict: customEvent.detail.verdict,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 6000);
    };

    window.addEventListener('veritas-toast-alert', handleToastEvent);
    return () => {
      window.removeEventListener('veritas-toast-alert', handleToastEvent);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto rounded-xl border border-teal-500/40 bg-[#0E131F]/95 p-4 text-slate-100 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 space-y-1.5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <Bell className="h-3.5 w-3.5" />
              <span>Daily Health Brief Alert</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <h4 className="text-xs font-bold text-white leading-snug">
            {toast.title}
          </h4>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {toast.body}
          </p>

          {toast.verdict && (
            <div className="pt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-teal-300">
                VERDICT: {toast.verdict}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
