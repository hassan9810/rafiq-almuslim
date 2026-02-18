import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const DEFAULT_LAT = 30.0444;
const DEFAULT_LON = 31.2357;

/**
 * Islamic day starts at Fajr.
 * Returns a stable string key for the current Islamic day (YYYY-MM-DD of the day on which
 * this Islamic day started at Fajr). Same key from Fajr until next Fajr.
 */
export function getIslamicDayKey(
  latitude: number | null,
  longitude: number | null,
  now: Date = new Date()
): string {
  const lat = latitude ?? DEFAULT_LAT;
  const lng = longitude ?? DEFAULT_LON;
  const coordinates = new Coordinates(lat, lng);
  const params = CalculationMethod.Egyptian();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const prayerTimesToday = new PrayerTimes(coordinates, today, params);
  const fajrToday = prayerTimesToday.fajr.getTime();
  const nowTime = now.getTime();

  if (nowTime >= fajrToday) {
    // Current Islamic day started at Fajr today
    return formatDateKey(today);
  }

  // Before Fajr: current Islamic day started at Fajr yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateKey(yesterday);
}

function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
