import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Pause, Volume2, VolumeX, Heart, Loader2, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { useQuery } from '@tanstack/react-query';
import { fetchRadioStations, type RadioStation as ApiRadioStation } from '@/lib/radioApi';

interface RadioStation {
  id: string;
  name: string;
  nameAr?: string;
  url: string;
  img?: string;
}

// Original curated stations with images - keep order
const curatedStations: RadioStation[] = [
  { id: 'c1', name: 'Quran Radio from Cairo', nameAr: 'إذاعة القرآن الكريم من القاهرة', url: 'https://n02.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABnBQSJywA7FMGmXdoGdldAA' },
  { id: 'c2', name: 'Makkah Live', nameAr: 'إذاعة مكة المكرمة', url: 'https://stream.radiojar.com/0tpy1h0kxtzuv' },
  { id: 'c3', name: 'Madinah Live', nameAr: 'إذاعة المدينة المنورة', url: 'https://stream.radiojar.com/4wqre23fytzuv' },
  { id: 'c4', name: 'Muhammad Siddiq Al-Minshawi', nameAr: 'إذاعة محمد صديق المنشاوي', url: 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi_mojawwad', img: 'https://i1.sndcdn.com/artworks-000284633237-7gdg9t-t200x200.jpg' },
  { id: 'c5', name: 'Mahmoud Ali Al-Banna', nameAr: 'إذاعة محمود علي البنا', url: 'https://backup.qurango.net/radio/mahmoud_ali__albanna_mojawwad', img: 'https://i.pinimg.com/200x/29/67/b3/2967b3fbc1ce1f5a70874288d34317bf.jpg' },
  { id: 'c6', name: 'Mahmoud Khalil Al-Hussary', nameAr: 'إذاعة محمود خليل الحصري', url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary_mojawwad', img: 'https://watanimg.elwatannews.com/image_archive/original_lower_quality/18194265071637693809.jpg' },
  { id: 'c7', name: 'Abdul Basit Abdul Samad', nameAr: 'إذاعة عبدالباسط عبدالصمد', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad', img: 'https://cdns-images.dzcdn.net/images/talk/06b711ac6da4cde0eb698e244f5e27b8/300x300.jpg' },
  { id: 'c7a', name: 'Mustafa Ismail', nameAr: 'إذاعة مصطفى إسماعيل', url: 'https://backup.qurango.net/radio/mustafa_ismail' },
  { id: 'c7b', name: 'Ahmad Nauina', nameAr: 'إذاعة أحمد نعينع', url: 'https://backup.qurango.net/radio/ahmad_nauina' },
  { id: 'c7c', name: 'Abdul Basit Abdul Samad (Murattal)', nameAr: 'إذاعة عبدالباسط عبدالصمد', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad' },
  { id: 'c7d', name: 'Abdul Basit Abdul Samad (Warsh)', nameAr: 'إذاعة عبدالباسط عبدالصمد', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_warsh' },
  { id: 'c7e', name: 'Mohammad Al-Tablaway', nameAr: 'إذاعة محمد الطبلاوي', url: 'https://backup.qurango.net/radio/mohammad_altablaway' },
  { id: 'c7f', name: 'Mohammed Jibreel', nameAr: 'إذاعة محمد جبريل', url: 'https://backup.qurango.net/radio/mohammed_jibreel' },
  { id: 'c7g', name: 'Muhammad Siddiq Al-Minshawi (Murattal)', nameAr: 'إذاعة محمد صديق المنشاوي', url: 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi' },
  { id: 'c7h', name: 'Mahmoud Khalil Al-Hussary', nameAr: 'إذاعة محمود خليل الحصري', url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary' },
  { id: 'c7i', name: 'Mahmoud Khalil Al-Hussary (Warsh)', nameAr: 'إذاعة محمود خليل الحصري', url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary_warsh' },
  { id: 'c7j', name: 'Mahmoud Ali Al-Banna (Murattal)', nameAr: 'إذاعة محمود علي البنا', url: 'https://backup.qurango.net/radio/mahmoud_ali__albanna' },
  { id: 'c7k', name: 'Ahmad Amer', nameAr: 'إذاعة أحمد عامر', url: 'https://backup.qurango.net/radio/ahmed_amer' },
  { id: 'c7l', name: 'Ahmad Khalil Shaheen', nameAr: 'إذاعة أحمد خليل شاهين', url: 'https://backup.qurango.net/radio/ahmad_shaheen' },
  { id: 'c8', name: 'Maher Al-Muaiqly', nameAr: 'إذاعة ماهر المعيقلي', url: 'https://backup.qurango.net/radio/maher', img: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/4b/80/58/4b80582d-78ca-a466-0341-0869bc611745/mza_5280524847349008894.jpg/250x250bb.jpg' },
  { id: 'c9', name: 'Mishary Al-Afasy', nameAr: 'إذاعة مشاري العفاسي', url: 'https://backup.qurango.net/radio/mishary_alafasi', img: 'https://i1.sndcdn.com/artworks-000019055020-yr9cjc-t200x200.jpg' },
  { id: 'c10', name: 'Abu Bakr Al-Shatri', nameAr: 'إذاعة أبو بكر الشاطري', url: 'https://backup.qurango.net/radio/shaik_abu_bakr_al_shatri', img: 'https://i1.sndcdn.com/artworks-000663801097-wb0y31-t200x200.jpg' },
  { id: 'c11', name: 'Khalid Al-Jaleel', nameAr: 'إذاعة خالد الجليل', url: 'https://backup.qurango.net/radio/khalid_aljileel', img: 'https://i1.sndcdn.com/avatars-ubX3f7yLm5eGyphJ-A4ysyA-t500x500.jpg' },
  { id: 'c12', name: 'Nasser Al-Qatami', nameAr: 'إذاعة ناصر القطامي', url: 'https://backup.qurango.net/radio/nasser_alqatami', img: 'https://i1.sndcdn.com/artworks-000096282703-s9wldh-t200x200.jpg' },
  { id: 'c13', name: 'Yasser Al-Dosari', nameAr: 'إذاعة ياسر الدوسري', url: 'https://backup.qurango.net/radio/yasser_aldosari', img: 'https://www.almowaten.net/wp-content/uploads/2022/06/%D9%8A%D8%A7%D8%B3%D8%B1-%D8%A7%D9%84%D8%AF%D9%88%D8%B3%D8%B1%D9%8A.jpg' },
  { id: 'c14', name: 'Fares Abbad', nameAr: 'إذاعة فارس عباد', url: 'https://backup.qurango.net/radio/fares_abbad', img: 'https://static.suratmp3.com/pics/reciters/thumbs/15_600_600.jpg' },
  { id: 'c15', name: 'Ibrahim Al-Akhdar', nameAr: 'إذاعة إبراهيم الأخضر', url: 'https://backup.qurango.net/radio/ibrahim_alakdar', img: 'https://static.suratmp3.com/pics/reciters/thumbs/44_600_600.jpg' },
  { id: 'c16', name: 'Salah Bu Khatir', nameAr: 'إذاعة صلاح بو خاطر', url: 'https://backup.qurango.net/radio/slaah_bukhatir', img: 'https://pbs.twimg.com/profile_images/1306502829251624960/uHKIJQpq_200x200.jpg' },
  { id: 'c17', name: 'Haitham Al-Jadani', nameAr: 'إذاعة هيثم الجدعاني', url: 'https://backup.qurango.net/radio/hitham_aljadani', img: 'https://ar.islamway.net/uploads/authors/3948.jpg' },
  { id: 'c18', name: 'Ahmad Khader Al-Tarabulsi', nameAr: 'إذاعة أحمد خضر الطرابلسي', url: 'https://backup.qurango.net/radio/ahmad_khader_altarabulsi', img: 'https://i.pinimg.com/564x/d3/c2/9c/d3c29cc03198c3c15d380af048b2d68b.jpg' },
  { id: 'c19', name: 'Salah Al-Hashim', nameAr: 'إذاعة صلاح الهاشم', url: 'https://backup.qurango.net/radio/salah_alhashim', img: 'https://i.pinimg.com/564x/e9/22/1b/e9221b5ffd484937dc70c3eabe350c6f.jpg' },
  { id: 'c20', name: 'Abdul Aziz Suhaim', nameAr: 'إذاعة عبد العزيز سحيم', url: 'https://backup.qurango.net/radio/a_sheim', img: 'https://i.pinimg.com/564x/a7/37/47/a73747375897de4897da372a0fd921a0.jpg' },
  { id: 'c21', name: 'Nabil Al-Rifai', nameAr: 'إذاعة نبيل الرفاعي', url: 'https://backup.qurango.net/radio/nabil_al_rifay', img: 'https://i1.sndcdn.com/artworks-000161140408-wh6nhw-t200x200.jpg' },
  { id: 'c22', name: 'Sunnah Radio', nameAr: 'إذاعة السنة النبوية', url: 'https://n01.radiojar.com/x0vs2vzy6k0uv?rj-ttl=5&rj-tok=AAABjW751GcA4NgCI8-5DCpCHQ', img: 'https://i.pinimg.com/564x/55/16/ab/5516abd3744c3d0b0a7b28bedd5474c0.jpg' },
  { id: 'c23', name: 'Humbling Recitations', nameAr: 'إذاعة تلاوات خاشعة', url: 'https://backup.qurango.net/radio/salma', img: 'https://pbs.twimg.com/profile_images/1396812808659079169/5ft2haLD_400x400.jpg' },
  { id: 'c24', name: 'Ruqyah Radio', nameAr: 'إذاعة الرقية الشرعية', url: 'https://backup.qurango.net/radio/roqiah', img: 'https://i1.sndcdn.com/artworks-zygACgAd2NKwuohE-UF2Piw-t500x500.jpg' },
  { id: 'c25', name: 'Quran Tafsir Summary', nameAr: 'المختصر في تفسير القرآن الكريم', url: 'https://backup.qurango.net/radio/mukhtasartafsir', img: 'https://areejquran.net/wp-content/uploads/2015/12/unnamed.jpg' },
  { id: 'c26', name: 'Eid Takbeer', nameAr: 'إذاعة تكبيرات العيد', url: 'https://backup.qurango.net/radio/eid', img: 'https://i.pinimg.com/736x/3c/b3/fc/3cb3fc494b9f8332a7b7b3256e3d9822.jpg' },
];

// Extract URL slugs from curated stations to avoid duplicates
const curatedSlugs = new Set(curatedStations.map(s => {
  try { return new URL(s.url).pathname.split('/').pop(); } catch { return s.url; }
}));

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
      .map(s => ({
        id: `api-${s.id}`,
        name: s.name,
        url: s.url,
      }));
    return [...curatedStations, ...apiConverted];
  }, [apiStations]);

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return allStations;
    const q = searchQuery.trim().toLowerCase();
    return allStations.filter(s =>
      s.name.toLowerCase().includes(q) ||
      (s.nameAr && s.nameAr.includes(q))
    );
  }, [allStations, searchQuery]);

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
          <div className="relative mb-4">
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
