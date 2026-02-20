import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader2, Navigation, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { getCurrentLocation, getQiblaDirection } from '@/lib/prayerTimes';

export default function QiblaPage() {
  const { t, language } = useTranslation();
  const { direction, location, setLocation } = useAppStore();
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [hasCompass, setHasCompass] = useState(true);

  useEffect(() => {
    if (location) {
      const direction = getQiblaDirection(location.latitude, location.longitude);
      setQiblaDirection(direction);
    }
  }, [location]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      // Request permission for iOS 13+
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            } else {
              setHasCompass(false);
            }
          })
          .catch(() => setHasCompass(false));
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } else {
      setHasCompass(false);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleDetectLocation = async () => {
    setLoading(true);
    try {
      const loc = await getCurrentLocation();
      setLocation({ latitude: loc.latitude, longitude: loc.longitude, city: loc.city });
    } catch (err) {
      console.error('Location error:', err);
    } finally {
      setLoading(false);
    }
  };

  const compassRotation = qiblaDirection !== null ? qiblaDirection - deviceHeading : 0;

  return (
    <div>
      <main>
        <div className="container max-w-lg">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Compass className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('qibla')}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('qiblaSubtitle')}
            </p>
          </motion.div>

          {!location ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('detectYourLocation')}
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                {t('allowLocationForQibla')}
              </p>
              <Button 
                variant="emerald" 
                size="lg" 
                onClick={handleDetectLocation}
                disabled={loading}
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
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {/* Location */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
                <MapPin className="w-4 h-4" />
                <span>{location.city}</span>
              </div>

              {/* Compass */}
              <div className="relative w-72 h-72 mx-auto mb-8">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-border bg-card shadow-card" />
                
                {/* Direction Markers */}
                <div className="absolute inset-4 rounded-full border-2 border-border/50">
                  {['N', 'E', 'S', 'W'].map((dir, i) => (
                    <div
                      key={dir}
                      className="absolute w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground"
                      style={{
                        top: i === 0 ? '0' : i === 2 ? 'auto' : '50%',
                        bottom: i === 2 ? '0' : 'auto',
                        left: i === 3 ? '0' : i === 1 ? 'auto' : '50%',
                        right: i === 1 ? '0' : 'auto',
                        transform: i % 2 === 0 ? 'translateX(-50%)' : 'translateY(-50%)',
                      }}
                    >
                      {dir}
                    </div>
                  ))}
                </div>

                {/* Compass Needle */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: compassRotation }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Kaaba Icon */}
                    <div className="absolute top-8 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                        <span className="font-arabic text-2xl text-primary-foreground">🕋</span>
                      </div>
                      <div className="w-1 h-24 bg-gradient-to-b from-primary to-transparent mt-2" />
                    </div>
                  </div>
                </motion.div>

                {/* Center Point */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-accent shadow-glow" />
                </div>
              </div>

              {/* Qibla Degree */}
              {qiblaDirection !== null && (
                <div className="bg-card rounded-2xl p-6 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t('qiblaDirection')}
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {Math.round(qiblaDirection)}°
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('fromNorth')}
                  </p>
                </div>
              )}

              {!hasCompass && (
                <p className="text-sm text-muted-foreground mt-4">
                  {t('compassNotAvailable')}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </main>
      
    </div>
  );
}