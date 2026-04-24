import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Loader2, RefreshCw, Search, X, Bell, BellOff, Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { 
  calculatePrayerTimes, 
  getCurrentLocation, 
  searchCity,
  formatTime, 
  getTimeUntilNextPrayer,
  type PrayerTime,
  type Location,
  type CalcMethodKey,
} from '@/lib/prayerTimes';
import {
  isNotificationSupported,
  requestNotificationPermission,
  getNotificationPermission,
  isNotificationsEnabled,
  setNotificationsEnabled,
  checkAndNotifyPrayers,
  previewAdhan,
  stopAdhan,
  pauseAdhan,
  resumeAdhan,
  isAdhanPlaying,
  isAdhanPaused,
} from '@/lib/prayerNotifications';
import { adhanSources } from '@/data/adhanSources';

const prayerIcons = {
  Fajr: '🌙',
  Sunrise: '🌅',
  Dhuhr: '☀️',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌃',
  Midnight: '🌌',
  LastThird: '✨',
};


export default function PrayerTimesPage() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const { 
    direction, location, setLocation, calculationMethod, setCalculationMethod,
    adhanEnabled, adhanMuezzinId, setAdhanEnabled, setAdhanMuezzinId,
  } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(isNotificationsEnabled());
  const [adhanState, setAdhanState] = useState<'idle' | 'playing' | 'paused'>('idle');

  // Sync adhan playback state every 500ms
  useEffect(() => {
    const id = setInterval(() => {
      if (isAdhanPlaying()) setAdhanState('playing');
      else if (isAdhanPaused()) setAdhanState('paused');
      else setAdhanState('idle');
    }, 500);
    return () => clearInterval(id);
  }, []);

  // Prayer notification + adhan interval is handled globally in AppLayout
  // (runs across all pages, not just this one)

  const handleToggleNotifications = async () => {
    if (!isNotificationSupported()) {
      toast({ title: t('notificationsNotSupported'), variant: 'destructive' });
      return;
    }
    if (notifEnabled) {
      setNotificationsEnabled(false);
      setNotifEnabled(false);
      toast({ title: t('notificationsDisabled') });
      return;
    }
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationsEnabled(true);
      setNotifEnabled(true);
      toast({ title: t('notificationsEnabled') });
    } else {
      toast({ title: t('notificationsDenied'), variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (!location) return;

    const areTimesEqual = (a: PrayerTime[], b: PrayerTime[]) => {
      if (a.length !== b.length) return false;
      return a.every((p, i) => (
        p.name === b[i].name
        && p.time.getTime() === b[i].time.getTime()
        && p.isNext === b[i].isNext
      ));
    };

    const refreshPrayerState = () => {
      const times = calculatePrayerTimes(location.latitude, location.longitude, new Date(), calculationMethod);
      setPrayerTimes((prev) => (areTimesEqual(prev, times) ? prev : times));

      const next = times.find((p) => p.isNext);
      setTimeUntilNext(next ? getTimeUntilNextPrayer(next.time) : '');
    };

    refreshPrayerState();
    const interval = setInterval(refreshPrayerState, 5000);
    return () => clearInterval(interval);
  }, [location, calculationMethod]);

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
  const isNextMainPrayer = nextPrayer
    ? ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(nextPrayer.name)
    : true;
  const nextLabelKey = isNextMainPrayer ? 'nextPrayer' : 'nextTime';

  return (
    <div>
      <main>
        <div className="container max-w-2xl">
          {/* Page Header */}
          <PageHeader
            icon={Clock}
            title={t('prayerTimes')}
          />
          {location && (
            <div className="flex flex-col items-center gap-2 text-center -mt-4 mb-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{location.city}</span>
                  <Button variant="ghost" size="icon-sm" onClick={handleDetectLocation} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setShowSearch(!showSearch)}>
                    {showSearch ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    onClick={handleToggleNotifications}
                    className={notifEnabled ? 'text-primary' : ''}
                  >
                    {notifEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </Button>
                  {/* Adhan toggle */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      if (adhanEnabled) { stopAdhan(); }
                      setAdhanEnabled(!adhanEnabled);
                      toast({ title: adhanEnabled ? t('adhanDisabled') : t('adhanEnabled') });
                    }}
                    className={adhanEnabled ? 'text-primary' : ''}
                    title={adhanEnabled ? t('disableAdhan') : t('enableAdhan')}
                  >
                    {adhanEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Calculation Method Selector */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{t('calculationMethod')}:</span>
                  <Select value={calculationMethod} onValueChange={(v) => setCalculationMethod(v as CalcMethodKey)}>
                    <SelectTrigger className="w-48 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Egyptian">{t('calcEgyptian')}</SelectItem>
                      <SelectItem value="MuslimWorldLeague">{t('calcMuslimWorldLeague')}</SelectItem>
                      <SelectItem value="NorthAmerica">{t('calcNorthAmerica')}</SelectItem>
                      <SelectItem value="UmmAlQura">{t('calcUmmAlQura')}</SelectItem>
                      <SelectItem value="Dubai">{t('calcDubai')}</SelectItem>
                      <SelectItem value="Qatar">{t('calcQatar')}</SelectItem>
                      <SelectItem value="Kuwait">{t('calcKuwait')}</SelectItem>
                      <SelectItem value="MoonsightingCommittee">{t('calcMoonsighting')}</SelectItem>
                      <SelectItem value="Singapore">{t('calcSingapore')}</SelectItem>
                      <SelectItem value="Karachi">{t('calcKarachi')}</SelectItem>
                      <SelectItem value="Tehran">{t('calcTehran')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Adhan Muezzin Selector */}
                {adhanEnabled && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{t('muezzin')}:</span>
                    <Select dir={direction} value={adhanMuezzinId} onValueChange={setAdhanMuezzinId}>
                      <SelectTrigger className="w-52 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {adhanSources.map(src => (
                          <SelectItem key={src.id} value={src.id}>
                            {language === 'ar' ? src.nameAr : src.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title={t('previewAdhan')}
                      onClick={() => { previewAdhan(adhanMuezzinId); setAdhanState('playing'); }}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                    {/* Pause / Resume */}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title={adhanState === 'paused' ? t('resumeAdhan') : t('pauseAdhan')}
                      disabled={adhanState === 'idle'}
                      onClick={() => {
                        if (adhanState === 'paused') { resumeAdhan(); setAdhanState('playing'); }
                        else { pauseAdhan(); setAdhanState('paused'); }
                      }}
                    >
                      {adhanState === 'paused'
                        ? <Play className="w-3.5 h-3.5 text-primary" />
                        : <Pause className="w-3.5 h-3.5" />}
                    </Button>
                    {/* Stop */}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      title={t('stopAdhan')}
                      disabled={adhanState === 'idle'}
                      onClick={() => { stopAdhan(); setAdhanState('idle'); }}
                    >
                      <Square className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
                
                {showSearch && (
                  <div className="w-full max-w-sm mt-4 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('searchCityPlaceholder')}
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
                {t('detectYourLocation')}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {t('allowLocationOrSearch')}
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
                    {t('detecting')}
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
                <span className="text-muted-foreground text-sm">{t('or')}</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Manual Search */}
              <div className="max-w-sm mx-auto space-y-3">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('searchForYourCity')}
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder={t('cityPlaceholderExample')}
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
                  <p className="text-primary-foreground/70 text-sm mb-2">{t(nextLabelKey)}</p>
                  <div className="text-5xl mb-2">
                    {prayerIcons[nextPrayer.name as keyof typeof prayerIcons]}
                  </div>
                  <h2 className="text-3xl font-bold text-primary-foreground mb-1">
                    {language === 'ar' ? nextPrayer.displayNameArabic : nextPrayer.displayName}
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
                        ? 'bg-primary/5 border-primary/30 active active-gold' 
                        : 'bg-card border-border/50 hover:border-primary/20 gold-hover'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {prayerIcons[prayer.name as keyof typeof prayerIcons]}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${prayer.isNext ? 'text-primary' : 'text-foreground'}`}>
                          {language === 'ar' ? prayer.displayNameArabic : prayer.displayName}
                        </h3>
                        {prayer.isNext && (
                          <p className="text-xs text-primary font-medium">
                            {t(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayer.name) ? 'nextPrayer' : 'nextTime')} · {timeUntilNext}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className={`font-bold ${prayer.isNext ? 'text-primary' : 'text-foreground'}`}>
                      {formatTime(prayer.time)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
