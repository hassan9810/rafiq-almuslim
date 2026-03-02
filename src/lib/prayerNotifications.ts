import { calculatePrayerTimes, formatTime, type PrayerTime } from './prayerTimes';
import { getAdhanSource } from '@/data/adhanSources';

const NOTIF_STORAGE_KEY = 'rafiq-prayer-notifications';
const NOTIFIED_KEY = 'rafiq-notified-prayers';
const ADHAN_PLAYED_KEY = 'rafiq-adhan-played';

// ── Adhan audio ────────────────────────────────────────────────────────────
let currentAdhanAudio: HTMLAudioElement | null = null;

export function stopAdhan() {
  if (currentAdhanAudio) {
    currentAdhanAudio.pause();
    currentAdhanAudio.currentTime = 0;
    currentAdhanAudio = null;
  }
}

export function pauseAdhan() {
  if (currentAdhanAudio && !currentAdhanAudio.paused) {
    currentAdhanAudio.pause();
  }
}

export function resumeAdhan() {
  if (currentAdhanAudio && currentAdhanAudio.paused) {
    currentAdhanAudio.play().catch(e => console.error('Adhan resume error:', e));
  }
}

export function isAdhanPlaying(): boolean {
  return !!currentAdhanAudio && !currentAdhanAudio.paused;
}

export function isAdhanPaused(): boolean {
  return !!currentAdhanAudio && currentAdhanAudio.paused;
}

export function playAdhan(audioUrl: string) {
  stopAdhan();
  try {
    currentAdhanAudio = new Audio(audioUrl);
    currentAdhanAudio.play().catch(e => console.error('Adhan play error:', e));
    currentAdhanAudio.onended = () => { currentAdhanAudio = null; };
  } catch (e) {
    console.error('Failed to create adhan audio:', e);
  }
}

export function previewAdhan(muezzinId: string) {
  const source = getAdhanSource(muezzinId);
  playAdhan(source.audioUrl);
}

function wasAdhanPlayed(prayer: string): boolean {
  try {
    const today = new Date().toISOString().split('T')[0];
    const played: string[] = JSON.parse(localStorage.getItem(ADHAN_PLAYED_KEY) || '[]');
    return played.includes(`${prayer}-${today}`);
  } catch { return false; }
}

function markAdhanPlayed(prayer: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const played: string[] = JSON.parse(localStorage.getItem(ADHAN_PLAYED_KEY) || '[]');
    const key = `${prayer}-${today}`;
    if (!played.includes(key)) {
      const todayEntries = played.filter(k => k.endsWith(today));
      todayEntries.push(key);
      localStorage.setItem(ADHAN_PLAYED_KEY, JSON.stringify(todayEntries));
    }
  } catch { /* ignore */ }
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function getNotificationPermission(): NotificationPermission | null {
  if (!isNotificationSupported()) return null;
  return Notification.permission;
}

export function isNotificationsEnabled(): boolean {
  try {
    return localStorage.getItem(NOTIF_STORAGE_KEY) === 'true';
  } catch { return false; }
}

export function setNotificationsEnabled(enabled: boolean) {
  localStorage.setItem(NOTIF_STORAGE_KEY, enabled ? 'true' : 'false');
}

function getNotifiedKey(prayer: string, date: string): string {
  return `${prayer}-${date}`;
}

function wasNotified(prayer: string): boolean {
  try {
    const today = new Date().toISOString().split('T')[0];
    const notified: string[] = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]');
    return notified.includes(getNotifiedKey(prayer, today));
  } catch { return false; }
}

function markNotified(prayer: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const notified: string[] = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]');
    const key = getNotifiedKey(prayer, today);
    if (!notified.includes(key)) {
      // Keep only today's entries
      const todayEntries = notified.filter(k => k.endsWith(today));
      todayEntries.push(key);
      localStorage.setItem(NOTIFIED_KEY, JSON.stringify(todayEntries));
    }
  } catch { /* ignore */ }
}

const prayerNameAr: Record<string, string> = {
  Fajr: 'الفجر',
  Sunrise: 'الشروق',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

export function sendPrayerNotification(prayer: PrayerTime, lang: string) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return;
  if (wasNotified(prayer.name)) return;

  const title = lang === 'ar'
    ? `حان وقت صلاة ${prayerNameAr[prayer.name] || prayer.name}`
    : `Time for ${prayer.name} prayer`;

  const body = lang === 'ar'
    ? `الوقت: ${formatTime(prayer.time)}`
    : `Time: ${formatTime(prayer.time)}`;

  try {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: `prayer-${prayer.name}`,
      silent: false,
    });
    markNotified(prayer.name);
  } catch (e) {
    console.error('Failed to send notification:', e);
  }
}

/**
 * Check if any prayer time has arrived and send notification.
 * Call this every ~30 seconds from a setInterval.
 */
export function checkAndNotifyPrayers(
  latitude: number,
  longitude: number,
  lang: string,
  adhanEnabled?: boolean,
  adhanMuezzinId?: string,
) {
  const canNotify = isNotificationsEnabled() && isNotificationSupported() && Notification.permission === 'granted';

  if (!canNotify && !adhanEnabled) return;

  const prayers = calculatePrayerTimes(latitude, longitude);
  const now = Date.now();
  const THRESHOLD = 60_000; // 1 minute window

  // Only notify for main prayers (not Sunrise, Midnight, LastThird)
  const notifiable = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const prayer of prayers) {
    if (!notifiable.includes(prayer.name)) continue;
    const diff = now - prayer.time.getTime();
    if (diff >= 0 && diff < THRESHOLD) {
      if (canNotify) {
        sendPrayerNotification(prayer, lang);
      }
      if (adhanEnabled && adhanMuezzinId && !wasAdhanPlayed(prayer.name)) {
        const source = getAdhanSource(adhanMuezzinId);
        const url = prayer.name === 'Fajr' && source.fajrAudioUrl
          ? source.fajrAudioUrl
          : source.audioUrl;
        playAdhan(url);
        markAdhanPlayed(prayer.name);
      }
    }
  }
}
