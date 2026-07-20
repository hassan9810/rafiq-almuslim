import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { SunnahRemindersWidget } from '@/components/SunnahRemindersWidget';
import { checkAndNotifyPrayers } from '@/lib/prayerNotifications';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * Shared layout: one Header and one Footer for the whole app.
 * Page content renders via <Outlet />. Modify Header/Footer here only.
 */
export function AppLayout() {
  const { direction, hideAppHeader, themeColor, quranFont, location, adhanEnabled, adhanMuezzinId } = useAppStore();
  const { language } = useTranslation();

  useEffect(() => {
    document.documentElement.dataset.themeColor = themeColor;
    document.documentElement.dataset.quranFont = quranFont;
  }, [themeColor, quranFont]);

  // Global adhan + notifications interval — runs regardless of which page is open
  useEffect(() => {
    if (!location) return;
    const run = () => checkAndNotifyPrayers(
      location.latitude, location.longitude, language, adhanEnabled, adhanMuezzinId
    );
    run();
    const interval = setInterval(run, 30_000);
    return () => clearInterval(interval);
  }, [location, language, adhanEnabled, adhanMuezzinId]);

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {!hideAppHeader && <Header />}
      <main className='py-24'>
        <Outlet />
      </main>
      {!hideAppHeader && <Footer />}
      <ScrollToTop />
      <SunnahRemindersWidget />
    </div>
  );
}
