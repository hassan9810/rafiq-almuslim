import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';

/**
 * Shared layout: one Header and one Footer for the whole app.
 * Page content renders via <Outlet />. Modify Header/Footer here only.
 */
export function AppLayout() {
  const { direction, hideAppHeader, themeColor, quranFont } = useAppStore();

  useEffect(() => {
    document.documentElement.dataset.themeColor = themeColor;
    document.documentElement.dataset.quranFont = quranFont;
  }, [themeColor, quranFont]);

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {!hideAppHeader && <Header />}
      <main className='py-24'>
        <Outlet />
      </main>
      {!hideAppHeader && <Footer />}
      <ScrollToTop />
    </div>
  );
}
