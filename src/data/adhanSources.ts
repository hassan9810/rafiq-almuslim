export interface AdhanSource {
  id: string;
  nameAr: string;
  nameEn: string;
  /** Regular prayer adhan */
  audioUrl: string;
  /** Optional Fajr adhan (includes "As-salatu khayrun mina an-nawm") */
  fajrAudioUrl?: string;
}

export const adhanSources: AdhanSource[] = [
  {
    id: 'makkah',
    nameAr: 'الحرم المكي - مكة المكرمة',
    nameEn: 'Masjid Al-Haram – Makkah',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan1.mp3',
    fajrAudioUrl: 'https://www.islamcan.com/audio/adhan/fajr1.mp3',
  },
  {
    id: 'madinah',
    nameAr: 'الحرم المدني - المدينة المنورة',
    nameEn: 'Masjid An-Nabawi – Madinah',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan2.mp3',
    fajrAudioUrl: 'https://www.islamcan.com/audio/adhan/fajr2.mp3',
  },
  {
    id: 'mishary',
    nameAr: 'مشاري راشد العفاسي',
    nameEn: 'Mishary Rashid Al-Afasy',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan3.mp3',
  },
  {
    id: 'abdulbasit',
    nameAr: 'عبد الباسط عبد الصمد',
    nameEn: 'Abdul Basit Abd Al-Samad',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan4.mp3',
  },
  {
    id: 'aqsa',
    nameAr: 'المسجد الأقصى',
    nameEn: 'Al-Aqsa Mosque',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan5.mp3',
  },
  {
    id: 'turkey',
    nameAr: 'الأذان التركي - ديانت',
    nameEn: 'Turkish Adhan – Diyanet',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan6.mp3',
  },
  {
    id: 'egypt',
    nameAr: 'الأذان المصري',
    nameEn: 'Egyptian Adhan',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan7.mp3',
  },
  {
    id: 'ali_mulla',
    nameAr: 'علي أحمد ملا',
    nameEn: 'Ali Ahmed Mulla',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan8.mp3',
  },
  {
    id: 'nasser_qatami',
    nameAr: 'ناصر القطامي',
    nameEn: 'Nasser Al-Qatami',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan9.mp3',
  },
  {
    id: 'sudais',
    nameAr: 'عبدالرحمن السديس',
    nameEn: 'Abdul Rahman Al-Sudais',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan10.mp3',
  },
  {
    id: 'shuraim',
    nameAr: 'سعود الشريم',
    nameEn: 'Saud Al-Shuraim',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan11.mp3',
  },
  {
    id: 'classic',
    nameAr: 'الأذان الكلاسيكي',
    nameEn: 'Classic Adhan',
    audioUrl: 'https://www.islamcan.com/audio/adhan/azan12.mp3',
  },
];

export const DEFAULT_ADHAN_ID = 'egypt';

export function getAdhanSource(id: string): AdhanSource {
  return adhanSources.find(s => s.id === id) ?? adhanSources[0];
}
