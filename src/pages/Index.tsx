import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { HeroSection } from '@/components/HeroSection';
import { SurahList } from '@/components/SurahList';
import { PrayerTimesWidget } from '@/components/PrayerTimesWidget';
import { AyahOfTheDay } from '@/components/AyahOfTheDay';
import { DhikrOfTheDay } from '@/components/DhikrOfTheDay';
import { NextPrayerWidget } from '@/components/NextPrayerWidget';

const Index = () => {
  const { theme } = useAppStore();
  const { language } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="-mt-24">
      <main>
        <HeroSection />

        {/* Daily Widgets Section */}
        <section className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AyahOfTheDay />
            <DhikrOfTheDay />
            <NextPrayerWidget />
          </div>
        </section>

        {/* Mobile Prayer Times */}
        <section className="lg:hidden py-4 px-4">
          <PrayerTimesWidget />
        </section>
        
        <SurahList />
      </main>
    </div>
  );
};

export default Index;