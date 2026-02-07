import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  ChevronUp,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMushafStore } from '@/hooks/useMushafStore';
import { useTranslation } from '@/hooks/useTranslation';
import { fetchReciters, getAudioUrl, Reciter } from '@/lib/quranApi';
import { getSurahForPage, surahPageMap } from '@/lib/mushafApi';

interface MushafAudioPlayerProps {
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export const MushafAudioPlayer = memo(function MushafAudioPlayer({
  expanded = false,
  onToggleExpand
}: MushafAudioPlayerProps) {
  const { language } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const {
    currentPage,
    isPlaying,
    setIsPlaying,
    currentReciterId,
    setCurrentReciterId,
    currentSurah,
    setCurrentSurah,
    playbackRate,
    setPlaybackRate,
    volume,
    setVolume,
    repeatMode,
    setRepeatMode
  } = useMushafStore();

  // Load reciters
  useEffect(() => {
    const loadReciters = async () => {
      const data = await fetchReciters(language);
      setReciters(data);
      
      // Set default reciter
      if (data.length > 0) {
        const defaultReciter = data.find(r => 
          r.name.includes('المنشاوي') || 
          r.name.includes('ماهر المعيقلي')
        ) || data[0];
        setSelectedReciter(defaultReciter);
        setCurrentReciterId(defaultReciter.id);
      }
    };
    loadReciters();
  }, [language, setCurrentReciterId]);

  // Get current surah from page
  useEffect(() => {
    const surahInfo = getSurahForPage(currentPage);
    if (surahInfo) {
      setCurrentSurah(surahInfo.number);
    }
  }, [currentPage, setCurrentSurah]);

  // Handle audio playback
  const handlePlayPause = useCallback(() => {
    if (!audioRef.current || !selectedReciter || !currentSurah) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      const audioUrl = getAudioUrl(selectedReciter, currentSurah);
      if (audioRef.current.src !== audioUrl) {
        audioRef.current.src = audioUrl;
        setIsLoading(true);
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  }, [isPlaying, selectedReciter, currentSurah, setIsPlaying]);

  // Handle reciter change
  const handleReciterChange = useCallback((reciterId: string) => {
    const reciter = reciters.find(r => r.id.toString() === reciterId);
    if (reciter) {
      setSelectedReciter(reciter);
      setCurrentReciterId(reciter.id);
      
      // Reload audio if playing
      if (isPlaying && audioRef.current && currentSurah) {
        audioRef.current.src = getAudioUrl(reciter, currentSurah);
        audioRef.current.play().catch(console.error);
      }
    }
  }, [reciters, isPlaying, currentSurah, setCurrentReciterId]);

  // Handle playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'surah') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      setIsPlaying(false);
    }
  };

  // Navigate to previous/next surah
  const handlePrevSurah = () => {
    if (currentSurah && currentSurah > 1) {
      const newSurah = currentSurah - 1;
      setCurrentSurah(newSurah);
      
      if (audioRef.current && selectedReciter) {
        audioRef.current.src = getAudioUrl(selectedReciter, newSurah);
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  };

  const handleNextSurah = () => {
    if (currentSurah && currentSurah < 114) {
      const newSurah = currentSurah + 1;
      setCurrentSurah(newSurah);
      
      if (audioRef.current && selectedReciter) {
        audioRef.current.src = getAudioUrl(selectedReciter, newSurah);
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Seek
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg transition-all duration-300 ${
        expanded ? 'h-auto' : 'h-20'
      }`}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
      />

      {/* Expand Toggle */}
      <button
        onClick={onToggleExpand}
        className="absolute -top-4 left-1/2 -translate-x-1/2 bg-card border border-border rounded-full p-1 shadow-lg hover:bg-muted transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>

      <div className="container max-w-6xl mx-auto px-4 py-3">
        {/* Compact View */}
        <div className="flex items-center gap-4">
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevSurah}
              disabled={!currentSurah || currentSurah <= 1}
              className="h-9 w-9"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={handlePlayPause}
              disabled={!selectedReciter}
              className="h-12 w-12 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextSurah}
              disabled={!currentSurah || currentSurah >= 114}
              className="h-9 w-9"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 flex items-center gap-3">
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
              disabled={!duration}
            />
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Reciter Select */}
          <Select
            value={selectedReciter?.id.toString() || ''}
            onValueChange={handleReciterChange}
          >
            <SelectTrigger className="w-48 hidden md:flex">
              <SelectValue placeholder={language === 'ar' ? 'اختر القارئ' : 'Select Reciter'} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {reciters.slice(0, 50).map((reciter) => (
                <SelectItem key={reciter.id} value={reciter.id.toString()}>
                  {reciter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="h-9 w-9"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={([val]) => {
                setVolume(val / 100);
                if (val > 0) setIsMuted(false);
              }}
              className="w-20"
            />
          </div>

          {/* Repeat */}
          <Button
            variant={repeatMode !== 'none' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => {
              const modes: ('none' | 'surah')[] = ['none', 'surah'];
              const currentIndex = modes.indexOf(repeatMode as 'none' | 'surah');
              setRepeatMode(modes[(currentIndex + 1) % modes.length]);
            }}
            className="h-9 w-9"
          >
            {repeatMode === 'surah' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Expanded View */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="flex flex-wrap items-center gap-4">
                {/* Playback Speed */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'السرعة:' : 'Speed:'}
                  </span>
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    {playbackRates.map((rate) => (
                      <Button
                        key={rate}
                        variant={playbackRate === rate ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setPlaybackRate(rate)}
                        className="h-7 px-2 text-xs"
                      >
                        {rate}x
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Reciter Select */}
                <div className="md:hidden flex-1">
                  <Select
                    value={selectedReciter?.id.toString() || ''}
                    onValueChange={handleReciterChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={language === 'ar' ? 'اختر القارئ' : 'Select Reciter'} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {reciters.slice(0, 50).map((reciter) => (
                        <SelectItem key={reciter.id} value={reciter.id.toString()}>
                          {reciter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});
