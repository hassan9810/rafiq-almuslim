import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Headphones, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PrayerTimesWidget } from '@/components/PrayerTimesWidget';

export function HeroSection() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Get current dates
  const { gregorianDate, hijriDate } = useMemo(() => {
    const now = new Date();
    
    // Gregorian without weekday + "م" suffix - force Gregorian calendar for ar-SA
    const gregorian = now.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) + ' م';
    
    // Hijri with weekday (already includes هـ from the locale)
    const hijri = now.toLocaleDateString('ar-SA', {
      calendar: 'islamic-umalqura',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    return { gregorianDate: gregorian, hijriDate: hijri };
  }, [language]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to Quran page with search query
      navigate(`/quran?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient islamic-pattern" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
      
      {/* Animated Geometric Pattern */}
      <svg 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-auto opacity-10 animate-spin-slow"
        viewBox="0 0 200 200"
      >
        <polygon 
          points="100,10 40,198 190,78 10,78 160,198" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
          className="text-primary-foreground"
        />
      </svg>

      {/* Date Bar - Right below header */}
      <div className="relative z-10 pt-16 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary-foreground/10 backdrop-blur-sm py-2 px-4"
        >
          <div className="container flex items-center justify-center gap-2 text-primary-foreground/90 dark:text-foreground">
            <Calendar className="w-4 h-4" />
            <span className="font-arabic text-sm md:text-base">{hijriDate}</span>
            <span className="text-primary-foreground/50 dark:text-foreground/50">|</span>
            <span className="text-sm md:text-base">{gregorianDate}</span>
          </div>
        </motion.div>
      </div>

      <div className="container relative z-10 flex-1 flex items-center py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`space-y-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {/* Bismillah */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-arabic text-2xl md:text-3xl text-primary-foreground/90"
            >
              {t('bismillah')}
            </motion.p>

            {/* Title */}
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight"
              >
                {t('welcome')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-primary-foreground/80 max-w-xl"
              >
                {t('heroSubtitle')}
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onSubmit={handleSearch}
              className="relative max-w-xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-background/95 backdrop-blur-md border-0 text-foreground placeholder:text-muted-foreground shadow-lg focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                variant="hero-outline"
                size="xl"
                onClick={() => navigate('/quran')}
                className="group"
              >
                <Book className="w-5 h-5" />
                {t('startReading')}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="gold"
                size="xl"
                onClick={() => navigate('/quran')}
                className="group"
              >
                <Headphones className="w-5 h-5" />
                {t('listenNow')}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-8 pt-4"
            >
              {[
                { value: language === 'ar' ? 'القرآن' : 'Quran', label: language === 'ar' ? 'الكريم' : 'Kareem' },
                { value: '+50', label: language === 'ar' ? 'قارئ' : 'Reciters' },
                { value: language === 'ar' ? 'الحديث' : 'Hadith', label: language === 'ar' ? 'الشريف' : 'Sharif' },
                { value: language === 'ar' ? 'حصن' : 'Hisn', label: language === 'ar' ? 'المسلم' : 'Muslim' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Prayer Times */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <PrayerTimesWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
