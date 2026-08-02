export type RadioCategory = 'all' | 'favorites' | 'official' | 'egyptian' | 'haramain' | 'other' | 'tafsir' | 'athkar' | 'books' | 'misc' | 'translations';

export interface RadioStation {
  id: string;
  name: string;
  nameAr?: string;
  url: string;
  fallbackUrl?: string;
  img?: string;
  categories: RadioCategory[];
  playlistUrls?: string[];
}

export const RADIO_CATEGORIES: { key: RadioCategory; labelAr: string; labelEn: string }[] = [
  { key: 'all', labelAr: 'الكل', labelEn: 'All' },
  { key: 'favorites', labelAr: '❤️ المفضلة', labelEn: '❤️ Favorites' },
  { key: 'official', labelAr: 'محطات رسمية', labelEn: 'Official' },
  { key: 'egyptian', labelAr: 'قراء مصريون', labelEn: 'Egyptian Reciters' },
  { key: 'haramain', labelAr: 'قراء الحرمين', labelEn: 'Haramain Reciters' },
  { key: 'other', labelAr: 'قراء آخرون', labelEn: 'Other Reciters' },
  { key: 'tafsir', labelAr: 'التفسير وعلوم القرآن', labelEn: 'Tafsir & Sciences' },
  { key: 'athkar', labelAr: 'الأذكار والرقية', labelEn: 'Athkar & Ruqyah' },
  { key: 'books', labelAr: 'كتب مسموعة', labelEn: 'Audio Books' },
  { key: 'misc', labelAr: 'إذاعات متنوعة', labelEn: 'Miscellaneous' },
  { key: 'translations', labelAr: 'ترجمات القرآن', labelEn: 'Translations' },
];

// Curated stations with preserved order
export const curatedStations: RadioStation[] = [
  { id: 'c1', name: 'Quran Radio from Cairo', nameAr: 'إذاعة القرآن الكريم من القاهرة', url: 'https://stream.radiojar.com/8s5u5tpdtwzuv', fallbackUrl: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad', categories: ['official', 'egyptian'] },
  { id: 'c2', name: 'Makkah Live', nameAr: 'إذاعة مكة المكرمة', url: 'https://stream.radiojar.com/0tpy1h0kxtzuv', fallbackUrl: 'https://backup.qurango.net/radio/maher', categories: ['official'] },
  { id: 'c3', name: 'Madinah Live', nameAr: 'إذاعة المدينة المنورة', url: 'https://stream.radiojar.com/4wqre23fytzuv', fallbackUrl: 'https://backup.qurango.net/radio/abdulmohsen_alqasim', categories: ['official'] },
  { id: 'c4', name: 'Muhammad Siddiq Al-Minshawi', nameAr: 'إذاعة محمد صديق المنشاوي', url: 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi_mojawwad', img: 'https://i1.sndcdn.com/artworks-000284633237-7gdg9t-t200x200.jpg', categories: ['egyptian'] },
  { id: 'c5', name: 'Mahmoud Ali Al-Banna', nameAr: 'إذاعة محمود علي البنا', url: 'https://backup.qurango.net/radio/mahmoud_ali__albanna_mojawwad', img: 'https://i.pinimg.com/200x/29/67/b3/2967b3fbc1ce1f5a70874288d34317bf.jpg', categories: ['egyptian'] },
  { id: 'c6', name: 'Mahmoud Khalil Al-Hussary', nameAr: 'إذاعة محمود خليل الحصري', url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary_mojawwad', img: 'https://i.pinimg.com/564x/3f/da/7e/3fda7ed5056347e700cac64d07e164c3.jpg', categories: ['egyptian'] },
  { id: 'c7', name: 'Abdul Basit Abdul Samad', nameAr: 'إذاعة عبدالباسط عبدالصمد', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad', img: 'https://upload.wikimedia.org/wikipedia/ar/7/73/%D8%B5%D9%88%D8%B1%D8%A9_%D8%B4%D8%AE%D8%B5%D9%8A%D8%A9_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%B5%D9%85%D8%AF.png', categories: ['egyptian'] },
  { id: 'c7a', name: 'Mustafa Ismail', nameAr: 'إذاعة مصطفى إسماعيل', url: 'https://backup.qurango.net/radio/mustafa_ismail', img: 'https://i.pinimg.com/236x/95/d8/f5/95d8f538f52eb1dc18dfc028732fb66f.jpg', categories: ['egyptian'] },
  { id: 'c7b', name: 'Ahmad Nauina', nameAr: 'إذاعة أحمد نعينع', url: 'https://backup.qurango.net/radio/ahmad_nauina', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTngDAeqT6lVNZCCUxbWK28gO4etkida-6-mVSqS4OQrqfjdOuwjXjvKg&s', categories: ['egyptian'] },
  { id: 'c7c', name: 'Abdul Basit Abdul Samad (Murattal)', nameAr: 'إذاعة عبدالباسط عبدالصمد', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad', img: 'https://upload.wikimedia.org/wikipedia/ar/7/73/%D8%B5%D9%88%D8%B1%D8%A9_%D8%B4%D8%AE%D8%B5%D9%8A%D8%A9_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%B5%D9%85%D8%AF.png', categories: ['egyptian'] },
  { id: 'c7d', name: 'Abdul Basit Abdul Samad (Warsh)', nameAr: 'إذاعة عبدالباسط عبدالصمد', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_warsh', img: 'https://i.pinimg.com/564x/52/95/ae/5295ae7c08e4ebdc7eda3ddb5c6c0a19.jpg', categories: ['egyptian'] },
  { id: 'c7e', name: 'Mohammad Al-Tablaway', nameAr: 'إذاعة محمد الطبلاوي', url: 'https://backup.qurango.net/radio/mohammad_altablaway', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4o1eZwYw2AtvziYaWDVGEEL26jSBqfEPgA-483uWQbxxe9Fqkw-DDMWc&s', categories: ['egyptian'] },
  { id: 'c7f', name: 'Mohammed Jibreel', nameAr: 'إذاعة محمد جبريل', url: 'https://backup.qurango.net/radio/mohammed_jibreel', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoCAdloX_Mw5jxHSFS4i6HnBl7j6Ev9C07oSJCI7a1wtmrGN1LUn0VVIw&s', categories: ['egyptian'] },
  { id: 'c7g', name: 'Muhammad Siddiq Al-Minshawi (Murattal)', nameAr: 'إذاعة محمد صديق المنشاوي', url: 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQashc7OM1bQ2MJe-kvfSMGyG5W0Ylb9sR2KjSW5gu3nKQ4vM8tolcQu58&s', categories: ['egyptian'] },
  { id: 'c7h', name: 'Mahmoud Khalil Al-Hussary', nameAr: 'إذاعة محمود خليل الحصري', url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary', img: 'https://i.pinimg.com/564x/3f/da/7e/3fda7ed5056347e700cac64d07e164c3.jpg', categories: ['egyptian'] },
  { id: 'c7i', name: 'Mahmoud Khalil Al-Hussary (Warsh)', nameAr: 'إذاعة محمود خليل الحصري', url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary_warsh', img: 'https://i.pinimg.com/564x/3f/da/7e/3fda7ed5056347e700cac64d07e164c3.jpg', categories: ['egyptian'] },
  { id: 'c7j', name: 'Mahmoud Ali Al-Banna (Murattal)', nameAr: 'إذاعة محمود علي البنا', url: 'https://backup.qurango.net/radio/mahmoud_ali__albanna', img:'https://i.pinimg.com/564x/28/8a/2a/288a2a1237b195e44c24a0c4451e089a.jpg', categories: ['egyptian'] },
  { id: 'c7k', name: 'Ahmad Amer', nameAr: 'إذاعة أحمد عامر', url: 'https://backup.qurango.net/radio/ahmed_amer', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSLZGlfGp9Kz0xkcgkMPinuJFDC17x5cTWVJxJzYDv-3Ea6v2HE0pGt-Sx&s', categories: ['egyptian'] },
  { id: 'c7l', name: 'Ahmad Khalil Shaheen', nameAr: 'إذاعة أحمد خليل شاهين', url: 'https://backup.qurango.net/radio/ahmad_shaheen', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTcowohZJnuf8xkcffgZnoyp5tjbV4vTm35uBUXh36MgzITFa1alOgu-4&s', categories: ['egyptian'] },
  { id: 'c-baqarah', name: 'Surah Al-Baqarah - Various Reciters', nameAr: 'سورة البقرة - مختلف القراء', url: 'https://backup.qurango.net/radio/albaqarah', img:'https://istiqamaacademy.net/wp-content/uploads/2025/05/%D8%B3%D9%88%D8%B1%D8%A9-%D8%A7%D9%84%D8%A8%D9%82%D8%B1%D8%A9-1024x1024.jpg.webp', categories: ['official', 'misc'] },
  { id: 'c8', name: 'Maher Al-Muaiqly', nameAr: 'إذاعة ماهر المعيقلي', url: 'https://backup.qurango.net/radio/maher', img: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/4b/80/58/4b80582d-78ca-a466-0341-0869bc611745/mza_5280524847349008894.jpg/250x250bb.jpg', categories: ['haramain'] },
  { id: 'c9', name: 'Mishary Al-Afasy', nameAr: 'إذاعة مشاري العفاسي', url: 'https://backup.qurango.net/radio/mishary_alafasi', img: 'https://i1.sndcdn.com/artworks-000019055020-yr9cjc-t200x200.jpg', categories: ['other'] },
  { id: 'c10', name: 'Abu Bakr Al-Shatri', nameAr: 'إذاعة أبو بكر الشاطري', url: 'https://backup.qurango.net/radio/shaik_abu_bakr_al_shatri', img: 'https://i1.sndcdn.com/artworks-000663801097-wb0y31-t200x200.jpg', categories: ['other'] },
  { id: 'c11', name: 'Khalid Al-Jaleel', nameAr: 'إذاعة خالد الجليل', url: 'https://backup.qurango.net/radio/khalid_aljileel', img: 'https://i1.sndcdn.com/avatars-ubX3f7yLm5eGyphJ-A4ysyA-t500x500.jpg', categories: ['other'] },
  { id: 'c12', name: 'Nasser Al-Qatami', nameAr: 'إذاعة ناصر القطامي', url: 'https://backup.qurango.net/radio/nasser_alqatami', img: 'https://i1.sndcdn.com/artworks-000096282703-s9wldh-t200x200.jpg', categories: ['other'] },
  { id: 'c13', name: 'Yasser Al-Dosari', nameAr: 'إذاعة ياسر الدوسري', url: 'https://backup.qurango.net/radio/yasser_aldosari', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Yasser_Al-Dosari_%28cropped%29.jpg/500px-Yasser_Al-Dosari_%28cropped%29.jpg', categories: ['haramain'] },
  { id: 'c14', name: 'Fares Abbad', nameAr: 'إذاعة فارس عباد', url: 'https://backup.qurango.net/radio/fares_abbad', img: 'https://static.suratmp3.com/pics/reciters/thumbs/15_600_600.jpg', categories: ['other'] },
  { id: 'c15', name: 'Ibrahim Al-Akhdar', nameAr: 'إذاعة إبراهيم الأخضر', url: 'https://backup.qurango.net/radio/ibrahim_alakdar', img: 'https://static.suratmp3.com/pics/reciters/thumbs/44_600_600.jpg', categories: ['other'] },
  { id: 'c16', name: 'Salah Bu Khatir', nameAr: 'إذاعة صلاح بو خاطر', url: 'https://backup.qurango.net/radio/slaah_bukhatir', img: 'https://pbs.twimg.com/profile_images/1306502829251624960/uHKIJQpq_200x200.jpg', categories: ['other'] },
  { id: 'c17', name: 'Haitham Al-Jadani', nameAr: 'إذاعة هيثم الجدعاني', url: 'https://backup.qurango.net/radio/hitham_aljadani', img: 'https://ar.islamway.net/uploads/authors/3948.jpg', categories: ['other'] },
  { id: 'c18', name: 'Ahmad Khader Al-Tarabulsi', nameAr: 'إذاعة أحمد خضر الطرابلسي', url: 'https://backup.qurango.net/radio/ahmad_khader_altarabulsi', img: 'https://i.pinimg.com/564x/d3/c2/9c/d3c29cc03198c3c15d380af048b2d68b.jpg', categories: ['other'] },
  { id: 'c19', name: 'Salah Al-Hashim', nameAr: 'إذاعة صلاح الهاشم', url: 'https://backup.qurango.net/radio/salah_alhashim', img: 'https://i.pinimg.com/564x/e9/22/1b/e9221b5ffd484937dc70c3eabe350c6f.jpg', categories: ['other'] },
  { id: 'c20', name: 'Abdul Aziz Suhaim', nameAr: 'إذاعة عبد العزيز سحيم', url: 'https://backup.qurango.net/radio/a_sheim', img: 'https://i.pinimg.com/564x/a7/37/47/a73747375897de4897da372a0fd921a0.jpg', categories: ['other'] },
  { id: 'c21', name: 'Nabil Al-Rifai', nameAr: 'إذاعة نبيل الرفاعي', url: 'https://backup.qurango.net/radio/nabil_al_rifay', img: 'https://i1.sndcdn.com/artworks-000161140408-wh6nhw-t200x200.jpg', categories: ['other'] },
  { id: 'c22', name: 'Sunnah Radio', nameAr: 'إذاعة السنة النبوية', url: 'https://n01.radiojar.com/x0vs2vzy6k0uv?rj-ttl=5&rj-tok=AAABjW751GcA4NgCI8-5DCpCHQ', img: 'https://i.pinimg.com/564x/55/16/ab/5516abd3744c3d0b0a7b28bedd5474c0.jpg', categories: ['athkar'] },
  { id: 'c23', name: 'Humbling Recitations', nameAr: 'إذاعة تلاوات خاشعة', url: 'https://backup.qurango.net/radio/salma', img: 'https://pbs.twimg.com/profile_images/1396812808659079169/5ft2haLD_400x400.jpg', categories: ['misc'] },
  { id: 'c24', name: 'Ruqyah Radio', nameAr: 'إذاعة الرقية الشرعية', url: 'https://backup.qurango.net/radio/roqiah', img: 'https://i1.sndcdn.com/artworks-zygACgAd2NKwuohE-UF2Piw-t500x500.jpg', categories: ['athkar'] },
  { id: 'c25', name: 'Quran Tafsir Summary', nameAr: 'المختصر في تفسير القرآن الكريم', url: 'https://backup.qurango.net/radio/mukhtasartafsir', img: 'https://areejquran.net/wp-content/uploads/2015/12/unnamed.jpg', categories: ['tafsir'] },
  { id: 'c26', name: 'Eid Takbeer', nameAr: 'إذاعة تكبيرات العيد', url: 'https://backup.qurango.net/radio/eid', img: 'https://i.pinimg.com/736x/3c/b3/fc/3cb3fc494b9f8332a7b7b3256e3d9822.jpg', categories: ['misc'] },
  { id: 'c-alsaid-saeed', name: 'Al-Sayyid Sa\'id', nameAr: 'الشيخ السيد السعيد', url: 'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/001.mp3', img: 'https://i1.sndcdn.com/artworks-000455505294-x2v8z1-t500x500.jpg', categories: ['egyptian'], playlistUrls: [
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/002-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/002-002.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/003-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/003-002.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/004-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/005-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/006-002.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/012.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/013-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/014-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/016-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/017-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/018-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/019-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/020-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/021-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/023-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/025-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/028-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/030-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/030-002.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/031.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/032.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/033-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/035.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/036-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/049.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/050.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/054.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/055-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/059.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/066.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/069.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/073.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/075.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/078-001.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/079.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/082.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/085.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/086.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/087.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/088.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/089.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/090.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/091.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/093.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/097.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/106.mp3',
    'https://media.way2quran.com/alsaid-saeed/hafs-an-asim/108.mp3'
  ] },
];

// Slug → categories for API stations
export const apiSlugCategories: Record<string, RadioCategory[]> = {
  // Haramain
  abdulrahman_alsudaes: ['haramain'],
  saud_alshuraim: ['haramain'],
  maher: ['haramain'],
  yasser_aldosari: ['haramain'],
  abdullah_aljohany: ['haramain'],
  ali_alhuthaifi: ['haramain'],
  ali_alhuthaifi_qalon: ['haramain'],
  abdulmohsen_alqasim: ['haramain'],
  salah_albudair: ['haramain'],
  bandar_balilah: ['haramain'],
  abdelbari_altoubayti: ['haramain'],

  // Egyptian
  mustafa_ismail: ['egyptian'],
  ahmad_nauina: ['egyptian'],
  abdulbasit_abdulsamad: ['egyptian'],
  abdulbasit_abdulsamad_mojawwad: ['egyptian'],
  abdulbasit_abdulsamad_warsh: ['egyptian'],
  mohammad_altablaway: ['egyptian'],
  mohammed_jibreel: ['egyptian'],
  mohammed_siddiq_alminshawi: ['egyptian'],
  mohammed_siddiq_alminshawi_mojawwad: ['egyptian'],
  mahmoud_khalil_alhussary: ['egyptian'],
  mahmoud_khalil_alhussary_mojawwad: ['egyptian'],
  mahmoud_khalil_alhussary_warsh: ['egyptian'],
  mahmoud_ali__albanna: ['egyptian'],
  mahmoud_ali__albanna_mojawwad: ['egyptian'],
  ahmed_amer: ['egyptian'],
  ahmad_shaheen: ['egyptian'],
  ali_hajjaj_alsouasi: ['egyptian'],
  mahmood_alsheimy: ['egyptian'],
  hatem_fareed_alwaer: ['egyptian'],
  mustafa_allahoni: ['egyptian'],
  abdulhadi_kanakeri: ['egyptian'],

  // Tafsir & Sciences
  mukhtasartafsir: ['tafsir'],
  tafseer: ['tafsir'],
  tabri: ['tafsir'],
  'gareeb-quran': ['tafsir'],
  almukhtasar_fi_alsiyra: ['tafsir'],
  fi_zilal_alsiyra: ['tafsir'],

  // Athkar & Ruqyah
  athkar_sabah: ['athkar'],
  athkar_masa: ['athkar'],
  sakeenah: ['athkar'],
  roqiah: ['athkar'],
  salma: ['athkar'],

  // Audio Books
  'saheh-bokharee': ['books'],
  'saheh-muslim': ['books'],
  riyad: ['books'],
  alanbiya: ['books'],
  alaikhtiarat_alfiqhayh_bin_baz: ['books'],
  sahabah: ['books'],

  // Misc
  eid: ['misc'],
  albaqarah: ['misc'],
  tarateel: ['misc'],
  ramadan: ['misc'],
  mix: ['misc'],
  fatwa: ['misc'],
  'Surah_Al-Mulk': ['misc'],

  // Translations
  translation_quran_english_basit: ['translations'],
  translation_quran_english_bsfr: ['translations'],
  translation_quran_english_walk_basit: ['translations'],
  translation_quran_french: ['translations'],
  translation_quran_german: ['translations'],
  translation_quran_turkish: ['translations'],
  translation_quran_urdu_basit: ['translations'],
  translation_quran_urdu_sds_shur: ['translations'],
  translation_quran_urdu_minsh: ['translations'],
  translation_quran_farsi: ['translations'],
  translation_quran_Russia: ['translations'],
  translation_quran_chinese: ['translations'],
  translation_quran_spanish_afs: ['translations'],
  translation_quran_portuguese: ['translations'],
  translation_quran_kurdish: ['translations'],
  translation_quran_Korean: ['translations'],
  translation_quran_tamazight: ['translations'],
  translation_quran_bosnia: ['translations'],
  Translation_Quran_Hausa: ['translations'],
  translation_quran_albanian: ['translations'],
  translation_quran_hungarian: ['translations'],
  translation_quran_greek: ['translations'],
};

// Get slug from URL
export function getSlugFromUrl(url: string): string {
  try {
    return new URL(url).pathname.split('/').pop() || '';
  } catch {
    return url.split('/').pop() || '';
  }
}

// Extract curated slugs for deduplication
export const curatedSlugs = new Set(curatedStations.map(s => getSlugFromUrl(s.url)));
