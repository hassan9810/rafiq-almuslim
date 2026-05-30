import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, Search, Users, X, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/PageHeader';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { fetchReciters, fetchSurahs, getAudioUrl, type Reciter, type Surah } from '@/lib/quranApi';

function buildFallbackSurahs(language: 'ar' | 'en'): Surah[] {
  return Array.from({ length: 114 }, (_, i) => ({
    number: i + 1,
    name: language === 'ar' ? `سورة ${i + 1}` : `Surah ${i + 1}`,
    englishName: `Surah ${i + 1}`,
    englishNameTranslation: '',
    numberOfAyahs: 0,
    revelationType: '',
  }));
}

function parseSurahList(list?: string): Set<number> | null {
  if (!list) return null;
  const parsed = list
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((num) => !Number.isNaN(num) && num > 0);
  return parsed.length ? new Set(parsed) : null;
}

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

function buildMoshafAudioUrl(server: string, surahNumber: number): string {
  if (!server) return '';
  const paddedSurah = surahNumber.toString().padStart(3, '0');
  return `${server}${paddedSurah}.mp3`;
}

function orderMoshafList(moshafList: Reciter['moshaf'] = []): Reciter['moshaf'] {
  const priority = ['المرتل', 'المجود', 'المعلم'];
  return [...moshafList].sort((a, b) => {
    const aIndex = priority.findIndex((label) => a.name.includes(label));
    const bIndex = priority.findIndex((label) => b.name.includes(label));
    const normalizedA = aIndex === -1 ? priority.length : aIndex;
    const normalizedB = bIndex === -1 ? priority.length : bIndex;
    if (normalizedA !== normalizedB) return normalizedA - normalizedB;
    return a.name.localeCompare(b.name, 'ar', { sensitivity: 'base' });
  });
}

export default function RecitersPage() {
  const { t, language } = useTranslation();
  const { surahs, setSurahs, player, setPlayer } = useAppStore();
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciterId, setSelectedReciterId] = useState<number | null>(player.currentReciter?.id ?? null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(player.currentSurah ?? 1);
  const [selectedMoshafId, setSelectedMoshafId] = useState<number | null>(player.currentReciter?.moshaf?.[0]?.id ?? null);
  const [reciterQuery, setReciterQuery] = useState('');
  const [surahQuery, setSurahQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs().then((data) => {
        if (data.length > 0) setSurahs(data);
      });
    }
  }, [surahs.length, setSurahs]);

  useEffect(() => {
    setIsLoading(true);
    fetchReciters(language)
      .then((data) => {
        const sorted = [...data].sort((a, b) =>
          a.name.localeCompare(b.name, language === 'ar' ? 'ar' : 'en', { sensitivity: 'base' })
        );
        setReciters(sorted);
        const preferredId = player.currentReciter?.id;
        const fallbackId = sorted[0]?.id ?? null;
        setSelectedReciterId((current) => {
          if (current && sorted.some((r) => r.id === current)) return current;
          if (preferredId && sorted.some((r) => r.id === preferredId)) return preferredId;
          return fallbackId;
        });
      })
      .finally(() => setIsLoading(false));
  }, [language, player.currentReciter?.id]);

  const selectedReciter = useMemo(
    () => reciters.find((r) => r.id === selectedReciterId) || null,
    [reciters, selectedReciterId]
  );

  const selectedMoshaf = useMemo(() => {
    if (!selectedReciter?.moshaf?.length) return null;
    const preferred = selectedReciter.moshaf.find((m) => m.id === selectedMoshafId);
    return preferred || selectedReciter.moshaf[0] || null;
  }, [selectedReciter, selectedMoshafId]);
  const reciterSurahSet = useMemo(() => parseSurahList(selectedMoshaf?.surah_list), [selectedMoshaf?.surah_list]);

  const availableSurahs = useMemo(() => {
    const base = surahs.length > 0 ? surahs : buildFallbackSurahs(language);
    if (!reciterSurahSet) return base;
    return base.filter((s) => reciterSurahSet.has(s.number));
  }, [surahs, language, reciterSurahSet]);

  const reciterOptions = useMemo(() => {
    return reciters.flatMap((reciter) => {
      const isMinshawi = reciter.name.includes('المنشاوي');
      if (!isMinshawi) {
        return [{
          key: `${reciter.id}`,
          reciter,
          moshaf: reciter.moshaf?.[0] ?? null,
          label: reciter.name,
        }];
      }

      const orderedMoshaf = orderMoshafList(reciter.moshaf || []);
      return orderedMoshaf.map((moshaf) => ({
        key: `${reciter.id}-${moshaf.id}`,
        reciter,
        moshaf,
        label: `${reciter.name} - ${moshaf.name}`,
      }));
    });
  }, [reciters]);

  const filteredReciters = useMemo(() => {
    const query = reciterQuery.trim().toLowerCase();
    if (!query) return reciterOptions;
    return reciterOptions.filter((option) => option.label.toLowerCase().includes(query));
  }, [reciterOptions, reciterQuery]);

  const filteredSurahs = useMemo(() => {
    const query = surahQuery.trim().toLowerCase();
    if (!query) return availableSurahs;
    const normalizedQuery = normalizeArabic(query);
    return availableSurahs.filter((surah) => {
      const matchesNumber = surah.number.toString().includes(query);
      const surahName = surah.name || '';
      const matchesAr = surahName.includes(query) || normalizeArabic(surahName).includes(normalizedQuery);
      const matchesEn = surah.englishName?.toLowerCase().includes(query);
      return matchesNumber || matchesAr || matchesEn;
    });
  }, [availableSurahs, surahQuery]);

  const selectedSurahData = useMemo(
    () => availableSurahs.find((surah) => surah.number === selectedSurah) || null,
    [availableSurahs, selectedSurah]
  );

  useEffect(() => {
    if (!selectedReciter?.moshaf?.length) {
      setSelectedMoshafId(null);
      return;
    }
    if (selectedMoshafId && selectedReciter.moshaf.some((m) => m.id === selectedMoshafId)) return;
    const ordered = orderMoshafList(selectedReciter.moshaf);
    setSelectedMoshafId(ordered[0].id);
  }, [selectedReciter, selectedMoshafId]);

  useEffect(() => {
    if (!selectedSurah || !availableSurahs.find((s) => s.number === selectedSurah)) {
      setSelectedSurah(availableSurahs[0]?.number ?? null);
    }
  }, [availableSurahs, selectedSurah]);

  useEffect(() => {
    if (!selectedSurah) return;
    if (player.currentSurah !== selectedSurah) {
      setPlayer({ currentSurah: selectedSurah });
    }
  }, [player.currentSurah, selectedSurah, setPlayer]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = '';
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [selectedReciterId, selectedSurah, selectedMoshafId]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handlePrevSurah = () => {
    if (!selectedSurahData) return;
    const index = availableSurahs.findIndex((surah) => surah.number === selectedSurahData.number);
    if (index > 0) setSelectedSurah(availableSurahs[index - 1].number);
  };

  const handleNextSurah = () => {
    if (!selectedSurahData) return;
    const index = availableSurahs.findIndex((surah) => surah.number === selectedSurahData.number);
    if (index >= 0 && index < availableSurahs.length - 1) setSelectedSurah(availableSurahs[index + 1].number);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || !duration) return;
    const nextTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !selectedReciter || !selectedSurah) return;
    const audioUrl = selectedMoshaf
      ? buildMoshafAudioUrl(selectedMoshaf.server, selectedSurah)
      : getAudioUrl(selectedReciter, selectedSurah);
    if (!audioUrl) return;

    if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setPlayer({ currentReciter: selectedReciter, currentSurah: selectedSurah });
        })
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div>
      <main>
        <div className="container max-w-6xl pb-28">
          <PageHeader
            icon={Users}
            title={t('recitersPageTitle')}
            subtitle={t('recitersPageSubtitle')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{t('recitersPageTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={reciterQuery}
                    onChange={(e) => setReciterQuery(e.target.value)}
                    placeholder={t('searchRecitersPlaceholder')}
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
                  <p className="text-sm text-muted-foreground text-center py-8">{t('noRecitersFound')}</p>
                )}

                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {filteredReciters.map((option, index) => {
                    const isActive = option.reciter.id === selectedReciterId
                      && (!option.moshaf || option.moshaf.id === selectedMoshaf?.id);
                    return (
                      <motion.button
                        key={option.key}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.01, 0.2) }}
                        className={`w-full text-start p-3 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-primary/5 border-primary/30 active-gold'
                            : 'bg-card border-border/50 hover:border-primary/20 gold-hover'
                        }`}
                        onClick={() => {
                          setSelectedReciterId(option.reciter.id);
                          setSelectedMoshafId(option.moshaf?.id ?? option.reciter.moshaf?.[0]?.id ?? null);
                          setPlayer({ currentReciter: option.reciter });
                        }}
                      >
                        <div className="text-sm font-semibold">{option.label}</div>
                        {option.moshaf?.name && (
                          <div className="text-xs text-muted-foreground">{option.moshaf.name}</div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {selectedReciter?.moshaf && selectedReciter.moshaf.length > 1 && !selectedReciter.name.includes('المنشاوي') && (
                  <div className="pt-2">
                    <div className="text-xs text-muted-foreground mb-2">{t('edition')}</div>
                    <RadioGroup
                      value={selectedMoshaf?.id?.toString()}
                      onValueChange={(value) => setSelectedMoshafId(Number(value))}
                      className="gap-3"
                    >
                      {orderMoshafList(selectedReciter.moshaf).map((moshaf) => (
                        <label
                          key={moshaf.id}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all cursor-pointer ${
                            moshaf.id === selectedMoshaf?.id
                              ? 'bg-primary/5 border-primary/30'
                              : 'border-border/50 hover:border-primary/20'
                          }`}
                        >
                          <RadioGroupItem value={moshaf.id.toString()} />
                          <span>{moshaf.name}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{t('selectSurah')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={surahQuery}
                    onChange={(e) => setSurahQuery(e.target.value)}
                    placeholder={t('searchSurahsPlaceholder')}
                    className="ps-9 pe-9 rounded-xl"
                  />
                  {surahQuery && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute end-1 top-1/2 -translate-y-1/2"
                      onClick={() => setSurahQuery('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {filteredSurahs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">{t('noSurahsFound')}</p>
                )}

                <div className="space-y-2 max-h-[420px] overflow-y-auto">
                  {filteredSurahs.map((surah, index) => {
                    const isActive = surah.number === selectedSurah;
                    return (
                      <motion.button
                        key={surah.number}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.01, 0.2) }}
                        className={`w-full text-start p-3 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-primary/5 border-primary/30 active-gold'
                            : 'bg-card border-border/50 hover:border-primary/20 gold-hover'
                        }`}
                        onClick={() => setSelectedSurah(surah.number)}
                      >
                        <div className="text-sm font-semibold">
                          {surah.number}. {language === 'ar' ? surah.name : surah.englishName}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="fixed inset-x-0 bottom-4 z-40">
            <div className="container max-w-4xl">
              <Card className="border-border/50 shadow-xl">
                <CardContent className="py-4 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">{t('selectReciter')}</div>
                      <div className="text-base font-semibold">
                        {selectedReciter?.name || t('loading')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedSurahData
                          ? `${selectedSurahData.number}. ${language === 'ar' ? selectedSurahData.name : selectedSurahData.englishName}`
                          : t('selectSurah')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevSurah}
                        disabled={!selectedSurahData || isLoading}
                      >
                        <SkipBack className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handlePlayPause}
                        disabled={!selectedReciter || !selectedSurah || isLoading}
                        className="gap-2 rounded-xl"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isPlaying ? t('pause') : t('play')}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextSurah}
                        disabled={!selectedSurahData || isLoading}
                      >
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
                        disabled={!selectedReciter || !selectedSurah || isLoading}
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
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
          />
        </div>
      </main>
    </div>
  );
}
