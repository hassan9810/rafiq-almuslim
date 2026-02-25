import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Eye, EyeOff, Loader2, BookOpen, ArrowLeft, RotateCcw
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

type HideLevel = 0 | 1 | 2 | 3; // 0=show all, 1=hide last word, 2=hide half, 3=hide all

export default function MemorizationPage() {
  const { t, language } = useTranslation();
  const { direction, surahs, setSurahs } = useAppStore();
  const isAr = language === 'ar';

  const [surah, setSurahNum] = useState(1);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(7);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [hideLevel, setHideLevel] = useState<HideLevel>(0);
  const [repeatCount, setRepeatCount] = useState(3);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reciter, setReciter] = useState<EveryAyahReciter>(EVERY_AYAH_RECITERS[0]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const totalAyahs = getAyahCount(surah);

  // Load surahs list
  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs().then(data => setSurahs(data));
    }
  }, [surahs.length, setSurahs]);

  // Load surah text
  useEffect(() => {
    setLoadingSurah(true);
    fetchSurah(surah).then(data => {
      setSurahData(data);
      setLoadingSurah(false);
      setStartAyah(1);
      setEndAyah(Math.min(7, getAyahCount(surah)));
      setCurrentAyah(1);
      setHideLevel(0);
      setCurrentRepeat(0);
    });
  }, [surah]);

  const currentSurah = surahs.find(s => s.number === surah);

  const filteredReciters = useMemo(() => {
    if (categoryFilter === 'all') return EVERY_AYAH_RECITERS;
    return EVERY_AYAH_RECITERS.filter(r => r.category === categoryFilter);
  }, [categoryFilter]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const rangeAyahs = useMemo(() => {
    if (!surahData) return [];
    return surahData.ayahs.filter(a => a.numberInSurah >= startAyah && a.numberInSurah <= endAyah);
  }, [surahData, startAyah, endAyah]);

  const currentAyahData = surahData?.ayahs.find(a => a.numberInSurah === currentAyah);

  // Hide text based on level
  const getDisplayText = (text: string, level: HideLevel): string => {
    if (level === 0) return text;
    if (level === 3) return '• • • • • • •';
    const words = text.split(' ');
    if (level === 1) {
      const hideCount = Math.max(1, Math.floor(words.length * 0.3));
      return words.slice(0, words.length - hideCount).join(' ') + ' ' + Array(hideCount).fill('___').join(' ');
    }
    // level 2 - hide half
    const hideCount = Math.ceil(words.length / 2);
    return words.slice(0, words.length - hideCount).join(' ') + ' ' + Array(hideCount).fill('___').join(' ');
  };

  const playCurrentAyah = useCallback(() => {
    if (!audioRef.current) return;
    const url = getAyahAudioUrl(reciter, surah, currentAyah);
    audioRef.current.src = url;
    setIsLoading(true);
    audioRef.current.play()
      .then(() => { setIsPlaying(true); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, [reciter, surah, currentAyah]);

  const handlePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      playCurrentAyah();
    }
  }, [isPlaying, playCurrentAyah]);

  const handleEnded = useCallback(() => {
    const nextRepeat = currentRepeat + 1;
    if (nextRepeat < repeatCount) {
      // Repeat same ayah
      setCurrentRepeat(nextRepeat);
      playCurrentAyah();
    } else if (autoAdvance && currentAyah < endAyah) {
      // Move to next ayah
      setCurrentRepeat(0);
      setCurrentAyah(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentRepeat(0);
    }
  }, [currentRepeat, repeatCount, autoAdvance, currentAyah, endAyah, playCurrentAyah]);

  // Auto-play when currentAyah changes (if auto-advance)
  useEffect(() => {
    if (autoAdvance && isPlaying) {
      playCurrentAyah();
    }
  }, [currentAyah]);

  const cycleHideLevel = () => {
    setHideLevel(prev => ((prev + 1) % 4) as HideLevel);
  };

  const resetSession = () => {
    setCurrentAyah(startAyah);
    setHideLevel(0);
    setCurrentRepeat(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  const hideLevelLabels = isAr
    ? ['إظهار الكل', 'إخفاء جزئي', 'إخفاء النصف', 'إخفاء الكل']
    : ['Show All', 'Hide Partial', 'Hide Half', 'Hide All'];

  return (
    <div>
      <main>
        <div className="container max-w-4xl py-6">
          {/* Back */}
          <div className="mb-4">
            <Link to="/quran">
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
              {isAr ? 'وضع الحفظ' : 'Memorization Mode'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isAr ? 'حفظ القرآن بتكرار الآيات وإخفاء تدريجي للنص' : 'Memorize Quran with verse repetition and gradual text hiding'}
            </p>
          </div>

          {/* Surah + Reciter Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Select dir={direction} value={surah.toString()} onValueChange={v => setSurahNum(parseInt(v))}>
              <SelectTrigger><SelectValue placeholder={t('selectSurah')} /></SelectTrigger>
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

            <Select dir={direction} value={reciter.id.toString()} onValueChange={v => {
              const r = EVERY_AYAH_RECITERS.find(r => r.id.toString() === v);
              if (r) setReciter(r);
            }}>
              <SelectTrigger><SelectValue placeholder={t('selectReciter')} /></SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                {filteredReciters.map(r => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {isAr ? r.nameAr : r.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Range Selection */}
          <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {isAr ? 'نطاق الحفظ' : 'Memorization Range'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{isAr ? 'من آية' : 'From Ayah'}</label>
                <div className="flex gap-2">
                  <Select dir={direction} value={startAyah.toString()} onValueChange={v => {
                    const val = parseInt(v);
                    setStartAyah(val);
                    if (val > endAyah) setEndAyah(val);
                    setCurrentAyah(val);
                  }}>
                    <SelectTrigger className="flex-1 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                      {Array.from({ length: totalAyahs }, (_, i) => i + 1).map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="number" min={1} max={totalAyahs}
                    value={startAyah}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= totalAyahs) {
                        setStartAyah(val);
                        if (val > endAyah) setEndAyah(val);
                        setCurrentAyah(val);
                      }
                    }}
                    className="w-16 h-9 rounded-lg border border-input bg-background px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{isAr ? 'إلى آية' : 'To Ayah'}</label>
                <div className="flex gap-2">
                  <Select dir={direction} value={endAyah.toString()} onValueChange={v => {
                    const val = parseInt(v);
                    if (val >= startAyah) setEndAyah(val);
                  }}>
                    <SelectTrigger className="flex-1 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                      {Array.from({ length: totalAyahs - startAyah + 1 }, (_, i) => startAyah + i).map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="number" min={startAyah} max={totalAyahs}
                    value={endAyah}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      if (val >= startAyah && val <= totalAyahs) setEndAyah(val);
                    }}
                    className="w-16 h-9 rounded-lg border border-input bg-background px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <label className="text-xs text-muted-foreground whitespace-nowrap">
                {isAr ? 'عدد التكرار:' : 'Repeat count:'}
              </label>
              <Select value={repeatCount.toString()} onValueChange={v => setRepeatCount(parseInt(v))}>
                <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {[1, 2, 3, 5, 7, 10, 15, 20].map(n => (
                    <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ayah Display */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 mb-4 min-h-[120px]">
            {loadingSurah ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : currentAyahData ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentAyah}-${hideLevel}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <Badge variant="secondary" className="mb-4">
                    {isAr ? `آية ${currentAyah}` : `Ayah ${currentAyah}`}
                    {' • '}
                    {isAr ? `تكرار ${currentRepeat + 1}/${repeatCount}` : `Rep ${currentRepeat + 1}/${repeatCount}`}
                  </Badge>
                  <p className="font-arabic text-2xl md:text-3xl leading-loose text-foreground" dir="rtl">
                    {getDisplayText(currentAyahData.text, hideLevel)}
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="text-center text-muted-foreground">
                {isAr ? 'جاري التحميل...' : 'Loading...'}
              </p>
            )}
          </div>

          {/* Hide Level Control */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={cycleHideLevel} className="gap-2">
              {hideLevel === 3 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {hideLevelLabels[hideLevel]}
            </Button>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(level => (
                <button
                  key={level}
                  onClick={() => setHideLevel(level as HideLevel)}
                  className={`w-3 h-3 rounded-full transition-colors ${hideLevel === level ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Audio Player */}
          <audio ref={audioRef} onEnded={handleEnded} onCanPlay={() => setIsLoading(false)} onWaiting={() => setIsLoading(true)} />

          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Button variant="ghost" size="icon" onClick={() => { if (currentAyah > startAyah) { setCurrentAyah(currentAyah - 1); setCurrentRepeat(0); } }} disabled={currentAyah <= startAyah}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={handlePlayPause}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { if (currentAyah < endAyah) { setCurrentAyah(currentAyah + 1); setCurrentRepeat(0); } }} disabled={currentAyah >= endAyah}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant={autoAdvance ? 'default' : 'outline'} size="sm" onClick={() => setAutoAdvance(!autoAdvance)}>
                {isAr ? 'تقدم تلقائي' : 'Auto-advance'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetSession} className="gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'إعادة' : 'Reset'}
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Slider value={[isMuted ? 0 : volume * 100]} max={100} step={1}
                  onValueChange={([v]) => { setVolume(v / 100); if (v > 0) setIsMuted(false); }}
                  className="w-20" />
              </div>
            </div>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{isAr ? 'التقدم' : 'Progress'}</span>
                <span>{currentAyah - startAyah + 1} / {endAyah - startAyah + 1}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((currentAyah - startAyah + 1) / (endAyah - startAyah + 1)) * 100}%` }}
                />
              </div>
              {/* Jump to ayah */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {isAr ? 'أكمل من آية:' : 'Continue from:'}
                </span>
                <Select dir={direction} value={currentAyah.toString()} onValueChange={v => {
                  const val = parseInt(v);
                  setCurrentAyah(val);
                  setCurrentRepeat(0);
                }}>
                  <SelectTrigger className="w-24 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                    {Array.from({ length: endAyah - startAyah + 1 }, (_, i) => startAyah + i).map(n => (
                      <SelectItem key={n} value={n.toString()}>
                        {isAr ? `آية ${n}` : `Ayah ${n}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="number" min={startAyah} max={endAyah}
                  value={currentAyah}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    if (val >= startAyah && val <= endAyah) {
                      setCurrentAyah(val);
                      setCurrentRepeat(0);
                    }
                  }}
                  className="w-16 h-8 rounded-lg border border-input bg-background px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
