import { Coordinates, CalculationMethod, PrayerTimes, Prayer, Qibla } from 'adhan';

export interface PrayerTime {
  name: string;
  nameArabic: string;
  time: Date;
  isNext: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
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

// Calculate prayer times
export function calculatePrayerTimes(latitude: number, longitude: number, date: Date = new Date()): PrayerTime[] {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.MoonsightingCommittee();
  const prayerTimes = new PrayerTimes(coordinates, date, params);

  const now = new Date();
  const prayers: { name: string; nameArabic: string; time: Date }[] = [
    { name: 'Fajr', nameArabic: 'الفجر', time: prayerTimes.fajr },
    { name: 'Sunrise', nameArabic: 'الشروق', time: prayerTimes.sunrise },
    { name: 'Dhuhr', nameArabic: 'الظهر', time: prayerTimes.dhuhr },
    { name: 'Asr', nameArabic: 'العصر', time: prayerTimes.asr },
    { name: 'Maghrib', nameArabic: 'المغرب', time: prayerTimes.maghrib },
    { name: 'Isha', nameArabic: 'العشاء', time: prayerTimes.isha },
  ];

  // Find next prayer
  const nextPrayer = prayerTimes.nextPrayer();
  
  return prayers.map((prayer) => ({
    ...prayer,
    isNext: Prayer[nextPrayer] === prayer.name,
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
