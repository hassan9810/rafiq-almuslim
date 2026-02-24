import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Pause, Volume2, VolumeX, Heart, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { fetchRadioStations } from '@/lib/radioApi';
import {
  curatedStations,
  curatedSlugs,
  apiSlugCategories,
  getSlugFromUrl,
  RADIO_CATEGORIES,
  type RadioStation,
  type RadioCategory,
} from '@/data/radioStations';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function RadioPage() {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('radio-favorites-v2') || '[]'); } catch { return []; }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<RadioCategory>('all');
  const audioRef = useRef<HTMLAudioElement>(null);

  const { data: apiStations = [], isLoading } = useQuery({
    queryKey: ['radio-stations', language],
    queryFn: () => fetchRadioStations(language),
    staleTime: 1000 * 60 * 30,
  });

  // Merge: curated first, then API stations that aren't duplicates
  const allStations = useMemo(() => {
    const apiConverted: RadioStation[] = apiStations
      .filter(s => {
        const slug = s.url.split('/').pop() || '';
        return !curatedSlugs.has(slug);
      })
      .map(s => {
        const slug = getSlugFromUrl(s.url);
        const cats = apiSlugCategories[slug];
        return {
          id: `api-${s.id}`,
          name: s.name,
          url: s.url,
          categories: cats || ['other'],
        };
      });
    return [...curatedStations, ...apiConverted];
  }, [apiStations]);

  const filteredStations = useMemo(() => {
    let stations = allStations;

    // Filter by category
    if (activeCategory !== 'all') {
      stations = stations.filter(s => s.categories.includes(activeCategory));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      stations = stations.filter(s =>
        s.name.toLowerCase().includes(q) ||
        (s.nameAr && s.nameAr.includes(q))
      );
    }

    return stations;
  }, [allStations, searchQuery, activeCategory]);

  useEffect(() => {
    localStorage.setItem('radio-favorites-v2', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayStation = async (station: RadioStation) => {
    if (!audioRef.current) return;
    setLoading(true);

    if (currentStation?.id === station.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setLoading(false);
    } else {
      audioRef.current.src = station.url;
      setCurrentStation(station);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error playing audio:', error);
      }
      setLoading(false);
    }
  };

  const toggleFavorite = (stationId: string) => {
    setFavorites(prev =>
      prev.includes(stationId)
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };

  const getDisplayName = (station: RadioStation) => {
    if (language === 'ar' && station.nameAr) return station.nameAr;
    return station.name;
  };

  const getCategoryLabel = (cat: typeof RADIO_CATEGORIES[number]) => {
    return language === 'ar' ? cat.labelAr : cat.labelEn;
  };

  return (
    <div>
      <main>
        <div className="container max-w-2xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Radio className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('radio')}
            </h1>
            <p className="font-arabic text-muted-foreground max-w-2xl mx-auto">
              {t('radioSubtitle')}
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchRadioPlaceholder')}
              className="ps-9 pe-9 rounded-xl"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute end-1 top-1/2 -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category Tabs */}
          <ScrollArea className="w-full mb-4">
            <div className="flex gap-2 pb-2">
              {RADIO_CATEGORIES.map(cat => (
                <Button
                  key={cat.key}
                  variant={activeCategory === cat.key ? 'default' : 'outline'}
                  size="sm"
                  className="shrink-0 rounded-full text-xs font-medium"
                  onClick={() => setActiveCategory(cat.key)}
                >
                  {getCategoryLabel(cat)}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Count */}
          <p className="text-xs text-muted-foreground mb-3">
            {filteredStations.length} {t('stationsCount')}
            {isLoading && <Loader2 className="inline w-3 h-3 animate-spin ms-2" />}
          </p>

          {/* No results */}
          {filteredStations.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t('noRadioResults')}</p>
            </div>
          )}

          {/* Radio Stations */}
          <div className="space-y-2 pb-24">
            {filteredStations.map((station, index) => {
              const isActive = currentStation?.id === station.id;
              const isFavorite = favorites.includes(station.id);

              return (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-card border-border/50 hover:border-primary/20'
                  }`}
                  onClick={() => handlePlayStation(station)}
                >
                  {/* Station Image */}
                  {station.img ? (
                    <img
                      src={station.img}
                      alt={station.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5 text-primary" />
                    </div>
                  )}

                  {/* Play Button */}
                  <Button
                    variant={isActive && isPlaying ? 'emerald' : 'outline'}
                    size="icon"
                    className="shrink-0 h-10 w-10"
                  >
                    {loading && isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isActive && isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Station Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {getDisplayName(station)}
                    </h3>
                    {isActive && isPlaying && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs text-primary">{t('nowPlaying')}</span>
                      </div>
                    )}
                  </div>

                  {/* Favorite */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(station.id);
                    }}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-destructive text-destructive' : ''}`} />
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Player Bar */}
      {currentStation && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50"
        >
          <div className="container max-w-2xl py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {getDisplayName(currentStation)}
                </p>
                {isPlaying && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-primary">Live</span>
                  </div>
                )}
              </div>

              <Button
                variant="emerald"
                size="icon"
                onClick={() => handlePlayStation(currentStation)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <div className="hidden sm:flex items-center gap-2 w-32">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsMuted(!isMuted)}
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
        </motion.div>
      )}

      <audio ref={audioRef} />
    </div>
  );
}
