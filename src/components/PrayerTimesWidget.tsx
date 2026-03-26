import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { calculatePrayerTimes, getCurrentLocation, formatTime, getTimeUntilNextPrayer, type PrayerTime } from '@/lib/prayerTimes';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

export function PrayerTimesWidget() {
  const { t, language } = useTranslation();
  const { location, setLocation, direction, calculationMethod } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState('');

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
    setError(null);
    try {
      const loc = await getCurrentLocation();
      setLocation({ latitude: loc.latitude, longitude: loc.longitude, city: loc.city });
    } catch (err) {
      setError(t('locationError'));
    } finally {
      setLoading(false);
    }
  };

  const nextPrayer = prayerTimes.find(p => p.isNext);
  const isNextMainPrayer = nextPrayer
    ? ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(nextPrayer.name)
    : true;
  const nextLabelKey = isNextMainPrayer ? 'nextPrayer' : 'nextTime';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card/80 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-border/50 shadow-card gold-hover"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">{t('prayerTimes')}</h3>
        </div>
        {location && (
          <div className="px-3 flex items-center gap-1 text-sm text-muted-foreground" dir='ltr'>
            <MapPin className="w-3 h-3" />
            <span>{location.city}</span>
          </div>
        )}
      </div>

      {!location ? (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-3">{t('detectLocation')}</p>
          <Button 
            variant="emerald" 
            size="sm" 
            onClick={handleDetectLocation}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                {t('detectLocation')}
              </>
            )}
          </Button>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      ) : (
        <>
          {/* Next Prayer Highlight */}
          {nextPrayer && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-3 mb-4 border border-accent/15">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t(nextLabelKey)}</p>
                  <p className="text-lg font-bold text-primary">
                    {language === 'ar' ? nextPrayer.nameArabic : nextPrayer.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{formatTime(nextPrayer.time)}</p>
                  <p className="text-xs text-primary font-medium">{timeUntilNext}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prayer Times List */}
          <div className="space-y-2">
            {prayerTimes.map((prayer) => (
              <motion.div
                key={prayer.name}
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                  prayer.isNext ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                whileHover={{ x: 4 }}
              >
                <span className={`text-sm ${prayer.isNext ? 'font-semibold text-primary' : 'text-foreground'}`}>
                  {language === 'ar' ? prayer.nameArabic : prayer.name}
                </span>
                <span className={`text-sm font-medium ${prayer.isNext ? 'text-primary' : 'text-muted-foreground'}`}>
                  {formatTime(prayer.time)}
                </span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
