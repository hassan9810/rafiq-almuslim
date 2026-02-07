import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Loader2, RefreshCw, Search, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { 
  calculatePrayerTimes, 
  getCurrentLocation, 
  searchCity,
  formatTime, 
  getTimeUntilNextPrayer,
  type PrayerTime,
  type Location
} from '@/lib/prayerTimes';

const prayerIcons = {
  Fajr: '🌙',
  Sunrise: '🌅',
  Dhuhr: '☀️',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌃',
};

export default function PrayerTimesPage() {
  const { t, language } = useTranslation();
  const { location, setLocation } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (location) {
      const times = calculatePrayerTimes(location.latitude, location.longitude);
      setPrayerTimes(times);
    }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPrayer = prayerTimes.find(p => p.isNext);
      if (nextPrayer) {
        setTimeUntilNext(getTimeUntilNextPrayer(nextPrayer.time));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const handleDetectLocation = async () => {
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation({ latitude: loc.latitude, longitude: loc.longitude, city: loc.city });
      setShowSearch(false);
    } catch (err) {
      console.error('Location error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCity = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchCity(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectCity = (city: Location) => {
    setLocation({ latitude: city.latitude, longitude: city.longitude, city: `${city.city}, ${city.country}` });
    setSearchResults([]);
    setSearchQuery('');
    setShowSearch(false);
  };

  const nextPrayer = prayerTimes.find(p => p.isNext);

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('prayerTimes')}
            </h1>
            {location && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{location.city}</span>
                  <Button variant="ghost" size="icon-sm" onClick={handleDetectLocation} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setShowSearch(!showSearch)}>
                    {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
                
                {showSearch && (
                  <div className="w-full max-w-sm mt-4 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder={language === 'ar' ? 'ابحث عن مدينة...' : 'Search city...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchCity()}
                      />
                      <Button onClick={handleSearchCity} disabled={searching}>
                        {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="bg-card border rounded-lg overflow-hidden">
                        {searchResults.map((city, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectCity(city)}
                            className="w-full p-3 text-left hover:bg-muted flex items-center gap-2 border-b last:border-0"
                          >
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{city.city}, {city.country}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {!location ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {language === 'ar' ? 'تحديد موقعك' : 'Detect Your Location'}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {language === 'ar' 
                  ? 'اسمح بالوصول إلى موقعك أو ابحث عن مدينتك يدوياً'
                  : 'Allow location access or search for your city manually'
                }
              </p>
              
              {/* Auto Detect Button */}
              <Button 
                variant="emerald" 
                size="lg" 
                onClick={handleDetectLocation}
                disabled={loading}
                className="mb-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'ar' ? 'جاري التحديد...' : 'Detecting...'}
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" />
                    {t('detectLocation')}
                  </>
                )}
              </Button>

              {/* Or Divider */}
              <div className="flex items-center gap-4 max-w-sm mx-auto mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-muted-foreground text-sm">{language === 'ar' ? 'أو' : 'or'}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Manual Search */}
              <div className="max-w-sm mx-auto space-y-3">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'ar' ? 'ابحث عن مدينتك:' : 'Search for your city:'}
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder={language === 'ar' ? 'مثال: القاهرة، مكة، دبي...' : 'e.g., Cairo, Mecca, Dubai...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchCity()}
                  />
                  <Button onClick={handleSearchCity} disabled={searching}>
                    {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
                {searchResults.length > 0 && (
                  <div className="bg-card border rounded-lg overflow-hidden text-right">
                    {searchResults.map((city, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectCity(city)}
                        className="w-full p-3 text-right hover:bg-muted flex items-center gap-2 border-b last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{city.city}, {city.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <>
              {/* Next Prayer Card */}
              {nextPrayer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hero-gradient rounded-3xl p-8 mb-8 text-center islamic-pattern"
                >
                  <p className="text-primary-foreground/70 text-sm mb-2">{t('nextPrayer')}</p>
                  <div className="text-5xl mb-2">
                    {prayerIcons[nextPrayer.name as keyof typeof prayerIcons]}
                  </div>
                  <h2 className="text-3xl font-bold text-primary-foreground mb-1">
                    {language === 'ar' ? nextPrayer.nameArabic : nextPrayer.name}
                  </h2>
                  <p className="text-4xl font-bold text-primary-foreground mb-2">
                    {formatTime(nextPrayer.time)}
                  </p>
                  <div className="inline-flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2">
                    <Clock className="w-4 h-4 text-primary-foreground" />
                    <span className="text-primary-foreground font-medium">{timeUntilNext}</span>
                  </div>
                </motion.div>
              )}

              {/* All Prayer Times */}
              <div className="space-y-3">
                {prayerTimes.map((prayer, index) => (
                  <motion.div
                    key={prayer.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`prayer-card flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      prayer.isNext 
                        ? 'bg-primary/5 border-primary/30 active' 
                        : 'bg-card border-border/50 hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {prayerIcons[prayer.name as keyof typeof prayerIcons]}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${prayer.isNext ? 'text-primary' : 'text-foreground'}`}>
                          {language === 'ar' ? prayer.nameArabic : prayer.name}
                        </h3>
                        {prayer.isNext && (
                          <p className="text-xs text-accent">{language === 'ar' ? 'الصلاة القادمة' : 'Next Prayer'}</p>
                        )}
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${prayer.isNext ? 'text-primary' : 'text-foreground'}`}>
                      {formatTime(prayer.time)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}