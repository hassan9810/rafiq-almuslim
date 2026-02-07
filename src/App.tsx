import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/quran/:surahNumber" element={<SurahReader />} />
          <Route path="/mushaf" element={<MushafPage />} />
          <Route path="/mushaf-text" element={<TextMushafPage />} />
          <Route path="/tafsir" element={<TafsirPage />} />
          <Route path="/hadith" element={<HadithPage />} />
          <Route path="/azkar" element={<AzkarPage />} />
          <Route path="/hisn-muslim" element={<HisnMuslimPage />} />
          <Route path="/translations" element={<TranslationsPage />} />
          <Route path="/translations/:translationKey/:surahNumber" element={<TranslationReaderPage />} />
          <Route path="/e3rab" element={<E3rabPage />} />
          <Route path="/prayer-times" element={<PrayerTimesPage />} />
          <Route path="/qibla" element={<QiblaPage />} />
          <Route path="/radio" element={<RadioPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;