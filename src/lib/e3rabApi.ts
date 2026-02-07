// E3rab (Quran Grammatical Analysis) API

export interface E3rabItem {
  id: number;
  sura: number;
  aya: number;
  text: string;
}

let e3rabCache: E3rabItem[] | null = null;

export async function fetchE3rabData(): Promise<E3rabItem[]> {
  if (e3rabCache) return e3rabCache;
  
  try {
    const response = await fetch('/data/e3rab.json');
    if (!response.ok) throw new Error('Failed to fetch e3rab data');
    const data = await response.json();
    e3rabCache = data;
    return data;
  } catch (error) {
    console.error('Error fetching e3rab data:', error);
    return [];
  }
}

export async function fetchE3rabBySurah(surahNumber: number): Promise<E3rabItem[]> {
  const data = await fetchE3rabData();
  return data.filter(item => item.sura === surahNumber);
}

export async function fetchE3rabByAyah(surahNumber: number, ayahNumber: number): Promise<E3rabItem | null> {
  const data = await fetchE3rabData();
  return data.find(item => item.sura === surahNumber && item.aya === ayahNumber) || null;
}

// Surah names for reference
export const surahNames = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha' },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah' },
  { number: 3, name: 'آل عمران', englishName: 'Aal-Imran' },
  { number: 4, name: 'النساء', englishName: 'An-Nisa' },
  { number: 5, name: 'المائدة', englishName: 'Al-Maidah' },
  { number: 6, name: 'الأنعام', englishName: 'Al-Anam' },
  { number: 7, name: 'الأعراف', englishName: 'Al-Araf' },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal' },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah' },
  { number: 10, name: 'يونس', englishName: 'Yunus' },
  { number: 11, name: 'هود', englishName: 'Hud' },
  { number: 12, name: 'يوسف', englishName: 'Yusuf' },
  { number: 13, name: 'الرعد', englishName: 'Ar-Rad' },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim' },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr' },
  { number: 16, name: 'النحل', englishName: 'An-Nahl' },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra' },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf' },
  { number: 19, name: 'مريم', englishName: 'Maryam' },
  { number: 20, name: 'طه', englishName: 'Ta-Ha' },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya' },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj' },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun' },
  { number: 24, name: 'النور', englishName: 'An-Nur' },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqan' },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara' },
  { number: 27, name: 'النمل', englishName: 'An-Naml' },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas' },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut' },
  { number: 30, name: 'الروم', englishName: 'Ar-Rum' },
  { number: 31, name: 'لقمان', englishName: 'Luqman' },
  { number: 32, name: 'السجدة', englishName: 'As-Sajdah' },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab' },
  { number: 34, name: 'سبأ', englishName: 'Saba' },
  { number: 35, name: 'فاطر', englishName: 'Fatir' },
  { number: 36, name: 'يس', englishName: 'Ya-Sin' },
  { number: 37, name: 'الصافات', englishName: 'As-Saffat' },
  { number: 38, name: 'ص', englishName: 'Sad' },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar' },
  { number: 40, name: 'غافر', englishName: 'Ghafir' },
  { number: 41, name: 'فصلت', englishName: 'Fussilat' },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura' },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf' },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan' },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah' },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf' },
  { number: 47, name: 'محمد', englishName: 'Muhammad' },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath' },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat' },
  { number: 50, name: 'ق', englishName: 'Qaf' },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat' },
  { number: 52, name: 'الطور', englishName: 'At-Tur' },
  { number: 53, name: 'النجم', englishName: 'An-Najm' },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar' },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman' },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah' },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid' },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujadilah' },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr' },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah' },
  { number: 61, name: 'الصف', englishName: 'As-Saff' },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah' },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun' },
  { number: 64, name: 'التغابن', englishName: 'At-Taghabun' },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaq' },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim' },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk' },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam' },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah' },
  { number: 70, name: 'المعارج', englishName: 'Al-Maarij' },
  { number: 71, name: 'نوح', englishName: 'Nuh' },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn' },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil' },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir' },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah' },
  { number: 76, name: 'الإنسان', englishName: 'Al-Insan' },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat' },
  { number: 78, name: 'النبأ', englishName: 'An-Naba' },
  { number: 79, name: 'النازعات', englishName: 'An-Naziat' },
  { number: 80, name: 'عبس', englishName: 'Abasa' },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir' },
  { number: 82, name: 'الانفطار', englishName: 'Al-Infitar' },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin' },
  { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq' },
  { number: 85, name: 'البروج', englishName: 'Al-Buruj' },
  { number: 86, name: 'الطارق', englishName: 'At-Tariq' },
  { number: 87, name: 'الأعلى', englishName: 'Al-Ala' },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah' },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr' },
  { number: 90, name: 'البلد', englishName: 'Al-Balad' },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams' },
  { number: 92, name: 'الليل', englishName: 'Al-Layl' },
  { number: 93, name: 'الضحى', englishName: 'Ad-Duha' },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh' },
  { number: 95, name: 'التين', englishName: 'At-Tin' },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq' },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr' },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyinah' },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah' },
  { number: 100, name: 'العاديات', englishName: 'Al-Adiyat' },
  { number: 101, name: 'القارعة', englishName: 'Al-Qariah' },
  { number: 102, name: 'التكاثر', englishName: 'At-Takathur' },
  { number: 103, name: 'العصر', englishName: 'Al-Asr' },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humazah' },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil' },
  { number: 106, name: 'قريش', englishName: 'Quraysh' },
  { number: 107, name: 'الماعون', englishName: 'Al-Maun' },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar' },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun' },
  { number: 110, name: 'النصر', englishName: 'An-Nasr' },
  { number: 111, name: 'المسد', englishName: 'Al-Masad' },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas' },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq' },
  { number: 114, name: 'الناس', englishName: 'An-Nas' },
];
