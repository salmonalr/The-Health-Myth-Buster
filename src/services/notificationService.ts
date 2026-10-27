import { NotificationPreferences } from '../types/myth';
import { HEALTH_MYTHS } from '../data/mythsData';

const STORAGE_KEY = 'veritas_notification_prefs_v2';

// Synthesized subtle notification chime using Web Audio API
export function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: E5 (659 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2: B5 (987 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(987.77, now + 0.08);
    gain2.gain.setValueAtTime(0.09, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.38);
  } catch {
    // Audio context may require user interaction
  }
}

export function getStoredNotificationPreferences(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const browserPerm =
      typeof window !== 'undefined' && 'Notification' in window
        ? Notification.permission
        : 'default';

    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        // If app-level permission was granted, preserve it even inside sandbox
        permission: parsed.permission === 'granted' ? 'granted' : browserPerm,
      };
    }

    return {
      permission: browserPerm,
      dailyEnabled: browserPerm === 'granted',
      alertTime: '09:00',
    };
  } catch {
    return {
      permission: 'default',
      dailyEnabled: false,
      alertTime: '09:00',
    };
  }
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save notification preferences:', err);
  }
}

export async function requestNotificationPermission(): Promise<{
  permission: NotificationPermission;
  isIframeFallback: boolean;
}> {
  // If native Notification API is supported and not sandboxed, try it
  if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const current = getStoredNotificationPreferences();
        saveNotificationPreferences({
          ...current,
          permission: 'granted',
          dailyEnabled: true,
        });
        playNotificationChime();
        return { permission: 'granted', isIframeFallback: false };
      }
    } catch {
      // Sandboxed iframe blocked requestPermission
    }
  }

  // Graceful iframe permission grant: enable App-Level Alerts
  const current = getStoredNotificationPreferences();
  saveNotificationPreferences({
    ...current,
    permission: 'granted',
    dailyEnabled: true,
  });
  playNotificationChime();

  return { permission: 'granted', isIframeFallback: true };
}

export function triggerMythNotification(
  customTitle?: string,
  customBody?: string
): { success: boolean; fallback: boolean; message: string } {
  // Select a random myth for the notification
  const randomMyth = HEALTH_MYTHS[Math.floor(Math.random() * HEALTH_MYTHS.length)];
  const title = customTitle || `Veritas Health Myth Alert: ${randomMyth.title}`;
  const body =
    customBody ||
    `Verdict: ${randomMyth.verdict}. ${randomMyth.summary.slice(0, 120)}...`;

  playNotificationChime();

  // Attempt native notification first if supported
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'veritas-daily-myth',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Also dispatch in-app toast so user sees immediate feedback
      const event = new CustomEvent('veritas-toast-alert', {
        detail: { title, body, verdict: randomMyth.verdict },
      });
      window.dispatchEvent(event);

      return {
        success: true,
        fallback: false,
        message: 'Notification dispatched to your system and app feed!',
      };
    } catch (err) {
      console.warn('Native notification suppressed, displaying in-app toast', err);
    }
  }

  // Fallback in-app toast dispatch (always visible and reliable in iframe)
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('veritas-toast-alert', {
      detail: { title, body, verdict: randomMyth.verdict },
    });
    window.dispatchEvent(event);
  }

  return {
    success: true,
    fallback: true,
    message: 'Health Alert successfully delivered to your active feed!',
  };
}
