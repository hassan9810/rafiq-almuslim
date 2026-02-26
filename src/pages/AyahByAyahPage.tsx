import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, ChevronLeft, ChevronRight, Loader2, BookOpen, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { fetchSurahs, fetchSurah, type Surah, type SurahData } from '@/lib/quranApi';
import {
  EVERY_AYAH_RECITERS, RECITER_CATEGORIES,
  getAyahAudioUrl, getAyahCount,
  type EveryAyahReciter,
} from '@/data/everyAyahReciters';

export default function AyahByAyahPage() {
  const { surahNumber: paramSurah } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { direction, surahs, setSurahs } = useAppStore();
  const isAr = language === 'ar';

  const [surah, setSurah] = useState(paramSurah ? parseInt(paramSurah) : 1);
  const [ayah, setAyah] = useState(1);
  const [reciter, setReciter] = useState<EveryAyahReciter>(EVERY_AYAH_RECITERS[0]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [repeatAyah, setRepeatAyah] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const totalAyahs = getAyahCount(surah);

  // Load surahs if not loaded
  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs().then(data => setSurahs(data));
    }
  }, [surahs.length, setSurahs]);

  // Load surah text data
  useEffect(() => {
    setLoadingSurah(true);
    fetchSurah(surah).then(data => {
      setSurahData(data);
      setLoadingSurah(false);
    });
  }, [surah]);

  const currentSurah = surahs.find(s => s.number === surah);

  // Filter reciters by category
  const filteredReciters = useMemo(() => {
    if (categoryFilter === 'all') return EVERY_AYAH_RECITERS;
    return EVERY_AYAH_RECITERS.filter(r => r.category === categoryFilter);
  }, [categoryFilter]);

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Reset ayah when surah changes
  useEffect(() => {
    setAyah(1);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, [surah]);

  const playAyah = useCallback(() => {
    if (!audioRef.current) return;
    const url = getAyahAudioUrl(reciter, surah, ayah);
    audioRef.current.src = url;
    setIsLoading(true);
    audioRef.current.play()
      .then(() => { setIsPlaying(true); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [reciter, surah, ayah]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playAyah();
    }
  }, [isPlaying, playAyah]);

  const handleEnded = useCallback(() => {
    if (repeatAyah) {
      playAyah();
      return;
    }
    if (autoPlay && ayah < totalAyahs) {
      setAyah(prev => prev + 1);
    } else if (autoPlay && ayah >= totalAyahs && surah < 114) {
      setSurah(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [repeatAyah, autoPlay, ayah, totalAyahs, surah, playAyah]);

  // Auto-play when ayah changes if autoPlay is on
  useEffect(() => {
    if (autoPlay && !repeatAyah) {
      playAyah();
    }
  }, [ayah]);

  const goToAyah = (n: number) => {
    if (n >= 1 && n <= totalAyahs) {
      setAyah(n);
    }
  };

  const prevAyah = () => goToAyah(ayah - 1);
  const nextAyah = () => goToAyah(ayah + 1);

  return (
    <div>
      <main>
        <div className="container max-w-4xl py-6">
          {/* Back button */}
          <div className="mb-4">
            <Link to={paramSurah ? `/quran/${paramSurah}` : '/quran'}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {isAr ? 'رجوع' : 'Back'}
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
              <BookOpen className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-arabic text-2xl md:text-3xl font-bold text-foreground mb-1">
              {isAr ? 'تشغيل آية بآية' : 'Ayah by Ayah Player'}
            </h1>
            {currentSurah && (
              <p className="text-muted-foreground font-arabic">
                {isAr ? currentSurah.name : currentSurah.englishName} - {totalAyahs} {t('verses')}
              </p>
            )}
          </div>

          {/* Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Surah Select */}
            <Select dir={direction} value={surah.toString()} onValueChange={v => setSurah(parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectSurah')} />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                {(surahs.length > 0 ? surahs : Array.from({ length: 114 }, (_, i) => ({
                  number: i + 1, name: `سورة ${i + 1}`, englishName: `Surah ${i + 1}`
                }))).map((s: any) => (
                  <SelectItem key={s.number} value={s.number.toString()}>
                    {s.number}. {isAr ? s.name : s.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Reciter Category */}
            <Select dir={direction} value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {RECITER_CATEGORIES.map(c => (
                  <SelectItem key={c.key} value={c.key}>
                    {isAr ? c.labelAr : c.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reciter Select */}
          <div className="mb-6">
            <Select dir={direction} value={reciter.id.toString()} onValueChange={v => {
              const r = EVERY_AYAH_RECITERS.find(r => r.id.toString() === v);
              if (r) setReciter(r);
            }}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectReciter')} />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                {filteredReciters.map(r => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {isAr ? r.nameAr : r.nameEn} ({r.bitrate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ayah Text Display */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6 min-h-[120px] flex items-center justify-center">
            {loadingSurah ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : surahData ? (
              <AnimatePresence mode="wait">
                <motion.p
                  key={ayah}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-arabic text-2xl md:text-3xl leading-loose text-foreground text-center"
                  dir="rtl"
                >
                  {surahData.ayahs.find(a => a.numberInSurah === ayah)?.text || ''}
                </motion.p>
              </AnimatePresence>
            ) : null}
          </div>

          {/* Ayah Number & Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={prevAyah} disabled={ayah <= 1}>
              {direction === 'rtl' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {isAr ? 'السابقة' : 'Previous'}
            </Button>

            <Badge variant="secondary" className="text-base px-4 py-1 font-arabic">
              {isAr ? `آية ${ayah} من ${totalAyahs}` : `Ayah ${ayah} of ${totalAyahs}`}
            </Badge>

            <Button variant="outline" size="sm" onClick={nextAyah} disabled={ayah >= totalAyahs}>
              {isAr ? 'التالية' : 'Next'}
              {direction === 'rtl' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {/* Audio Player */}
          <audio
            ref={audioRef}
            onEnded={handleEnded}
            onCanPlay={() => setIsLoading(false)}
            onWaiting={() => setIsLoading(true)}
          />

          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Button variant="ghost" size="icon" onClick={prevAyah} disabled={ayah <= 1}>
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                variant="default"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handlePlayPause}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={nextAyah} disabled={ayah >= totalAyahs}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant={autoPlay ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAutoPlay(!autoPlay)}
              >
                {isAr ? 'تشغيل تلقائي' : 'Auto-play'}
              </Button>

              <Button
                variant={repeatAyah ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRepeatAyah(!repeatAyah)}
                className="gap-1"
              >
                <Repeat className="w-3.5 h-3.5" />
                {isAr ? 'تكرار الآية' : 'Repeat Ayah'}
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={([v]) => { setVolume(v / 100); if (v > 0) setIsMuted(false); }}
                  className="w-20"
                />
              </div>
            </div>
          </div>

          {/* Quick Ayah Jump */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-center gap-3">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                {isAr ? 'انتقل إلى آية:' : 'Jump to Ayah:'}
              </label>
              <input
                type="number"
                min={1}
                max={totalAyahs}
                value={ayah}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= totalAyahs) {
                    setAyah(v);
                    setAyah(v);
                  }
                }}
                className="w-20 h-9 rounded-lg border border-input bg-background px-3 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-xs text-muted-foreground">/ {totalAyahs}</span>
            </div>
            <Slider
              value={[ayah]}
              min={1}
              max={totalAyahs}
              step={1}
              onValueChange={([v]) => { setAyah(v); }}
              className="w-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
