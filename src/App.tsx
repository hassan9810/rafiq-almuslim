import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppLayout } from "./components/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* Home page route */}
              <Route path="/" element={<Index />} />

              {/*
                Temporarily disabled routes
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
              */}

              {/* Fallback route for unknown paths */}
              <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;