import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Qibla } from 'adhan';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';

export interface PrayerTime {
  name: string;
  nameArabic: string;
  displayName: string;
  displayNameArabic: string;
  time: Date;
  isNext: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

function getHijriMonthDay(date: Date): { month: number; day: number } | null {
  const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);
  const monthPart = parts.find((part) => part.type === 'month');
  const dayPart = parts.find((part) => part.type === 'day');
  if (!monthPart || !dayPart) return null;

  const month = Number(monthPart.value);
  const day = Number(dayPart.value);
  if (Number.isNaN(month) || Number.isNaN(day)) return null;
  return { month, day };
}

function getEidPrayerLabel(date: Date): { displayName: string; displayNameArabic: string } | null {
  const hijri = getHijriMonthDay(date);
  if (!hijri) return null;

  if (hijri.month === 10 && hijri.day === 1) {
    return { displayName: en.eidAlFitrPrayer, displayNameArabic: ar.eidAlFitrPrayer };
  }

  if (hijri.month === 12 && hijri.day === 10) {
    return { displayName: en.eidAlAdhaPrayer, displayNameArabic: ar.eidAlAdhaPrayer };
  }

  return null;
}

// Get user's current location
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get city name using Nominatim
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();

          resolve({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
            country: data.address?.country || 'Unknown',
          });
        } catch {
          resolve({
            latitude,
            longitude,
            city: 'Unknown',
            country: 'Unknown',
          });
        }
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// Search for city by name using Nominatim
export async function searchCity(query: string): Promise<Location[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
    );
    const data = await response.json();

    return data.map((result: any) => ({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      city: result.address?.city || result.address?.town || result.address?.village || result.name || 'Unknown',
      country: result.address?.country || 'Unknown',
    }));
  } catch (error) {
    console.error('Error searching city:', error);
    return [];
  }
}

export type CalcMethodKey =
  | 'Egyptian'
  | 'MuslimWorldLeague'
  | 'NorthAmerica'
  | 'UmmAlQura'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'MoonsightingCommittee'
  | 'Singapore'
  | 'Karachi'
  | 'Tehran';

const calcMethodMap: Record<CalcMethodKey, () => ReturnType<typeof CalculationMethod.Egyptian>> = {
  Egyptian: () => CalculationMethod.Egyptian(),
  MuslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
  NorthAmerica: () => CalculationMethod.NorthAmerica(),
  UmmAlQura: () => CalculationMethod.UmmAlQura(),
  Dubai: () => CalculationMethod.Dubai(),
  Qatar: () => CalculationMethod.Qatar(),
  Kuwait: () => CalculationMethod.Kuwait(),
  MoonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
  Singapore: () => CalculationMethod.Singapore(),
  Karachi: () => CalculationMethod.Karachi(),
  Tehran: () => CalculationMethod.Tehran(),
};

// Calculate prayer times
export function calculatePrayerTimes(latitude: number, longitude: number, date: Date = new Date(), method: CalcMethodKey = 'Egyptian'): PrayerTime[] {
  const coordinates = new Coordinates(latitude, longitude);
  const params = (calcMethodMap[method] ?? calcMethodMap.Egyptian)();
  const prayerTimes = new PrayerTimes(coordinates, date, params);
  const maghribTime = prayerTimes.maghrib.getTime();

  let fajrTime = prayerTimes.fajr.getTime();
  if (fajrTime <= maghribTime) {
    fajrTime += 24 * 60 * 60 * 1000;
  }

  const nightDuration = fajrTime - maghribTime;
  const midnight = new Date(maghribTime + nightDuration / 2);
  const lastThird = new Date(maghribTime + (nightDuration * 2) / 3);
  const isFriday = date.getDay() === 5;
  const eidPrayerLabel = getEidPrayerLabel(date);
  const eidPrayerTime = new Date(prayerTimes.sunrise.getTime() + 20 * 60 * 1000);

  const prayers: { name: string; nameArabic: string; displayName: string; displayNameArabic: string; time: Date }[] = [
    { name: 'Fajr', nameArabic: 'الفجر', displayName: 'Fajr', displayNameArabic: 'الفجر', time: prayerTimes.fajr },
    { name: 'Sunrise', nameArabic: 'الشروق', displayName: 'Sunrise', displayNameArabic: 'الشروق', time: prayerTimes.sunrise },
    ...(eidPrayerLabel
      ? [{ name: 'Eid', nameArabic: eidPrayerLabel.displayNameArabic, displayName: eidPrayerLabel.displayName, displayNameArabic: eidPrayerLabel.displayNameArabic, time: eidPrayerTime }]
      : []),
    {
      name: 'Dhuhr',
      nameArabic: 'الظهر',
      displayName: isFriday ? 'Jumuah' : 'Dhuhr',
      displayNameArabic: isFriday ? 'الجمعة' : 'الظهر',
      time: prayerTimes.dhuhr,
    },
    { name: 'Asr', nameArabic: 'العصر', displayName: 'Asr', displayNameArabic: 'العصر', time: prayerTimes.asr },
    { name: 'Maghrib', nameArabic: 'المغرب', displayName: 'Maghrib', displayNameArabic: 'المغرب', time: prayerTimes.maghrib },
    { name: 'Isha', nameArabic: 'العشاء', displayName: 'Isha', displayNameArabic: 'العشاء', time: prayerTimes.isha },
    { name: 'Midnight', nameArabic: 'منتصف الليل', displayName: 'Midnight', displayNameArabic: 'منتصف الليل', time: midnight },
    { name: 'LastThird', nameArabic: 'الثلث الأخير', displayName: 'LastThird', displayNameArabic: 'الثلث الأخير', time: lastThird },
  ];


  // Find next prayer (including custom ones like Midnight, LastThird)
  const now = new Date();
  let nextIndex = -1;
  for (let i = 0; i < prayers.length; i++) {
    if (prayers[i].time.getTime() > now.getTime()) {
      nextIndex = i;
      break;
    }
  }

  return prayers.map((prayer, i) => ({
    ...prayer,
    isNext: i === nextIndex,
  }));
}

// Get Qibla direction
export function getQiblaDirection(latitude: number, longitude: number): number {
  const coordinates = new Coordinates(latitude, longitude);
  return Qibla(coordinates);
}

// Format time
export function formatTime(date: Date, use24Hour: boolean = false): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour,
  });
}

// Get time until next prayer
export function getTimeUntilNextPrayer(nextPrayerTime: Date): string {
  const now = new Date();
  const diff = nextPrayerTime.getTime() - now.getTime();

  if (diff <= 0) return 'Now';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
