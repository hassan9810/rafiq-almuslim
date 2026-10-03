import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Pause,
  Play,
  Search,
  X,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic2,
  ChevronDown,
  Music,
  ListMusic,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/PageHeader';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/useTranslation';

/* ── Types ────────────────────────────────────────────────── */

interface TilawahTrack {
  title: string;
  url: string;
  date: string | null;
  surahs: string[];
}

interface TilawahReciter {
  author_id: number;
  author_name: string;
  author_slug: string;
  murattal: Record<string, TilawahTrack[]> | TilawahTrack[];
  mujawwad: Record<string, TilawahTrack[]> | TilawahTrack[];
  nawader: TilawahTrack[];
  purified: TilawahTrack[];
  other: TilawahTrack[];
}

type CategoryKey = 'all' | 'nawader' | 'purified' | 'murattal' | 'mujawwad' | 'other';

const CATEGORIES: { key: CategoryKey; labelAr: string; labelEn: string }[] = [
  { key: 'all', labelAr: 'الكل', labelEn: 'All' },
  { key: 'nawader', labelAr: 'نوادر', labelEn: 'Rare Recitations' },
  { key: 'purified', labelAr: 'منقحة', labelEn: 'Purified' },
  { key: 'murattal', labelAr: 'مرتل', labelEn: 'Murattal' },
  { key: 'mujawwad', labelAr: 'مجود', labelEn: 'Mujawwad' },
  { key: 'other', labelAr: 'أخرى', labelEn: 'Other' },
];

/* ── Helpers ───────────────────────────────────────────────── */

function normalizeArabic(value: string): string {
  return value
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/\u0640/g, '');
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

/**
 * Extract tracks from a category value.
 * murattal / mujawwad can be either an array or a nested object { "surah": [...tracks] }.
 */
function extractTracks(value: Record<string, TilawahTrack[]> | TilawahTrack[] | undefined): TilawahTrack[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && value !== null) {
    return Object.values(value).flat();
  }
  return [];
}

function getReciterTrackCount(reciter: TilawahReciter): number {
  return (
    extractTracks(reciter.nawader).length +
    extractTracks(reciter.purified).length +
    extractTracks(reciter.murattal).length +
    extractTracks(reciter.mujawwad).length +
    extractTracks(reciter.other).length
  );
}

function getReciterCategoryTracks(reciter: TilawahReciter, category: CategoryKey): TilawahTrack[] {
  if (category === 'all') {
    return [
      ...extractTracks(reciter.murattal),
      ...extractTracks(reciter.mujawwad),
      ...extractTracks(reciter.nawader),
      ...extractTracks(reciter.purified),
      ...extractTracks(reciter.other)
    ];
  }
  switch (category) {
    case 'nawader': return extractTracks(reciter.nawader);
    case 'purified': return extractTracks(reciter.purified);
    case 'murattal': return extractTracks(reciter.murattal);
    case 'mujawwad': return extractTracks(reciter.mujawwad);
    case 'other': return extractTracks(reciter.other);
    default: return [];
  }
}

function getAvailableCategories(reciter: TilawahReciter): CategoryKey[] {
  const available = CATEGORIES
    .filter((c) => c.key !== 'all')
    .map((c) => c.key)
    .filter((key) => getReciterCategoryTracks(reciter, key).length > 0);

  if (available.length > 1) {
    return ['all', ...available];
  }
  return available;
}

/* ── Lazy loading helper ──────────────────────────────────── */

const TRACKS_PER_PAGE = 50;

/* ── Main Component ───────────────────────────────────────── */

export default function TilawahPage() {
  const { t, language } = useTranslation();
  const isAr = language === 'ar';

  // Data
  const [allReciters, setAllReciters] = useState<TilawahReciter[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Selection state
  const [selectedReciterId, setSelectedReciterId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('nawader');
  const [reciterQuery, setReciterQuery] = useState('');
  const [trackQuery, setTrackQuery] = useState('');
  const [trackPage, setTrackPage] = useState(1);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load JSON data lazily
  useEffect(() => {
    setIsLoadingData(true);
    fetch('/data/tilawah.json')
      .then((res) => res.json())
      .then((data: TilawahReciter[]) => {
        // Sort by name
        const sorted = [...data].sort((a, b) =>
          a.author_name.localeCompare(b.author_name, 'ar', { sensitivity: 'base' })
        );
        setAllReciters(sorted);
        if (sorted.length > 0 && !selectedReciterId) {
          setSelectedReciterId(sorted[0].author_id);
        }
      })
      .catch((err) => {
        console.error('Failed to load Tilawah data:', err);
      })
      .finally(() => setIsLoadingData(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Derived data ─────────────────────────────────────── */

  const filteredReciters = useMemo(() => {
    const query = reciterQuery.trim().toLowerCase();
    if (!query) return allReciters;
    const normalizedQuery = normalizeArabic(query);
    return allReciters.filter((r) => {
      const name = r.author_name;
      return (
        normalizeArabic(name).toLowerCase().includes(normalizedQuery) ||
        name.toLowerCase().includes(query)
      );
    });
  }, [allReciters, reciterQuery]);



  const selectedReciter = useMemo(
    () => allReciters.find((r) => r.author_id === selectedReciterId) || null,
    [allReciters, selectedReciterId]
  );

  const availableCategories = useMemo(
    () => (selectedReciter ? getAvailableCategories(selectedReciter) : []),
    [selectedReciter]
  );

  // When reciter changes, auto-select first available category
  useEffect(() => {
    if (availableCategories.length > 0 && !availableCategories.includes(activeCategory)) {
      setActiveCategory(availableCategories[0]);
    }
  }, [availableCategories, activeCategory]);

  const allTracksForCategory = useMemo(
    () => (selectedReciter ? getReciterCategoryTracks(selectedReciter, activeCategory) : []),
    [selectedReciter, activeCategory]
  );

  const filteredTracks = useMemo(() => {
    const query = trackQuery.trim().toLowerCase();
    if (!query) return allTracksForCategory;
    const normalizedQuery = normalizeArabic(query);
    return allTracksForCategory.filter((track) => {
      const text = track.title + ' ' + track.surahs.join(' ') + (track.date || '');
      return (
        normalizeArabic(text).toLowerCase().includes(normalizedQuery) ||
        text.toLowerCase().includes(query)
      );
    });
  }, [allTracksForCategory, trackQuery]);

  // Paginated tracks
  const visibleTracks = useMemo(
    () => {
      const limit = activeCategory === 'all' ? 200 : TRACKS_PER_PAGE;
      return filteredTracks.slice(0, trackPage * limit);
    },
    [filteredTracks, trackPage, activeCategory]
  );
  const hasMoreTracks = visibleTracks.length < filteredTracks.length;
  // Reset track search and page when switching reciter or category
  useEffect(() => {
    setTrackPage(1);
    setTrackQuery('');
  }, [selectedReciterId, activeCategory]);



  /* ── Audio controls ───────────────────────────────────── */

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const playTrack = useCallback(
    (track: TilawahTrack) => {
      if (!audioRef.current) return;

      if (currentTrackUrl === track.url) {
        // Toggle play/pause
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        }
        return;
      }

      // New track
      audioRef.current.pause();
      audioRef.current.src = track.url;
      setCurrentTrackUrl(track.url);
      setCurrentTime(0);
      setDuration(0);
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    },
    [currentTrackUrl, isPlaying]
  );

  const currentTrack = useMemo(
    () => filteredTracks.find((t) => t.url === currentTrackUrl) || null,
    [filteredTracks, currentTrackUrl]
  );

  const handlePrevTrack = useCallback(() => {
    if (!currentTrackUrl) return;
    const idx = filteredTracks.findIndex((t) => t.url === currentTrackUrl);
    if (idx > 0) playTrack(filteredTracks[idx - 1]);
  }, [currentTrackUrl, filteredTracks, playTrack]);

  const handleNextTrack = useCallback(() => {
    if (!currentTrackUrl) return;
    const idx = filteredTracks.findIndex((t) => t.url === currentTrackUrl);
    if (idx >= 0 && idx < filteredTracks.length - 1) playTrack(filteredTracks[idx + 1]);
  }, [currentTrackUrl, filteredTracks, playTrack]);

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || !duration) return;
    const nextTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrackUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  /* ── Render ───────────────────────────────────────────── */

  const tilawahTitle = isAr ? 'التلاوات' : 'Tilawah';
  const tilawahSubtitle = isAr
    ? 'استمع إلى التلاوات من كبار القراء'
    : 'Listen to the finest recitations from top reciters';
  const searchReciterPlaceholder = isAr ? 'ابحث عن قارئ...' : 'Search reciters...';
  const searchTrackPlaceholder = isAr ? 'ابحث عن تلاوة...' : 'Search recitations...';
  const noRecitersText = isAr ? 'لا يوجد قراء مطابقون' : 'No matching reciters';
  const noTracksText = isAr ? 'لا توجد تلاوات في هذا التصنيف' : 'No recitations in this category';
  const loadMoreText = isAr ? 'عرض المزيد' : 'Show more';
  const totalRecitersText = isAr
    ? `مجموع القراء: ${new Intl.NumberFormat('ar-EG').format(filteredReciters.length)}`
    : `Total reciters: ${filteredReciters.length}`;
  const totalTracksText = isAr
    ? `عدد التلاوات: ${new Intl.NumberFormat('ar-EG').format(filteredTracks.length)}`
    : `Total recitations: ${filteredTracks.length}`;
  const recitationsLabel = isAr ? 'تلاوة' : 'recitations';

  if (isLoadingData) {
    return (
      <div>
        <main>
          <div className="container max-w-6xl pb-28">
            <PageHeader icon={Mic2} title={tilawahTitle} subtitle={tilawahSubtitle} />
            <div className="flex justify-center mb-6">
              <Link to="/quran" className="btn-islamic inline-flex items-center justify-center gap-3 rounded-xl text-base font-semibold transition-all h-auto px-6 py-3 border border-primary/30 hover:bg-primary/10 hover:border-accent/50 bg-background text-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                {isAr ? 'القرآن الكريم' : 'Holy Quran'}
              </Link>
            </div>
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full"
              />
              <span className="ms-3 text-muted-foreground font-arabic">
                {isAr ? 'جاري تحميل التلاوات...' : 'Loading recitations...'}
              </span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main>
        <div className="container max-w-6xl pb-28">
          <PageHeader icon={Mic2} title={tilawahTitle} subtitle={tilawahSubtitle} />
          <div className="flex justify-center mb-6">
            <Link to="/quran" className="btn-islamic inline-flex items-center justify-center gap-3 rounded-xl text-base font-semibold transition-all h-auto px-6 py-3 border border-primary/30 hover:bg-primary/10 hover:border-accent/50 bg-background text-foreground">
              <BookOpen className="w-5 h-5 text-primary" />
              {isAr ? 'القرآن الكريم' : 'Holy Quran'}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* ── Left: Reciters list ────────────────── */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  {isAr ? 'القراء' : 'Reciters'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={reciterQuery}
                    onChange={(e) => setReciterQuery(e.target.value)}
                    placeholder={searchReciterPlaceholder}
                    className="ps-9 pe-9 rounded-xl"
                  />
                  {reciterQuery && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute end-1 top-1/2 -translate-y-1/2"
                      onClick={() => setReciterQuery('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {filteredReciters.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">{noRecitersText}</p>
                )}

                {/* Reciters scrollable list */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {filteredReciters.map((reciter, index) => {
                    const isActive = reciter.author_id === selectedReciterId;
                    const trackCount = getReciterTrackCount(reciter);
                    return (
                      <motion.button
                        key={reciter.author_id}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.01, 0.2) }}
                        className={`w-full text-start p-3 rounded-2xl border transition-all ${isActive
                          ? 'bg-primary/5 border-primary/30 active-gold'
                          : 'bg-card border-border/50 hover:border-primary/20 gold-hover'
                          }`}
                        onClick={() => setSelectedReciterId(reciter.author_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">{reciter.author_name}</div>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                            {isAr
                              ? `${new Intl.NumberFormat('ar-EG').format(trackCount)} ${recitationsLabel}`
                              : `${trackCount} ${recitationsLabel}`}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>



                <div className="pt-3 text-center text-sm font-medium text-muted-foreground border-t border-border/50 mt-2">
                  {totalRecitersText}
                </div>
              </CardContent>
            </Card>

            {/* ── Right: Category tabs + Tracks ──────── */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-primary" />
                  {selectedReciter?.author_name || (isAr ? 'اختر قارئًا' : 'Select a reciter')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Category tabs */}
                {selectedReciter && availableCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 pb-1">
                    {availableCategories.map((catKey) => {
                      const catInfo = CATEGORIES.find((c) => c.key === catKey)!;
                      const isActiveCat = activeCategory === catKey;
                      const count = getReciterCategoryTracks(selectedReciter, catKey).length;
                      return (
                        <button
                          key={catKey}
                          onClick={() => setActiveCategory(catKey)}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${isActiveCat
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                            }`}
                        >
                          {isAr ? catInfo.labelAr : catInfo.labelEn}
                          <span className="ms-1 opacity-70">({isAr ? new Intl.NumberFormat('ar-EG').format(count) : count})</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Track search */}
                {allTracksForCategory.length > 5 && (
                  <div className="relative">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={trackQuery}
                      onChange={(e) => setTrackQuery(e.target.value)}
                      placeholder={searchTrackPlaceholder}
                      className="ps-9 pe-9 rounded-xl"
                    />
                    {trackQuery && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="absolute end-1 top-1/2 -translate-y-1/2"
                        onClick={() => setTrackQuery('')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}

                {filteredTracks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">{noTracksText}</p>
                )}

                {/* Track list */}
                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {visibleTracks.map((track, index) => {
                    const isActive = currentTrackUrl === track.url;
                    return (
                      <motion.button
                        key={`${track.url}-${index}`}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.008, 0.15) }}
                        className={`w-full text-start p-3 rounded-2xl border transition-all ${isActive
                          ? 'bg-primary/5 border-primary/30 active-gold'
                          : 'bg-card border-border/50 hover:border-primary/20 gold-hover'
                          }`}
                        onClick={() => playTrack(track)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isActive && isPlaying
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted/60 text-muted-foreground'
                              }`}
                          >
                            {isActive && isPlaying ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{track.title.trim()}</div>
                            {track.surahs.length > 0 && (
                              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                {track.surahs.join(' • ')}
                              </div>
                            )}
                          </div>
                          {track.date && (
                            <span className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded-md flex-shrink-0">
                              {track.date}
                            </span>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {hasMoreTracks && (
                  <div className="pt-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTrackPage((p) => p + 1)}
                      className="gap-1.5"
                    >
                      <ChevronDown className="w-4 h-4" />
                      {loadMoreText}
                    </Button>
                  </div>
                )}



                {selectedReciter && filteredTracks.length > 0 && (
                  <div className="pt-3 text-center text-sm font-medium text-muted-foreground border-t border-border/50 mt-2">
                    {totalTracksText}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Fixed bottom audio player ────────────── */}
          <div className="fixed inset-x-0 bottom-4 z-40">
            <div className="container max-w-4xl">
              <Card className="border-border/50 shadow-xl">
                <CardContent className="py-4 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">
                        {selectedReciter?.author_name || (isAr ? 'اختر قارئًا' : 'Select a reciter')}
                      </div>
                      <div className="text-base font-semibold truncate">
                        {currentTrack?.title.trim() || (isAr ? 'اختر تلاوة للتشغيل' : 'Select a recitation')}
                      </div>
                      {currentTrack?.surahs && currentTrack.surahs.length > 0 && (
                        <div className="text-xs text-muted-foreground truncate">
                          {currentTrack.surahs.join(' • ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={handlePrevTrack} disabled={!currentTrackUrl}>
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handlePlayPause}
                        disabled={!currentTrackUrl}
                        className="gap-2 rounded-xl"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? t('pause') : t('play')}
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleNextTrack} disabled={!currentTrackUrl}>
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-xs text-muted-foreground min-w-[42px] text-start">
                        {formatTime(currentTime)}
                      </span>
                      <Slider
                        value={[duration ? (currentTime / duration) * 100 : 0]}
                        onValueChange={handleSeek}
                        max={100}
                        step={0.1}
                        className="w-full"
                      />
                      <span className="text-xs text-muted-foreground min-w-[42px] text-end">
                        {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMuted((prev) => !prev)}
                        disabled={!currentTrackUrl}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={(value) => {
                          const next = value[0] / 100;
                          setVolume(next);
                          if (next > 0 && isMuted) setIsMuted(false);
                        }}
                        max={100}
                        step={1}
                        className="w-28"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <audio
            ref={audioRef}
            onEnded={() => {
              setIsPlaying(false);
              // Auto-play next track
              handleNextTrack();
            }}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          />
        </div>
      </main>
    </div>
  );
}
