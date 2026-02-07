import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SurahList } from '@/components/SurahList';
import { Footer } from '@/components/Footer';
import { PrayerTimesWidget } from '@/components/PrayerTimesWidget';

const Index = () => {
  const { theme } = useAppStore();
  const { language } = useTranslation();

  useEffect(() => {
    // Apply theme on mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main>
        <HeroSection />
        
        {/* Mobile Prayer Times */}
        <section className="lg:hidden py-8 px-4">
          <PrayerTimesWidget />
        </section>
        
        <SurahList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;