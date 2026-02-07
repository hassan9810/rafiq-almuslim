import { useAppStore } from '@/store/useAppStore';

type TranslationKey = 
  | 'appName'
  | 'quran'
  | 'mushaf'
  | 'tafsir'
  | 'hadith'
  | 'prayerTimes'
  | 'qibla'
  | 'radio'
  | 'azkar'
  | 'hisnMuslim'
  | 'translations'
  | 'search'
  | 'searchPlaceholder'
  | 'allSurahs'
  | 'favorites'
  | 'bookmarks'
  | 'recentReads'
  | 'makki'
  | 'madani'
  | 'verses'
  | 'play'
  | 'pause'
  | 'next'
  | 'previous'
  | 'selectReciter'
  | 'translation'
  | 'settings'
  | 'language'
  | 'theme'
  | 'dark'
  | 'light'
  | 'nextPrayer'
  | 'fajr'
  | 'sunrise'
  | 'dhuhr'
  | 'asr'
  | 'maghrib'
  | 'isha'
  | 'yourLocation'
  | 'detectLocation'
  | 'welcome'
  | 'heroSubtitle'
  | 'startReading'
  | 'listenNow'
  | 'bismillah'
  | 'surahNumber'
  | 'juz'
  | 'hizb'
  | 'page';

const translations: Record<'en' | 'ar', Record<TranslationKey, string>> = {
  en: {
    appName: 'Rafiq Al-Muslim',
    quran: 'Quran',
    mushaf: 'Mushaf',
    tafsir: 'Tafsir',
    hadith: 'Hadith',
    prayerTimes: 'Prayer Times',
    qibla: 'Qibla',
    radio: 'Radio',
    azkar: 'Azkar',
    hisnMuslim: 'Hisn Muslim',
    translations: 'Translations',
    search: 'Search',
    searchPlaceholder: 'Search Quran, Hadith, or Tafsir...',
    allSurahs: 'All Surahs',
    favorites: 'Favorites',
    bookmarks: 'Bookmarks',
    recentReads: 'Recent Reads',
    makki: 'Makki',
    madani: 'Madani',
    verses: 'verses',
    play: 'Play',
    pause: 'Pause',
    next: 'Next',
    previous: 'Previous',
    selectReciter: 'Select Reciter',
    translation: 'Translation',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    nextPrayer: 'Next Prayer',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    yourLocation: 'Your Location',
    detectLocation: 'Detect Location',
    welcome: 'Welcome to Rafiq Al-Muslim',
    heroSubtitle: 'Your spiritual companion for Quran recitation, learning, and daily prayers',
    startReading: 'Start Reading',
    listenNow: 'Listen Now',
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    surahNumber: 'Surah',
    juz: 'Juz',
    hizb: 'Hizb',
    page: 'Page',
  },
  ar: {
    appName: 'رفيق المسلم',
    quran: 'القرآن',
    mushaf: 'المصحف',
    tafsir: 'التفسير',
    hadith: 'الحديث',
    prayerTimes: 'مواقيت الصلاة',
    qibla: 'القبلة',
    radio: 'الراديو',
    azkar: 'الأذكار',
    hisnMuslim: 'حصن المسلم',
    translations: 'الترجمات',
    search: 'بحث',
    searchPlaceholder: 'ابحث في القرآن أو الحديث أو التفسير...',
    allSurahs: 'جميع السور',
    favorites: 'المفضلة',
    bookmarks: 'العلامات',
    recentReads: 'القراءات الأخيرة',
    makki: 'مكية',
    madani: 'مدنية',
    verses: 'آيات',
    play: 'تشغيل',
    pause: 'إيقاف',
    next: 'التالي',
    previous: 'السابق',
    selectReciter: 'اختر القارئ',
    translation: 'الترجمة',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    dark: 'داكن',
    light: 'فاتح',
    nextPrayer: 'الصلاة القادمة',
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    yourLocation: 'موقعك',
    detectLocation: 'تحديد الموقع',
    welcome: 'مرحباً بك في رفيق المسلم',
    heroSubtitle: 'رفيقك الروحي لتلاوة القرآن والتعلم والصلوات اليومية',
    startReading: 'ابدأ القراءة',
    listenNow: 'استمع الآن',
    bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    surahNumber: 'سورة',
    juz: 'جزء',
    hizb: 'حزب',
    page: 'صفحة',
  },
};

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };
  
  return { t, language };
}
