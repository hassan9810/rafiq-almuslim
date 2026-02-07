import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, Play, Pause, Volume2, VolumeX, Heart, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/useTranslation';

interface RadioStation {
  id: number;
  name: string;
  nameAr?: string;
  url: string;
  img?: string;
}

// Popular Quran Radio Stations - Ordered: Cairo, Makkah, Madinah, then Egyptian reciters, then others
const radioStations: RadioStation[] = [
  // Top 3: Cairo, Makkah, Madinah
  { id: 1, name: 'Quran Radio from Cairo', nameAr: 'إذاعة القرآن الكريم من القاهرة', url: 'https://n02.radiojar.com/8s5u5tpdtwzuv?rj-ttl=5&rj-tok=AAABnBQSJywA7FMGmXdoGdldAA' },
  { id: 2, name: 'Makkah Live', nameAr: 'إذاعة مكة المكرمة', url: 'https://stream.radiojar.com/0tpy1h0kxtzuv' },
  { id: 3, name: 'Madinah Live', nameAr: 'إذاعة المدينة المنورة', url: 'https://stream.radiojar.com/4wqre23fytzuv' },
  
  // Egyptian Reciters
  { id: 4, name: 'Muhammad Siddiq Al-Minshawi', nameAr: 'إذاعة محمد صديق المنشاوي', url: 'https://backup.qurango.net/radio/mohammed_siddiq_alminshawi_mojawwad', img: 'https://i1.sndcdn.com/artworks-000284633237-7gdg9t-t200x200.jpg' },
  { id: 5, name: 'Mahmoud Ali Al-Banna', nameAr: 'إذاعة محمود علي البنا', url: 'https://backup.qurango.net/radio/mahmoud_ali__albanna_mojawwad', img: 'https://i.pinimg.com/200x/29/67/b3/2967b3fbc1ce1f5a70874288d34317bf.jpg' },
  { id: 6, name: 'Mahmoud Khalil Al-Hussary', nameAr: 'إذاعة محمود خليل الحصري', url: 'https://backup.qurango.net/radio/mahmoud_khalil_alhussary_mojawwad', img: 'https://watanimg.elwatannews.com/image_archive/original_lower_quality/18194265071637693809.jpg' },
  { id: 7, name: 'Abdul Basit Abdul Samad', nameAr: 'إذاعة عبدالباسط عبدالصمد', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad', img: 'https://cdns-images.dzcdn.net/images/talk/06b711ac6da4cde0eb698e244f5e27b8/300x300.jpg' },
  
  // Other Reciters
  { id: 8, name: 'Maher Al-Muaiqly', nameAr: 'إذاعة ماهر المعيقلي', url: 'https://backup.qurango.net/radio/maher', img: 'https://is1-ssl.mzstatic.com/image/thumb/Podcasts113/v4/4b/80/58/4b80582d-78ca-a466-0341-0869bc611745/mza_5280524847349008894.jpg/250x250bb.jpg' },
  { id: 9, name: 'Mishary Al-Afasy', nameAr: 'إذاعة مشاري العفاسي', url: 'https://backup.qurango.net/radio/mishary_alafasi', img: 'https://i1.sndcdn.com/artworks-000019055020-yr9cjc-t200x200.jpg' },
  { id: 10, name: 'Abu Bakr Al-Shatri', nameAr: 'إذاعة أبو بكر الشاطري', url: 'https://backup.qurango.net/radio/shaik_abu_bakr_al_shatri', img: 'https://i1.sndcdn.com/artworks-000663801097-wb0y31-t200x200.jpg' },
  { id: 11, name: 'Khalid Al-Jaleel', nameAr: 'إذاعة خالد الجليل', url: 'https://backup.qurango.net/radio/khalid_aljileel', img: 'https://i1.sndcdn.com/avatars-ubX3f7yLm5eGyphJ-A4ysyA-t500x500.jpg' },
  { id: 12, name: 'Nasser Al-Qatami', nameAr: 'إذاعة ناصر القطامي', url: 'https://backup.qurango.net/radio/nasser_alqatami', img: 'https://i1.sndcdn.com/artworks-000096282703-s9wldh-t200x200.jpg' },
  { id: 13, name: 'Yasser Al-Dosari', nameAr: 'إذاعة ياسر الدوسري', url: 'https://backup.qurango.net/radio/yasser_aldosari', img: 'https://www.almowaten.net/wp-content/uploads/2022/06/%D9%8A%D8%A7%D8%B3%D8%B1-%D8%A7%D9%84%D8%AF%D9%88%D8%B3%D8%B1%D9%8A.jpg' },
  { id: 14, name: 'Fares Abbad', nameAr: 'إذاعة فارس عباد', url: 'https://backup.qurango.net/radio/fares_abbad', img: 'https://static.suratmp3.com/pics/reciters/thumbs/15_600_600.jpg' },
  { id: 15, name: 'Ibrahim Al-Akhdar', nameAr: 'إذاعة إبراهيم الأخضر', url: 'https://backup.qurango.net/radio/ibrahim_alakdar', img: 'https://static.suratmp3.com/pics/reciters/thumbs/44_600_600.jpg' },
  { id: 16, name: 'Salah Bu Khatir', nameAr: 'إذاعة صلاح بو خاطر', url: 'https://backup.qurango.net/radio/slaah_bukhatir', img: 'https://pbs.twimg.com/profile_images/1306502829251624960/uHKIJQpq_200x200.jpg' },
  { id: 17, name: 'Haitham Al-Jadani', nameAr: 'إذاعة هيثم الجدعاني', url: 'https://backup.qurango.net/radio/hitham_aljadani', img: 'https://ar.islamway.net/uploads/authors/3948.jpg' },
  { id: 18, name: 'Ahmad Khader Al-Tarabulsi', nameAr: 'إذاعة أحمد خضر الطرابلسي', url: 'https://backup.qurango.net/radio/ahmad_khader_altarabulsi', img: 'https://i.pinimg.com/564x/d3/c2/9c/d3c29cc03198c3c15d380af048b2d68b.jpg' },
  { id: 19, name: 'Salah Al-Hashim', nameAr: 'إذاعة صلاح الهاشم', url: 'https://backup.qurango.net/radio/salah_alhashim', img: 'https://i.pinimg.com/564x/e9/22/1b/e9221b5ffd484937dc70c3eabe350c6f.jpg' },
  { id: 20, name: 'Abdul Aziz Suhaim', nameAr: 'إذاعة عبد العزيز سحيم', url: 'https://backup.qurango.net/radio/a_sheim', img: 'https://i.pinimg.com/564x/a7/37/47/a73747375897de4897da372a0fd921a0.jpg' },
  { id: 21, name: 'Nabil Al-Rifai', nameAr: 'إذاعة نبيل الرفاعي', url: 'https://backup.qurango.net/radio/nabil_al_rifay', img: 'https://i1.sndcdn.com/artworks-000161140408-wh6nhw-t200x200.jpg' },
  
  // Special Radios
  { id: 22, name: 'Sunnah Radio', nameAr: 'إذاعة السنة النبوية', url: 'https://n01.radiojar.com/x0vs2vzy6k0uv?rj-ttl=5&rj-tok=AAABjW751GcA4NgCI8-5DCpCHQ', img: 'https://i.pinimg.com/564x/55/16/ab/5516abd3744c3d0b0a7b28bedd5474c0.jpg' },
  { id: 23, name: 'Humbling Recitations', nameAr: 'إذاعة تلاوات خاشعة', url: 'https://backup.qurango.net/radio/salma', img: 'https://pbs.twimg.com/profile_images/1396812808659079169/5ft2haLD_400x400.jpg' },
  { id: 24, name: 'Ruqyah Radio', nameAr: 'إذاعة الرقية الشرعية', url: 'https://backup.qurango.net/radio/roqiah', img: 'https://i1.sndcdn.com/artworks-zygACgAd2NKwuohE-UF2Piw-t500x500.jpg' },
  { id: 25, name: 'Quran Tafsir Summary', nameAr: 'المختصر في تفسير القرآن الكريم', url: 'https://backup.qurango.net/radio/mukhtasartafsir', img: 'https://areejquran.net/wp-content/uploads/2015/12/unnamed.jpg' },
  { id: 26, name: 'Eid Takbeer', nameAr: 'إذاعة تكبيرات العيد', url: 'https://backup.qurango.net/radio/eid', img: 'https://i.pinimg.com/736x/3c/b3/fc/3cb3fc494b9f8332a7b7b3256e3d9822.jpg' },
];

export default function RadioPage() {
  const { t, language } = useTranslation();
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const toggleFavorite = (stationId: number) => {
    setFavorites(prev => 
      prev.includes(stationId) 
        ? prev.filter(id => id !== stationId)
        : [...prev, stationId]
    );
  };

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-32">
        <div className="container max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Radio className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('radio')}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'استمع إلى إذاعات القرآن الكريم' : 'Listen to Quran Radio Stations'}
            </p>
          </motion.div>

          {/* Radio Stations */}
          <div className="space-y-3">
            {radioStations.map((station, index) => {
              const isActive = currentStation?.id === station.id;
              const isFavorite = favorites.includes(station.id);
              
              return (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.5) }}
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
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
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
                      {language === 'ar' && station.nameAr ? station.nameAr : station.name}
                    </h3>
                    {isActive && isPlaying && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        <span className="text-xs text-accent">
                          {language === 'ar' ? 'يعمل الآن' : 'Now Playing'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Favorite Button */}
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
              {/* Station Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {language === 'ar' && currentStation.nameAr ? currentStation.nameAr : currentStation.name}
                </p>
                {isPlaying && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-xs text-accent">Live</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <Button
                variant="emerald"
                size="icon"
                onClick={() => handlePlayStation(currentStation)}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              {/* Volume */}
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
      <Footer />
    </div>
  );
}