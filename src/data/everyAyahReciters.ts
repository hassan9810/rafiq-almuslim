// EveryAyah.com reciters data and helpers

export const AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
  5, 4, 5, 6
];

export interface EveryAyahReciter {
  id: number;
  subfolder: string;
  nameEn: string;
  nameAr: string;
  bitrate: string;
  category: 'egyptian' | 'haramain' | 'other' | 'translation';
}

export const EVERY_AYAH_RECITERS: EveryAyahReciter[] = [
  // Egyptian Reciters (at top)
  { id: 1, subfolder: 'Abdul_Basit_Murattal_64kbps', nameEn: 'Abdul Basit (Murattal)', nameAr: 'عبد الباسط عبد الصمد (مرتل)', bitrate: '64kbps', category: 'egyptian' },
  { id: 2, subfolder: 'Abdul_Basit_Murattal_192kbps', nameEn: 'Abdul Basit (Murattal HQ)', nameAr: 'عبد الباسط عبد الصمد (مرتل عالي الجودة)', bitrate: '192kbps', category: 'egyptian' },
  { id: 3, subfolder: 'Abdul_Basit_Mujawwad_128kbps', nameEn: 'Abdul Basit (Mujawwad)', nameAr: 'عبد الباسط عبد الصمد (مجود)', bitrate: '128kbps', category: 'egyptian' },
  { id: 9, subfolder: 'AbdulSamad_64kbps_QuranExplorer.Com', nameEn: 'Abdul Samad', nameAr: 'عبد الباسط عبد الصمد (مختلف)', bitrate: '64kbps', category: 'egyptian' },
  { id: 19, subfolder: 'Husary_64kbps', nameEn: 'Husary (Murattal)', nameAr: 'محمود خليل الحصري (مرتل)', bitrate: '64kbps', category: 'egyptian' },
  { id: 20, subfolder: 'Husary_128kbps', nameEn: 'Husary (Murattal HQ)', nameAr: 'محمود خليل الحصري (مرتل عالي الجودة)', bitrate: '128kbps', category: 'egyptian' },
  { id: 21, subfolder: 'Husary_Mujawwad_64kbps', nameEn: 'Husary (Mujawwad)', nameAr: 'محمود خليل الحصري (مجود)', bitrate: '64kbps', category: 'egyptian' },
  { id: 22, subfolder: 'Husary_128kbps_Mujawwad', nameEn: 'Husary (Mujawwad HQ)', nameAr: 'محمود خليل الحصري (مجود عالي الجودة)', bitrate: '128kbps', category: 'egyptian' },
  { id: 65, subfolder: 'Husary_Muallim_128kbps', nameEn: 'Husary (Muallim)', nameAr: 'محمود خليل الحصري (معلم)', bitrate: '128kbps', category: 'egyptian' },
  { id: 30, subfolder: 'Menshawi_16kbps', nameEn: 'Menshawi (16kbps)', nameAr: 'محمد صديق المنشاوي', bitrate: '16kbps', category: 'egyptian' },
  { id: 31, subfolder: 'Menshawi_32kbps', nameEn: 'Menshawi (32kbps)', nameAr: 'محمد صديق المنشاوي', bitrate: '32kbps', category: 'egyptian' },
  { id: 32, subfolder: 'Minshawy_Mujawwad_64kbps', nameEn: 'Minshawy (Mujawwad)', nameAr: 'المنشاوي (مجود)', bitrate: '64kbps', category: 'egyptian' },
  { id: 33, subfolder: 'Minshawy_Mujawwad_192kbps', nameEn: 'Minshawy (Mujawwad HQ)', nameAr: 'المنشاوي (مجود عالي الجودة)', bitrate: '192kbps', category: 'egyptian' },
  { id: 34, subfolder: 'Minshawy_Murattal_128kbps', nameEn: 'Minshawy (Murattal)', nameAr: 'المنشاوي (مرتل)', bitrate: '128kbps', category: 'egyptian' },
  { id: 35, subfolder: 'Mohammad_al_Tablaway_64kbps', nameEn: 'Mohammad al-Tablaway', nameAr: 'محمد الطبلاوي', bitrate: '64kbps', category: 'egyptian' },
  { id: 36, subfolder: 'Mohammad_al_Tablaway_128kbps', nameEn: 'Mohammad al-Tablaway (HQ)', nameAr: 'محمد الطبلاوي (عالي الجودة)', bitrate: '128kbps', category: 'egyptian' },
  { id: 42, subfolder: 'Mustafa_Ismail_48kbps', nameEn: 'Mustafa Ismail', nameAr: 'مصطفى إسماعيل', bitrate: '48kbps', category: 'egyptian' },
  { id: 59, subfolder: 'mahmoud_ali_al_banna_32kbps', nameEn: 'Mahmoud Ali Al-Banna', nameAr: 'محمود علي البنا', bitrate: '32kbps', category: 'egyptian' },
  { id: 56, subfolder: 'Ahmed_Neana_128kbps', nameEn: 'Ahmed Neana', nameAr: 'أحمد نعينع', bitrate: '128kbps', category: 'egyptian' },
  { id: 69, subfolder: 'Ali_Hajjaj_AlSuesy_128kbps', nameEn: 'Ali Hajjaj Al-Suesy', nameAr: 'علي حجاج السويسي', bitrate: '128kbps', category: 'egyptian' },
  { id: 40, subfolder: 'Muhammad_Jibreel_64kbps', nameEn: 'Muhammad Jibreel', nameAr: 'محمد جبريل', bitrate: '64kbps', category: 'egyptian' },
  { id: 41, subfolder: 'Muhammad_Jibreel_128kbps', nameEn: 'Muhammad Jibreel (HQ)', nameAr: 'محمد جبريل (عالي الجودة)', bitrate: '128kbps', category: 'egyptian' },

  // Haramain Reciters
  { id: 7, subfolder: 'Abdurrahmaan_As-Sudais_64kbps', nameEn: 'Abdurrahman As-Sudais', nameAr: 'عبدالرحمن السديس', bitrate: '64kbps', category: 'haramain' },
  { id: 8, subfolder: 'Abdurrahmaan_As-Sudais_192kbps', nameEn: 'Abdurrahman As-Sudais (HQ)', nameAr: 'عبدالرحمن السديس (عالي الجودة)', bitrate: '192kbps', category: 'haramain' },
  { id: 43, subfolder: 'Saood_ash-Shuraym_64kbps', nameEn: 'Saud Ash-Shuraym', nameAr: 'سعود الشريم', bitrate: '64kbps', category: 'haramain' },
  { id: 44, subfolder: 'Saood_ash-Shuraym_128kbps', nameEn: 'Saud Ash-Shuraym (HQ)', nameAr: 'سعود الشريم (عالي الجودة)', bitrate: '128kbps', category: 'haramain' },
  { id: 28, subfolder: 'Maher_AlMuaiqly_64kbps', nameEn: 'Maher Al-Muaiqly', nameAr: 'ماهر المعيقلي', bitrate: '64kbps', category: 'haramain' },
  { id: 29, subfolder: 'MaherAlMuaiqly128kbps', nameEn: 'Maher Al-Muaiqly (HQ)', nameAr: 'ماهر المعيقلي (عالي الجودة)', bitrate: '128kbps', category: 'haramain' },
  { id: 23, subfolder: 'Hudhaify_32kbps', nameEn: 'Hudhaify', nameAr: 'علي الحذيفي', bitrate: '32kbps', category: 'haramain' },
  { id: 24, subfolder: 'Hudhaify_64kbps', nameEn: 'Hudhaify', nameAr: 'علي الحذيفي', bitrate: '64kbps', category: 'haramain' },
  { id: 25, subfolder: 'Hudhaify_128kbps', nameEn: 'Hudhaify (HQ)', nameAr: 'علي الحذيفي (عالي الجودة)', bitrate: '128kbps', category: 'haramain' },
  { id: 52, subfolder: 'Muhsin_Al_Qasim_192kbps', nameEn: 'Muhsin Al-Qasim', nameAr: 'عبدالمحسن القاسم', bitrate: '192kbps', category: 'haramain' },
  { id: 53, subfolder: 'Abdullaah_3awwaad_Al-Juhaynee_128kbps', nameEn: 'Abdullah Al-Juhany', nameAr: 'عبدالله عواد الجهني', bitrate: '128kbps', category: 'haramain' },
  { id: 54, subfolder: 'Salah_Al_Budair_128kbps', nameEn: 'Salah Al-Budair', nameAr: 'صلاح البدير', bitrate: '128kbps', category: 'haramain' },
  { id: 67, subfolder: 'Yasser_Ad-Dussary_128kbps', nameEn: 'Yasser Ad-Dussary', nameAr: 'ياسر الدوسري', bitrate: '128kbps', category: 'haramain' },

  // Other Reciters
  { id: 4, subfolder: 'Abdullah_Basfar_32kbps', nameEn: 'Abdullah Basfar', nameAr: 'عبدالله بصفر', bitrate: '32kbps', category: 'other' },
  { id: 5, subfolder: 'Abdullah_Basfar_64kbps', nameEn: 'Abdullah Basfar', nameAr: 'عبدالله بصفر', bitrate: '64kbps', category: 'other' },
  { id: 6, subfolder: 'Abdullah_Basfar_192kbps', nameEn: 'Abdullah Basfar (HQ)', nameAr: 'عبدالله بصفر (عالي الجودة)', bitrate: '192kbps', category: 'other' },
  { id: 10, subfolder: 'Abu_Bakr_Ash-Shaatree_64kbps', nameEn: 'Abu Bakr Ash-Shatri', nameAr: 'أبو بكر الشاطري', bitrate: '64kbps', category: 'other' },
  { id: 11, subfolder: 'Abu_Bakr_Ash-Shaatree_128kbps', nameEn: 'Abu Bakr Ash-Shatri (HQ)', nameAr: 'أبو بكر الشاطري (عالي الجودة)', bitrate: '128kbps', category: 'other' },
  { id: 12, subfolder: 'Ahmed_ibn_Ali_al-Ajamy_64kbps_QuranExplorer.Com', nameEn: 'Ahmed al-Ajamy', nameAr: 'أحمد العجمي', bitrate: '64kbps', category: 'other' },
  { id: 13, subfolder: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net', nameEn: 'Ahmed al-Ajamy (HQ)', nameAr: 'أحمد العجمي (عالي الجودة)', bitrate: '128kbps', category: 'other' },
  { id: 14, subfolder: 'Alafasy_64kbps', nameEn: 'Mishary Alafasy', nameAr: 'مشاري العفاسي', bitrate: '64kbps', category: 'other' },
  { id: 15, subfolder: 'Alafasy_128kbps', nameEn: 'Mishary Alafasy (HQ)', nameAr: 'مشاري العفاسي (عالي الجودة)', bitrate: '128kbps', category: 'other' },
  { id: 16, subfolder: 'Ghamadi_40kbps', nameEn: 'Ghamadi', nameAr: 'سعد الغامدي', bitrate: '40kbps', category: 'other' },
  { id: 17, subfolder: 'Hani_Rifai_64kbps', nameEn: 'Hani Rifai', nameAr: 'هاني الرفاعي', bitrate: '64kbps', category: 'other' },
  { id: 18, subfolder: 'Hani_Rifai_192kbps', nameEn: 'Hani Rifai (HQ)', nameAr: 'هاني الرفاعي (عالي الجودة)', bitrate: '192kbps', category: 'other' },
  { id: 26, subfolder: 'Ibrahim_Akhdar_32kbps', nameEn: 'Ibrahim Akhdar', nameAr: 'إبراهيم الأخضر', bitrate: '32kbps', category: 'other' },
  { id: 27, subfolder: 'Ibrahim_Akhdar_64kbps', nameEn: 'Ibrahim Akhdar', nameAr: 'إبراهيم الأخضر', bitrate: '64kbps', category: 'other' },
  { id: 37, subfolder: 'Muhammad_Ayyoub_128kbps', nameEn: 'Muhammad Ayyoub (HQ)', nameAr: 'محمد أيوب (عالي الجودة)', bitrate: '128kbps', category: 'other' },
  { id: 38, subfolder: 'Muhammad_Ayyoub_64kbps', nameEn: 'Muhammad Ayyoub', nameAr: 'محمد أيوب', bitrate: '64kbps', category: 'other' },
  { id: 39, subfolder: 'Muhammad_Ayyoub_32kbps', nameEn: 'Muhammad Ayyoub', nameAr: 'محمد أيوب', bitrate: '32kbps', category: 'other' },
  { id: 51, subfolder: 'Salaah_AbdulRahman_Bukhatir_128kbps', nameEn: 'Salah Bukhatir', nameAr: 'صلاح بوخاطر', bitrate: '128kbps', category: 'other' },
  { id: 55, subfolder: 'Abdullah_Matroud_128kbps', nameEn: 'Abdullah Matroud', nameAr: 'عبدالله مطرود', bitrate: '128kbps', category: 'other' },
  { id: 57, subfolder: 'Muhammad_AbdulKareem_128kbps', nameEn: 'Muhammad AbdulKareem', nameAr: 'محمد عبدالكريم', bitrate: '128kbps', category: 'other' },
  { id: 58, subfolder: 'khalefa_al_tunaiji_64kbps', nameEn: 'Khalefa Al-Tunaiji', nameAr: 'خليفة الطنيجي', bitrate: '64kbps', category: 'other' },
  { id: 66, subfolder: 'Khaalid_Abdullaah_al-Qahtaanee_192kbps', nameEn: 'Khalid al-Qahtanee', nameAr: 'خالد القحطاني', bitrate: '192kbps', category: 'other' },
  { id: 68, subfolder: 'Nasser_Alqatami_128kbps', nameEn: 'Nasser Alqatami', nameAr: 'ناصر القطامي', bitrate: '128kbps', category: 'other' },
  { id: 70, subfolder: 'Sahl_Yassin_128kbps', nameEn: 'Sahl Yassin', nameAr: 'سهل ياسين', bitrate: '128kbps', category: 'other' },
  { id: 71, subfolder: 'ahmed_ibn_ali_al_ajamy_128kbps', nameEn: 'Ahmed ibn Ali al-Ajamy', nameAr: 'أحمد بن علي العجمي', bitrate: '128kbps', category: 'other' },
  { id: 73, subfolder: 'aziz_alili_128kbps', nameEn: 'Aziz Alili', nameAr: 'عزيز عليلي', bitrate: '128kbps', category: 'other' },
  { id: 74, subfolder: 'Yaser_Salamah_128kbps', nameEn: 'Yaser Salamah', nameAr: 'ياسر سلامة', bitrate: '128kbps', category: 'other' },
  { id: 75, subfolder: 'Akram_AlAlaqimy_128kbps', nameEn: 'Akram Al-Alaqimy', nameAr: 'أكرم العلاقمي', bitrate: '128kbps', category: 'other' },
  { id: 76, subfolder: 'Ali_Jaber_64kbps', nameEn: 'Ali Jaber', nameAr: 'علي جابر', bitrate: '64kbps', category: 'other' },
  { id: 77, subfolder: 'Fares_Abbad_64kbps', nameEn: 'Fares Abbad', nameAr: 'فارس عباد', bitrate: '64kbps', category: 'other' },
  { id: 79, subfolder: 'Ayman_Sowaid_64kbps', nameEn: 'Ayman Sowaid', nameAr: 'أيمن سويد', bitrate: '64kbps', category: 'other' },
  { id: 49, subfolder: 'Parhizgar_48kbps', nameEn: 'Parhizgar', nameAr: 'بارهيزجار', bitrate: '64kbps', category: 'other' },
  { id: 64, subfolder: 'Karim_Mansoori_40kbps', nameEn: 'Karim Mansoori', nameAr: 'كريم منصوري', bitrate: '40kbps', category: 'other' },

  // Warsh
  { id: 60, subfolder: 'warsh/warsh_ibrahim_aldosary_128kbps', nameEn: '(Warsh) Ibrahim Al-Dosary', nameAr: '(ورش) إبراهيم الدوسري', bitrate: '128kbps', category: 'other' },
  { id: 61, subfolder: 'warsh/warsh_yassin_al_jazaery_64kbps', nameEn: '(Warsh) Yassin Al-Jazaery', nameAr: '(ورش) ياسين الجزائري', bitrate: '64kbps', category: 'other' },
  { id: 62, subfolder: 'warsh/warsh_Abdul_Basit_128kbps', nameEn: '(Warsh) Abdul Basit', nameAr: '(ورش) عبد الباسط', bitrate: '128kbps', category: 'other' },

  // Translations
  { id: 45, subfolder: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps', nameEn: 'English - Sahih International', nameAr: 'الإنجليزية - صحيح انترناشونال', bitrate: '192kbps', category: 'translation' },
  { id: 46, subfolder: 'MultiLanguage/Basfar_Walk_192kbps', nameEn: 'Multi-Language - Basfar Walk', nameAr: 'متعدد اللغات - بصفر ووك', bitrate: '192kbps', category: 'translation' },
  { id: 47, subfolder: 'translations/Makarem_Kabiri_16Kbps', nameEn: 'Persian - Makarem', nameAr: 'الفارسية - مكارم', bitrate: '64kbps', category: 'translation' },
  { id: 48, subfolder: 'translations/Fooladvand_Hedayatfar_40Kbps', nameEn: 'Persian - Fooladvand', nameAr: 'الفارسية - فولادوند', bitrate: '64kbps', category: 'translation' },
  { id: 50, subfolder: 'translations/azerbaijani/balayev', nameEn: 'Azerbaijani - Balayev', nameAr: 'الأذربيجانية - بالاييف', bitrate: '64kbps', category: 'translation' },
  { id: 63, subfolder: 'translations/urdu_shamshad_ali_khan_46kbps', nameEn: 'Urdu - Shamshad Ali Khan', nameAr: 'الأوردية - شمشاد علي خان', bitrate: '46kbps', category: 'translation' },
  { id: 72, subfolder: 'translations/besim_korkut_ajet_po_ajet', nameEn: 'Bosnian - Besim Korkut', nameAr: 'البوسنية - بسيم كوركوت', bitrate: '128kbps', category: 'translation' },
  { id: 78, subfolder: 'translations/urdu_farhat_hashmi', nameEn: 'Urdu - Farhat Hashmi', nameAr: 'الأوردية - فرحات هاشمي', bitrate: '32kbps', category: 'translation' },
];

export const RECITER_CATEGORIES = [
  { key: 'all', labelAr: 'الكل', labelEn: 'All' },
  { key: 'egyptian', labelAr: 'قراء مصريون', labelEn: 'Egyptian Reciters' },
  { key: 'haramain', labelAr: 'قراء الحرمين', labelEn: 'Haramain Reciters' },
  { key: 'other', labelAr: 'قراء آخرون', labelEn: 'Other Reciters' },
  { key: 'translation', labelAr: 'ترجمات', labelEn: 'Translations' },
];

const BASE_URL = 'https://everyayah.com/data';

export function getAyahAudioUrl(reciter: EveryAyahReciter, surah: number, ayah: number): string {
  const surahStr = surah.toString().padStart(3, '0');
  const ayahStr = ayah.toString().padStart(3, '0');
  return `${BASE_URL}/${reciter.subfolder}/${surahStr}${ayahStr}.mp3`;
}

export function getAyahImageUrl(surah: number, ayah: number): string {
  return `${BASE_URL}/images_png/${surah}_${ayah}.png`;
}

export function getAyahCount(surahNumber: number): number {
  return AYAH_COUNTS[surahNumber - 1] || 0;
}
