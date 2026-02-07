import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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

export default function SurahReader() {
  const { surahNumber } = useParams();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const { 
    favorites, 
    toggleFavorite, 
    addBookmark, 
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
  
  const audioRef = useRef<HTMLAudioElement>(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-32">
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Could not load surah data</p>
      </div>
    );
  }

  const { arabic, translation } = surahData;

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-40">
        <div className="container max-w-4xl">
          {/* Surah Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <Badge variant="outline" className="text-xs">
                {arabic.revelationType === 'Meccan' ? t('makki') : t('madani')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {arabic.numberOfAyahs} {t('verses')}
              </Badge>
            </div>
            
            <h1 className="font-arabic text-4xl md:text-5xl text-foreground mb-2">
              {arabic.name}
            </h1>
            <p className="text-xl text-muted-foreground">{arabic.englishName}</p>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(surahNum)}
                >
                  <Star className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              <Link to="/mushaf">
                <Button className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                  <BookOpen className="w-5 h-5" />
                  {language === 'ar' ? 'تصفح المصحف الشريف' : 'Browse Mushaf'}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Bismillah */}
          {surahNum !== 1 && surahNum !== 9 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 mb-8 bg-card rounded-2xl border border-border/50"
            >
              <p className="font-arabic text-3xl text-primary">{t('bismillah')}</p>
            </motion.div>
          )}

          {/* Ayahs */}
          <div className="space-y-6">
            {arabic.ayahs.map((ayah, index) => {
              const translationAyah = translation.ayahs[index];
              const isActive = currentAyah === ayah.numberInSurah;
              
              return (
                <motion.div
                  key={ayah.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`ayah-highlight p-6 rounded-2xl border transition-all ${
                    isActive 
                      ? 'border-accent bg-accent/5 playing' 
                      : 'border-border/50 bg-card hover:border-primary/30'
                  }`}
                >
                  {/* Ayah Number */}
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
                      onClick={() => addBookmark(surahNum, ayah.numberInSurah)}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked(ayah.numberInSurah) ? 'fill-accent text-accent' : ''}`} />
                    </Button>
                  </div>

                  {/* Arabic Text */}
                  <p className="arabic-quran text-foreground mb-4 leading-loose" dir="rtl">
                    {ayah.text}
                    <span className="inline-block mx-2 font-arabic text-accent">
                      ﴿{ayah.numberInSurah.toLocaleString('ar-EG')}﴾
                    </span>
                  </p>

                  {/* Translation */}
                  {translationAyah && (
                    <p className="text-muted-foreground text-base leading-relaxed" dir="ltr">
                      {translationAyah.text}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevSurah}
              disabled={surahNum <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              {language === 'ar' ? 'السورة السابقة' : 'Previous Surah'}
            </Button>
            <Button
              variant="outline"
              onClick={handleNextSurah}
              disabled={surahNum >= 114}
            >
              {language === 'ar' ? 'السورة التالية' : 'Next Surah'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border z-50">
        <div className="container max-w-4xl py-4">
          <div className="flex items-center gap-4">
            {/* Reciter Select */}
            <Select
              value={selectedReciter?.id.toString()}
              onValueChange={(value) => {
                const reciter = reciters.find(r => r.id.toString() === value);
                if (reciter) setSelectedReciter(reciter);
              }}
            >
              <SelectTrigger className="w-48">
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
            <div className="flex items-center gap-2 flex-1 justify-center">
              <Button variant="ghost" size="icon" onClick={handlePrevSurah}>
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button variant="emerald" size="icon-lg" onClick={handlePlay}>
                {player.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextSurah}>
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 w-32">
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
      </div>

      <audio ref={audioRef} onEnded={() => setPlayer({ isPlaying: false })} />
      <Footer />
    </div>
  );
}