// Hisn Al-Muslim API Integration
// Using hisnmuslim.com APIs with HTTPS

export interface HisnDhikr {
  ID: number | string;
  ARABIC_TEXT: string;
  TRANSLATED_TEXT?: string;
  LANGUAGE_ARABIC_TRANSLATED_TEXT?: string;
  REPEAT?: number | string;
  AUDIO?: string;
  REFERENCE?: string;
}

export interface HisnCategory {
  ID: number;
  TITLE: string;
  AUDIO_URL: string;
  TEXT: string;
}

export interface HisnChapter {
  id: number;
  title: string;
  audioUrl: string;
  textUrl: string;
  adhkar: HisnDhikr[];
}

// Cache for loaded data
let allChapters: HisnChapter[] = [];
let contentByTitle: Record<string, HisnDhikr[]> = {};
let dataLoaded = false;
let loadingPromise: Promise<void> | null = null;

// Convert HTTP to HTTPS for URLs - use CORS proxy for API calls
function toHttps(url: string): string {
  return url.replace('http://', 'https://');
}

// Use CORS proxy for fetching from hisnmuslim.com API
function getProxiedUrl(url: string): string {
  // Use a CORS proxy to fetch from HTTP API
  const httpsUrl = toHttps(url);
  // allorigins.win is a reliable CORS proxy
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(httpsUrl)}`;
}

// Load categories and content from local file
async function loadAllData(): Promise<void> {
  if (dataLoaded) return;
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = (async () => {
    try {
      const response = await fetch('/data/hisnmuslim.json');
      if (!response.ok) throw new Error('Failed to load data');
      
      const text = await response.text();
      
      // The file contains multiple JSON objects
      // First object is categories: { "العربية": [...] }
      // Following objects are content: { "title": [...] }
      
      // Find all JSON objects by matching balanced braces
      const jsonObjects: string[] = [];
      let depth = 0;
      let start = -1;
      
      for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') {
          if (depth === 0) start = i;
          depth++;
        } else if (text[i] === '}') {
          depth--;
          if (depth === 0 && start !== -1) {
            jsonObjects.push(text.substring(start, i + 1));
            start = -1;
          }
        }
      }
      
      // Parse first object as categories
      if (jsonObjects.length > 0) {
        try {
          const categoriesData = JSON.parse(jsonObjects[0]);
          const categories: HisnCategory[] = categoriesData['العربية'] || [];
          
          allChapters = categories.map(cat => ({
            id: cat.ID,
            title: cat.TITLE,
            audioUrl: toHttps(cat.AUDIO_URL),
            textUrl: toHttps(cat.TEXT),
            adhkar: []
          }));
          
          console.log(`Parsed ${allChapters.length} chapters`);
        } catch (e) {
          console.error('Error parsing categories:', e);
        }
      }
      
      // Parse remaining objects as content
      for (let i = 1; i < jsonObjects.length; i++) {
        try {
          const contentData = JSON.parse(jsonObjects[i]);
          for (const [title, adhkarList] of Object.entries(contentData)) {
            if (Array.isArray(adhkarList)) {
              const adhkarWithHttps = (adhkarList as HisnDhikr[]).map(d => ({
                ...d,
                AUDIO: d.AUDIO ? toHttps(d.AUDIO) : undefined
              }));
              contentByTitle[title] = adhkarWithHttps;
            }
          }
        } catch (e) {
          // Skip invalid JSON
        }
      }
      
      console.log(`Parsed ${Object.keys(contentByTitle).length} content sections`);
      
      // Link adhkar to chapters by matching titles
      for (const chapter of allChapters) {
        if (contentByTitle[chapter.title]) {
          chapter.adhkar = contentByTitle[chapter.title];
        }
      }
      
      dataLoaded = true;
      hisnMuslimCategories = allChapters;
      
    } catch (error) {
      console.error('Error loading Hisn Muslim data:', error);
    }
  })();
  
  return loadingPromise;
}

// Get all chapters
export async function getHisnChapters(): Promise<HisnChapter[]> {
  await loadAllData();
  return allChapters;
}

// Get adhkar by chapter ID - Always fetch from API if not cached
export async function getAdhkarById(id: number): Promise<HisnDhikr[]> {
  await loadAllData();
  const chapter = allChapters.find(c => c.id === id);
  
  if (!chapter) return [];
  
  // Always fetch from API if no local content
  if (chapter.adhkar.length === 0 && chapter.textUrl) {
    try {
      const proxiedUrl = getProxiedUrl(chapter.textUrl);
      console.log(`Fetching adhkar from API for chapter ${id}: ${proxiedUrl}`);
      const response = await fetch(proxiedUrl);
      if (response.ok) {
        const data = await response.json();
        // API returns { "title": [...] }
        for (const [, adhkarList] of Object.entries(data)) {
          if (Array.isArray(adhkarList)) {
            chapter.adhkar = (adhkarList as HisnDhikr[]).map(d => ({
              ...d,
              AUDIO: d.AUDIO ? toHttps(d.AUDIO) : undefined
            }));
            console.log(`Loaded ${chapter.adhkar.length} adhkar for chapter ${id}`);
            break;
          }
        }
      }
    } catch (e) {
      console.error(`Error fetching adhkar for chapter ${id}:`, e);
    }
  }
  
  return chapter?.adhkar || [];
}

// Get chapter with adhkar by ID - fetches from API if needed
export async function getChapterWithAdhkar(id: number): Promise<HisnChapter | null> {
  await loadAllData();
  const chapter = allChapters.find(c => c.id === id);
  
  if (!chapter) return null;
  
  // Fetch adhkar from API if not cached
  if (chapter.adhkar.length === 0 && chapter.textUrl) {
    try {
      const proxiedUrl = getProxiedUrl(chapter.textUrl);
      console.log(`Fetching adhkar from API for chapter ${id}: ${proxiedUrl}`);
      const response = await fetch(proxiedUrl);
      if (response.ok) {
        const data = await response.json();
        for (const [, adhkarList] of Object.entries(data)) {
          if (Array.isArray(adhkarList)) {
            chapter.adhkar = (adhkarList as HisnDhikr[]).map(d => ({
              ...d,
              AUDIO: d.AUDIO ? toHttps(d.AUDIO) : undefined
            }));
            console.log(`Loaded ${chapter.adhkar.length} adhkar for chapter ${id}`);
            break;
          }
        }
      }
    } catch (e) {
      console.error(`Error fetching adhkar for chapter ${id}:`, e);
    }
  }
  
  return chapter;
}

// Get adhkar by chapter title
export async function getAdhkarByTitle(title: string): Promise<HisnDhikr[]> {
  await loadAllData();
  return contentByTitle[title] || [];
}

// For backwards compatibility
export let hisnMuslimCategories: HisnChapter[] = [];

// Initialize function to load categories
export async function initHisnMuslim(): Promise<HisnChapter[]> {
  await loadAllData();
  return allChapters;
}

// Category labels for grouping UI
export const categoryLabels: Record<string, { ar: string; en: string }> = {
  morning_evening: { ar: 'أذكار الصباح والمساء', en: 'Morning & Evening' },
  sleep: { ar: 'أذكار النوم', en: 'Sleep' },
  wakeup: { ar: 'الاستيقاظ', en: 'Waking Up' },
  clothing: { ar: 'اللباس', en: 'Clothing' },
  bathroom: { ar: 'الخلاء', en: 'Bathroom' },
  wudu: { ar: 'الوضوء', en: 'Ablution' },
  home: { ar: 'المنزل', en: 'Home' },
  mosque: { ar: 'المسجد', en: 'Mosque' },
  adhan: { ar: 'الأذان', en: 'Adhan' },
  prayer: { ar: 'الصلاة', en: 'Prayer' },
  distress: { ar: 'الكرب والهم', en: 'Distress' },
  family: { ar: 'الأسرة', en: 'Family' },
  illness: { ar: 'المرض', en: 'Illness' },
  death: { ar: 'الموت', en: 'Death' },
  weather: { ar: 'الطقس', en: 'Weather' },
  food: { ar: 'الطعام', en: 'Food' },
  social: { ar: 'الاجتماعية', en: 'Social' },
  travel: { ar: 'السفر', en: 'Travel' },
  misc: { ar: 'متنوعة', en: 'Miscellaneous' },
  hajj: { ar: 'الحج', en: 'Hajj' },
  general: { ar: 'عامة', en: 'General' },
};

// Chapter grouping by category (based on title keywords)
export function getCategoryForChapter(title: string): string {
  if (title.includes('الصباح') || title.includes('المساء')) return 'morning_evening';
  if (title.includes('النوم') || title.includes('المنام') || title.includes('تقلب ليلا') || title.includes('الفزع في النوم') || title.includes('الرؤيا') || title.includes('الحلم')) return 'sleep';
  if (title.includes('الاستيقاظ')) return 'wakeup';
  if (title.includes('الثوب') || title.includes('لبس') || title.includes('ُلبْس')) return 'clothing';
  if (title.includes('الخلاء')) return 'bathroom';
  if (title.includes('الوضوء')) return 'wudu';
  if (title.includes('المنزل') || title.includes('البيت')) return 'home';
  if (title.includes('المسجد')) return 'mosque';
  if (title.includes('الأذان') || title.includes('الآذان')) return 'adhan';
  if (title.includes('الصلاة') || title.includes('السجود') || title.includes('الركوع') || title.includes('التشهد') || title.includes('الوتر') || title.includes('الاستفتاح') || title.includes('الاستخارة') || title.includes('قنوت')) return 'prayer';
  if (title.includes('الكرب') || title.includes('الهم') || title.includes('الحزن') || title.includes('الوسوسة') || title.includes('الفزع') || title.includes('استصعب') || title.includes('الدين') || title.includes('الشيطان') || title.includes('الغضب') || title.includes('مصيبة') || title.includes('ظلم')) return 'distress';
  if (title.includes('المولود') || title.includes('الزوج') || title.includes('الأولاد') || title.includes('المتزوج')) return 'family';
  if (title.includes('المريض') || title.includes('المرض') || title.includes('وجع') || title.includes('عيادة')) return 'illness';
  if (title.includes('الميت') || title.includes('الموت') || title.includes('القبر') || title.includes('التعزية') || title.includes('المحتضر') || title.includes('دفن') || title.includes('إغماض')) return 'death';
  if (title.includes('الريح') || title.includes('الرعد') || title.includes('المطر') || title.includes('الهلال') || title.includes('الاستسقاء') || title.includes('الاستصحاء')) return 'weather';
  if (title.includes('الطعام') || title.includes('الإفطار') || title.includes('الصائم') || title.includes('الثمر') || title.includes('إفطار') || title.includes('الشراب')) return 'food';
  if (title.includes('السلام') || title.includes('العطاس') || title.includes('المجلس') || title.includes('معروف') || title.includes('أحبك') || title.includes('بارك') || title.includes('غفر') || title.includes('مدح') || title.includes('زكي') || title.includes('سببته')) return 'social';
  if (title.includes('السفر') || title.includes('الركوب') || title.includes('المسافر') || title.includes('السوق') || title.includes('القرية') || title.includes('البلدة') || title.includes('المركوب') || title.includes('المقيم') || title.includes('أسحر') || title.includes('الرجوع')) return 'travel';
  if (title.includes('الحج') || title.includes('العمرة') || title.includes('الصفا') || title.includes('عرفة') || title.includes('الجمار') || title.includes('المحرم') || title.includes('الركن') || title.includes('المشعر')) return 'hajj';
  
  return 'misc';
}

// Get chapters grouped by category
export async function getGroupedChapters(): Promise<Record<string, HisnChapter[]>> {
  await loadAllData();
  
  const grouped: Record<string, HisnChapter[]> = {};
  
  for (const chapter of allChapters) {
    const category = getCategoryForChapter(chapter.title);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(chapter);
  }
  
  return grouped;
}

// Search adhkar
export async function searchAdhkar(query: string): Promise<{ chapter: HisnChapter; dhikr: HisnDhikr }[]> {
  await loadAllData();
  const results: { chapter: HisnChapter; dhikr: HisnDhikr }[] = [];
  
  for (const chapter of allChapters) {
    if (chapter.title.includes(query)) {
      for (const dhikr of chapter.adhkar) {
        results.push({ chapter, dhikr });
      }
    } else {
      for (const dhikr of chapter.adhkar) {
        if (dhikr.ARABIC_TEXT?.includes(query)) {
          results.push({ chapter, dhikr });
        }
      }
    }
  }
  
  return results;
}
