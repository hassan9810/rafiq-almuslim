// QuranEnc API for translations
// Documentation: https://quranenc.com/api

const QURANENC_API = 'https://quranenc.com/api/v1';

export interface TranslationEdition {
  key: string;
  direction: 'ltr' | 'rtl';
  language_iso_code: string;
  version: string;
  last_update: number;
  title: string;
  description: string;
  file?: string;
  database_url?: string;
  pdf_url?: string | null;
  epub_url?: string | null;
}

export interface TranslationAyah {
  id: string;
  sura: string;
  aya: string;
  arabic_text: string;
  translation: string;
  footnotes: string;
}

// Arabic tafsir/translation editions — not returned by the quranenc list API
// but their sura endpoints work correctly, so we inject them manually.
export const arabicTranslations: TranslationEdition[] = [
  {
    key: 'arabic_moyassar',
    direction: 'rtl',
    language_iso_code: 'ar',
    version: '1.0.4',
    last_update: 1700000000,
    title: 'التفسير الميسر',
    description: 'مجمع الملك فهد لطباعة المصحف الشريف بالمدينة المنورة'
  },
  {
    key: 'arabic_yaseer',
    direction: 'rtl',
    language_iso_code: 'ar',
    version: '1.0.10',
    last_update: 1735430400,
    title: 'اليسير في التفسير',
    description: 'اليسير في التفسير'
  },
  {
    key: 'arabic_mokhtasar',
    direction: 'rtl',
    language_iso_code: 'ar',
    version: '1.0.0',
    last_update: 1487116800,
    title: 'المختصر في تفسير القرآن الكريم',
    description: 'مركز تفسير للدراسات القرآنية'
  },
  {
    key: 'arabic_seraj',
    direction: 'rtl',
    language_iso_code: 'ar',
    version: '1.0.0',
    last_update: 1487116800,
    title: 'السراج في بيان غريب القرآن',
    description: 'كتاب السراج في بيان غريب القرآن'
  },
  {
    key: 'arabic_nafahat',
    direction: 'rtl',
    language_iso_code: 'ar',
    version: '1.0.0',
    last_update: 1735084800,
    title: 'النفحات المكية - محمد بن صالح الشاوي',
    description: 'النفحات المكية في تفسير كتاب رب البرية للشيخ محمد بن صالح الشاوي'
  },
];

// Fetch all available translations with optional language filter
export async function fetchAvailableTranslations(language?: string, localization: string = 'en'): Promise<TranslationEdition[]> {
  try {
    let url = `${QURANENC_API}/translations/list`;
    if (language) {
      url += `/${language}`;
    }
    url += `?localization=${localization}`;
    
    const response = await fetch(url);
    const data = await response.json();
    const apiResults: TranslationEdition[] = data.translations || [];

    // The API does not list Arabic tafsirs in its /translations/list endpoint,
    // so we always inject them manually (deduplicating by key).
    const existingKeys = new Set(apiResults.map(t => t.key));
    const missingArabic = arabicTranslations.filter(t => !existingKeys.has(t.key));

    // If caller requested Arabic-only, return only Arabic entries
    if (language === 'ar') {
      return arabicTranslations;
    }

    return [...missingArabic, ...apiResults];
  } catch (error) {
    console.error('Error fetching translations list:', error);
    return popularTranslations;
  }
}

// Fetch surah translation
export async function fetchSurahTranslation(
  translationKey: string, 
  surahNumber: number
): Promise<TranslationAyah[]> {
  try {
    const response = await fetch(
      `${QURANENC_API}/translation/sura/${translationKey}/${surahNumber}`
    );
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching surah translation:', error);
    return [];
  }
}

// Fetch single ayah translation
export async function fetchAyahTranslation(
  translationKey: string,
  surahNumber: number,
  ayahNumber: number
): Promise<TranslationAyah | null> {
  try {
    const response = await fetch(
      `${QURANENC_API}/translation/aya/${translationKey}/${surahNumber}/${ayahNumber}`
    );
    const data = await response.json();
    return data.result || null;
  } catch (error) {
    console.error('Error fetching ayah translation:', error);
    return null;
  }
}

// Popular translations with their keys
export const popularTranslations: TranslationEdition[] = [
  ...arabicTranslations,
  {
    key: 'english_rwwad',
    direction: 'ltr',
    language_iso_code: 'en',
    version: '1.0.18',
    last_update: 1767269960,
    title: 'English - Rowwad Translation Center',
    description: 'Translated by Rowwad Translation Center'
  },
  {
    key: 'english_saheeh',
    direction: 'ltr',
    language_iso_code: 'en',
    version: '1.1.2',
    last_update: 1750772247,
    title: 'English - Noor International Center',
    description: 'Issued by Noor International'
  },
  {
    key: 'english_hilali_khan',
    direction: 'ltr',
    language_iso_code: 'en',
    version: '1.1.2',
    last_update: 1756933433,
    title: 'English - Hilali and Khan',
    description: 'Translated by Taquddin Al-Hilali & Mohsen Khan'
  },
  {
    key: 'urdu_junagarhi',
    direction: 'rtl',
    language_iso_code: 'ur',
    version: '1.0.3',
    last_update: 1700000000,
    title: 'اردو - جوناگڑھی',
    description: 'مولانا محمد جوناگڑھی'
  },
  {
    key: 'french_hamidullah',
    direction: 'ltr',
    language_iso_code: 'fr',
    version: '1.0.2',
    last_update: 1700000000,
    title: 'French - Hamidullah',
    description: 'Translated by Muhammad Hamidullah'
  },
  {
    key: 'turkish_diyanet',
    direction: 'ltr',
    language_iso_code: 'tr',
    version: '1.0.3',
    last_update: 1700000000,
    title: 'Turkish - Diyanet İşleri',
    description: 'Diyanet İşleri Başkanlığı'
  },
  {
    key: 'indonesian_sabiq',
    direction: 'ltr',
    language_iso_code: 'id',
    version: '1.0.2',
    last_update: 1700000000,
    title: 'Indonesian - Sabiq',
    description: 'Indonesian Translation'
  },
  {
    key: 'german_bubenheim',
    direction: 'ltr',
    language_iso_code: 'de',
    version: '1.0.2',
    last_update: 1700000000,
    title: 'German - Bubenheim & Elyas',
    description: 'Abdullah Frank Bubenheim and Nadeem Elyas'
  },
  {
    key: 'spanish_cortes',
    direction: 'ltr',
    language_iso_code: 'es',
    version: '1.0.2',
    last_update: 1700000000,
    title: 'Spanish - Julio Cortes',
    description: 'Translated by Julio Cortes'
  }
];

// Group translations by language
export function groupTranslationsByLanguage(translations: TranslationEdition[]): Record<string, TranslationEdition[]> {
  return translations.reduce((acc, t) => {
    const lang = t.language_iso_code;
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(t);
    return acc;
  }, {} as Record<string, TranslationEdition[]>);
}

// Language names mapping
export const languageNames: Record<string, { en: string; native: string }> = {
  en: { en: 'English', native: 'English' },
  ar: { en: 'Arabic', native: 'العربية' },
  ur: { en: 'Urdu', native: 'اردو' },
  fr: { en: 'French', native: 'Français' },
  tr: { en: 'Turkish', native: 'Türkçe' },
  id: { en: 'Indonesian', native: 'Bahasa Indonesia' },
  de: { en: 'German', native: 'Deutsch' },
  es: { en: 'Spanish', native: 'Español' },
  bn: { en: 'Bengali', native: 'বাংলা' },
  ru: { en: 'Russian', native: 'Русский' },
  pt: { en: 'Portuguese', native: 'Português' },
  hi: { en: 'Hindi', native: 'हिन्दी' },
  zh: { en: 'Chinese', native: '中文' },
  ja: { en: 'Japanese', native: '日本語' },
  ko: { en: 'Korean', native: '한국어' },
  fa: { en: 'Persian', native: 'فارسی' },
  ml: { en: 'Malayalam', native: 'മലയാളം' },
  ta: { en: 'Tamil', native: 'தமிழ்' },
  th: { en: 'Thai', native: 'ไทย' },
  vi: { en: 'Vietnamese', native: 'Tiếng Việt' }
};
