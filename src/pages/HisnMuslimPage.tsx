import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  ChevronLeft,
  ChevronRight,
  X,
  Sun,
  Moon,
  Plane,
  Home,
  Heart,
  CloudRain,
  UtensilsCrossed,
  Users,
  Compass,
  Loader2,
  Shield
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  HisnChapter,
  HisnDhikr,
  initHisnMuslim,
  categoryLabels,
  getCategoryForChapter,
  getChapterWithAdhkar
} from '@/lib/hisnMuslimApi';

const categoryIcons: Record<string, any> = {
  morning_evening: Sun,
  sleep: Moon,
  wakeup: Sun,
  clothing: Home,
  bathroom: Home,
  wudu: Home,
  home: Home,
  mosque: BookOpen,
  adhan: Volume2,
  prayer: BookOpen,
  distress: Heart,
  family: Users,
  illness: Heart,
  death: Heart,
  weather: CloudRain,
  food: UtensilsCrossed,
  social: Users,
  travel: Plane,
  misc: BookOpen,
  hajj: Compass,
  general: BookOpen,
};

export default function HisnMuslimPage() {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [chapters, setChapters] = useState<HisnChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<HisnChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentDhikrIndex, setCurrentDhikrIndex] = useState(0);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isArabic = language === 'ar';

  // Load chapters on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const loadedChapters = await initHisnMuslim();
        setChapters(loadedChapters);
      } catch (error) {
        console.error('Error loading chapters:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter chapters by search
  const filteredChapters = chapters.filter(ch =>
    ch.title.includes(searchQuery) || searchQuery === ''
  );

  // Group chapters by category
  const groupedChapters = filteredChapters.reduce((acc, chapter) => {
    const category = getCategoryForChapter(chapter.title);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(chapter);
    return acc;
  }, {} as Record<string, HisnChapter[]>);

  // Open chapter modal and fetch adhkar from API
  const openChapter = async (chapter: HisnChapter) => {
    setSelectedChapter(chapter);
    setCurrentDhikrIndex(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Fetch adhkar from API if not cached
    if (chapter.adhkar.length === 0) {
      setLoadingChapter(true);
      try {
        const updatedChapter = await getChapterWithAdhkar(chapter.id);
        if (updatedChapter) {
          setSelectedChapter(updatedChapter);
          // Update the chapter in the chapters list too
          setChapters(prev => prev.map(ch => 
            ch.id === updatedChapter.id ? updatedChapter : ch
          ));
        }
      } catch (error) {
        console.error('Error fetching chapter adhkar:', error);
      } finally {
        setLoadingChapter(false);
      }
    }
  };

  // Play audio for current dhikr
  const playCurrentDhikrAudio = () => {
    if (!selectedChapter || !audioRef.current) return;
    
    const currentDhikr = selectedChapter.adhkar[currentDhikrIndex];
    if (currentDhikr?.AUDIO) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        // Use HTTPS for audio
        const audioUrl = currentDhikr.AUDIO.replace('http://', 'https://');
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(err => {
          console.error('Audio playback error:', err);
          // Fallback: try chapter audio
          if (selectedChapter.audioUrl) {
            const chapterAudioUrl = selectedChapter.audioUrl.replace('http://', 'https://');
            audioRef.current!.src = chapterAudioUrl;
            audioRef.current!.play().catch(e => console.error('Chapter audio error:', e));
          }
        });
        setIsPlaying(true);
      }
    } else if (selectedChapter.audioUrl) {
      // Use chapter audio if no dhikr audio
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const audioUrl = selectedChapter.audioUrl.replace('http://', 'https://');
        audioRef.current.src = audioUrl;
        audioRef.current.play().catch(err => console.error('Audio playback error:', err));
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Navigate dhikr
  const nextDhikr = () => {
    if (selectedChapter && currentDhikrIndex < selectedChapter.adhkar.length - 1) {
      setCurrentDhikrIndex(prev => prev + 1);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const prevDhikr = () => {
    if (currentDhikrIndex > 0) {
      setCurrentDhikrIndex(prev => prev - 1);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const currentDhikr = selectedChapter?.adhkar[currentDhikrIndex];

  return (
    <div>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <main>
        <div className="container max-w-6xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold mb-2">
              {t('hisnMuslim')}
            </h1>
            <p className="font-arabic text-muted-foreground max-w-2xl mx-auto">
              {t('hisnSubtitle')}
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchAdhkarPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 text-right"
              dir={direction}
            />
          </div>

          {/* Selected Chapter Modal */}
          <AnimatePresence>
            {selectedChapter && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedChapter(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-background rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedChapter(null)}
                      className="text-primary-foreground hover:bg-primary-foreground/20"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                    <h2 className="font-arabic text-lg font-bold flex-1 text-center">
                      {selectedChapter.title}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleMute}
                        className="text-primary-foreground hover:bg-primary-foreground/20"
                      >
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={playCurrentDhikrAudio}
                        className="text-primary-foreground hover:bg-primary-foreground/20"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <ScrollArea className="h-[calc(85vh-140px)]">
                    <div className="p-6">
                      {selectedChapter.adhkar.length > 0 ? (
                        <div className="space-y-6">
                          {/* Current Dhikr Card */}
                          <Card className="border-2 border-primary/20 bg-primary/5">
                            <CardContent className="p-6">
                              <div className="text-center">
                                <Badge className="mb-4">
                                  {currentDhikrIndex + 1} / {selectedChapter.adhkar.length}
                                </Badge>
                                
                                {/* Arabic Text */}
                                <p className="font-arabic text-2xl md:text-3xl leading-loose mb-4 text-foreground" dir={direction}>
                                  {currentDhikr?.ARABIC_TEXT}
                                </p>
                                
                                {/* Translation if available */}
                                {currentDhikr?.TRANSLATED_TEXT && (
                                  <p className="text-muted-foreground text-sm leading-relaxed mb-4" dir={direction}>
                                    {currentDhikr.TRANSLATED_TEXT}
                                  </p>
                                )}
                                
                                {/* Repeat count */}
                                {currentDhikr?.REPEAT && (
                                  <Badge variant="secondary" className="mt-2">
                                    {t('repeat')} {currentDhikr.REPEAT}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Navigation */}
                          <div className="flex justify-center gap-4">
                            <Button
                              variant="outline"
                              onClick={prevDhikr}
                              disabled={currentDhikrIndex === 0}
                            >
                              <ChevronRight className="h-4 w-4 ml-2" />
                              {t('previous')}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={nextDhikr}
                              disabled={currentDhikrIndex === selectedChapter.adhkar.length - 1}
                            >
                              {t('next')}
                              <ChevronLeft className="h-4 w-4 mr-2" />
                            </Button>
                          </div>

                          {/* All Adhkar List */}
                          <div className="space-y-3 mt-8">
                            <h3 className="font-semibold text-muted-foreground">
                              {isArabic ? 'جميع الأذكار' : 'All Adhkar'}
                            </h3>
                            {selectedChapter.adhkar.map((dhikr, idx) => (
                              <Card 
                                key={dhikr.ID || idx}
                                className={`cursor-pointer transition-all ${
                                  idx === currentDhikrIndex 
                                    ? 'ring-2 ring-primary' 
                                    : 'hover:bg-muted/50'
                                }`}
                                onClick={() => {
                                  setCurrentDhikrIndex(idx);
                                  setIsPlaying(false);
                                  if (audioRef.current) audioRef.current.pause();
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <Badge variant="outline" className="shrink-0">
                                      {idx + 1}
                                    </Badge>
                                    <p className="font-arabic text-base leading-relaxed line-clamp-2" dir={direction}>
                                      {dhikr.ARABIC_TEXT}
                                    </p>
                                  </div>
                                  {dhikr.REPEAT && (
                                    <Badge variant="secondary" className="mt-2 text-xs">
                                      {dhikr.REPEAT} {t('times')}
                                    </Badge>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ) : loadingChapter ? (
                        <div className="text-center py-12">
                          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                          <p className="text-muted-foreground">
                            {t('loadingAdhkar')}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            {t('noContentAvailable')}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          ) : searchQuery ? (
            // Search results - flat list
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChapters.map((chapter) => (
                <Card
                  key={chapter.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  onClick={() => openChapter(chapter)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-arabic text-base flex-1">{chapter.title}</p>
                      <Badge variant="secondary" className="text-xs">
                        {chapter.adhkar.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Grouped categories
            <div className="space-y-8">
              {Object.entries(groupedChapters).map(([category, categoryChapters]) => {
                const Icon = categoryIcons[category] || BookOpen;
                const label = categoryLabels[category] || { ar: category, en: category };
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="font-arabic text-xl font-bold">
                        {isArabic ? label.ar : label.en}
                      </h2>
                      <Badge variant="secondary">{categoryChapters.length}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryChapters.map((chapter) => (
                        <Card
                          key={chapter.id}
                          className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                          onClick={() => openChapter(chapter)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-arabic text-sm leading-relaxed flex-1">
                                {chapter.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {chapter.adhkar.length}
                                </Badge>
                                <Play className="h-4 w-4 text-muted-foreground shrink-0" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
    </div>
  );
}
