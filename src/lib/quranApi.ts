// Quran API - Using alquran.cloud API
import recitersData from '@/data/reciters.json';

const QURAN_API = 'https://api.alquran.cloud/v1';
const MP3_QURAN_API = 'https://mp3quran.net/api/v3';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
  translation?: string;
  juz: number;
  page: number;
  hizbQuarter: number;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface Reciter {
  id: number;
  name: string;
  letter: string;
  moshaf: {
    id: number;
    name: string;
    server: string;
    surah_list: string;
    surah_total: number;
    moshaf_type: number;
  }[];
}

// Fetch all surahs
export async function fetchSurahs(): Promise<Surah[]> {
  try {
    const response = await fetch(`${QURAN_API}/surah`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

// Fetch a specific surah with Arabic text
export async function fetchSurah(surahNumber: number): Promise<SurahData | null> {
  try {
    const response = await fetch(`${QURAN_API}/surah/${surahNumber}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

// Fetch surah with translation
export async function fetchSurahWithTranslation(
  surahNumber: number, 
  edition: string = 'en.sahih'
): Promise<{ arabic: SurahData; translation: SurahData } | null> {
  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`${QURAN_API}/surah/${surahNumber}`),
      fetch(`${QURAN_API}/surah/${surahNumber}/${edition}`)
    ]);
    
    const arabicData = await arabicRes.json();
    const translationData = await translationRes.json();
    
    return {
      arabic: arabicData.data,
      translation: translationData.data
    };
  } catch (error) {
    console.error('Error fetching surah with translation:', error);
    return null;
  }
}

// Get reciters from local JSON data (Arabic names)
export function getRecitersFromData(): Reciter[] {
  return recitersData.reciters as Reciter[];
}

// Fetch reciters from mp3quran.net API with language support
export async function fetchReciters(language: string = 'ar'): Promise<Reciter[]> {
  try {
    if (language === 'ar') {
      // Use local data for Arabic names
      const localReciters = getRecitersFromData();
      if (localReciters.length > 0) {
        return localReciters;
      }
    }
    
    // Fetch from API for English or as fallback
    const response = await fetch(`${MP3_QURAN_API}/reciters?language=${language}`);
    const data = await response.json();
    return data.reciters || getRecitersFromData();
  } catch (error) {
    console.error('Error fetching reciters:', error);
    return getRecitersFromData();
  }
}

// Get audio URL for a surah
export function getAudioUrl(reciter: Reciter, surahNumber: number): string {
  if (!reciter.moshaf || reciter.moshaf.length === 0) return '';
  const moshaf = reciter.moshaf[0];
  const paddedSurah = surahNumber.toString().padStart(3, '0');
  return `${moshaf.server}${paddedSurah}.mp3`;
}

// Search in Quran
export async function searchQuran(query: string): Promise<any> {
  try {
    const response = await fetch(`${QURAN_API}/search/${encodeURIComponent(query)}/all/en`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching Quran:', error);
    return null;
  }
}

// Available translations
export const translations = [
  { code: 'en.sahih', name: 'Sahih International', language: 'English' },
  { code: 'en.pickthall', name: 'Pickthall', language: 'English' },
  { code: 'en.yusufali', name: 'Yusuf Ali', language: 'English' },
  { code: 'ar.muyassar', name: 'المیسر', language: 'Arabic' },
  { code: 'ur.jalandhry', name: 'جالندہری', language: 'Urdu' },
  { code: 'fr.hamidullah', name: 'Hamidullah', language: 'French' },
  { code: 'de.aburida', name: 'Abu Rida', language: 'German' },
  { code: 'tr.diyanet', name: 'Diyanet', language: 'Turkish' },
  { code: 'id.indonesian', name: 'Indonesian', language: 'Indonesian' },
  { code: 'bn.bengali', name: 'Bengali', language: 'Bengali' },
];
