# Rafiq AlMuslim - رفيق المسلم 🕌

<div align="center">

![Rafiq AlMuslim Logo](https://img.shields.io/badge/Rafiq-AlMuslim-00A67E?style=for-the-badge&logo=quran&logoColor=white)

**Your Spiritual Companion for Quran, Prayer Times, and Daily Islamic Practices**

**رفيقك الروحي لتلاوة القرآن الكريم وأوقات الصلاة والأذكار اليومية**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_App-00A67E?style=for-the-badge)](https://rafiqalmuslim.lovable.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[English](#english) • [العربية](#arabic)

</div>

---

## <a name="english"></a>📖 About The Project

**Rafiq AlMuslim** is a comprehensive Islamic companion web application designed to help Muslims worldwide with their daily spiritual practices. Built with modern web technologies, it provides an intuitive and beautiful interface for reading the Quran, tracking prayer times, listening to Islamic radio, and much more.

### ✨ Key Features

#### 📕 Quran & Islamic Texts
- **Complete Quran Reader** - Read all 114 Surahs with beautiful Arabic typography
- **Mushaf Mode** - Traditional page-by-page Quran reading experience
- **Ayah by Ayah Player** - Listen to and view individual verses with 79+ reciters, verse images, auto-play, and repeat modes
- **90+ Translations** - Quran translations in multiple languages from trusted sources
- **Tafsir (Exegesis)** - Deep understanding with multiple tafsir sources
- **Audio Recitations** - Listen to various renowned Qaris

#### 🕌 Daily Islamic Practices
- **Prayer Times** - Accurate prayer times based on your location with countdown
- **Qibla Compass** - Find the direction to Makkah with device compass integration
- **Azkar & Adhkar** - Morning, evening, and daily remembrances
- **Hisn Muslim** - Complete fortress of the Muslim with audio
- **Digital Tasbih** - Electronic counter with vibration feedback

#### 📚 Hadith Collection
- Access to the six major hadith books (Kutub al-Sittah)
- Sahih Bukhari, Sahih Muslim, and more
- Search by hadith number
- Grade and authenticity information

#### 🌍 Multi-language Support
- Bilingual interface (Arabic & English)
- RTL/LTR layout switching
- Localized content and translations

#### 🎨 Modern UI/UX
- Beautiful glassmorphism design
- Dark/Light theme support
- Smooth animations with Framer Motion
- Fully responsive for all devices
- Progressive Web App (PWA) capabilities

### 🛠️ Built With

**Frontend Framework:**
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool & dev server

**Styling:**
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Framer Motion](https://www.framer.com/motion/) - Animation library

**State Management & Data:**
- [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- [TanStack Query](https://tanstack.com/query/latest) - Server state management
- [Axios](https://axios-http.com/) - HTTP client

**APIs & Services:**
- [Alquran Cloud API](https://alquran.cloud/api) - Quran data
- [Aladhan API](https://aladhan.com/prayer-times-api) - Prayer times
- [Sunnah.com API](https://sunnah.api-docs.io/) - Hadith collection

**Testing:**
- [Vitest](https://vitest.dev/) - Unit testing
- [Playwright](https://playwright.dev/) - E2E testing
- [React Testing Library](https://testing-library.com/react) - Component testing

### 🚀 Getting Started

#### Prerequisites

- Node.js (v18 or higher)
- npm or bun package manager
- Modern web browser

#### Installation

```bash
# Clone the repository
git clone https://github.com/hassan9810/rafiq-almuslim.git

# Navigate to project directory
cd rafiq-almuslim

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

### 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run E2E tests

# Code Quality
npm run lint         # Lint code
```

### 📁 Project Structure

```
rafiq-almuslim/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── lib/            # Utility functions & APIs
│   ├── hooks/          # Custom React hooks
│   ├── store/          # Zustand store
│   ├── data/           # Static data & constants
│   └── App.tsx         # Main application component
├── public/             # Static assets
└── tests/              # Test files
```

### 🎯 Features Overview

#### 1. Quran Reader
- Surah-by-surah navigation
- Verse bookmarking
- Audio playback with word-by-word synchronization
- Reciter selection
- Reading progress tracking

#### 2. Prayer Times
- Location-based calculation
- Visual countdown to next prayer
- Prayer time notifications
- Multiple calculation methods support

#### 3. Qibla Finder
- Real-time compass orientation
- Device gyroscope integration
- Distance to Makkah calculation
- Visual direction indicator

#### 4. Islamic Radio
- Live streams from Makkah and Madinah
- Multiple Quran radio stations
- **Category-based filtering** (Official, Egyptian Reciters, Haramain, Tafsir, Azkar, Audiobooks, Translations & more)
- Background playback support
- Volume control

#### 5. Ayah by Ayah Player
- Verse-by-verse audio playback with 79+ reciters from everyayah.com
- Visual verse image display for each ayah
- Auto-play sequential progression through surahs
- Ayah repeat mode for memorization
- Direct ayah number input and slider navigation
- Categorized reciter selection (Egyptian, Haramain, Other, Translations)

#### 6. Azkar & Duas
- Categorized by time and occasion
- Audio recitations
- Progress tracking
- Custom counters

### 🌐 API Integration

The application integrates with several Islamic content APIs:

- **Quran API** - Complete Quran text and audio
- **Prayer Times API** - Accurate prayer calculations
- **Hadith API** - Authentic hadith collections
- **Tafsir API** - Multiple tafsir sources

### 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

### 📧 Contact

**Ahmed Hassan**
- Email: [ahmed.hassan.shehatah@gmail.com](mailto:ahmed.hassan.shehatah@gmail.com)
- Portfolio: [ahmed-hassan-portfolio.lovable.app](https://ahmed-hassan-portfolio.lovable.app)

**Amr Allam**
- Email:
[amr.i.allam@hotmail.com](mailto:amr.i.allam@hotmail.com)
- GitHub: [https://github.com/amriallam](https://github.com/amriallam)

**Ahmed Shams**
- Email:
[Ahmedtaha757@gmail.com](mailto:Ahmedtaha757@gmail.com)
- GitHub: [https://github.com/Ahhmedshams](https://github.com/Ahhmedshams)


Project Link: [https://github.com/hassan9810/rafiq-almuslim](https://github.com/hassan9810/rafiq-almuslim)

Live Demo: [https://rafiqalmuslim.lovable.app](https://rafiqalmuslim.lovable.app)

### 🙏 Acknowledgments

- [Alquran Cloud](https://alquran.cloud/) for Quran API
- [Aladhan](https://aladhan.com/) for Prayer Times API
- [Sunnah.com](https://sunnah.com/) for Hadith API
- [EveryAyah.com](https://everyayah.com/) for verse-by-verse audio and images
- [quran-search-engine](https://github.com/adelpro/quran-search-engine) for advanced linguistic Quran search
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- All contributors and users of this project

### 🗺️ Roadmap

- [ ] Offline mode support
- [ ] Prayer time notifications
- [ ] Quran memorization tools
- [ ] Social features (community)
- [ ] Mobile app (React Native)
- [ ] Advanced search capabilities
- [ ] Personalized learning paths

---

## <a name="arabic"></a>🕌 النسخة العربية

### نبذة عن المشروع

**رفيق المسلم** هو تطبيق ويب إسلامي شامل مصمم لمساعدة المسلمين في جميع أنحاء العالم في ممارساتهم الروحية اليومية. تم بناؤه بتقنيات الويب الحديثة، ويوفر واجهة جميلة وسهلة الاستخدام لقراءة القرآن الكريم، ومتابعة أوقات الصلاة، والاستماع إلى الإذاعات الإسلامية، والمزيد.

### ✨ المميزات الرئيسية

#### 📕 القرآن الكريم والنصوص الإسلامية
- **قارئ القرآن الكامل** - اقرأ جميع السور الـ 114 بخط عربي جميل
- **وضع المصحف** - تجربة قراءة تقليدية صفحة بصفحة
- **مشغّل آية بآية** - استمع وشاهد كل آية على حدة مع أكثر من 79 قارئ، مع التشغيل التلقائي والتكرار
- **أكثر من 90 ترجمة** - ترجمات القرآن بلغات متعددة من مصادر موثوقة
- **التفسير** - فهم عميق مع مصادر تفسير متعددة
- **التلاوات الصوتية** - استمع لمختلف القراء المشهورين

#### 📻 الإذاعات الإسلامية
- **تصنيفات متعددة** - محطات رسمية، قراء مصريون، قراء الحرمين، تفسير، أذكار، كتب مسموعة، ترجمات والمزيد
- بث مباشر من مكة والمدينة
- البحث والتصفية حسب التصنيف

#### 🕌 الممارسات الإسلامية اليومية
- **أوقات الصلاة** - أوقات صلاة دقيقة بناءً على موقعك مع العد التنازلي
- **بوصلة القبلة** - اعثر على اتجاه مكة مع تكامل بوصلة الجهاز
- **الأذكار** - أذكار الصباح والمساء واليومية
- **حصن المسلم** - حصن المسلم الكامل مع الصوت
- **السبحة الإلكترونية** - عداد إلكتروني مع ردود فعل اهتزازية

#### 📚 مجموعة الأحاديث
- الوصول إلى الكتب الستة الرئيسية (الكتب الستة)
- صحيح البخاري، صحيح مسلم، والمزيد
- البحث برقم الحديث
- معلومات الدرجة والأصالة

#### 🌍 دعم متعدد اللغات
- واجهة ثنائية اللغة (العربية والإنجليزية)
- تبديل تخطيط RTL/LTR
- محتوى وترجمات محلية

#### 🎨 واجهة مستخدم حديثة
- تصميم جميل بتأثيرات زجاجية
- دعم الوضع الداكن والفاتح
- رسوم متحركة سلسة
- استجابة كاملة لجميع الأجهزة
- قدرات تطبيق الويب التقدمي (PWA)

### 🚀 البدء

#### المتطلبات الأساسية

- Node.js (الإصدار 18 أو أعلى)
- npm أو bun
- متصفح ويب حديث

#### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/hassan9810/rafiq-almuslim.git

# الانتقال إلى دليل المشروع
cd rafiq-almuslim

# تثبيت التبعيات
npm install

# بدء خادم التطوير
npm run dev
```

سيكون التطبيق متاحًا على `http://localhost:8080`

### 📧 التواصل

البريد الإلكتروني: [ahmed.hassan.shehatah@gmail.com](mailto:ahmed.hassan.shehatah@gmail.com)
[amr.i.allam@hotmail.com](mailto:amr.i.allam@hotmail.com)
[Ahmedtaha757@gmail.com](mailto:Ahmedtaha757@gmail.com)

رابط المشروع: [https://github.com/hassan9810/rafiq-almuslim](https://github.com/hassan9810/rafiq-almuslim)

النسخة التجريبية: [https://rafiqalmuslim.lovable.app](https://rafiqalmuslim.lovable.app)

### 🙏 شكر وتقدير

- [Alquran Cloud](https://alquran.cloud/) لواجهة برمجة تطبيقات القرآن
- [Aladhan](https://aladhan.com/) لواجهة برمجة تطبيقات أوقات الصلاة
- [Sunnah.com](https://sunnah.com/) لواجهة برمجة تطبيقات الأحاديث
- [quran-search-engine](https://github.com/adelpro/quran-search-engine) لمحرك البحث اللغوي المتقدم في القرآن الكريم
- جميع المساهمين ومستخدمي هذا المشروع

---

<div align="center">

**Made with ❤️ for the Muslim Ummah | صُنع بحب ♥️ للأمة الإسلامية**

</div>
