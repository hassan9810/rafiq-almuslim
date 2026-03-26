import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { calculatePrayerTimes, formatTime, getTimeUntilNextPrayer, getCurrentLocation, type PrayerTime } from '@/lib/prayerTimes';
import { Button } from '@/components/ui/button';

export function NextPrayerWidget() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { location, setLocation, calculationMethod } = useAppStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [loading, setLoading] = useState(false);

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
    const id = setInterval(refreshPrayerState, 5000);
    return () => clearInterval(id);
  }, [location, calculationMethod]);

  const handleDetect = async () => {
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation({ latitude: loc.latitude, longitude: loc.longitude, city: loc.city });
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const nextPrayer = prayerTimes.find(p => p.isNext);
  const isNextMainPrayer = nextPrayer
    ? ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(nextPrayer.name)
    : true;
  const nextLabelKey = isNextMainPrayer ? 'nextPrayer' : 'nextTime';

  // Find next 3 prayers after current next
  const nextIndex = prayerTimes.findIndex(p => p.isNext);
  const upcoming = nextIndex >= 0
    ? prayerTimes.slice(nextIndex, nextIndex + 3)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden bg-card rounded-2xl border border-border/50 shadow-card cursor-pointer"
      onClick={() => navigate('/prayer-times')}
    >
      {/* Gradient accent */}
      <div className="h-1.5 bg-gradient-to-r from-primary to-accent" />

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">
              {t(nextLabelKey)}
            </h3>
          </div>
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground" dir="ltr">
              <MapPin className="w-3 h-3" />
              <span>{location.city}</span>
            </div>
          )}
        </div>

        {!location ? (
          <div className="text-center py-3">
            <Button variant="emerald" size="sm" onClick={(e) => { e.stopPropagation(); handleDetect(); }} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <><MapPin className="w-4 h-4" />{t('detectLocation')}</>
              )}
            </Button>
          </div>
        ) : nextPrayer ? (
          <div className="space-y-3">
            {/* Big next prayer */}
            <div className="flex items-center justify-between bg-primary/5 rounded-xl p-3 border border-primary/10">
              <div>
                <p className="text-lg font-bold text-primary">
                  {language === 'ar' ? nextPrayer.nameArabic : nextPrayer.name}
                </p>
                <p className="text-xs text-muted-foreground">{t(nextLabelKey)}</p>
              </div>
              <div className="text-end">
                <p className="text-2xl font-bold text-foreground">{formatTime(nextPrayer.time)}</p>
                <p className="text-xs font-medium text-primary">{timeUntilNext}</p>
              </div>
            </div>

            {/* Upcoming mini list */}
            {upcoming.length > 1 && (
              <div className="flex gap-2">
                {upcoming.slice(1).map(p => (
                  <div key={p.name} className="flex-1 text-center py-1.5 px-2 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? p.nameArabic : p.name}
                    </p>
                    <p className="text-sm font-medium text-foreground">{formatTime(p.time)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
