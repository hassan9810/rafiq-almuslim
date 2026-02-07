// Mushaf API - Complete integration with mp3quran.net and quran.cloud

const MP3_QURAN_API = 'https://mp3quran.net/api/v3';
const QURAN_API = 'https://api.alquran.cloud/v1';

// Surah to Page mapping for Madinah Mushaf (604 pages)
export const surahPageMap: { [key: number]: number } = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187,
  10: 208, 11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282,
  18: 293, 19: 305, 20: 312, 21: 322, 22: 332, 23: 342, 24: 350, 25: 359,
  26: 367, 27: 377, 28: 385, 29: 396, 30: 404, 31: 411, 32: 415, 33: 418,
  34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467, 41: 477,
  42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515,
  50: 518, 51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537,
  58: 542, 59: 545, 60: 549, 61: 551, 62: 553, 63: 554, 64: 556, 65: 558,
  66: 560, 67: 562, 68: 564, 69: 566, 70: 568, 71: 570, 72: 572, 73: 574,
  74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585, 81: 586,
  82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593,
  90: 594, 91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598,
  98: 598, 99: 599, 100: 599, 101: 600, 102: 600, 103: 601, 104: 601, 105: 601,
  106: 602, 107: 602, 108: 602, 109: 603, 110: 603, 111: 603, 112: 604, 113: 604, 114: 604
};

// Juz to Page mapping
export const juzPageMap: { [key: number]: number } = {
  1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 121, 8: 142,
  9: 162, 10: 182, 11: 201, 12: 222, 13: 242, 14: 262, 15: 282,
  16: 302, 17: 322, 18: 342, 19: 362, 20: 382, 21: 402, 22: 422,
  23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582
};

// Hizb to Page mapping (precise Madinah Mushaf)
export const hizbPageMap: { [key: number]: number } = {
  1: 1, 2: 12, 3: 22, 4: 32, 5: 42, 6: 52, 7: 62, 8: 72,
  9: 82, 10: 92, 11: 102, 12: 112, 13: 122, 14: 132, 15: 142, 16: 152,
  17: 162, 18: 173, 19: 182, 20: 192, 21: 202, 22: 212, 23: 222, 24: 232,
  25: 242, 26: 252, 27: 262, 28: 272, 29: 282, 30: 292, 31: 302, 32: 312,
  33: 322, 34: 332, 35: 342, 36: 352, 37: 362, 38: 372, 39: 382, 40: 392,
  41: 402, 42: 413, 43: 422, 44: 432, 45: 442, 46: 452, 47: 462, 48: 472,
  49: 482, 50: 492, 51: 502, 52: 513, 53: 522, 54: 532, 55: 542, 56: 553,
  57: 562, 58: 572, 59: 582, 60: 592
};

// Quarter (Rub) markers - each Hizb has 4 quarters
// Quarter number is 1-240 total (60 hizb × 4 quarters)
export const quarterPageMap: { [key: number]: number } = {
  // Hizb 1 quarters
  1: 1, 2: 4, 3: 7, 4: 10,
  // Hizb 2 quarters
  5: 12, 6: 15, 7: 18, 8: 20,
  // Hizb 3 quarters
  9: 22, 10: 25, 11: 27, 12: 30,
  // Hizb 4 quarters
  13: 32, 14: 35, 15: 37, 16: 40,
  // Hizb 5 quarters
  17: 42, 18: 45, 19: 47, 20: 50,
  // Hizb 6 quarters
  21: 52, 22: 55, 23: 57, 24: 60,
  // Hizb 7 quarters
  25: 62, 26: 65, 27: 67, 28: 70,
  // Hizb 8 quarters
  29: 72, 30: 75, 31: 77, 32: 80,
  // Hizb 9 quarters
  33: 82, 34: 85, 35: 87, 36: 90,
  // Hizb 10 quarters
  37: 92, 38: 95, 39: 97, 40: 100,
  // Simplified: continue pattern for remaining quarters
  41: 102, 42: 105, 43: 107, 44: 110,
  45: 112, 46: 115, 47: 117, 48: 120,
  49: 122, 50: 125, 51: 127, 52: 130,
  53: 132, 54: 135, 55: 137, 56: 140,
  57: 142, 58: 145, 59: 147, 60: 150,
  61: 152, 62: 155, 63: 158, 64: 160,
  65: 162, 66: 165, 67: 168, 68: 170,
  69: 173, 70: 175, 71: 178, 72: 180,
  73: 182, 74: 185, 75: 187, 76: 190,
  77: 192, 78: 195, 79: 197, 80: 200,
  81: 202, 82: 205, 83: 207, 84: 210,
  85: 212, 86: 215, 87: 217, 88: 220,
  89: 222, 90: 225, 91: 227, 92: 230,
  93: 232, 94: 235, 95: 237, 96: 240,
  97: 242, 98: 245, 99: 247, 100: 250,
  101: 252, 102: 255, 103: 257, 104: 260,
  105: 262, 106: 265, 107: 267, 108: 270,
  109: 272, 110: 275, 111: 277, 112: 280,
  113: 282, 114: 285, 115: 287, 116: 290,
  117: 292, 118: 295, 119: 297, 120: 300,
  121: 302, 122: 305, 123: 307, 124: 310,
  125: 312, 126: 315, 127: 317, 128: 320,
  129: 322, 130: 325, 131: 327, 132: 330,
  133: 332, 134: 335, 135: 337, 136: 340,
  137: 342, 138: 345, 139: 347, 140: 350,
  141: 352, 142: 355, 143: 357, 144: 360,
  145: 362, 146: 365, 147: 367, 148: 370,
  149: 372, 150: 375, 151: 377, 152: 380,
  153: 382, 154: 385, 155: 387, 156: 390,
  157: 392, 158: 395, 159: 397, 160: 400,
  161: 402, 162: 405, 163: 408, 164: 410,
  165: 413, 166: 415, 167: 418, 168: 420,
  169: 422, 170: 425, 171: 427, 172: 430,
  173: 432, 174: 435, 175: 437, 176: 440,
  177: 442, 178: 445, 179: 447, 180: 450,
  181: 452, 182: 455, 183: 457, 184: 460,
  185: 462, 186: 465, 187: 467, 188: 470,
  189: 472, 190: 475, 191: 477, 192: 480,
  193: 482, 194: 485, 195: 487, 196: 490,
  197: 492, 198: 495, 199: 498, 200: 500,
  201: 502, 202: 505, 203: 508, 204: 510,
  205: 513, 206: 515, 207: 518, 208: 520,
  209: 522, 210: 525, 211: 527, 212: 530,
  213: 532, 214: 535, 215: 537, 216: 540,
  217: 542, 218: 545, 219: 548, 220: 550,
  221: 553, 222: 555, 223: 558, 224: 560,
  225: 562, 226: 565, 227: 567, 228: 570,
  229: 572, 230: 575, 231: 577, 232: 580,
  233: 582, 234: 585, 235: 587, 236: 590,
  237: 592, 238: 595, 239: 597, 240: 600
};

// Check if page is start of a Hizb
export function isHizbStart(page: number): number | null {
  for (const [hizb, startPage] of Object.entries(hizbPageMap)) {
    if (startPage === page) return parseInt(hizb);
  }
  return null;
}

// Check if page is start of a quarter (Rub)
export function isQuarterStart(page: number): { quarter: number; position: 1 | 2 | 3 | 4 } | null {
  for (const [quarter, startPage] of Object.entries(quarterPageMap)) {
    if (startPage === page) {
      const q = parseInt(quarter);
      const position = ((q - 1) % 4) + 1 as 1 | 2 | 3 | 4;
      return { quarter: q, position };
    }
  }
  return null;
}

// Page to Surah mapping
export const pageToSurahMap: { [key: number]: { surah: number; name: string; nameAr: string }[] } = {};

// Surah names
export const surahNames: { number: number; name: string; nameAr: string }[] = [
  { number: 1, name: 'Al-Fatiha', nameAr: 'الفاتحة' },
  { number: 2, name: 'Al-Baqarah', nameAr: 'البقرة' },
  { number: 3, name: 'Aal-Imran', nameAr: 'آل عمران' },
  { number: 4, name: 'An-Nisa', nameAr: 'النساء' },
  { number: 5, name: 'Al-Maidah', nameAr: 'المائدة' },
  { number: 6, name: 'Al-Anam', nameAr: 'الأنعام' },
  { number: 7, name: 'Al-Araf', nameAr: 'الأعراف' },
  { number: 8, name: 'Al-Anfal', nameAr: 'الأنفال' },
  { number: 9, name: 'At-Tawbah', nameAr: 'التوبة' },
  { number: 10, name: 'Yunus', nameAr: 'يونس' },
  { number: 11, name: 'Hud', nameAr: 'هود' },
  { number: 12, name: 'Yusuf', nameAr: 'يوسف' },
  { number: 13, name: 'Ar-Rad', nameAr: 'الرعد' },
  { number: 14, name: 'Ibrahim', nameAr: 'إبراهيم' },
  { number: 15, name: 'Al-Hijr', nameAr: 'الحجر' },
  { number: 16, name: 'An-Nahl', nameAr: 'النحل' },
  { number: 17, name: 'Al-Isra', nameAr: 'الإسراء' },
  { number: 18, name: 'Al-Kahf', nameAr: 'الكهف' },
  { number: 19, name: 'Maryam', nameAr: 'مريم' },
  { number: 20, name: 'Ta-Ha', nameAr: 'طه' },
  { number: 21, name: 'Al-Anbiya', nameAr: 'الأنبياء' },
  { number: 22, name: 'Al-Hajj', nameAr: 'الحج' },
  { number: 23, name: 'Al-Muminun', nameAr: 'المؤمنون' },
  { number: 24, name: 'An-Nur', nameAr: 'النور' },
  { number: 25, name: 'Al-Furqan', nameAr: 'الفرقان' },
  { number: 26, name: 'Ash-Shuara', nameAr: 'الشعراء' },
  { number: 27, name: 'An-Naml', nameAr: 'النمل' },
  { number: 28, name: 'Al-Qasas', nameAr: 'القصص' },
  { number: 29, name: 'Al-Ankabut', nameAr: 'العنكبوت' },
  { number: 30, name: 'Ar-Rum', nameAr: 'الروم' },
  { number: 31, name: 'Luqman', nameAr: 'لقمان' },
  { number: 32, name: 'As-Sajdah', nameAr: 'السجدة' },
  { number: 33, name: 'Al-Ahzab', nameAr: 'الأحزاب' },
  { number: 34, name: 'Saba', nameAr: 'سبأ' },
  { number: 35, name: 'Fatir', nameAr: 'فاطر' },
  { number: 36, name: 'Ya-Sin', nameAr: 'يس' },
  { number: 37, name: 'As-Saffat', nameAr: 'الصافات' },
  { number: 38, name: 'Sad', nameAr: 'ص' },
  { number: 39, name: 'Az-Zumar', nameAr: 'الزمر' },
  { number: 40, name: 'Ghafir', nameAr: 'غافر' },
  { number: 41, name: 'Fussilat', nameAr: 'فصلت' },
  { number: 42, name: 'Ash-Shura', nameAr: 'الشورى' },
  { number: 43, name: 'Az-Zukhruf', nameAr: 'الزخرف' },
  { number: 44, name: 'Ad-Dukhan', nameAr: 'الدخان' },
  { number: 45, name: 'Al-Jathiyah', nameAr: 'الجاثية' },
  { number: 46, name: 'Al-Ahqaf', nameAr: 'الأحقاف' },
  { number: 47, name: 'Muhammad', nameAr: 'محمد' },
  { number: 48, name: 'Al-Fath', nameAr: 'الفتح' },
  { number: 49, name: 'Al-Hujurat', nameAr: 'الحجرات' },
  { number: 50, name: 'Qaf', nameAr: 'ق' },
  { number: 51, name: 'Adh-Dhariyat', nameAr: 'الذاريات' },
  { number: 52, name: 'At-Tur', nameAr: 'الطور' },
  { number: 53, name: 'An-Najm', nameAr: 'النجم' },
  { number: 54, name: 'Al-Qamar', nameAr: 'القمر' },
  { number: 55, name: 'Ar-Rahman', nameAr: 'الرحمن' },
  { number: 56, name: 'Al-Waqiah', nameAr: 'الواقعة' },
  { number: 57, name: 'Al-Hadid', nameAr: 'الحديد' },
  { number: 58, name: 'Al-Mujadila', nameAr: 'المجادلة' },
  { number: 59, name: 'Al-Hashr', nameAr: 'الحشر' },
  { number: 60, name: 'Al-Mumtahanah', nameAr: 'الممتحنة' },
  { number: 61, name: 'As-Saff', nameAr: 'الصف' },
  { number: 62, name: 'Al-Jumuah', nameAr: 'الجمعة' },
  { number: 63, name: 'Al-Munafiqun', nameAr: 'المنافقون' },
  { number: 64, name: 'At-Taghabun', nameAr: 'التغابن' },
  { number: 65, name: 'At-Talaq', nameAr: 'الطلاق' },
  { number: 66, name: 'At-Tahrim', nameAr: 'التحريم' },
  { number: 67, name: 'Al-Mulk', nameAr: 'الملك' },
  { number: 68, name: 'Al-Qalam', nameAr: 'القلم' },
  { number: 69, name: 'Al-Haqqah', nameAr: 'الحاقة' },
  { number: 70, name: 'Al-Maarij', nameAr: 'المعارج' },
  { number: 71, name: 'Nuh', nameAr: 'نوح' },
  { number: 72, name: 'Al-Jinn', nameAr: 'الجن' },
  { number: 73, name: 'Al-Muzzammil', nameAr: 'المزمل' },
  { number: 74, name: 'Al-Muddaththir', nameAr: 'المدثر' },
  { number: 75, name: 'Al-Qiyamah', nameAr: 'القيامة' },
  { number: 76, name: 'Al-Insan', nameAr: 'الإنسان' },
  { number: 77, name: 'Al-Mursalat', nameAr: 'المرسلات' },
  { number: 78, name: 'An-Naba', nameAr: 'النبأ' },
  { number: 79, name: 'An-Naziat', nameAr: 'النازعات' },
  { number: 80, name: 'Abasa', nameAr: 'عبس' },
  { number: 81, name: 'At-Takwir', nameAr: 'التكوير' },
  { number: 82, name: 'Al-Infitar', nameAr: 'الانفطار' },
  { number: 83, name: 'Al-Mutaffifin', nameAr: 'المطففين' },
  { number: 84, name: 'Al-Inshiqaq', nameAr: 'الانشقاق' },
  { number: 85, name: 'Al-Buruj', nameAr: 'البروج' },
  { number: 86, name: 'At-Tariq', nameAr: 'الطارق' },
  { number: 87, name: 'Al-Ala', nameAr: 'الأعلى' },
  { number: 88, name: 'Al-Ghashiyah', nameAr: 'الغاشية' },
  { number: 89, name: 'Al-Fajr', nameAr: 'الفجر' },
  { number: 90, name: 'Al-Balad', nameAr: 'البلد' },
  { number: 91, name: 'Ash-Shams', nameAr: 'الشمس' },
  { number: 92, name: 'Al-Layl', nameAr: 'الليل' },
  { number: 93, name: 'Ad-Duhaa', nameAr: 'الضحى' },
  { number: 94, name: 'Ash-Sharh', nameAr: 'الشرح' },
  { number: 95, name: 'At-Tin', nameAr: 'التين' },
  { number: 96, name: 'Al-Alaq', nameAr: 'العلق' },
  { number: 97, name: 'Al-Qadr', nameAr: 'القدر' },
  { number: 98, name: 'Al-Bayyinah', nameAr: 'البينة' },
  { number: 99, name: 'Az-Zalzalah', nameAr: 'الزلزلة' },
  { number: 100, name: 'Al-Adiyat', nameAr: 'العاديات' },
  { number: 101, name: 'Al-Qariah', nameAr: 'القارعة' },
  { number: 102, name: 'At-Takathur', nameAr: 'التكاثر' },
  { number: 103, name: 'Al-Asr', nameAr: 'العصر' },
  { number: 104, name: 'Al-Humazah', nameAr: 'الهمزة' },
  { number: 105, name: 'Al-Fil', nameAr: 'الفيل' },
  { number: 106, name: 'Quraysh', nameAr: 'قريش' },
  { number: 107, name: 'Al-Maun', nameAr: 'الماعون' },
  { number: 108, name: 'Al-Kawthar', nameAr: 'الكوثر' },
  { number: 109, name: 'Al-Kafirun', nameAr: 'الكافرون' },
  { number: 110, name: 'An-Nasr', nameAr: 'النصر' },
  { number: 111, name: 'Al-Masad', nameAr: 'المسد' },
  { number: 112, name: 'Al-Ikhlas', nameAr: 'الإخلاص' },
  { number: 113, name: 'Al-Falaq', nameAr: 'الفلق' },
  { number: 114, name: 'An-Nas', nameAr: 'الناس' }
];

// Initialize pageToSurahMap
for (let page = 1; page <= 604; page++) {
  pageToSurahMap[page] = [];
  for (let i = 114; i >= 1; i--) {
    if (surahPageMap[i] <= page) {
      const surah = surahNames.find(s => s.number === i);
      if (surah) {
        pageToSurahMap[page].push({ surah: surah.number, name: surah.name, nameAr: surah.nameAr });
      }
      break;
    }
  }
}

export interface AyahTiming {
  surah: number;
  ayah: number;
  start: number;
  end: number;
}

export interface PageAyahs {
  page: number;
  ayahs: {
    surah: number;
    ayah: number;
    text: string;
    translation?: string;
  }[];
}

// Fetch ayah timings for a reciter/surah (for audio sync)
export async function fetchAyahTimings(reciterId: number, surahNumber: number): Promise<AyahTiming[]> {
  try {
    const response = await fetch(
      `${MP3_QURAN_API}/ayat_timing?reciter_id=${reciterId}&sura_id=${surahNumber}`
    );
    const data = await response.json();
    
    if (data.ayat_timing && Array.isArray(data.ayat_timing)) {
      return data.ayat_timing.map((t: any) => ({
        surah: surahNumber,
        ayah: t.aya_id,
        start: t.start_time / 1000, // Convert to seconds
        end: t.end_time / 1000
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching ayah timings:', error);
    return [];
  }
}

// Fetch page ayahs with Arabic text
export async function fetchPageAyahs(pageNumber: number): Promise<PageAyahs | null> {
  try {
    const response = await fetch(`${QURAN_API}/page/${pageNumber}/quran-uthmani`);
    const data = await response.json();
    
    if (data.data && data.data.ayahs) {
      return {
        page: pageNumber,
        ayahs: data.data.ayahs.map((ayah: any) => ({
          surah: ayah.surah.number,
          ayah: ayah.numberInSurah,
          text: ayah.text
        }))
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching page ayahs:', error);
    return null;
  }
}

// Fetch page ayahs with translation
export async function fetchPageWithTranslation(
  pageNumber: number, 
  translationEdition: string = 'en.sahih'
): Promise<PageAyahs | null> {
  try {
    const [arabicRes, translationRes] = await Promise.all([
      fetch(`${QURAN_API}/page/${pageNumber}/quran-uthmani`),
      fetch(`${QURAN_API}/page/${pageNumber}/${translationEdition}`)
    ]);
    
    const arabicData = await arabicRes.json();
    const translationData = await translationRes.json();
    
    if (arabicData.data && translationData.data) {
      const translations = translationData.data.ayahs.reduce((acc: any, ayah: any) => {
        acc[`${ayah.surah.number}:${ayah.numberInSurah}`] = ayah.text;
        return acc;
      }, {});
      
      return {
        page: pageNumber,
        ayahs: arabicData.data.ayahs.map((ayah: any) => ({
          surah: ayah.surah.number,
          ayah: ayah.numberInSurah,
          text: ayah.text,
          translation: translations[`${ayah.surah.number}:${ayah.numberInSurah}`]
        }))
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching page with translation:', error);
    return null;
  }
}

// Get Juz number for a page
export function getJuzForPage(page: number): number {
  for (let juz = 30; juz >= 1; juz--) {
    if (juzPageMap[juz] <= page) {
      return juz;
    }
  }
  return 1;
}

// Get Hizb number for a page
export function getHizbForPage(page: number): number {
  for (let hizb = 60; hizb >= 1; hizb--) {
    if (hizbPageMap[hizb] <= page) {
      return hizb;
    }
  }
  return 1;
}

// Get Surah info for a page
export function getSurahForPage(page: number): { number: number; name: string; nameAr: string } | null {
  const surahs = pageToSurahMap[page];
  if (surahs && surahs.length > 0) {
    const s = surahs[0];
    return { number: s.surah, name: s.name, nameAr: s.nameAr };
  }
  return null;
}

// Mushaf editions with proper configuration
export interface MushafEdition {
  id: string;
  name: string;
  nameAr: string;
  baseUrl: string;
  startPage: number;
  endPage: number;
  extension: string;
  padLength: number;
  rewayah: string;
}

export const mushafEditions: MushafEdition[] = [
  {
    id: 'medina',
    name: 'Medina Mushaf',
    nameAr: 'مصحف المدينة المنورة',
    baseUrl: 'https://app.quranflash.com/book/Medina1/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 606,
    extension: 'gif',
    padLength: 4,
    rewayah: 'hafs'
  },
  {
    id: 'ksu',
    name: 'King Saud University',
    nameAr: 'مصحف جامعة الملك سعود',
    baseUrl: 'https://quran.ksu.edu.sa/ayat/safahat1/',
    startPage: 1,
    endPage: 604,
    extension: 'png',
    padLength: 0,
    rewayah: 'hafs'
  },
  {
    id: 'tajweed',
    name: 'Tajweed Mushaf',
    nameAr: 'مصحف التجويد',
    baseUrl: 'https://app.quranflash.com/book/Tajweed/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 604,
    extension: 'png',
    padLength: 3,
    rewayah: 'hafs'
  },
  {
    id: 'warsh',
    name: 'Warsh Mushaf',
    nameAr: 'مصحف ورش',
    baseUrl: 'https://app.quranflash.com/book/Warsh1/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 563,
    extension: 'png',
    padLength: 4,
    rewayah: 'warsh'
  },
  {
    id: 'qaloon',
    name: 'Qaloon Mushaf',
    nameAr: 'مصحف قالون',
    baseUrl: 'https://app.quranflash.com/book/Qaloon/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 563,
    extension: 'png',
    padLength: 4,
    rewayah: 'qaloon'
  },
  {
    id: 'medinaNabawiya',
    name: 'Medina Nabawiya',
    nameAr: 'مصحف المدينة النبوية',
    baseUrl: 'https://www.mp3quran.net/mushaf2/',
    startPage: 4,
    endPage: 638,
    extension: 'jpg',
    padLength: 0,
    rewayah: 'hafs'
  }
];

// Get page URL for edition
export function getPageUrl(edition: MushafEdition, page: number): string {
  if (edition.padLength > 0) {
    const paddedPage = page.toString().padStart(edition.padLength, '0');
    return `${edition.baseUrl}${paddedPage}.${edition.extension}`;
  }
  return `${edition.baseUrl}${page}.${edition.extension}`;
}

// Sajda positions in the Quran
export const sajdaPositions: { surah: number; ayah: number; page: number }[] = [
  { surah: 7, ayah: 206, page: 176 },
  { surah: 13, ayah: 15, page: 252 },
  { surah: 16, ayah: 50, page: 272 },
  { surah: 17, ayah: 109, page: 293 },
  { surah: 19, ayah: 58, page: 309 },
  { surah: 22, ayah: 18, page: 334 },
  { surah: 22, ayah: 77, page: 341 },
  { surah: 25, ayah: 60, page: 365 },
  { surah: 27, ayah: 26, page: 379 },
  { surah: 32, ayah: 15, page: 416 },
  { surah: 38, ayah: 24, page: 454 },
  { surah: 41, ayah: 38, page: 480 },
  { surah: 53, ayah: 62, page: 528 },
  { surah: 84, ayah: 21, page: 589 },
  { surah: 96, ayah: 19, page: 597 }
];

// Check if page has sajda
export function hasSajda(page: number): boolean {
  return sajdaPositions.some(s => s.page === page);
}

// Get sajda info for page
export function getSajdaForPage(page: number): { surah: number; ayah: number } | null {
  const sajda = sajdaPositions.find(s => s.page === page);
  return sajda ? { surah: sajda.surah, ayah: sajda.ayah } : null;
}
