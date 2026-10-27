import { NotificationPreferences } from '../types/myth';
import { HEALTH_MYTHS } from '../data/mythsData';

const STORAGE_KEY = 'veritas_notification_prefs_v1';

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
        permission: browserPerm,
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

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported in this environment');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    const current = getStoredNotificationPreferences();
    saveNotificationPreferences({
      ...current,
      permission,
      dailyEnabled: permission === 'granted',
    });
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

export function triggerMythNotification(customTitle?: string, customBody?: string): { success: boolean; fallback: boolean; message: string } {
  // Select a random myth for the notification
  const randomMyth = HEALTH_MYTHS[Math.floor(Math.random() * HEALTH_MYTHS.length)];
  const title = customTitle || `Veritas Health Myth Alert: ${randomMyth.title}`;
  const body =
    customBody ||
    `Verdict: ${randomMyth.verdict}. ${randomMyth.summary.slice(0, 120)}...`;

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

      return {
        success: true,
        fallback: false,
        message: 'Browser notification dispatched directly to your device desktop/system tray!',
      };
    } catch (err) {
      console.warn('Browser notification failed, falling back to in-app toast', err);
    }
  }

  // Fallback toast dispatch
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('veritas-toast-alert', {
      detail: { title, body, verdict: randomMyth.verdict },
    });
    window.dispatchEvent(event);
  }

  return {
    success: true,
    fallback: true,
    message: 'Dispatched in-app toast alert (browser system notifications require permission).',
  };
}
