import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Bookmark,
  Share2,
  Settings,
  Loader2,
  Star,
  BookOpen,
  LayoutList,
  AlignJustify,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import {
  fetchSurahWithTranslation,
  fetchReciters,
  getRecitersFromData,
  getAudioUrl,
  translations,
  type SurahData,
  type Reciter
} from '@/lib/quranApi';
import { tafsirEditions, fetchTafsirAyah } from '@/lib/tafsirApi';

const BISMILLAH_VARIANTS = [
  'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ'
];

function getAyahDisplayText(surahNum: number, numberInSurah: number, text: string): string {
  if (surahNum === 1 || surahNum === 27 || surahNum === 9 || numberInSurah !== 1) return text.trim();
  let trimmed = text.trimStart();
  for (const b of BISMILLAH_VARIANTS) {
    if (trimmed.startsWith(b)) {
      return trimmed.slice(b.length).trim();
    }
  }
  return text;
}

export default function SurahReader() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const {
    direction,
    favorites,
    toggleFavorite,
    addBookmark,
    removeBookmark,
    bookmarks,
    addRecentRead,
    player,
    setPlayer
  } = useAppStore();

  const [surahData, setSurahData] = useState<{ arabic: SurahData; translation: SurahData } | null>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState('en.sahih');
  const [loading, setLoading] = useState(true);
  const [currentAyah, setCurrentAyah] = useState<number>(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<'flowing' | 'cards'>('flowing');
  const [flowingAyahPopupIndex, setFlowingAyahPopupIndex] = useState<number | null>(null);
  const [blinkAyah, setBlinkAyah] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [popupTafsirSource, setPopupTafsirSource] = useState(() =>
    language === 'ar' ? tafsirEditions[2].slug : tafsirEditions[7].slug
  );
  const [popupTafsirText, setPopupTafsirText] = useState<string | null>(null);
  const [popupTafsirLoading, setPopupTafsirLoading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPopupTafsirSource(language === 'ar' ? tafsirEditions[2].slug : tafsirEditions[7].slug);
  }, [language]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const showArabic = language === 'ar';
  const surahNum = parseInt(surahNumber || '1');
  const isFavorite = favorites.includes(surahNum);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // Load reciters based on language
      const recitersData = await fetchReciters(language);
      if (recitersData.length > 0) {
        setReciters(recitersData);
        // Default to محمد صديق المنشاوي as the default reciter
        const minshawi = recitersData.find(r => r.name.includes('المنشاوي') || r.name.toLowerCase().includes('minshawi'));
        if (minshawi) {
          // Override with our custom server for minshawi
          setSelectedReciter({
            ...minshawi,
            moshaf: [{
              ...minshawi.moshaf[0],
              server: 'https://server10.mp3quran.net/minsh/'
            }]
          });
        } else {
          const maher = recitersData.find(r => r.name.includes('ماهر المعيقلي'));
          setSelectedReciter(maher || recitersData[0]);
        }
      }

      // Load surah data
      const surah = await fetchSurahWithTranslation(surahNum, selectedTranslation);
      if (surah) {
        setSurahData(surah);
        addRecentRead(surahNum, 1);
      }

      setLoading(false);
    };
    loadData();
  }, [surahNum, selectedTranslation, language]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Scroll to ayah and blink twice when opened from bookmark (?ayah=N)
  useEffect(() => {
    const ayahParam = searchParams.get('ayah');
    if (!surahData?.arabic?.ayahs?.length || !ayahParam) return;
    const ayahNum = parseInt(ayahParam, 10);
    if (Number.isNaN(ayahNum) || ayahNum < 1) return;
    const maxAyah = surahData.arabic.ayahs.length;
    const targetAyah = Math.min(ayahNum, maxAyah);
    setBlinkAyah(targetAyah);
    const scrollToAyah = () => {
      const el = document.getElementById(`ayah-${targetAyah}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    const tScroll = setTimeout(scrollToAyah, 150);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('ayah');
      return next;
    }, { replace: true });
    return () => clearTimeout(tScroll);
  }, [surahNum, searchParams, setSearchParams, surahData?.arabic?.ayahs?.length]);

  // Fetch tafsir when popup is open and ayah or source changes
  useEffect(() => {
    const ayahs = surahData?.arabic?.ayahs;
    if (flowingAyahPopupIndex === null || !ayahs?.[flowingAyahPopupIndex]) {
      setPopupTafsirText(null);
      return;
    }
    const ayahNumber = ayahs[flowingAyahPopupIndex].numberInSurah;
    let cancelled = false;
    setPopupTafsirLoading(true);
    setPopupTafsirText(null);
    fetchTafsirAyah(popupTafsirSource, surahNum, ayahNumber).then((text) => {
      if (!cancelled) {
        setPopupTafsirLoading(false);
        setPopupTafsirText(text);
      }
    }).catch(() => {
      if (!cancelled) {
        setPopupTafsirLoading(false);
        setPopupTafsirText(null);
      }
    });
    return () => { cancelled = true; };
  }, [flowingAyahPopupIndex, popupTafsirSource, surahNum, surahData?.arabic?.ayahs]);

  const handlePlay = () => {
    if (!selectedReciter || !audioRef.current) return;

    const audioUrl = getAudioUrl(selectedReciter, surahNum);
    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    if (player.isPlaying) {
      audioRef.current.pause();
      setPlayer({ isPlaying: false });
    } else {
      audioRef.current.play();
      setPlayer({ isPlaying: true, currentSurah: surahNum, currentReciter: selectedReciter });
    }
  };

  const handlePrevSurah = () => {
    if (surahNum > 1) {
      navigate(`/quran/${surahNum - 1}`);
    }
  };

  const handleNextSurah = () => {
    if (surahNum < 114) {
      navigate(`/quran/${surahNum + 1}`);
    }
  };

  const isBookmarked = (ayahNum: number) => {
    return bookmarks.some(b => b.surah === surahNum && b.ayah === ayahNum);
  };

  // Reading progress scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalHeight = el.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
      setReadingProgress(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div>
        <main>
          <div className="container max-w-4xl">
            <Skeleton className="h-12 w-48 mb-4" />
            <Skeleton className="h-8 w-32 mb-8" />
            <div className="space-y-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!surahData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">{t('couldNotLoadSurah')}</p>
      </div>
    );
  }

  const { arabic, translation } = surahData;

  return (
    <div ref={contentRef}>
      {/* Reading Progress Bar - fixed top */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-muted/30">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Reading Progress Bar - fixed top */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-muted/30">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <main>
        <div className="container max-w-4xl py-8">
          {/* Surah Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(surahNum)}
                    aria-label={isFavorite ? t('removeFavorite') : t('favorite')}
                  >
                    <Star className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={t('shareAyah')}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <Button
                    variant={viewMode === 'flowing' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode('flowing')}
                    title={t('readingStyleFlow')}
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode('cards')}
                    title={t('readingStyleCards')}
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <h1 className="font-arabic text-4xl md:text-5xl text-foreground mb-2">
              {arabic.name}
            </h1>
            <p className="text-xl text-muted-foreground">{arabic.englishName}</p>

            <div className="inline-flex items-center gap-2 my-3">
              <Badge variant="outline" className="text-xs">
                {arabic.revelationType === 'Meccan' ? t('makki') : t('madani')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {arabic.numberOfAyahs} {t('verses')}
              </Badge>
            </div>

            {/* Ayah by Ayah Button */}
            <div className="mt-4">
              <Link to={`/ayah-player/${surahNum}`}>
                <Button variant="outline" className="gap-2 border-primary/30 hover:bg-primary/10">
                  <Play className="w-4 h-4 text-primary" />
                  {t('ayahByAyah')}
                </Button>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between w-full mx-auto mt-6">
              <Button
                variant="outline"
                onClick={handlePrevSurah}
                disabled={surahNum <= 1}
              >
                {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {t('previousSurah')}
              </Button>
              <Button
                variant="outline"
                onClick={handleNextSurah}
                disabled={surahNum >= 114}
              >
                {t('nextSurah')}
                {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>

          {/* Bismillah */}
          {surahNum !== 1 && surahNum !== 9 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 mb-8 rounded-2xl border border-accent/20 bg-gradient-to-b from-[hsl(45_40%_98%)] to-[hsl(45_30%_96%)] dark:from-[hsl(30_15%_12%)] dark:to-[hsl(30_12%_10%)] dark:border-accent/15 relative overflow-hidden"
            >
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 islamic-pattern-light pointer-events-none" />
              <p className="bismillah-golden font-arabic text-3xl relative z-10">{t('bismillah')}</p>
            </motion.div>
          )}

          {/* Ayahs - one section based on language; style from viewMode */}
          {viewMode === 'flowing' ? (
            /* Flowing (Quran-style): verses next to each other */
            <motion.div
              key="flowing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-2xl border p-6 lg:p-8 ${showArabic ? 'bg-gradient-to-b from-[hsl(45_40%_98%)] to-[hsl(45_30%_96%)] dark:from-[hsl(30_15%_12%)] dark:to-[hsl(30_12%_10%)] border-accent/15' : 'bg-muted/30 border-border/50'}`}
              dir={showArabic ? 'rtl' : direction}
            >
              {showArabic ? (
                <p
                  className="uthmani-text text-foreground text-right select-text"
                  style={{ lineHeight: 2.5, fontSize: '1.75rem' }}
                >
                  {arabic.ayahs.map((ayah, index) => {
                    return (
                      <span
                        key={ayah.number}
                        id={`ayah-${ayah.numberInSurah}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => setFlowingAyahPopupIndex(index)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlowingAyahPopupIndex(index); } }}
                        className={`group/ayah relative inline cursor-pointer rounded px-0.5 -mx-0.5 hover:bg-primary/5 transition-colors ${blinkAyah === ayah.numberInSurah ? 'ayah-blink' : ''}`}
                      onAnimationEnd={blinkAyah === ayah.numberInSurah ? () => setBlinkAyah(null) : undefined}
                      >
                        {getAyahDisplayText(surahNum, ayah.numberInSurah, ayah.text)}
                        <span className="font-arabic text-primary/90 mx-1" aria-label={`${t('ayah')} ${ayah.numberInSurah}`}>
                          ﴿{ayah.numberInSurah.toLocaleString('ar-EG')}﴾
                        </span>
                      </span>
                    );
                  })}
                </p>
              ) : (
                <div className="text-muted-foreground text-base leading-relaxed select-text" style={{ lineHeight: 1.8 }}>
                  {translation.ayahs.map((translationAyah, index) => {
                    const ayah = arabic.ayahs[index];
                    const isActive = ayah && currentAyah === ayah.numberInSurah;
                    return (
                      <span
                        key={translationAyah?.number ?? index}
                        id={ayah ? `ayah-${ayah.numberInSurah}` : undefined}
                        role="button"
                        tabIndex={0}
                        onClick={() => setFlowingAyahPopupIndex(index)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlowingAyahPopupIndex(index); } }}
                        className={`inline cursor-pointer rounded px-0.5 -mx-0.5 hover:bg-primary/5 transition-colors ${ayah && blinkAyah === ayah.numberInSurah ? 'ayah-blink' : ''}`}
                        onAnimationEnd={ayah && blinkAyah === ayah.numberInSurah ? () => setBlinkAyah(null) : undefined}
                      >
                        {translationAyah?.text}
                        {ayah && (
                          <span className="text-xs text-muted-foreground/80 ms-1" aria-hidden>
                            ({ayah.numberInSurah})
                          </span>
                        )}
                        {' '}
                      </span>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            /* Cards: one card per verse (old style) */
            <div className="space-y-6">
              {showArabic
                ? arabic.ayahs.map((ayah, index) => {
                  const isActive = currentAyah === ayah.numberInSurah;
                  return (
                    <motion.div
                      key={ayah.number}
                      id={`ayah-${ayah.numberInSurah}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.02, 0.3) }}
                      className={`ayah-highlight p-6 rounded-2xl border transition-all border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 ${isActive ? 'playing active-gold' : ''} ${blinkAyah === ayah.numberInSurah ? 'ayah-blink' : ''}`}
                      onAnimationEnd={blinkAyah === ayah.numberInSurah ? () => setBlinkAyah(null) : undefined}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{ayah.numberInSurah}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <span>{t('juz')} {ayah.juz}</span>
                            <span className="mx-1">•</span>
                            <span>{t('page')} {ayah.page}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => (isBookmarked(ayah.numberInSurah) ? removeBookmark(surahNum, ayah.numberInSurah) : addBookmark(surahNum, ayah.numberInSurah))}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked(ayah.numberInSurah) ? 'fill-primary text-primary' : ''}`} />
                        </Button>
                      </div>
                      <p className="uthmani-text text-foreground text-right" dir="rtl" style={{ lineHeight: 2.5, fontSize: '1.75rem' }}>
                        {getAyahDisplayText(surahNum, ayah.numberInSurah, ayah.text)}
                        <span className="inline-block mx-2 font-arabic text-primary">﴿{ayah.numberInSurah.toLocaleString('ar-EG')}﴾</span>
                      </p>
                    </motion.div>
                  );
                })
                : translation.ayahs.map((translationAyah, index) => {
                  const ayah = arabic.ayahs[index];
                  const isActive = ayah && currentAyah === ayah.numberInSurah;
                  return (
                    <motion.div
                      key={translationAyah?.number ?? index}
                      id={ayah ? `ayah-${ayah.numberInSurah}` : undefined}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`ayah-highlight p-6 rounded-2xl border transition-all border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 ${isActive ? 'playing' : ''} ${ayah && blinkAyah === ayah.numberInSurah ? 'ayah-blink' : ''}`}
                      onAnimationEnd={ayah && blinkAyah === ayah.numberInSurah ? () => setBlinkAyah(null) : undefined}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{ayah?.numberInSurah ?? index + 1}</span>
                          </div>
                          {ayah && (
                            <div className="text-xs text-muted-foreground">
                              <span>{t('juz')} {ayah.juz}</span>
                              <span className="mx-1">•</span>
                              <span>{t('page')} {ayah.page}</span>
                            </div>
                          )}
                        </div>
                        {ayah && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => (isBookmarked(ayah.numberInSurah) ? removeBookmark(surahNum, ayah.numberInSurah) : addBookmark(surahNum, ayah.numberInSurah))}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked(ayah.numberInSurah) ? 'fill-primary text-primary' : ''}`} />
                          </Button>
                        )}
                      </div>
                      <p className="text-muted-foreground text-base leading-relaxed" dir={direction}>
                        {translationAyah?.text}
                      </p>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </div>
      </main>

      {/* Flowing view: ayah popup (card style with bookmark) */}
      <Dialog open={flowingAyahPopupIndex !== null} onOpenChange={(open) => !open && setFlowingAyahPopupIndex(null)}>
        <DialogContent className="container max-w-4xl p-0 gap-0 overflow-hidden rounded-2xl border border-border/50 max-h-[90vh] md:max-h-[85vh]" hideClose>
          {flowingAyahPopupIndex !== null && arabic.ayahs[flowingAyahPopupIndex] && (
            <div className="p-4 md:p-6 rounded-2xl border-0 bg-card overflow-y-auto max-h-[88vh] md:max-h-[83vh]">
              <div className="flex items-start justify-between mb-4" dir={direction}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{arabic.ayahs[flowingAyahPopupIndex].numberInSurah}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span>{t('juz')} {arabic.ayahs[flowingAyahPopupIndex].juz}</span>
                    <span className="mx-1">•</span>
                    <span>{t('page')} {arabic.ayahs[flowingAyahPopupIndex].page}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      const num = arabic.ayahs[flowingAyahPopupIndex].numberInSurah;
                      isBookmarked(num) ? removeBookmark(surahNum, num) : addBookmark(surahNum, num);
                    }}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked(arabic.ayahs[flowingAyahPopupIndex].numberInSurah) ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Close">
                      <X className="w-4 h-4" />
                    </Button>
                  </DialogClose>
                </div>
              </div>
              {showArabic ? (
                <p className="uthmani-text text-foreground text-right" dir="rtl" style={{ lineHeight: 2.5, fontSize: '1.75rem' }}>
                  {getAyahDisplayText(surahNum, arabic.ayahs[flowingAyahPopupIndex].numberInSurah, arabic.ayahs[flowingAyahPopupIndex].text)}
                  <span className="inline-block mx-2 font-arabic text-primary">﴿{arabic.ayahs[flowingAyahPopupIndex].numberInSurah.toLocaleString('ar-EG')}﴾</span>
                </p>
              ) : (
                <p className="text-muted-foreground text-base leading-relaxed" dir={direction}>
                  {translation.ayahs[flowingAyahPopupIndex]?.text}
                </p>
              )}

              {/* Tafsir */}
              <div className="mt-4 pt-4 border-t border-border flex flex-col min-h-0" dir={direction}>
                <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
                  <span className="text-sm font-semibold text-muted-foreground">{t('tafsir')}</span>
                  <Select
                    dir={direction}
                    value={popupTafsirSource}
                    onValueChange={setPopupTafsirSource}
                  >
                    <SelectTrigger className="w-[200px] h-8 text-md">
                      <SelectValue placeholder={t('selectTafsir')} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 bg-background">
                      {tafsirEditions.map((edition) => (
                        <SelectItem key={edition.slug} value={edition.slug}>
                          <span className={edition.language === 'arabic' ? 'font-arabic' : ''}>
                            {language === 'ar' && edition.nameAr ? edition.nameAr : edition.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="max-h-[min(50vh,320px)] overflow-y-auto overflow-x-hidden rounded-md pr-1 -mr-1">
                  {popupTafsirLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('loading')}</span>
                    </div>
                  ) : popupTafsirText ? (
                    <p
                      className={`text-xl pt-2 text-foreground/90 leading-relaxed ${tafsirEditions.find(e => e.slug === popupTafsirSource)?.language === 'arabic' ? 'font-arabic' : ''}`}
                      dir={tafsirEditions.find(e => e.slug === popupTafsirSource)?.language === 'arabic' ? 'rtl' : direction}
                    >
                      {popupTafsirText}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">
                      {t('noContentAvailable')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between w-full mt-10 mb-16">
            <Button
              variant="outline"
              onClick={handlePrevSurah}
              disabled={surahNum <= 1}
            >
              {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {t('previousSurah')}
            </Button>
            <Button
              variant="outline"
              onClick={handleNextSurah}
              disabled={surahNum >= 114}
            >
              {t('nextSurah')}
              {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

      {/* Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50 islamic-pattern-light">
        <div className="container max-w-4xl py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Reciter Select */}
            <Select
              dir={direction}
              value={selectedReciter?.id.toString()}
              onValueChange={(value) => {
                const reciter = reciters.find(r => r.id.toString() === value);
                if (reciter) setSelectedReciter(reciter);
              }}
            >
              <SelectTrigger className="w-28 md:w-48 text-xs md:text-sm">
                <SelectValue placeholder={t('selectReciter')} />
              </SelectTrigger>
              <SelectContent className="max-h-80 bg-background">
                {reciters.map((reciter) => (
                  <SelectItem key={reciter.id} value={reciter.id.toString()}>
                    <span className="font-arabic">{reciter.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Controls */}
            <div className="flex items-center gap-1 md:gap-2 flex-1 justify-center">
              <Button variant="ghost" size="icon" onClick={handlePrevSurah} aria-label={t('previousSurah')}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button variant="emerald" size="icon-lg" onClick={handlePlay} aria-label={player.isPlaying ? t('pause') : t('play')}>
                {player.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextSurah} aria-label={t('nextSurah')}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume - hidden on mobile */}
            <div className="hidden md:flex items-center gap-2 w-32">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Slider
                value={[volume * 100]}
                onValueChange={(val) => setVolume(val[0] / 100)}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} onEnded={() => setPlayer({ isPlaying: false })} />
    </div>
  );
}