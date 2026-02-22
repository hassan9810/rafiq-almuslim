import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { HeroSection } from '@/components/HeroSection';
import { SurahList } from '@/components/SurahList';
import { PrayerTimesWidget } from '@/components/PrayerTimesWidget';

const Index = () => {
  const { theme, direction } = useAppStore();
  const { language } = useTranslation();

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="-mt-24">
      <main>
        <HeroSection />
        
        {/* Mobile Prayer Times */}
        <section className="lg:hidden py-8 px-4">
          <PrayerTimesWidget />
        </section>
        
        <SurahList />
      </main>
    </div>
  );
};

export default Index;