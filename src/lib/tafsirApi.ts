// Tafsir API - Using multiple sources

const TAFSIR_API_BASE = 'https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir';
const MP3QURAN_API = 'https://mp3quran.net/api/v3';

export interface TafsirEdition {
  id: number;
  name: string;
  nameAr?: string;
  author: string;
  authorAr?: string;
  language: string;
  slug: string;
  source: string;
}

export interface TafsirAyah {
  ayah: number;
  text: string;
}

export interface TafsirSurah {
  surah: number;
  ayahs: TafsirAyah[];
}

export interface AudioTafsir {
  id: number;
  name: string;
  url: string;
}

// Available tafsir editions
export const tafsirEditions: TafsirEdition[] = [
  { id: 1, name: 'Tafsir Ibn Kathir', nameAr: 'تفسير ابن كثير', author: 'Hafiz Ibn Kathir', authorAr: 'الحافظ ابن كثير', language: 'arabic', slug: 'ar-tafsir-ibn-kathir', source: 'quran.com' },
  { id: 2, name: 'Tafsir al-Tabari', nameAr: 'تفسير الطبري', author: 'Tabari', authorAr: 'الإمام الطبري', language: 'arabic', slug: 'ar-tafsir-al-tabari', source: 'quran.com' },
  { id: 3, name: 'Tafsir Muyassar', nameAr: 'التفسير الميسر', author: 'Al Muyassar', authorAr: 'مجمع الملك فهد', language: 'arabic', slug: 'ar-tafsir-muyassar', source: 'quran.com' },
  { id: 4, name: 'Tafseer Al-Baghawi', nameAr: 'تفسير البغوي', author: 'Baghawy', authorAr: 'الإمام البغوي', language: 'arabic', slug: 'ar-tafsir-al-baghawi', source: 'quran.com' },
  { id: 5, name: 'Tafseer Al Saddi', nameAr: 'تفسير السعدي', author: 'Saddi', authorAr: 'الشيخ السعدي', language: 'arabic', slug: 'ar-tafseer-al-saddi', source: 'quran.com' },
  { id: 6, name: 'Tafseer Al Qurtubi', nameAr: 'تفسير القرطبي', author: 'Qurtubi', authorAr: 'الإمام القرطبي', language: 'arabic', slug: 'ar-tafseer-al-qurtubi', source: 'quran.com' },
  { id: 7, name: 'Tafsir Ibn Kathir (English)', nameAr: 'تفسير ابن كثير (إنجليزي)', author: 'Hafiz Ibn Kathir', authorAr: 'الحافظ ابن كثير', language: 'english', slug: 'en-tafisr-ibn-kathir', source: 'quran.com' },
  { id: 8, name: 'Al-Jalalayn', nameAr: 'تفسير الجلالين', author: 'Al-Jalalayn', authorAr: 'الجلالين', language: 'english', slug: 'en-al-jalalayn', source: 'altafsir.com' },
  { id: 9, name: 'Maarif-ul-Quran', nameAr: 'معارف القرآن', author: 'Mufti Muhammad Shafi', authorAr: 'المفتي محمد شفيع', language: 'english', slug: 'en-tafsir-maarif-ul-quran', source: 'quran.com' },
  { id: 10, name: 'Tafsir Ibn Kathir (Urdu)', nameAr: 'تفسير ابن كثير (أردو)', author: 'Hafiz Ibn Kathir', authorAr: 'الحافظ ابن كثير', language: 'urdu', slug: 'ur-tafseer-ibn-e-kaseer', source: 'quran.com' },
  { id: 11, name: 'Tafsir Bayan ul Quran', nameAr: 'تفسير بيان القرآن', author: 'Dr. Israr Ahmad', authorAr: 'د. إسرار أحمد', language: 'urdu', slug: 'ur-tafsir-bayan-ul-quran', source: 'quran.com' },
  { id: 12, name: 'Tafseer Al Saddi (Russian)', nameAr: 'تفسير السعدي (روسي)', author: 'Saddi', authorAr: 'الشيخ السعدي', language: 'russian', slug: 'ru-tafseer-al-saddi', source: 'quran.com' },
  { id: 13, name: 'Tafsir Abu Bakr Zakaria', nameAr: 'تفسير أبو بكر زكريا', author: 'King Fahd Complex', authorAr: 'مجمع الملك فهد', language: 'bengali', slug: 'bn-tafsir-abu-bakr-zakaria', source: 'quran.com' },
];

// Fetch tafsir for a surah
export async function fetchTafsir(slug: string, surahNumber: number): Promise<TafsirAyah[] | null> {
  try {
    const response = await fetch(`${TAFSIR_API_BASE}/${slug}/${surahNumber}.json`);
    if (!response.ok) throw new Error('Failed to fetch tafsir');
    const data = await response.json();
    return data.ayahs || data;
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return null;
  }
}

// Fetch tafsir for a specific ayah
export async function fetchTafsirAyah(slug: string, surahNumber: number, ayahNumber: number): Promise<string | null> {
  try {
    const response = await fetch(`${TAFSIR_API_BASE}/${slug}/${surahNumber}/${ayahNumber}.json`);
    if (!response.ok) throw new Error('Failed to fetch tafsir ayah');
    const data = await response.json();
    return data.text || null;
  } catch (error) {
    console.error('Error fetching tafsir ayah:', error);
    return null;
  }
}

// Fetch audio tafsirs from mp3quran.net
export async function fetchAudioTafsirs(language: string = 'ar'): Promise<AudioTafsir[]> {
  try {
    const response = await fetch(`${MP3QURAN_API}/tafasir?language=${language}`);
    if (!response.ok) throw new Error('Failed to fetch audio tafsirs');
    const data = await response.json();
    return data.tafasir || [];
  } catch (error) {
    console.error('Error fetching audio tafsirs:', error);
    return [];
  }
}
