import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppLayout } from "./components/AppLayout";
import { useAppStore } from "./store/useAppStore";
import Index from "./pages/Index";
import QuranPage from "./pages/QuranPage";
import SurahReader from "./pages/SurahReader";
import MushafPage from "./pages/MushafPage";
import TextMushafPage from "./pages/TextMushafPage";
import PrayerTimesPage from "./pages/PrayerTimesPage";
import QiblaPage from "./pages/QiblaPage";
import RadioPage from "./pages/RadioPage";
import TafsirPage from "./pages/TafsirPage";
import HadithPage from "./pages/HadithPage";
import AzkarPage from "./pages/AzkarPage";
import HisnMuslimPage from "./pages/HisnMuslimPage";
import TranslationsPage from "./pages/TranslationsPage";
import TranslationReaderPage from "./pages/TranslationReaderPage";
import E3rabPage from "./pages/E3rabPage";
import AyahByAyahPage from "./pages/AyahByAyahPage";
import BookmarksPage from "./pages/BookmarksPage";
import SearchPage from "./pages/SearchPage";
import MemorizationPage from "./pages/MemorizationPage";
import ReadingPlanPage from "./pages/ReadingPlanPage";
import TasbeehPage from "./pages/TasbeehPage";
import ShareAyahPage from "./pages/ShareAyahPage";
import NotFound from "./pages/NotFound";
import CalendarPage from "./pages/CalendarPage";

const queryClient = new QueryClient();

const App = () => {
  const theme = useAppStore((state) => state.theme);

  // Apply theme on initial load and when it changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/quran/:surahNumber" element={<SurahReader />} />
            <Route path="/mushaf" element={<MushafPage />} />
            <Route path="/mushaf-text" element={<TextMushafPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/tafsir" element={<TafsirPage />} />
            <Route path="/hadith" element={<HadithPage />} />
            <Route path="/azkar" element={<AzkarPage />} />
            <Route path="/hisn-muslim" element={<HisnMuslimPage />} />
            <Route path="/translations" element={<TranslationsPage />} />
            <Route path="/translations/:translationKey/:surahNumber" element={<TranslationReaderPage />} />
            <Route path="/e3rab" element={<E3rabPage />} />
            <Route path="/ayah-player" element={<AyahByAyahPage />} />
            <Route path="/ayah-player/:surahNumber" element={<AyahByAyahPage />} />
            <Route path="/prayer-times" element={<PrayerTimesPage />} />
            <Route path="/qibla" element={<QiblaPage />} />
            <Route path="/radio" element={<RadioPage />} />
            <Route path="/memorization" element={<MemorizationPage />} />
            <Route path="/reading-plan" element={<ReadingPlanPage />} />
            <Route path="/tasbeeh" element={<TasbeehPage />} />
            <Route path="/share-ayah" element={<ShareAyahPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;