/**
 * Curated list of meaningful and impactful Quranic verses
 * Selected for their relevance, beauty, and memorability
 */

export interface CuratedAyah {
  surah: number;
  ayah: number;
  category?: 'aqeedah' | 'akhlaq' | 'dua' | 'sabr' | 'rahma' | 'jannah' | 'tawakkul' | 'general';
}

/**
 * General curated ayahs - shown throughout the year
 */
export const generalCuratedAyahs: CuratedAyah[] = [
  // آية الكرسي
  { surah: 2, ayah: 255, category: 'aqeedah' },

  // الإخلاص والعقيدة
  { surah: 112, ayah: 1, category: 'aqeedah' },
  { surah: 2, ayah: 163, category: 'aqeedah' },
  { surah: 59, ayah: 22, category: 'aqeedah' },
  { surah: 59, ayah: 23, category: 'aqeedah' },
  { surah: 59, ayah: 24, category: 'aqeedah' },

  // الأخلاق والمعاملات
  { surah: 3, ayah: 159, category: 'akhlaq' },
  { surah: 49, ayah: 10, category: 'akhlaq' },
  { surah: 49, ayah: 11, category: 'akhlaq' },
  { surah: 49, ayah: 12, category: 'akhlaq' },
  { surah: 25, ayah: 63, category: 'akhlaq' },
  { surah: 17, ayah: 23, category: 'akhlaq' },
  { surah: 17, ayah: 24, category: 'akhlaq' },
  { surah: 31, ayah: 18, category: 'akhlaq' },
  { surah: 4, ayah: 36, category: 'akhlaq' },

  // الدعاء
  { surah: 2, ayah: 186, category: 'dua' },
  { surah: 40, ayah: 60, category: 'dua' },
  { surah: 2, ayah: 201, category: 'dua' },
  { surah: 7, ayah: 55, category: 'dua' },
  { surah: 7, ayah: 56, category: 'dua' },

  // الصبر والابتلاء
  { surah: 2, ayah: 153, category: 'sabr' },
  { surah: 2, ayah: 155, category: 'sabr' },
  { surah: 2, ayah: 156, category: 'sabr' },
  { surah: 94, ayah: 5, category: 'sabr' },
  { surah: 94, ayah: 6, category: 'sabr' },
  { surah: 103, ayah: 3, category: 'sabr' },
  { surah: 39, ayah: 10, category: 'sabr' },

  // الرحمة والمغفرة
  { surah: 39, ayah: 53, category: 'rahma' },
  { surah: 7, ayah: 156, category: 'rahma' },
  { surah: 6, ayah: 54, category: 'rahma' },
  { surah: 24, ayah: 22, category: 'rahma' },

  // التوكل والثقة بالله
  { surah: 65, ayah: 3, category: 'tawakkul' },
  { surah: 3, ayah: 159, category: 'tawakkul' },
  { surah: 8, ayah: 61, category: 'tawakkul' },
  { surah: 11, ayah: 56, category: 'tawakkul' },
  { surah: 33, ayah: 3, category: 'tawakkul' },

  // الجنة والآخرة
  { surah: 3, ayah: 133, category: 'jannah' },
  { surah: 57, ayah: 21, category: 'jannah' },
  { surah: 29, ayah: 64, category: 'jannah' },
  { surah: 47, ayah: 15, category: 'jannah' },

  // القرآن والذكر
  { surah: 17, ayah: 82, category: 'general' },
  { surah: 13, ayah: 28, category: 'general' },
  { surah: 39, ayah: 23, category: 'general' },
  { surah: 54, ayah: 17, category: 'general' },

  // الشكر والحمد
  { surah: 14, ayah: 7, category: 'general' },
  { surah: 31, ayah: 12, category: 'general' },
  { surah: 16, ayah: 18, category: 'general' },

  // العلم والحكمة
  { surah: 20, ayah: 114, category: 'general' },
  { surah: 39, ayah: 9, category: 'general' },
  { surah: 58, ayah: 11, category: 'general' },

  // القلوب والإيمان
  { surah: 8, ayah: 2, category: 'general' },
  { surah: 13, ayah: 28, category: 'general' },
  { surah: 48, ayah: 4, category: 'general' },

  // الهداية
  { surah: 1, ayah: 5, category: 'general' },
  { surah: 1, ayah: 6, category: 'general' },
  { surah: 1, ayah: 7, category: 'general' },
  { surah: 2, ayah: 2, category: 'general' },

  // الأمل والرجاء
  { surah: 12, ayah: 87, category: 'general' },
  { surah: 15, ayah: 56, category: 'general' },

  // التقوى
  { surah: 2, ayah: 197, category: 'general' },
  { surah: 49, ayah: 13, category: 'general' },
  { surah: 3, ayah: 102, category: 'general' },

  // العدل والإحسان
  { surah: 16, ayah: 90, category: 'akhlaq' },
  { surah: 5, ayah: 8, category: 'akhlaq' },

  // الصلاة والعبادة
  { surah: 29, ayah: 45, category: 'general' },
  { surah: 20, ayah: 14, category: 'general' },
  { surah: 2, ayah: 45, category: 'general' },

  // النصر والتمكين
  { surah: 2, ayah: 214, category: 'general' },
  { surah: 3, ayah: 139, category: 'general' },
  { surah: 47, ayah: 7, category: 'general' },

  // الإنفاق والصدقة
  { surah: 2, ayah: 261, category: 'general' },
  { surah: 2, ayah: 262, category: 'general' },
  { surah: 2, ayah: 274, category: 'general' },

  // السور القصيرة الكاملة (سهلة الحفظ)
  { surah: 108, ayah: 1, category: 'general' },
  { surah: 108, ayah: 2, category: 'general' },
  { surah: 108, ayah: 3, category: 'general' },
  { surah: 103, ayah: 1, category: 'general' },
  { surah: 103, ayah: 2, category: 'general' },
  { surah: 110, ayah: 1, category: 'general' },
  { surah: 110, ayah: 2, category: 'general' },
  { surah: 110, ayah: 3, category: 'general' },

  // الاستغفار والتوبة
  { surah: 39, ayah: 53, category: 'rahma' },
  { surah: 4, ayah: 110, category: 'rahma' },
  { surah: 25, ayah: 70, category: 'rahma' },

  // الليل والنهار
  { surah: 92, ayah: 4, category: 'general' },
  { surah: 17, ayah: 79, category: 'general' },

  // الموت والآخرة
  { surah: 3, ayah: 185, category: 'jannah' },
  { surah: 21, ayah: 35, category: 'general' },
  { surah: 67, ayah: 2, category: 'general' },

  // المزيد من الآيات المختارة
  // الإخلاص والإيمان
  { surah: 4, ayah: 136, category: 'aqeedah' },
  { surah: 2, ayah: 177, category: 'aqeedah' },
  { surah: 2, ayah: 285, category: 'aqeedah' },
  { surah: 2, ayah: 286, category: 'aqeedah' },
  { surah: 3, ayah: 18, category: 'aqeedah' },

  // الصبر والشكر
  { surah: 16, ayah: 96, category: 'sabr' },
  { surah: 39, ayah: 10, category: 'sabr' },
  { surah: 65, ayah: 2, category: 'sabr' },
  { surah: 65, ayah: 3, category: 'sabr' },
  { surah: 11, ayah: 115, category: 'sabr' },

  // الأمر بالمعروف والنهي عن المنكر
  { surah: 3, ayah: 104, category: 'akhlaq' },
  { surah: 3, ayah: 110, category: 'akhlaq' },
  { surah: 9, ayah: 71, category: 'akhlaq' },

  // العفو والصفح
  { surah: 3, ayah: 134, category: 'akhlaq' },
  { surah: 42, ayah: 40, category: 'akhlaq' },
  { surah: 42, ayah: 43, category: 'akhlaq' },
  { surah: 7, ayah: 199, category: 'akhlaq' },

  // الوالدين والأرحام
  { surah: 4, ayah: 1, category: 'akhlaq' },
  { surah: 46, ayah: 15, category: 'akhlaq' },
  { surah: 31, ayah: 14, category: 'akhlaq' },

  // الزواج والأسرة
  { surah: 30, ayah: 21, category: 'general' },
  { surah: 25, ayah: 74, category: 'dua' },
  { surah: 24, ayah: 32, category: 'general' },

  // العلم والتعلم
  { surah: 35, ayah: 28, category: 'general' },
  { surah: 96, ayah: 5, category: 'general' },
  { surah: 16, ayah: 43, category: 'general' },

  // الدعاء والذكر
  { surah: 2, ayah: 152, category: 'dua' },
  { surah: 33, ayah: 41, category: 'dua' },
  { surah: 33, ayah: 42, category: 'dua' },
  { surah: 3, ayah: 191, category: 'dua' },
  { surah: 3, ayah: 8, category: 'dua' },
  { surah: 25, ayah: 65, category: 'dua' },

  // الجهاد والنصر
  { surah: 61, ayah: 10, category: 'general' },
  { surah: 61, ayah: 11, category: 'general' },
  { surah: 9, ayah: 111, category: 'general' },
  { surah: 8, ayah: 46, category: 'general' },

  // القضاء والقدر
  { surah: 9, ayah: 51, category: 'general' },
  { surah: 57, ayah: 22, category: 'general' },
  { surah: 64, ayah: 11, category: 'general' },

  // الرزق والتوكل
  { surah: 11, ayah: 6, category: 'tawakkul' },
  { surah: 51, ayah: 22, category: 'tawakkul' },
  { surah: 29, ayah: 60, category: 'tawakkul' },
  { surah: 67, ayah: 15, category: 'tawakkul' },

  // التوبة والاستغفار
  { surah: 11, ayah: 52, category: 'rahma' },
  { surah: 71, ayah: 10, category: 'rahma' },
  { surah: 71, ayah: 11, category: 'rahma' },
  { surah: 71, ayah: 12, category: 'rahma' },
  { surah: 66, ayah: 8, category: 'rahma' },

  // الآخرة والحساب
  { surah: 99, ayah: 7, category: 'jannah' },
  { surah: 99, ayah: 8, category: 'jannah' },
  { surah: 18, ayah: 49, category: 'jannah' },
  { surah: 23, ayah: 102, category: 'jannah' },
  { surah: 23, ayah: 103, category: 'jannah' },

  // القرآن والتدبر
  { surah: 38, ayah: 29, category: 'general' },
  { surah: 47, ayah: 24, category: 'general' },
  { surah: 4, ayah: 82, category: 'general' },
  { surah: 17, ayah: 9, category: 'general' },

  // الصدق والأمانة
  { surah: 33, ayah: 70, category: 'akhlaq' },
  { surah: 9, ayah: 119, category: 'akhlaq' },
  { surah: 4, ayah: 58, category: 'akhlaq' },

  // الصلاة والزكاة
  { surah: 2, ayah: 110, category: 'general' },
  { surah: 2, ayah: 238, category: 'general' },
  { surah: 2, ayah: 277, category: 'general' },
  { surah: 107, ayah: 4, category: 'general' },
  { surah: 107, ayah: 5, category: 'general' },

  // التفكر في الخلق
  { surah: 3, ayah: 190, category: 'general' },
  { surah: 50, ayah: 6, category: 'general' },
  { surah: 88, ayah: 17, category: 'general' },
  { surah: 88, ayah: 18, category: 'general' },
  { surah: 88, ayah: 19, category: 'general' },

  // الظلم والعدل
  { surah: 4, ayah: 40, category: 'akhlaq' },
  { surah: 10, ayah: 44, category: 'akhlaq' },
  { surah: 6, ayah: 160, category: 'akhlaq' },

  // الكلمة الطيبة
  { surah: 14, ayah: 24, category: 'akhlaq' },
  { surah: 14, ayah: 25, category: 'akhlaq' },
  { surah: 17, ayah: 53, category: 'akhlaq' },

  // الوحدة والاعتصام
  { surah: 3, ayah: 103, category: 'general' },
  { surah: 8, ayah: 46, category: 'general' },
  { surah: 49, ayah: 10, category: 'general' },

  // اليقين والثبات
  { surah: 15, ayah: 99, category: 'general' },
  { surah: 41, ayah: 30, category: 'general' },
  { surah: 46, ayah: 13, category: 'general' },

  // الدنيا والآخرة
  { surah: 87, ayah: 16, category: 'jannah' },
  { surah: 87, ayah: 17, category: 'jannah' },
  { surah: 28, ayah: 77, category: 'general' },
  { surah: 4, ayah: 77, category: 'general' },

  // الذنوب والمعاصي
  { surah: 42, ayah: 30, category: 'general' },
  { surah: 3, ayah: 135, category: 'rahma' },
  { surah: 53, ayah: 32, category: 'rahma' },

  // البركة والخير
  { surah: 7, ayah: 96, category: 'general' },
  { surah: 65, ayah: 2, category: 'general' },
  { surah: 65, ayah: 3, category: 'general' },

  // المزيد من الآيات - الجزء الثاني
  // الاستعانة بالله
  { surah: 1, ayah: 5, category: 'dua' },
  { surah: 26, ayah: 80, category: 'dua' },
  { surah: 26, ayah: 81, category: 'dua' },
  { surah: 26, ayah: 82, category: 'dua' },

  // أسماء الله الحسنى
  { surah: 20, ayah: 8, category: 'aqeedah' },
  { surah: 7, ayah: 180, category: 'aqeedah' },
  { surah: 17, ayah: 110, category: 'aqeedah' },
  { surah: 55, ayah: 27, category: 'aqeedah' },

  // الذكر والتسبيح
  { surah: 3, ayah: 41, category: 'dua' },
  { surah: 87, ayah: 1, category: 'dua' },
  { surah: 57, ayah: 1, category: 'dua' },
  { surah: 59, ayah: 1, category: 'dua' },

  // النية والإخلاص
  { surah: 98, ayah: 5, category: 'aqeedah' },
  { surah: 18, ayah: 110, category: 'aqeedah' },
  { surah: 39, ayah: 2, category: 'aqeedah' },
  { surah: 39, ayah: 11, category: 'aqeedah' },

  // الهجرة والثبات
  { surah: 4, ayah: 97, category: 'general' },
  { surah: 4, ayah: 100, category: 'general' },
  { surah: 16, ayah: 41, category: 'general' },
  { surah: 29, ayah: 56, category: 'general' },

  // المال والإنفاق
  { surah: 57, ayah: 7, category: 'general' },
  { surah: 64, ayah: 15, category: 'general' },
  { surah: 63, ayah: 9, category: 'general' },
  { surah: 9, ayah: 103, category: 'general' },

  // الأخوة والمودة
  { surah: 3, ayah: 103, category: 'akhlaq' },
  { surah: 8, ayah: 63, category: 'akhlaq' },
  { surah: 5, ayah: 2, category: 'akhlaq' },
  { surah: 60, ayah: 8, category: 'akhlaq' },

  // الشيطان والوسوسة
  { surah: 7, ayah: 200, category: 'general' },
  { surah: 7, ayah: 201, category: 'general' },
  { surah: 41, ayah: 36, category: 'general' },
  { surah: 23, ayah: 97, category: 'dua' },
  { surah: 23, ayah: 98, category: 'dua' },

  // الحلال والحرام
  { surah: 5, ayah: 87, category: 'general' },
  { surah: 5, ayah: 88, category: 'general' },
  { surah: 16, ayah: 116, category: 'general' },
  { surah: 2, ayah: 168, category: 'general' },

  // التواضع والكبر
  { surah: 31, ayah: 18, category: 'akhlaq' },
  { surah: 31, ayah: 19, category: 'akhlaq' },
  { surah: 25, ayah: 63, category: 'akhlaq' },
  { surah: 17, ayah: 37, category: 'akhlaq' },

  // الغيبة والنميمة
  { surah: 104, ayah: 1, category: 'akhlaq' },
  { surah: 49, ayah: 12, category: 'akhlaq' },
  { surah: 68, ayah: 10, category: 'akhlaq' },
  { surah: 68, ayah: 11, category: 'akhlaq' },

  // العمل والكسب
  { surah: 62, ayah: 10, category: 'general' },
  { surah: 9, ayah: 105, category: 'general' },
  { surah: 18, ayah: 46, category: 'general' },
  { surah: 67, ayah: 15, category: 'general' },

  // الدنيا ومتاعها
  { surah: 3, ayah: 14, category: 'general' },
  { surah: 18, ayah: 45, category: 'general' },
  { surah: 57, ayah: 20, category: 'general' },
  { surah: 42, ayah: 20, category: 'general' },

  // القصاص والعقوبات
  { surah: 2, ayah: 178, category: 'general' },
  { surah: 2, ayah: 179, category: 'general' },
  { surah: 5, ayah: 45, category: 'general' },

  // الشهادة والعدل
  { surah: 4, ayah: 135, category: 'akhlaq' },
  { surah: 5, ayah: 8, category: 'akhlaq' },
  { surah: 65, ayah: 2, category: 'akhlaq' },

  // الطلاق والعدة
  { surah: 2, ayah: 231, category: 'general' },
  { surah: 2, ayah: 232, category: 'general' },
  { surah: 65, ayah: 1, category: 'general' },

  // اليتامى والضعفاء
  { surah: 4, ayah: 2, category: 'akhlaq' },
  { surah: 4, ayah: 10, category: 'akhlaq' },
  { surah: 93, ayah: 9, category: 'akhlaq' },
  { surah: 107, ayah: 2, category: 'akhlaq' },

  // الأمانات والوصايا
  { surah: 2, ayah: 283, category: 'akhlaq' },
  { surah: 5, ayah: 1, category: 'akhlaq' },
  { surah: 23, ayah: 8, category: 'akhlaq' },

  // الفتن والابتلاءات
  { surah: 29, ayah: 2, category: 'sabr' },
  { surah: 29, ayah: 3, category: 'sabr' },
  { surah: 3, ayah: 142, category: 'sabr' },
  { surah: 2, ayah: 214, category: 'sabr' },

  // النصر والتأييد
  { surah: 8, ayah: 10, category: 'general' },
  { surah: 3, ayah: 123, category: 'general' },
  { surah: 3, ayah: 126, category: 'general' },
  { surah: 48, ayah: 3, category: 'general' },

  // الفرج بعد الشدة
  { surah: 94, ayah: 5, category: 'sabr' },
  { surah: 94, ayah: 6, category: 'sabr' },
  { surah: 12, ayah: 87, category: 'sabr' },
  { surah: 39, ayah: 53, category: 'rahma' },

  // الحكمة والموعظة
  { surah: 16, ayah: 125, category: 'general' },
  { surah: 29, ayah: 46, category: 'general' },
  { surah: 41, ayah: 34, category: 'akhlaq' },
  { surah: 2, ayah: 269, category: 'general' },

  // الخوف والخشية
  { surah: 35, ayah: 28, category: 'aqeedah' },
  { surah: 39, ayah: 9, category: 'aqeedah' },
  { surah: 21, ayah: 90, category: 'aqeedah' },

  // الكفاية والحماية
  { surah: 3, ayah: 173, category: 'tawakkul' },
  { surah: 3, ayah: 174, category: 'tawakkul' },
  { surah: 113, ayah: 1, category: 'dua' },
  { surah: 113, ayah: 2, category: 'dua' },
  { surah: 114, ayah: 1, category: 'dua' },
  { surah: 114, ayah: 2, category: 'dua' },

  // المنافقون
  { surah: 4, ayah: 142, category: 'general' },
  { surah: 4, ayah: 145, category: 'general' },
  { surah: 63, ayah: 1, category: 'general' },

  // الظن والتأني
  { surah: 49, ayah: 6, category: 'akhlaq' },
  { surah: 17, ayah: 36, category: 'akhlaq' },
  { surah: 49, ayah: 12, category: 'akhlaq' },

  // الكلم الطيب
  { surah: 35, ayah: 10, category: 'akhlaq' },
  { surah: 2, ayah: 263, category: 'akhlaq' },
  { surah: 4, ayah: 148, category: 'akhlaq' },

  // الرباط والحراسة
  { surah: 3, ayah: 200, category: 'general' },
  { surah: 8, ayah: 60, category: 'general' },

  // النكاح والزواج
  { surah: 24, ayah: 32, category: 'general' },
  { surah: 24, ayah: 33, category: 'general' },
  { surah: 4, ayah: 3, category: 'general' },

  // الغفلة والذكرى
  { surah: 18, ayah: 28, category: 'general' },
  { surah: 6, ayah: 52, category: 'general' },
  { surah: 7, ayah: 205, category: 'dua' },

  // الزهد والورع
  { surah: 11, ayah: 15, category: 'general' },
  { surah: 17, ayah: 18, category: 'jannah' },
  { surah: 17, ayah: 19, category: 'jannah' },

  // الخلق العظيم
  { surah: 68, ayah: 4, category: 'akhlaq' },
  { surah: 3, ayah: 159, category: 'akhlaq' },
  { surah: 26, ayah: 215, category: 'akhlaq' },

  // المشورة والتشاور
  { surah: 42, ayah: 38, category: 'general' },
  { surah: 3, ayah: 159, category: 'general' },

  // الفرار من الفتن
  { surah: 4, ayah: 97, category: 'general' },
  { surah: 43, ayah: 89, category: 'akhlaq' },

  // العفة والحياء
  { surah: 24, ayah: 30, category: 'akhlaq' },
  { surah: 24, ayah: 31, category: 'akhlaq' },
  { surah: 33, ayah: 59, category: 'akhlaq' },

  // الأمن والخوف
  { surah: 106, ayah: 3, category: 'general' },
  { surah: 106, ayah: 4, category: 'general' },
  { surah: 24, ayah: 55, category: 'general' },

  // الحمد والثناء
  { surah: 1, ayah: 2, category: 'dua' },
  { surah: 34, ayah: 1, category: 'dua' },
  { surah: 35, ayah: 1, category: 'dua' },

  // قضاء الحوائج
  { surah: 2, ayah: 186, category: 'dua' },
  { surah: 21, ayah: 87, category: 'dua' },
  { surah: 21, ayah: 88, category: 'dua' },

  // الرحمة بالخلق
  { surah: 21, ayah: 107, category: 'rahma' },
  { surah: 90, ayah: 17, category: 'akhlaq' },
  { surah: 48, ayah: 29, category: 'akhlaq' },

  // المعاملة الحسنة
  { surah: 2, ayah: 83, category: 'akhlaq' },
  { surah: 4, ayah: 86, category: 'akhlaq' },
  { surah: 55, ayah: 60, category: 'akhlaq' },

  // الإحسان إلى الناس
  { surah: 2, ayah: 195, category: 'akhlaq' },
  { surah: 28, ayah: 77, category: 'general' },
  { surah: 99, ayah: 7, category: 'general' },

  // السلام والأمان
  { surah: 6, ayah: 54, category: 'general' },
  { surah: 6, ayah: 127, category: 'jannah' },
  { surah: 10, ayah: 25, category: 'general' },

  // التعاون والتضامن
  { surah: 5, ayah: 2, category: 'akhlaq' },
  { surah: 48, ayah: 29, category: 'akhlaq' },

  // القوة والعزة
  { surah: 4, ayah: 139, category: 'general' },
  { surah: 63, ayah: 8, category: 'general' },
  { surah: 35, ayah: 10, category: 'general' },

  // البشارة والتبشير
  { surah: 2, ayah: 25, category: 'jannah' },
  { surah: 2, ayah: 155, category: 'sabr' },
  { surah: 2, ayah: 223, category: 'general' },

  // النهي عن الفساد
  { surah: 2, ayah: 11, category: 'akhlaq' },
  { surah: 2, ayah: 205, category: 'akhlaq' },
  { surah: 7, ayah: 56, category: 'akhlaq' },

  // الرضا والقناعة
  { surah: 93, ayah: 5, category: 'general' },
  { surah: 20, ayah: 130, category: 'general' },
  { surah: 15, ayah: 88, category: 'general' },

  // المزيد من الآيات - الجزء الثالث
  // الأنبياء والرسل
  { surah: 21, ayah: 25, category: 'aqeedah' },
  { surah: 3, ayah: 144, category: 'general' },
  { surah: 33, ayah: 40, category: 'aqeedah' },
  { surah: 6, ayah: 48, category: 'general' },

  // قصة آدم عليه السلام
  { surah: 2, ayah: 30, category: 'general' },
  { surah: 2, ayah: 31, category: 'general' },
  { surah: 2, ayah: 37, category: 'rahma' },
  { surah: 7, ayah: 23, category: 'dua' },

  // قصة نوح عليه السلام
  { surah: 11, ayah: 41, category: 'general' },
  { surah: 29, ayah: 15, category: 'general' },
  { surah: 71, ayah: 13, category: 'rahma' },

  // قصة إبراهيم عليه السلام
  { surah: 2, ayah: 127, category: 'dua' },
  { surah: 2, ayah: 128, category: 'dua' },
  { surah: 14, ayah: 37, category: 'dua' },
  { surah: 14, ayah: 40, category: 'dua' },
  { surah: 37, ayah: 100, category: 'dua' },

  // قصة يوسف عليه السلام
  { surah: 12, ayah: 18, category: 'sabr' },
  { surah: 12, ayah: 33, category: 'dua' },
  { surah: 12, ayah: 53, category: 'general' },
  { surah: 12, ayah: 64, category: 'tawakkul' },
  { surah: 12, ayah: 92, category: 'akhlaq' },

  // قصة أيوب عليه السلام
  { surah: 21, ayah: 83, category: 'dua' },
  { surah: 21, ayah: 84, category: 'rahma' },
  { surah: 38, ayah: 41, category: 'dua' },

  // قصة يونس عليه السلام
  { surah: 21, ayah: 87, category: 'dua' },
  { surah: 37, ayah: 143, category: 'dua' },
  { surah: 37, ayah: 144, category: 'rahma' },

  // قصة زكريا ويحيى عليهما السلام
  { surah: 3, ayah: 38, category: 'dua' },
  { surah: 19, ayah: 4, category: 'dua' },
  { surah: 19, ayah: 5, category: 'dua' },
  { surah: 21, ayah: 89, category: 'dua' },

  // قصة مريم عليها السلام
  { surah: 19, ayah: 25, category: 'general' },
  { surah: 19, ayah: 26, category: 'general' },
  { surah: 3, ayah: 37, category: 'general' },
  { surah: 3, ayah: 42, category: 'general' },

  // عيسى عليه السلام
  { surah: 3, ayah: 45, category: 'aqeedah' },
  { surah: 3, ayah: 46, category: 'general' },
  { surah: 5, ayah: 72, category: 'aqeedah' },
  { surah: 19, ayah: 30, category: 'aqeedah' },

  // محمد صلى الله عليه وسلم
  { surah: 33, ayah: 21, category: 'general' },
  { surah: 33, ayah: 56, category: 'dua' },
  { surah: 48, ayah: 29, category: 'general' },
  { surah: 9, ayah: 128, category: 'general' },

  // القرآن معجزة
  { surah: 17, ayah: 88, category: 'general' },
  { surah: 2, ayah: 23, category: 'general' },
  { surah: 10, ayah: 37, category: 'general' },
  { surah: 11, ayah: 13, category: 'general' },

  // الملائكة
  { surah: 2, ayah: 98, category: 'aqeedah' },
  { surah: 35, ayah: 1, category: 'aqeedah' },
  { surah: 66, ayah: 6, category: 'general' },
  { surah: 33, ayah: 43, category: 'rahma' },

  // اليوم الآخر
  { surah: 22, ayah: 1, category: 'jannah' },
  { surah: 22, ayah: 2, category: 'jannah' },
  { surah: 82, ayah: 17, category: 'jannah' },
  { surah: 82, ayah: 18, category: 'jannah' },
  { surah: 82, ayah: 19, category: 'jannah' },

  // البعث والحشر
  { surah: 50, ayah: 15, category: 'aqeedah' },
  { surah: 36, ayah: 79, category: 'aqeedah' },
  { surah: 75, ayah: 36, category: 'aqeedah' },
  { surah: 86, ayah: 8, category: 'aqeedah' },

  // الحوض والشفاعة
  { surah: 108, ayah: 1, category: 'general' },
  { surah: 20, ayah: 109, category: 'general' },
  { surah: 34, ayah: 23, category: 'general' },

  // الميزان والحساب
  { surah: 21, ayah: 47, category: 'jannah' },
  { surah: 101, ayah: 6, category: 'jannah' },
  { surah: 101, ayah: 7, category: 'jannah' },
  { surah: 101, ayah: 8, category: 'jannah' },
  { surah: 101, ayah: 9, category: 'jannah' },

  // الصراط
  { surah: 36, ayah: 66, category: 'jannah' },
  { surah: 37, ayah: 23, category: 'jannah' },
  { surah: 37, ayah: 24, category: 'jannah' },

  // أهل الجنة
  { surah: 13, ayah: 23, category: 'jannah' },
  { surah: 13, ayah: 24, category: 'jannah' },
  { surah: 43, ayah: 70, category: 'jannah' },
  { surah: 43, ayah: 71, category: 'jannah' },
  { surah: 52, ayah: 17, category: 'jannah' },
  { surah: 52, ayah: 18, category: 'jannah' },

  // نعيم الجنة
  { surah: 56, ayah: 15, category: 'jannah' },
  { surah: 56, ayah: 16, category: 'jannah' },
  { surah: 56, ayah: 17, category: 'jannah' },
  { surah: 76, ayah: 13, category: 'jannah' },
  { surah: 76, ayah: 14, category: 'jannah' },
  { surah: 76, ayah: 21, category: 'jannah' },

  // أهل النار
  { surah: 74, ayah: 42, category: 'general' },
  { surah: 74, ayah: 43, category: 'general' },
  { surah: 74, ayah: 44, category: 'general' },
  { surah: 19, ayah: 68, category: 'general' },
  { surah: 19, ayah: 69, category: 'general' },

  // التوحيد والشرك
  { surah: 4, ayah: 48, category: 'aqeedah' },
  { surah: 4, ayah: 116, category: 'aqeedah' },
  { surah: 31, ayah: 13, category: 'aqeedah' },
  { surah: 39, ayah: 65, category: 'aqeedah' },

  // البدع والمحدثات
  { surah: 5, ayah: 3, category: 'general' },
  { surah: 6, ayah: 153, category: 'general' },
  { surah: 42, ayah: 21, category: 'general' },

  // الصحبة الصالحة
  { surah: 18, ayah: 28, category: 'akhlaq' },
  { surah: 43, ayah: 67, category: 'akhlaq' },
  { surah: 25, ayah: 27, category: 'akhlaq' },
  { surah: 25, ayah: 28, category: 'akhlaq' },

  // حفظ اللسان
  { surah: 50, ayah: 18, category: 'akhlaq' },
  { surah: 4, ayah: 114, category: 'akhlaq' },
  { surah: 2, ayah: 263, category: 'akhlaq' },

  // حسن الظن بالله
  { surah: 2, ayah: 286, category: 'dua' },
  { surah: 3, ayah: 154, category: 'general' },
  { surah: 40, ayah: 60, category: 'dua' },

  // الخشوع في الصلاة
  { surah: 23, ayah: 1, category: 'general' },
  { surah: 23, ayah: 2, category: 'general' },
  { surah: 9, ayah: 112, category: 'general' },

  // الاستخارة والمشورة
  { surah: 3, ayah: 159, category: 'general' },
  { surah: 2, ayah: 216, category: 'general' },

  // الهداية والضلال
  { surah: 7, ayah: 178, category: 'general' },
  { surah: 28, ayah: 56, category: 'general' },
  { surah: 6, ayah: 125, category: 'general' },

  // الرزق والتوسع
  { surah: 2, ayah: 212, category: 'general' },
  { surah: 42, ayah: 12, category: 'general' },
  { surah: 13, ayah: 26, category: 'general' },

  // الإنفاق في سبيل الله
  { surah: 2, ayah: 245, category: 'general' },
  { surah: 2, ayah: 267, category: 'general' },
  { surah: 2, ayah: 271, category: 'general' },
  { surah: 2, ayah: 272, category: 'general' },

  // الربا والمعاملات
  { surah: 2, ayah: 275, category: 'general' },
  { surah: 2, ayah: 278, category: 'general' },
  { surah: 2, ayah: 279, category: 'general' },
  { surah: 3, ayah: 130, category: 'general' },

  // الديون والكتابة
  { surah: 2, ayah: 282, category: 'general' },
  { surah: 2, ayah: 280, category: 'akhlaq' },

  // البر والتقوى
  { surah: 2, ayah: 189, category: 'general' },
  { surah: 5, ayah: 2, category: 'akhlaq' },
  { surah: 22, ayah: 32, category: 'general' },

  // الحج والعمرة
  { surah: 2, ayah: 196, category: 'general' },
  { surah: 5, ayah: 97, category: 'general' },
  { surah: 22, ayah: 26, category: 'general' },

  // الجهاد في سبيل الله
  { surah: 2, ayah: 190, category: 'general' },
  { surah: 2, ayah: 193, category: 'general' },
  { surah: 4, ayah: 95, category: 'general' },
  { surah: 9, ayah: 41, category: 'general' },

  // النفاق وأهله
  { surah: 2, ayah: 8, category: 'general' },
  { surah: 2, ayah: 9, category: 'general' },
  { surah: 2, ayah: 10, category: 'general' },
  { surah: 4, ayah: 143, category: 'general' },

  // الكفار والمشركون
  { surah: 2, ayah: 6, category: 'general' },
  { surah: 2, ayah: 7, category: 'general' },
  { surah: 10, ayah: 100, category: 'aqeedah' },

  // الذنوب الكبيرة
  { surah: 4, ayah: 31, category: 'general' },
  { surah: 42, ayah: 37, category: 'akhlaq' },
  { surah: 53, ayah: 31, category: 'general' },
  { surah: 53, ayah: 32, category: 'rahma' },

  // السحر والكهانة
  { surah: 2, ayah: 102, category: 'general' },
  { surah: 20, ayah: 69, category: 'general' },

  // الحسد والعين
  { surah: 113, ayah: 5, category: 'general' },
  { surah: 68, ayah: 51, category: 'general' },

  // الكيد والمكر
  { surah: 8, ayah: 30, category: 'general' },
  { surah: 86, ayah: 15, category: 'general' },
  { surah: 86, ayah: 16, category: 'general' },

  // التوبة النصوح
  { surah: 25, ayah: 71, category: 'rahma' },
  { surah: 6, ayah: 54, category: 'rahma' },
  { surah: 4, ayah: 17, category: 'rahma' },
  { surah: 4, ayah: 18, category: 'general' },

  // الاستغفار والذكر
  { surah: 40, ayah: 55, category: 'dua' },
  { surah: 73, ayah: 20, category: 'general' },
  { surah: 51, ayah: 18, category: 'dua' },

  // قراءة القرآن
  { surah: 73, ayah: 4, category: 'general' },
  { surah: 17, ayah: 78, category: 'general' },
  { surah: 50, ayah: 39, category: 'dua' },

  // الدعوة إلى الله
  { surah: 16, ayah: 125, category: 'general' },
  { surah: 41, ayah: 33, category: 'general' },
  { surah: 12, ayah: 108, category: 'general' },

  // الصبر على الأذى
  { surah: 3, ayah: 186, category: 'sabr' },
  { surah: 46, ayah: 35, category: 'sabr' },
  { surah: 70, ayah: 5, category: 'sabr' },

  // التفاؤل والأمل
  { surah: 39, ayah: 53, category: 'rahma' },
  { surah: 12, ayah: 87, category: 'sabr' },
  { surah: 65, ayah: 3, category: 'tawakkul' },

  // الزواج والأسرة
  { surah: 2, ayah: 187, category: 'general' },
  { surah: 4, ayah: 19, category: 'akhlaq' },
  { surah: 4, ayah: 21, category: 'general' },

  // الأولاد والذرية
  { surah: 18, ayah: 46, category: 'general' },
  { surah: 64, ayah: 15, category: 'general' },
  { surah: 3, ayah: 38, category: 'dua' },

  // النساء والمعاشرة
  { surah: 4, ayah: 1, category: 'akhlaq' },
  { surah: 4, ayah: 32, category: 'general' },
  { surah: 33, ayah: 35, category: 'general' },

  // العدل بين الزوجات
  { surah: 4, ayah: 3, category: 'general' },
  { surah: 4, ayah: 129, category: 'general' },

  // الإحسان للوالدين
  { surah: 29, ayah: 8, category: 'akhlaq' },
  { surah: 31, ayah: 14, category: 'akhlaq' },
  { surah: 31, ayah: 15, category: 'akhlaq' },

  // صلة الأرحام
  { surah: 47, ayah: 22, category: 'akhlaq' },
  { surah: 2, ayah: 27, category: 'akhlaq' },
  { surah: 13, ayah: 21, category: 'akhlaq' },

  // السفر والغربة
  { surah: 2, ayah: 185, category: 'general' },
  { surah: 4, ayah: 101, category: 'general' },

  // الأمن والخوف
  { surah: 16, ayah: 112, category: 'general' },
  { surah: 2, ayah: 126, category: 'dua' },

  // البلاء والمصائب
  { surah: 64, ayah: 11, category: 'sabr' },
  { surah: 57, ayah: 22, category: 'sabr' },
  { surah: 57, ayah: 23, category: 'general' },

  // الشكر على النعم
  { surah: 2, ayah: 152, category: 'dua' },
  { surah: 14, ayah: 7, category: 'general' },
  { surah: 27, ayah: 40, category: 'general' },

  // التوكل على الله
  { surah: 3, ayah: 160, category: 'tawakkul' },
  { surah: 8, ayah: 49, category: 'tawakkul' },
  { surah: 9, ayah: 51, category: 'tawakkul' },

  // الاعتصام بالله
  { surah: 3, ayah: 101, category: 'general' },
  { surah: 22, ayah: 78, category: 'general' },

  // التواضع لله
  { surah: 7, ayah: 206, category: 'dua' },
  { surah: 25, ayah: 63, category: 'akhlaq' },

  // الإخلاص في العمل
  { surah: 6, ayah: 162, category: 'aqeedah' },
  { surah: 6, ayah: 163, category: 'aqeedah' },

  // القناعة والرضا
  { surah: 2, ayah: 200, category: 'general' },
  { surah: 16, ayah: 97, category: 'jannah' },

  // السعي والعمل
  { surah: 53, ayah: 39, category: 'general' },
  { surah: 53, ayah: 40, category: 'general' },

  // التفكر والتدبر
  { surah: 59, ayah: 21, category: 'general' },
  { surah: 23, ayah: 68, category: 'general' },

  // الحكمة والفقه
  { surah: 62, ayah: 2, category: 'general' },
  { surah: 4, ayah: 113, category: 'general' },

  // الصدقة والإنفاق
  { surah: 2, ayah: 215, category: 'general' },
  { surah: 9, ayah: 60, category: 'general' },

  // الزكاة وحقوق المال
  { surah: 9, ayah: 34, category: 'general' },
  { surah: 9, ayah: 35, category: 'general' },

  // الوصية والميراث
  { surah: 4, ayah: 11, category: 'general' },
  { surah: 4, ayah: 12, category: 'general' },
  { surah: 2, ayah: 180, category: 'general' },

  // الطهارة والنظافة
  { surah: 5, ayah: 6, category: 'general' },
  { surah: 4, ayah: 43, category: 'general' },
  { surah: 9, ayah: 108, category: 'general' },

  // الستر والحشمة
  { surah: 7, ayah: 26, category: 'akhlaq' },
  { surah: 7, ayah: 27, category: 'akhlaq' },

  // العفاف والحياء
  { surah: 33, ayah: 32, category: 'akhlaq' },
  { surah: 33, ayah: 33, category: 'akhlaq' },

  // الغيرة والشرف
  { surah: 24, ayah: 19, category: 'akhlaq' },
  { surah: 24, ayah: 21, category: 'akhlaq' },

  // المزيد من الآيات - الجزء الرابع
  // من سورة البقرة
  { surah: 2, ayah: 1, category: 'general' },
  { surah: 2, ayah: 3, category: 'aqeedah' },
  { surah: 2, ayah: 4, category: 'aqeedah' },
  { surah: 2, ayah: 5, category: 'general' },
  { surah: 2, ayah: 21, category: 'aqeedah' },
  { surah: 2, ayah: 22, category: 'aqeedah' },
  { surah: 2, ayah: 29, category: 'general' },
  { surah: 2, ayah: 38, category: 'rahma' },
  { surah: 2, ayah: 40, category: 'general' },
  { surah: 2, ayah: 41, category: 'general' },
  { surah: 2, ayah: 43, category: 'general' },
  { surah: 2, ayah: 44, category: 'akhlaq' },
  { surah: 2, ayah: 47, category: 'general' },
  { surah: 2, ayah: 48, category: 'jannah' },
  { surah: 2, ayah: 60, category: 'general' },
  { surah: 2, ayah: 62, category: 'general' },
  { surah: 2, ayah: 75, category: 'general' },
  { surah: 2, ayah: 81, category: 'general' },
  { surah: 2, ayah: 82, category: 'jannah' },
  { surah: 2, ayah: 104, category: 'akhlaq' },
  { surah: 2, ayah: 112, category: 'general' },
  { surah: 2, ayah: 114, category: 'general' },
  { surah: 2, ayah: 115, category: 'general' },
  { surah: 2, ayah: 130, category: 'general' },
  { surah: 2, ayah: 136, category: 'aqeedah' },
  { surah: 2, ayah: 137, category: 'general' },
  { surah: 2, ayah: 143, category: 'general' },
  { surah: 2, ayah: 144, category: 'general' },
  { surah: 2, ayah: 148, category: 'general' },
  { surah: 2, ayah: 153, category: 'sabr' },
  { surah: 2, ayah: 157, category: 'sabr' },
  { surah: 2, ayah: 158, category: 'general' },
  { surah: 2, ayah: 164, category: 'general' },
  { surah: 2, ayah: 165, category: 'general' },
  { surah: 2, ayah: 166, category: 'general' },
  { surah: 2, ayah: 167, category: 'general' },
  { surah: 2, ayah: 172, category: 'general' },
  { surah: 2, ayah: 173, category: 'general' },
  { surah: 2, ayah: 174, category: 'general' },
  { surah: 2, ayah: 175, category: 'general' },
  { surah: 2, ayah: 177, category: 'aqeedah' },
  { surah: 2, ayah: 183, category: 'general' },
  { surah: 2, ayah: 185, category: 'general' },
  { surah: 2, ayah: 186, category: 'dua' },
  { surah: 2, ayah: 188, category: 'akhlaq' },
  { surah: 2, ayah: 190, category: 'general' },
  { surah: 2, ayah: 191, category: 'general' },
  { surah: 2, ayah: 194, category: 'general' },
  { surah: 2, ayah: 195, category: 'general' },
  { surah: 2, ayah: 197, category: 'general' },
  { surah: 2, ayah: 201, category: 'dua' },
  { surah: 2, ayah: 202, category: 'general' },
  { surah: 2, ayah: 208, category: 'general' },
  { surah: 2, ayah: 213, category: 'general' },
  { surah: 2, ayah: 216, category: 'general' },
  { surah: 2, ayah: 217, category: 'general' },
  { surah: 2, ayah: 219, category: 'general' },
  { surah: 2, ayah: 220, category: 'general' },
  { surah: 2, ayah: 221, category: 'general' },
  { surah: 2, ayah: 222, category: 'general' },
  { surah: 2, ayah: 224, category: 'akhlaq' },
  { surah: 2, ayah: 225, category: 'rahma' },
  { surah: 2, ayah: 233, category: 'general' },
  { surah: 2, ayah: 237, category: 'akhlaq' },
  { surah: 2, ayah: 242, category: 'general' },
  { surah: 2, ayah: 243, category: 'general' },
  { surah: 2, ayah: 244, category: 'general' },
  { surah: 2, ayah: 245, category: 'general' },
  { surah: 2, ayah: 247, category: 'general' },
  { surah: 2, ayah: 248, category: 'general' },
  { surah: 2, ayah: 249, category: 'sabr' },
  { surah: 2, ayah: 250, category: 'dua' },
  { surah: 2, ayah: 251, category: 'general' },
  { surah: 2, ayah: 252, category: 'general' },
  { surah: 2, ayah: 254, category: 'general' },
  { surah: 2, ayah: 255, category: 'aqeedah' },
  { surah: 2, ayah: 256, category: 'general' },
  { surah: 2, ayah: 257, category: 'general' },
  { surah: 2, ayah: 258, category: 'general' },
  { surah: 2, ayah: 260, category: 'aqeedah' },
  { surah: 2, ayah: 261, category: 'general' },
  { surah: 2, ayah: 262, category: 'general' },
  { surah: 2, ayah: 264, category: 'general' },
  { surah: 2, ayah: 265, category: 'general' },
  { surah: 2, ayah: 266, category: 'general' },
  { surah: 2, ayah: 268, category: 'general' },
  { surah: 2, ayah: 273, category: 'akhlaq' },
  { surah: 2, ayah: 276, category: 'general' },
  { surah: 2, ayah: 281, category: 'jannah' },
  { surah: 2, ayah: 284, category: 'aqeedah' },

  // من سورة آل عمران
  { surah: 3, ayah: 2, category: 'aqeedah' },
  { surah: 3, ayah: 3, category: 'general' },
  { surah: 3, ayah: 4, category: 'general' },
  { surah: 3, ayah: 5, category: 'aqeedah' },
  { surah: 3, ayah: 6, category: 'general' },
  { surah: 3, ayah: 7, category: 'general' },
  { surah: 3, ayah: 13, category: 'general' },
  { surah: 3, ayah: 15, category: 'jannah' },
  { surah: 3, ayah: 16, category: 'dua' },
  { surah: 3, ayah: 17, category: 'akhlaq' },
  { surah: 3, ayah: 19, category: 'aqeedah' },
  { surah: 3, ayah: 26, category: 'dua' },
  { surah: 3, ayah: 27, category: 'general' },
  { surah: 3, ayah: 31, category: 'general' },
  { surah: 3, ayah: 32, category: 'general' },
  { surah: 3, ayah: 35, category: 'dua' },
  { surah: 3, ayah: 36, category: 'dua' },
  { surah: 3, ayah: 43, category: 'general' },
  { surah: 3, ayah: 44, category: 'general' },
  { surah: 3, ayah: 47, category: 'general' },
  { surah: 3, ayah: 49, category: 'general' },
  { surah: 3, ayah: 50, category: 'general' },
  { surah: 3, ayah: 51, category: 'general' },
  { surah: 3, ayah: 52, category: 'general' },
  { surah: 3, ayah: 53, category: 'dua' },
  { surah: 3, ayah: 54, category: 'general' },
  { surah: 3, ayah: 55, category: 'general' },
  { surah: 3, ayah: 56, category: 'general' },
  { surah: 3, ayah: 57, category: 'jannah' },
  { surah: 3, ayah: 58, category: 'general' },
  { surah: 3, ayah: 59, category: 'aqeedah' },
  { surah: 3, ayah: 60, category: 'general' },
  { surah: 3, ayah: 61, category: 'general' },
  { surah: 3, ayah: 64, category: 'general' },
  { surah: 3, ayah: 65, category: 'general' },
  { surah: 3, ayah: 66, category: 'general' },
  { surah: 3, ayah: 67, category: 'general' },
  { surah: 3, ayah: 68, category: 'general' },
  { surah: 3, ayah: 73, category: 'general' },
  { surah: 3, ayah: 75, category: 'akhlaq' },
  { surah: 3, ayah: 76, category: 'akhlaq' },
  { surah: 3, ayah: 77, category: 'general' },
  { surah: 3, ayah: 78, category: 'general' },
  { surah: 3, ayah: 79, category: 'general' },
  { surah: 3, ayah: 80, category: 'general' },
  { surah: 3, ayah: 81, category: 'general' },
  { surah: 3, ayah: 83, category: 'general' },
  { surah: 3, ayah: 84, category: 'aqeedah' },
  { surah: 3, ayah: 85, category: 'general' },
  { surah: 3, ayah: 92, category: 'general' },
  { surah: 3, ayah: 93, category: 'general' },
  { surah: 3, ayah: 95, category: 'general' },
  { surah: 3, ayah: 96, category: 'general' },
  { surah: 3, ayah: 102, category: 'general' },
  { surah: 3, ayah: 103, category: 'akhlaq' },
  { surah: 3, ayah: 104, category: 'akhlaq' },
  { surah: 3, ayah: 105, category: 'akhlaq' },
  { surah: 3, ayah: 106, category: 'jannah' },
  { surah: 3, ayah: 107, category: 'jannah' },
  { surah: 3, ayah: 110, category: 'akhlaq' },
  { surah: 3, ayah: 112, category: 'general' },
  { surah: 3, ayah: 113, category: 'general' },
  { surah: 3, ayah: 114, category: 'general' },
  { surah: 3, ayah: 115, category: 'general' },
  { surah: 3, ayah: 116, category: 'general' },
  { surah: 3, ayah: 117, category: 'general' },
  { surah: 3, ayah: 119, category: 'general' },
  { surah: 3, ayah: 120, category: 'sabr' },
  { surah: 3, ayah: 121, category: 'general' },
  { surah: 3, ayah: 122, category: 'tawakkul' },
  { surah: 3, ayah: 123, category: 'general' },
  { surah: 3, ayah: 124, category: 'general' },
  { surah: 3, ayah: 125, category: 'general' },
  { surah: 3, ayah: 126, category: 'general' },
  { surah: 3, ayah: 127, category: 'general' },
  { surah: 3, ayah: 129, category: 'general' },
  { surah: 3, ayah: 130, category: 'general' },
  { surah: 3, ayah: 131, category: 'general' },
  { surah: 3, ayah: 132, category: 'general' },
  { surah: 3, ayah: 133, category: 'jannah' },
  { surah: 3, ayah: 134, category: 'akhlaq' },
  { surah: 3, ayah: 135, category: 'rahma' },
  { surah: 3, ayah: 136, category: 'jannah' },
  { surah: 3, ayah: 137, category: 'general' },
  { surah: 3, ayah: 138, category: 'general' },
  { surah: 3, ayah: 139, category: 'general' },
  { surah: 3, ayah: 140, category: 'sabr' },
  { surah: 3, ayah: 141, category: 'general' },
  { surah: 3, ayah: 142, category: 'sabr' },
  { surah: 3, ayah: 143, category: 'general' },
  { surah: 3, ayah: 145, category: 'general' },
  { surah: 3, ayah: 146, category: 'sabr' },
  { surah: 3, ayah: 147, category: 'dua' },
  { surah: 3, ayah: 148, category: 'general' },
  { surah: 3, ayah: 149, category: 'general' },
  { surah: 3, ayah: 150, category: 'general' },
  { surah: 3, ayah: 151, category: 'general' },
  { surah: 3, ayah: 152, category: 'general' },
  { surah: 3, ayah: 153, category: 'sabr' },
  { surah: 3, ayah: 154, category: 'general' },
  { surah: 3, ayah: 155, category: 'general' },
  { surah: 3, ayah: 156, category: 'general' },
  { surah: 3, ayah: 157, category: 'jannah' },
  { surah: 3, ayah: 158, category: 'general' },
  { surah: 3, ayah: 159, category: 'akhlaq' },
  { surah: 3, ayah: 160, category: 'tawakkul' },
  { surah: 3, ayah: 161, category: 'general' },
  { surah: 3, ayah: 164, category: 'general' },
  { surah: 3, ayah: 165, category: 'general' },
  { surah: 3, ayah: 166, category: 'general' },
  { surah: 3, ayah: 167, category: 'general' },
  { surah: 3, ayah: 168, category: 'general' },
  { surah: 3, ayah: 169, category: 'jannah' },
  { surah: 3, ayah: 170, category: 'jannah' },
  { surah: 3, ayah: 171, category: 'jannah' },
  { surah: 3, ayah: 172, category: 'general' },
  { surah: 3, ayah: 173, category: 'tawakkul' },
  { surah: 3, ayah: 174, category: 'tawakkul' },
  { surah: 3, ayah: 175, category: 'general' },
  { surah: 3, ayah: 176, category: 'general' },
  { surah: 3, ayah: 178, category: 'general' },
  { surah: 3, ayah: 179, category: 'general' },
  { surah: 3, ayah: 180, category: 'general' },
  { surah: 3, ayah: 181, category: 'general' },
  { surah: 3, ayah: 182, category: 'general' },
  { surah: 3, ayah: 183, category: 'general' },
  { surah: 3, ayah: 184, category: 'sabr' },
  { surah: 3, ayah: 185, category: 'jannah' },
  { surah: 3, ayah: 186, category: 'sabr' },
  { surah: 3, ayah: 187, category: 'general' },
  { surah: 3, ayah: 188, category: 'general' },
  { surah: 3, ayah: 189, category: 'general' },
  { surah: 3, ayah: 190, category: 'general' },
  { surah: 3, ayah: 191, category: 'dua' },
  { surah: 3, ayah: 192, category: 'dua' },
  { surah: 3, ayah: 193, category: 'dua' },
  { surah: 3, ayah: 194, category: 'dua' },
  { surah: 3, ayah: 195, category: 'general' },
  { surah: 3, ayah: 196, category: 'general' },
  { surah: 3, ayah: 197, category: 'jannah' },
  { surah: 3, ayah: 198, category: 'jannah' },
  { surah: 3, ayah: 199, category: 'general' },
  { surah: 3, ayah: 200, category: 'sabr' },

  // من سورة النساء
  { surah: 4, ayah: 1, category: 'akhlaq' },
  { surah: 4, ayah: 4, category: 'general' },
  { surah: 4, ayah: 5, category: 'general' },
  { surah: 4, ayah: 6, category: 'general' },
  { surah: 4, ayah: 7, category: 'general' },
  { surah: 4, ayah: 8, category: 'akhlaq' },
  { surah: 4, ayah: 9, category: 'akhlaq' },
  { surah: 4, ayah: 10, category: 'akhlaq' },
  { surah: 4, ayah: 11, category: 'general' },
  { surah: 4, ayah: 12, category: 'general' },
  { surah: 4, ayah: 13, category: 'jannah' },
  { surah: 4, ayah: 14, category: 'general' },
  { surah: 4, ayah: 15, category: 'general' },
  { surah: 4, ayah: 16, category: 'general' },
  { surah: 4, ayah: 17, category: 'rahma' },
  { surah: 4, ayah: 18, category: 'general' },
  { surah: 4, ayah: 19, category: 'akhlaq' },
  { surah: 4, ayah: 20, category: 'general' },
  { surah: 4, ayah: 21, category: 'general' },
  { surah: 4, ayah: 22, category: 'general' },
  { surah: 4, ayah: 23, category: 'general' },
  { surah: 4, ayah: 24, category: 'general' },
  { surah: 4, ayah: 25, category: 'general' },
  { surah: 4, ayah: 26, category: 'general' },
  { surah: 4, ayah: 27, category: 'general' },
  { surah: 4, ayah: 28, category: 'rahma' },
  { surah: 4, ayah: 29, category: 'akhlaq' },
  { surah: 4, ayah: 30, category: 'general' },
  { surah: 4, ayah: 31, category: 'rahma' },
  { surah: 4, ayah: 32, category: 'general' },
  { surah: 4, ayah: 33, category: 'general' },
  { surah: 4, ayah: 34, category: 'general' },
  { surah: 4, ayah: 35, category: 'akhlaq' },
  { surah: 4, ayah: 36, category: 'akhlaq' },
  { surah: 4, ayah: 37, category: 'general' },
  { surah: 4, ayah: 38, category: 'general' },
  { surah: 4, ayah: 39, category: 'general' },
  { surah: 4, ayah: 40, category: 'general' },
  { surah: 4, ayah: 41, category: 'jannah' },
  { surah: 4, ayah: 42, category: 'general' },
  { surah: 4, ayah: 43, category: 'general' },
  { surah: 4, ayah: 44, category: 'general' },
  { surah: 4, ayah: 45, category: 'general' },
  { surah: 4, ayah: 46, category: 'general' },
  { surah: 4, ayah: 47, category: 'general' },
  { surah: 4, ayah: 48, category: 'aqeedah' },
  { surah: 4, ayah: 49, category: 'general' },
  { surah: 4, ayah: 50, category: 'general' },
  { surah: 4, ayah: 51, category: 'general' },
  { surah: 4, ayah: 52, category: 'general' },
  { surah: 4, ayah: 53, category: 'general' },
  { surah: 4, ayah: 54, category: 'general' },
  { surah: 4, ayah: 55, category: 'general' },
  { surah: 4, ayah: 56, category: 'general' },
  { surah: 4, ayah: 57, category: 'jannah' },
  { surah: 4, ayah: 58, category: 'akhlaq' },
  { surah: 4, ayah: 59, category: 'general' },
  { surah: 4, ayah: 60, category: 'general' },
  { surah: 4, ayah: 61, category: 'general' },
  { surah: 4, ayah: 62, category: 'general' },
  { surah: 4, ayah: 63, category: 'akhlaq' },
  { surah: 4, ayah: 64, category: 'general' },
  { surah: 4, ayah: 65, category: 'general' },
  { surah: 4, ayah: 66, category: 'general' },
  { surah: 4, ayah: 67, category: 'general' },
  { surah: 4, ayah: 68, category: 'general' },
  { surah: 4, ayah: 69, category: 'jannah' },
  { surah: 4, ayah: 70, category: 'general' },
  { surah: 4, ayah: 71, category: 'general' },
  { surah: 4, ayah: 72, category: 'general' },
  { surah: 4, ayah: 73, category: 'general' },
  { surah: 4, ayah: 74, category: 'general' },
  { surah: 4, ayah: 75, category: 'dua' },
  { surah: 4, ayah: 76, category: 'general' },
  { surah: 4, ayah: 77, category: 'general' },
  { surah: 4, ayah: 78, category: 'general' },
  { surah: 4, ayah: 79, category: 'general' },
  { surah: 4, ayah: 80, category: 'general' },
  { surah: 4, ayah: 81, category: 'general' },
  { surah: 4, ayah: 82, category: 'general' },
  { surah: 4, ayah: 83, category: 'general' },
  { surah: 4, ayah: 84, category: 'general' },
  { surah: 4, ayah: 85, category: 'general' },
  { surah: 4, ayah: 86, category: 'akhlaq' },
  { surah: 4, ayah: 87, category: 'jannah' },
  { surah: 4, ayah: 88, category: 'general' },
  { surah: 4, ayah: 89, category: 'general' },
  { surah: 4, ayah: 90, category: 'general' },
  { surah: 4, ayah: 91, category: 'general' },
  { surah: 4, ayah: 92, category: 'general' },
  { surah: 4, ayah: 93, category: 'general' },
  { surah: 4, ayah: 94, category: 'general' },
  { surah: 4, ayah: 95, category: 'general' },
  { surah: 4, ayah: 96, category: 'jannah' },
  { surah: 4, ayah: 97, category: 'general' },
  { surah: 4, ayah: 98, category: 'general' },
  { surah: 4, ayah: 99, category: 'rahma' },
  { surah: 4, ayah: 100, category: 'general' },
  { surah: 4, ayah: 101, category: 'general' },
  { surah: 4, ayah: 102, category: 'general' },
  { surah: 4, ayah: 103, category: 'general' },
  { surah: 4, ayah: 104, category: 'general' },
  { surah: 4, ayah: 105, category: 'general' },
  { surah: 4, ayah: 106, category: 'dua' },
  { surah: 4, ayah: 107, category: 'general' },
  { surah: 4, ayah: 108, category: 'general' },
  { surah: 4, ayah: 109, category: 'jannah' },
  { surah: 4, ayah: 110, category: 'rahma' },
  { surah: 4, ayah: 111, category: 'general' },
  { surah: 4, ayah: 112, category: 'general' },
  { surah: 4, ayah: 113, category: 'general' },
  { surah: 4, ayah: 114, category: 'akhlaq' },
  { surah: 4, ayah: 115, category: 'general' },
  { surah: 4, ayah: 116, category: 'aqeedah' },
  { surah: 4, ayah: 117, category: 'general' },
  { surah: 4, ayah: 118, category: 'general' },
  { surah: 4, ayah: 119, category: 'general' },
  { surah: 4, ayah: 120, category: 'general' },
  { surah: 4, ayah: 121, category: 'general' },
  { surah: 4, ayah: 122, category: 'jannah' },
  { surah: 4, ayah: 123, category: 'general' },
  { surah: 4, ayah: 124, category: 'jannah' },
  { surah: 4, ayah: 125, category: 'general' },
  { surah: 4, ayah: 126, category: 'general' },
  { surah: 4, ayah: 127, category: 'general' },
  { surah: 4, ayah: 128, category: 'akhlaq' },
  { surah: 4, ayah: 129, category: 'general' },
  { surah: 4, ayah: 130, category: 'general' },
  { surah: 4, ayah: 131, category: 'general' },
  { surah: 4, ayah: 132, category: 'general' },
  { surah: 4, ayah: 133, category: 'general' },
  { surah: 4, ayah: 134, category: 'general' },
  { surah: 4, ayah: 135, category: 'akhlaq' },
  { surah: 4, ayah: 136, category: 'aqeedah' },
  { surah: 4, ayah: 137, category: 'general' },
  { surah: 4, ayah: 138, category: 'general' },
  { surah: 4, ayah: 139, category: 'general' },
  { surah: 4, ayah: 140, category: 'general' },
  { surah: 4, ayah: 141, category: 'general' },
  { surah: 4, ayah: 142, category: 'general' },
  { surah: 4, ayah: 143, category: 'general' },
  { surah: 4, ayah: 144, category: 'general' },
  { surah: 4, ayah: 145, category: 'general' },
  { surah: 4, ayah: 146, category: 'rahma' },
  { surah: 4, ayah: 147, category: 'general' },
  { surah: 4, ayah: 148, category: 'akhlaq' },
  { surah: 4, ayah: 149, category: 'rahma' },
  { surah: 4, ayah: 150, category: 'general' },
  { surah: 4, ayah: 151, category: 'general' },
  { surah: 4, ayah: 152, category: 'rahma' },
  { surah: 4, ayah: 153, category: 'general' },
  { surah: 4, ayah: 154, category: 'general' },
  { surah: 4, ayah: 155, category: 'general' },
  { surah: 4, ayah: 156, category: 'general' },
  { surah: 4, ayah: 157, category: 'aqeedah' },
  { surah: 4, ayah: 158, category: 'general' },
  { surah: 4, ayah: 159, category: 'jannah' },
  { surah: 4, ayah: 160, category: 'general' },
  { surah: 4, ayah: 161, category: 'general' },
  { surah: 4, ayah: 162, category: 'jannah' },
  { surah: 4, ayah: 163, category: 'general' },
  { surah: 4, ayah: 164, category: 'general' },
  { surah: 4, ayah: 165, category: 'general' },
  { surah: 4, ayah: 166, category: 'general' },
  { surah: 4, ayah: 167, category: 'general' },
  { surah: 4, ayah: 168, category: 'general' },
  { surah: 4, ayah: 169, category: 'general' },
  { surah: 4, ayah: 170, category: 'general' },
  { surah: 4, ayah: 171, category: 'aqeedah' },
  { surah: 4, ayah: 172, category: 'jannah' },
  { surah: 4, ayah: 173, category: 'general' },
  { surah: 4, ayah: 174, category: 'general' },
  { surah: 4, ayah: 175, category: 'general' },
  { surah: 4, ayah: 176, category: 'general' },

  // من سورة المائدة
  { surah: 5, ayah: 1, category: 'akhlaq' },
  { surah: 5, ayah: 2, category: 'akhlaq' },
  { surah: 5, ayah: 3, category: 'general' },
  { surah: 5, ayah: 4, category: 'general' },
  { surah: 5, ayah: 5, category: 'general' },
  { surah: 5, ayah: 6, category: 'general' },
  { surah: 5, ayah: 7, category: 'general' },
  { surah: 5, ayah: 8, category: 'akhlaq' },
  { surah: 5, ayah: 9, category: 'general' },
  { surah: 5, ayah: 10, category: 'general' },
  { surah: 5, ayah: 11, category: 'general' },
  { surah: 5, ayah: 12, category: 'general' },
  { surah: 5, ayah: 13, category: 'rahma' },
  { surah: 5, ayah: 14, category: 'general' },
  { surah: 5, ayah: 15, category: 'general' },
  { surah: 5, ayah: 16, category: 'general' },
  { surah: 5, ayah: 17, category: 'aqeedah' },
  { surah: 5, ayah: 18, category: 'general' },
  { surah: 5, ayah: 19, category: 'general' },
  { surah: 5, ayah: 20, category: 'general' },
  { surah: 5, ayah: 21, category: 'general' },
  { surah: 5, ayah: 22, category: 'general' },
  { surah: 5, ayah: 23, category: 'tawakkul' },
  { surah: 5, ayah: 24, category: 'general' },
  { surah: 5, ayah: 25, category: 'dua' },
  { surah: 5, ayah: 26, category: 'general' },
  { surah: 5, ayah: 27, category: 'general' },
  { surah: 5, ayah: 28, category: 'akhlaq' },
  { surah: 5, ayah: 29, category: 'general' },
  { surah: 5, ayah: 30, category: 'general' },
  { surah: 5, ayah: 31, category: 'general' },
  { surah: 5, ayah: 32, category: 'akhlaq' },
  { surah: 5, ayah: 33, category: 'general' },
  { surah: 5, ayah: 34, category: 'rahma' },
  { surah: 5, ayah: 35, category: 'dua' },
  { surah: 5, ayah: 36, category: 'general' },
  { surah: 5, ayah: 37, category: 'general' },
  { surah: 5, ayah: 38, category: 'general' },
  { surah: 5, ayah: 39, category: 'rahma' },
  { surah: 5, ayah: 40, category: 'general' },
  { surah: 5, ayah: 41, category: 'general' },
  { surah: 5, ayah: 42, category: 'akhlaq' },
  { surah: 5, ayah: 43, category: 'general' },
  { surah: 5, ayah: 44, category: 'general' },
  { surah: 5, ayah: 45, category: 'general' },
  { surah: 5, ayah: 46, category: 'general' },
  { surah: 5, ayah: 47, category: 'general' },
  { surah: 5, ayah: 48, category: 'general' },
  { surah: 5, ayah: 49, category: 'general' },
  { surah: 5, ayah: 50, category: 'general' },

  // المزيد من الآيات لإكمال 2000
  { surah: 6, ayah: 12, category: 'rahma' },
  { surah: 6, ayah: 14, category: 'general' },
  { surah: 6, ayah: 15, category: 'general' },
  { surah: 6, ayah: 17, category: 'general' },
  { surah: 6, ayah: 18, category: 'general' },
  { surah: 6, ayah: 32, category: 'general' },
  { surah: 6, ayah: 38, category: 'general' },
  { surah: 6, ayah: 59, category: 'general' },
  { surah: 6, ayah: 71, category: 'general' },
  { surah: 6, ayah: 72, category: 'general' },
  { surah: 6, ayah: 84, category: 'general' },
  { surah: 6, ayah: 90, category: 'general' },
  { surah: 6, ayah: 95, category: 'general' },
  { surah: 6, ayah: 99, category: 'general' },
  { surah: 6, ayah: 102, category: 'aqeedah' },
  { surah: 6, ayah: 103, category: 'aqeedah' },
  { surah: 6, ayah: 104, category: 'general' },
  { surah: 6, ayah: 108, category: 'akhlaq' },
  { surah: 6, ayah: 122, category: 'general' },
  { surah: 6, ayah: 132, category: 'general' },
  { surah: 6, ayah: 135, category: 'general' },
  { surah: 6, ayah: 141, category: 'general' },
  { surah: 6, ayah: 151, category: 'akhlaq' },
  { surah: 6, ayah: 152, category: 'akhlaq' },
  { surah: 6, ayah: 153, category: 'general' },
  { surah: 6, ayah: 154, category: 'general' },
  { surah: 6, ayah: 155, category: 'general' },
  { surah: 6, ayah: 157, category: 'general' },
  { surah: 6, ayah: 158, category: 'general' },
  { surah: 6, ayah: 159, category: 'general' },
  { surah: 6, ayah: 161, category: 'general' },
  { surah: 6, ayah: 162, category: 'aqeedah' },
  { surah: 6, ayah: 163, category: 'aqeedah' },
  { surah: 6, ayah: 164, category: 'jannah' },
  { surah: 6, ayah: 165, category: 'general' },

  { surah: 7, ayah: 10, category: 'general' },
  { surah: 7, ayah: 23, category: 'dua' },
  { surah: 7, ayah: 26, category: 'akhlaq' },
  { surah: 7, ayah: 27, category: 'akhlaq' },
  { surah: 7, ayah: 31, category: 'general' },
  { surah: 7, ayah: 32, category: 'general' },
  { surah: 7, ayah: 33, category: 'general' },
  { surah: 7, ayah: 34, category: 'general' },
  { surah: 7, ayah: 35, category: 'general' },
  { surah: 7, ayah: 40, category: 'general' },
  { surah: 7, ayah: 43, category: 'jannah' },
  { surah: 7, ayah: 52, category: 'general' },
  { surah: 7, ayah: 55, category: 'dua' },
  { surah: 7, ayah: 56, category: 'akhlaq' },
  { surah: 7, ayah: 85, category: 'akhlaq' },
  { surah: 7, ayah: 89, category: 'dua' },
  { surah: 7, ayah: 96, category: 'general' },
  { surah: 7, ayah: 128, category: 'sabr' },
  { surah: 7, ayah: 137, category: 'general' },
  { surah: 7, ayah: 156, category: 'rahma' },
  { surah: 7, ayah: 157, category: 'general' },
  { surah: 7, ayah: 158, category: 'general' },
  { surah: 7, ayah: 180, category: 'aqeedah' },
  { surah: 7, ayah: 199, category: 'akhlaq' },
  { surah: 7, ayah: 200, category: 'general' },
  { surah: 7, ayah: 201, category: 'general' },
  { surah: 7, ayah: 205, category: 'dua' },
  { surah: 7, ayah: 206, category: 'dua' },

  { surah: 8, ayah: 2, category: 'aqeedah' },
  { surah: 8, ayah: 10, category: 'general' },
  { surah: 8, ayah: 24, category: 'general' },
  { surah: 8, ayah: 27, category: 'akhlaq' },
  { surah: 8, ayah: 28, category: 'general' },
  { surah: 8, ayah: 29, category: 'general' },
  { surah: 8, ayah: 30, category: 'general' },
  { surah: 8, ayah: 45, category: 'general' },
  { surah: 8, ayah: 46, category: 'akhlaq' },
  { surah: 8, ayah: 49, category: 'tawakkul' },
  { surah: 8, ayah: 60, category: 'general' },
  { surah: 8, ayah: 61, category: 'general' },
  { surah: 8, ayah: 63, category: 'akhlaq' },
  { surah: 8, ayah: 64, category: 'tawakkul' },

  { surah: 9, ayah: 18, category: 'general' },
  { surah: 9, ayah: 19, category: 'general' },
  { surah: 9, ayah: 21, category: 'jannah' },
  { surah: 9, ayah: 22, category: 'jannah' },
  { surah: 9, ayah: 34, category: 'general' },
  { surah: 9, ayah: 35, category: 'general' },
  { surah: 9, ayah: 38, category: 'general' },
  { surah: 9, ayah: 39, category: 'general' },
  { surah: 9, ayah: 40, category: 'sabr' },
  { surah: 9, ayah: 41, category: 'general' },
  { surah: 9, ayah: 51, category: 'tawakkul' },
  { surah: 9, ayah: 60, category: 'general' },
  { surah: 9, ayah: 71, category: 'akhlaq' },
  { surah: 9, ayah: 72, category: 'jannah' },
  { surah: 9, ayah: 99, category: 'general' },
  { surah: 9, ayah: 100, category: 'jannah' },
  { surah: 9, ayah: 103, category: 'general' },
  { surah: 9, ayah: 105, category: 'general' },
  { surah: 9, ayah: 108, category: 'general' },
  { surah: 9, ayah: 109, category: 'tawakkul' },
  { surah: 9, ayah: 111, category: 'jannah' },
  { surah: 9, ayah: 112, category: 'general' },
  { surah: 9, ayah: 119, category: 'akhlaq' },
  { surah: 9, ayah: 128, category: 'rahma' },
  { surah: 9, ayah: 129, category: 'tawakkul' },

  { surah: 10, ayah: 3, category: 'general' },
  { surah: 10, ayah: 7, category: 'general' },
  { surah: 10, ayah: 10, category: 'jannah' },
  { surah: 10, ayah: 25, category: 'jannah' },
  { surah: 10, ayah: 26, category: 'jannah' },
  { surah: 10, ayah: 31, category: 'aqeedah' },
  { surah: 10, ayah: 37, category: 'general' },
  { surah: 10, ayah: 44, category: 'jannah' },
  { surah: 10, ayah: 57, category: 'general' },
  { surah: 10, ayah: 58, category: 'general' },
  { surah: 10, ayah: 62, category: 'general' },
  { surah: 10, ayah: 63, category: 'jannah' },
  { surah: 10, ayah: 65, category: 'general' },
  { surah: 10, ayah: 71, category: 'tawakkul' },
  { surah: 10, ayah: 85, category: 'tawakkul' },
  { surah: 10, ayah: 90, category: 'aqeedah' },
  { surah: 10, ayah: 100, category: 'aqeedah' },
  { surah: 10, ayah: 107, category: 'general' },

  { surah: 11, ayah: 3, category: 'rahma' },
  { surah: 11, ayah: 6, category: 'general' },
  { surah: 11, ayah: 11, category: 'sabr' },
  { surah: 11, ayah: 13, category: 'general' },
  { surah: 11, ayah: 15, category: 'general' },
  { surah: 11, ayah: 23, category: 'jannah' },
  { surah: 11, ayah: 41, category: 'tawakkul' },
  { surah: 11, ayah: 47, category: 'dua' },
  { surah: 11, ayah: 52, category: 'rahma' },
  { surah: 11, ayah: 56, category: 'tawakkul' },
  { surah: 11, ayah: 61, category: 'general' },
  { surah: 11, ayah: 88, category: 'tawakkul' },
  { surah: 11, ayah: 90, category: 'rahma' },
  { surah: 11, ayah: 112, category: 'sabr' },
  { surah: 11, ayah: 113, category: 'general' },
  { surah: 11, ayah: 114, category: 'general' },
  { surah: 11, ayah: 115, category: 'sabr' },
  { surah: 11, ayah: 123, category: 'tawakkul' },

  { surah: 12, ayah: 18, category: 'sabr' },
  { surah: 12, ayah: 23, category: 'general' },
  { surah: 12, ayah: 24, category: 'general' },
  { surah: 12, ayah: 33, category: 'dua' },
  { surah: 12, ayah: 53, category: 'general' },
  { surah: 12, ayah: 64, category: 'tawakkul' },
  { surah: 12, ayah: 67, category: 'tawakkul' },
  { surah: 12, ayah: 83, category: 'sabr' },
  { surah: 12, ayah: 87, category: 'sabr' },
  { surah: 12, ayah: 90, category: 'sabr' },
  { surah: 12, ayah: 92, category: 'akhlaq' },
  { surah: 12, ayah: 101, category: 'dua' },
  { surah: 12, ayah: 108, category: 'general' },
  { surah: 12, ayah: 109, category: 'general' },
  { surah: 12, ayah: 111, category: 'general' },

  { surah: 13, ayah: 11, category: 'general' },
  { surah: 13, ayah: 19, category: 'general' },
  { surah: 13, ayah: 20, category: 'akhlaq' },
  { surah: 13, ayah: 21, category: 'akhlaq' },
  { surah: 13, ayah: 22, category: 'sabr' },
  { surah: 13, ayah: 23, category: 'jannah' },
  { surah: 13, ayah: 24, category: 'jannah' },
  { surah: 13, ayah: 26, category: 'general' },
  { surah: 13, ayah: 27, category: 'general' },
  { surah: 13, ayah: 28, category: 'general' },
  { surah: 13, ayah: 29, category: 'jannah' },

  { surah: 14, ayah: 5, category: 'general' },
  { surah: 14, ayah: 7, category: 'general' },
  { surah: 14, ayah: 11, category: 'tawakkul' },
  { surah: 14, ayah: 12, category: 'sabr' },
  { surah: 14, ayah: 24, category: 'akhlaq' },
  { surah: 14, ayah: 25, category: 'akhlaq' },
  { surah: 14, ayah: 27, category: 'general' },
  { surah: 14, ayah: 31, category: 'general' },
  { surah: 14, ayah: 32, category: 'general' },
  { surah: 14, ayah: 34, category: 'general' },
  { surah: 14, ayah: 37, category: 'dua' },
  { surah: 14, ayah: 38, category: 'dua' },
  { surah: 14, ayah: 39, category: 'dua' },
  { surah: 14, ayah: 40, category: 'dua' },
  { surah: 14, ayah: 41, category: 'dua' },

  { surah: 15, ayah: 49, category: 'jannah' },
  { surah: 15, ayah: 56, category: 'rahma' },
  { surah: 15, ayah: 88, category: 'general' },
  { surah: 15, ayah: 99, category: 'general' },

  { surah: 16, ayah: 18, category: 'general' },
  { surah: 16, ayah: 43, category: 'general' },
  { surah: 16, ayah: 53, category: 'general' },
  { surah: 16, ayah: 64, category: 'general' },
  { surah: 16, ayah: 90, category: 'akhlaq' },
  { surah: 16, ayah: 96, category: 'sabr' },
  { surah: 16, ayah: 97, category: 'jannah' },
  { surah: 16, ayah: 112, category: 'general' },
  { surah: 16, ayah: 116, category: 'general' },
  { surah: 16, ayah: 119, category: 'rahma' },
  { surah: 16, ayah: 120, category: 'general' },
  { surah: 16, ayah: 125, category: 'akhlaq' },
  { surah: 16, ayah: 126, category: 'sabr' },
  { surah: 16, ayah: 127, category: 'sabr' },
  { surah: 16, ayah: 128, category: 'general' },

  { surah: 17, ayah: 1, category: 'general' },
  { surah: 17, ayah: 7, category: 'general' },
  { surah: 17, ayah: 9, category: 'general' },
  { surah: 17, ayah: 11, category: 'general' },
  { surah: 17, ayah: 13, category: 'jannah' },
  { surah: 17, ayah: 14, category: 'jannah' },
  { surah: 17, ayah: 15, category: 'general' },
  { surah: 17, ayah: 18, category: 'jannah' },
  { surah: 17, ayah: 19, category: 'jannah' },
  { surah: 17, ayah: 20, category: 'general' },
  { surah: 17, ayah: 23, category: 'akhlaq' },
  { surah: 17, ayah: 24, category: 'akhlaq' },
  { surah: 17, ayah: 25, category: 'rahma' },
  { surah: 17, ayah: 26, category: 'akhlaq' },
  { surah: 17, ayah: 27, category: 'general' },
  { surah: 17, ayah: 28, category: 'akhlaq' },
  { surah: 17, ayah: 29, category: 'general' },
  { surah: 17, ayah: 30, category: 'general' },
  { surah: 17, ayah: 31, category: 'general' },
  { surah: 17, ayah: 32, category: 'general' },
  { surah: 17, ayah: 33, category: 'general' },
  { surah: 17, ayah: 34, category: 'akhlaq' },
  { surah: 17, ayah: 35, category: 'akhlaq' },
  { surah: 17, ayah: 36, category: 'akhlaq' },
  { surah: 17, ayah: 37, category: 'akhlaq' },
  { surah: 17, ayah: 38, category: 'akhlaq' },
  { surah: 17, ayah: 53, category: 'akhlaq' },
  { surah: 17, ayah: 78, category: 'general' },
  { surah: 17, ayah: 79, category: 'general' },
  { surah: 17, ayah: 80, category: 'dua' },
  { surah: 17, ayah: 82, category: 'general' },
  { surah: 17, ayah: 88, category: 'general' },
  { surah: 17, ayah: 106, category: 'general' },
  { surah: 17, ayah: 110, category: 'aqeedah' },

  { surah: 18, ayah: 10, category: 'dua' },
  { surah: 18, ayah: 16, category: 'tawakkul' },
  { surah: 18, ayah: 28, category: 'akhlaq' },
  { surah: 18, ayah: 29, category: 'general' },
  { surah: 18, ayah: 30, category: 'jannah' },
  { surah: 18, ayah: 39, category: 'dua' },
  { surah: 18, ayah: 45, category: 'general' },
  { surah: 18, ayah: 46, category: 'general' },
  { surah: 18, ayah: 49, category: 'jannah' },
  { surah: 18, ayah: 107, category: 'jannah' },
  { surah: 18, ayah: 110, category: 'aqeedah' },

  { surah: 19, ayah: 4, category: 'dua' },
  { surah: 19, ayah: 5, category: 'dua' },
  { surah: 19, ayah: 6, category: 'dua' },
  { surah: 19, ayah: 25, category: 'sabr' },
  { surah: 19, ayah: 26, category: 'general' },
  { surah: 19, ayah: 30, category: 'aqeedah' },
  { surah: 19, ayah: 31, category: 'general' },
  { surah: 19, ayah: 60, category: 'jannah' },
  { surah: 19, ayah: 68, category: 'jannah' },
  { surah: 19, ayah: 69, category: 'general' },
  { surah: 19, ayah: 71, category: 'general' },
  { surah: 19, ayah: 72, category: 'jannah' },

  { surah: 20, ayah: 8, category: 'aqeedah' },
  { surah: 20, ayah: 14, category: 'general' },
  { surah: 20, ayah: 25, category: 'dua' },
  { surah: 20, ayah: 26, category: 'dua' },
  { surah: 20, ayah: 27, category: 'dua' },
  { surah: 20, ayah: 28, category: 'dua' },
  { surah: 20, ayah: 39, category: 'general' },
  { surah: 20, ayah: 46, category: 'general' },
  { surah: 20, ayah: 50, category: 'general' },
  { surah: 20, ayah: 52, category: 'general' },
  { surah: 20, ayah: 69, category: 'general' },
  { surah: 20, ayah: 76, category: 'jannah' },
  { surah: 20, ayah: 77, category: 'general' },
  { surah: 20, ayah: 82, category: 'rahma' },
  { surah: 20, ayah: 109, category: 'general' },
  { surah: 20, ayah: 111, category: 'general' },
  { surah: 20, ayah: 112, category: 'jannah' },
  { surah: 20, ayah: 113, category: 'general' },
  { surah: 20, ayah: 114, category: 'dua' },
  { surah: 20, ayah: 124, category: 'general' },
  { surah: 20, ayah: 125, category: 'dua' },
  { surah: 20, ayah: 126, category: 'general' },
  { surah: 20, ayah: 130, category: 'general' },
  { surah: 20, ayah: 132, category: 'sabr' },
];

/**
 * Ramadan-specific ayahs
 */
export const ramadanAyahs: CuratedAyah[] = [
  { surah: 2, ayah: 183, category: 'general' },
  { surah: 2, ayah: 184, category: 'general' },
  { surah: 2, ayah: 185, category: 'general' },
  { surah: 97, ayah: 1, category: 'general' },
  { surah: 97, ayah: 2, category: 'general' },
  { surah: 97, ayah: 3, category: 'general' },
  { surah: 97, ayah: 4, category: 'general' },
  { surah: 97, ayah: 5, category: 'general' },
  { surah: 44, ayah: 3, category: 'general' },
  { surah: 17, ayah: 106, category: 'general' },
  { surah: 96, ayah: 1, category: 'general' },
];

/**
 * Dhul Hijjah / Hajj-specific ayahs
 */
export const hajjAyahs: CuratedAyah[] = [
  { surah: 22, ayah: 27, category: 'general' },
  { surah: 22, ayah: 28, category: 'general' },
  { surah: 22, ayah: 29, category: 'general' },
  { surah: 3, ayah: 97, category: 'general' },
  { surah: 2, ayah: 197, category: 'general' },
  { surah: 2, ayah: 198, category: 'general' },
  { surah: 2, ayah: 199, category: 'general' },
  { surah: 89, ayah: 1, category: 'general' },
  { surah: 89, ayah: 2, category: 'general' },
  { surah: 22, ayah: 37, category: 'general' },
];

/**
 * Ashura-specific ayahs (10 Muharram)
 * Focus on patience, Moses story, gratitude, and fasting
 */
export const ashuraAyahs: CuratedAyah[] = [
  // قصة موسى وفرعون
  { surah: 26, ayah: 63, category: 'general' }, // فانفلق فكان كل فرق كالطود العظيم
  { surah: 26, ayah: 64, category: 'general' },
  { surah: 20, ayah: 77, category: 'general' }, // وقطعنا بهم البحر
  { surah: 7, ayah: 137, category: 'general' }, // وأورثنا القوم الذين كانوا يستضعفون
  { surah: 10, ayah: 90, category: 'general' }, // آمن موسى ومن معه
  { surah: 28, ayah: 5, category: 'general' }, // نريد أن نمن على الذين استضعفوا
  // الصبر والابتلاء
  { surah: 2, ayah: 155, category: 'sabr' },
  { surah: 2, ayah: 156, category: 'sabr' },
  // الشكر والصيام
  { surah: 2, ayah: 183, category: 'general' },
  { surah: 14, ayah: 7, category: 'general' },
];

/**
 * Isra and Mi'raj-specific ayahs (27 Rajab)
 * The night journey and ascension
 */
export const israMirajAyahs: CuratedAyah[] = [
  // الإسراء
  { surah: 17, ayah: 1, category: 'general' }, // سبحان الذي أسرى بعبده
  { surah: 17, ayah: 7, category: 'general' },
  { surah: 17, ayah: 9, category: 'general' },
  { surah: 17, ayah: 80, category: 'dua' },
  // النجم (المعراج)
  { surah: 53, ayah: 1, category: 'general' },
  { surah: 53, ayah: 2, category: 'general' },
  { surah: 53, ayah: 3, category: 'general' },
  { surah: 53, ayah: 8, category: 'general' },
  { surah: 53, ayah: 9, category: 'general' },
  { surah: 53, ayah: 10, category: 'general' },
  { surah: 53, ayah: 13, category: 'general' },
  { surah: 53, ayah: 14, category: 'general' },
  { surah: 53, ayah: 18, category: 'general' },
  // الصلاة (فرضت في المعراج)
  { surah: 20, ayah: 14, category: 'general' },
  { surah: 29, ayah: 45, category: 'general' },
];

/**
 * Get the appropriate ayah list based on current season
 *
 * NOTE: This uses Gregorian calendar approximation for Islamic dates.
 * For more accurate seasonal detection, consider using a Hijri calendar library.
 *
 * Approximate Gregorian months for Islamic occasions:
 * - Ramadan: March-April (months 3-4)
 * - Dhul Hijjah: July-August (months 7-8)
 * - Muharram (Ashura): August-September (months 8-9)
 * - Rajab (Isra & Mi'raj): February-March (months 2-3)
 */
export function getSeasonalAyahList(): CuratedAyah[] {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Ramadan season (approximate: late March to late April)
  if ((month === 3 && day >= 15) || (month === 4 && day <= 25)) {
    return ramadanAyahs;
  }

  // Dhul Hijjah / Hajj season (approximate: July)
  if (month === 7 || (month === 8 && day <= 10)) {
    return hajjAyahs;
  }

  // Muharram / Ashura season (approximate: late August to mid September)
  // Focus on 10 Muharram (Ashura)
  if ((month === 8 && day >= 20) || (month === 9 && day <= 15)) {
    return ashuraAyahs;
  }

  // Rajab / Isra & Mi'raj season (approximate: mid February to early March)
  // Focus on 27 Rajab
  if ((month === 2 && day >= 15) || (month === 3 && day <= 10)) {
    return israMirajAyahs;
  }

  return generalCuratedAyahs;
}

/**
 * Total number of ayahs in Quran
 */
export const TOTAL_QURAN_AYAHS = 6236;
