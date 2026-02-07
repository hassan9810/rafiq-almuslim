// Azkar data - Morning, Evening, Sleep, and Travel adhkar

export interface Dhikr {
  id: number;
  text: string;
  translation?: string;
  reference?: string;
  count: number;
  category: 'morning' | 'evening' | 'sleep' | 'travel' | 'general';
}

export const morningAzkar: Dhikr[] = [
  {
    id: 1,
    text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation: 'We have entered the morning and the dominion belongs to Allah. Praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
    reference: 'Abu Dawud 4/317',
    count: 1,
    category: 'morning'
  },
  {
    id: 2,
    text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    translation: 'O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.',
    reference: 'At-Tirmidhi 5/466',
    count: 1,
    category: 'morning'
  },
  {
    id: 3,
    text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    translation: 'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide to Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.',
    reference: 'Sahih al-Bukhari',
    count: 1,
    category: 'morning'
  },
  {
    id: 4,
    text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    translation: 'Glory is to Allah and praise is to Him.',
    reference: 'Muslim 4/2071',
    count: 100,
    category: 'morning'
  },
  {
    id: 5,
    text: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation: 'None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
    reference: 'Al-Bukhari 4/95, Muslim 4/2071',
    count: 10,
    category: 'morning'
  },
  {
    id: 6,
    text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    translation: 'I seek forgiveness from Allah and repent to Him.',
    reference: 'Al-Bukhari, cf. Al-Asqalani',
    count: 100,
    category: 'morning'
  },
  {
    id: 7,
    text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    translation: 'In the Name of Allah, with Whose Name nothing on earth or in the heaven can cause harm, and He is the All-Hearing, the All-Knowing.',
    reference: 'Abu Dawud 4/323, At-Tirmidhi 5/465',
    count: 3,
    category: 'morning'
  },
  {
    id: 8,
    text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
    translation: 'O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for forgiveness and well-being in my religion, my worldly affairs, my family, and my wealth.',
    reference: 'Ibn Majah 2/332',
    count: 1,
    category: 'morning'
  },
];

export const eveningAzkar: Dhikr[] = [
  {
    id: 101,
    text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    translation: 'We have entered the evening and the dominion belongs to Allah. Praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.',
    reference: 'Abu Dawud 4/317',
    count: 1,
    category: 'evening'
  },
  {
    id: 102,
    text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    translation: 'O Allah, by You we enter the evening, by You we enter the morning, by You we live, by You we die, and to You is the return.',
    reference: 'At-Tirmidhi 5/466',
    count: 1,
    category: 'evening'
  },
  {
    id: 103,
    text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    translation: 'I seek refuge in the perfect words of Allah from the evil of that which He has created.',
    reference: 'Muslim 4/2081',
    count: 3,
    category: 'evening'
  },
  {
    id: 104,
    text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ',
    translation: 'O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.',
    reference: 'Al-Bukhari 7/158',
    count: 1,
    category: 'evening'
  },
];

export const sleepAzkar: Dhikr[] = [
  {
    id: 201,
    text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    translation: 'In Your Name, O Allah, I die and I live.',
    reference: 'Al-Bukhari',
    count: 1,
    category: 'sleep'
  },
  {
    id: 202,
    text: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
    reference: 'Abu Dawud 4/311',
    count: 3,
    category: 'sleep'
  },
  {
    id: 203,
    text: 'سُبْحَانَ اللَّهِ (٣٣) وَالْحَمْدُ لِلَّهِ (٣٣) وَاللَّهُ أَكْبَرُ (٣٤)',
    translation: 'Glory be to Allah (33x), Praise be to Allah (33x), Allah is the Greatest (34x).',
    reference: 'Al-Bukhari & Muslim',
    count: 1,
    category: 'sleep'
  },
  {
    id: 204,
    text: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَنَبِيِّكَ الَّذِي أَرْسَلْتَ',
    translation: 'O Allah, I submit myself to You, and I entrust my affair to You, and I turn my face to You, and I lean my back on You, hoping in You and fearing You. There is no refuge and no escape from You except to You. I believe in Your Book which You have revealed and in Your Prophet whom You have sent.',
    reference: 'Al-Bukhari, Muslim',
    count: 1,
    category: 'sleep'
  },
];

export const travelAzkar: Dhikr[] = [
  {
    id: 301,
    text: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    translation: 'Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. Glory is to Him who has subjected this to us, and we could not have done it ourselves. Indeed, to our Lord we will return.',
    reference: 'Muslim 2/978',
    count: 1,
    category: 'travel'
  },
  {
    id: 302,
    text: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ',
    translation: 'O Allah, we ask You for righteousness and piety in this journey of ours, and deeds which please You. O Allah, make this journey easy for us and shorten its distance.',
    reference: 'Muslim 2/978',
    count: 1,
    category: 'travel'
  },
  {
    id: 303,
    text: 'اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ',
    translation: 'O Allah, You are the Companion on the journey and the Successor over the family.',
    reference: 'Muslim 2/978',
    count: 1,
    category: 'travel'
  },
];

export const generalAzkar: Dhikr[] = [
  {
    id: 401,
    text: 'سُبْحَانَ اللَّهِ',
    translation: 'Glory be to Allah',
    count: 33,
    category: 'general'
  },
  {
    id: 402,
    text: 'الْحَمْدُ لِلَّهِ',
    translation: 'Praise be to Allah',
    count: 33,
    category: 'general'
  },
  {
    id: 403,
    text: 'اللَّهُ أَكْبَرُ',
    translation: 'Allah is the Greatest',
    count: 34,
    category: 'general'
  },
  {
    id: 404,
    text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    translation: 'There is no power and no strength except with Allah',
    reference: 'Al-Bukhari & Muslim',
    count: 10,
    category: 'general'
  },
  {
    id: 405,
    text: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    translation: 'There is no deity except Allah',
    count: 100,
    category: 'general'
  },
];

export function getAllAzkar(): Dhikr[] {
  return [...morningAzkar, ...eveningAzkar, ...sleepAzkar, ...travelAzkar, ...generalAzkar];
}

export function getAzkarByCategory(category: Dhikr['category']): Dhikr[] {
  switch (category) {
    case 'morning': return morningAzkar;
    case 'evening': return eveningAzkar;
    case 'sleep': return sleepAzkar;
    case 'travel': return travelAzkar;
    case 'general': return generalAzkar;
    default: return [];
  }
}
