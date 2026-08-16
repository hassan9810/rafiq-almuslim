import { useState, useMemo, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Book, Headphones, ChevronRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PrayerTimesWidget } from '@/components/PrayerTimesWidget';

/* â”€â”€ Decorative sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

/** Small glowing dot that slowly drifts upward */
function FloatingParticle({
  x, y, size, delay, duration,
}: { x: string; y: string; size: number; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-accent/40 blur-sm pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{ y: [0, -45, 0], opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/** 8-pointed Islamic star */
function IslamicStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
      <polygon
        points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
        stroke="currentColor" strokeWidth="0.6" fill="currentColor"
        fillOpacity="0.07" strokeOpacity="0.25"
      />
      <polygon
        points="50,22 58,40 78,40 63,52 69,72 50,61 31,72 37,52 22,40 42,40"
        stroke="currentColor" strokeWidth="0.4" fill="currentColor"
        fillOpacity="0.04" strokeOpacity="0.15"
      />
    </svg>
  );
}

/** Crescent moon */
function Crescent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" className={className} aria-hidden="true">
      <path
        d="M35 8 C18 10 8 22 8 36 C8 50 18 62 35 64 C22 58 14 48 14 36 C14 24 22 14 35 8Z"
        fill="currentColor" fillOpacity="0.22"
        stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.35"
      />
    </svg>
  );
}

/* â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

export function HeroSection() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const shouldReduceMotion = useReducedMotion();
  const takbeerAudioRef = useRef<HTMLAudioElement | null>(null);
  const talbiyaAudioRef = useRef<HTMLAudioElement | null>(null);
  const [activeAudio, setActiveAudio] = useState<'takbeer' | 'talbiya' | null>(null);

  const { gregorianDate, hijriDate } = useMemo(() => {
    const now = new Date();
    const gregorian =
      now.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
      }) + '\u0020\u0645';
    const hijri = now.toLocaleDateString('ar-SA', {
      calendar: 'islamic-umalqura',
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    return { gregorianDate: gregorian, hijriDate: hijri };
  }, [language]);

  const { hijriDay, hijriMonth } = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(new Date());
    const day = Number(parts.find((part) => part.type === 'day')?.value ?? '0');
    const month = Number(parts.find((part) => part.type === 'month')?.value ?? '0');
    return { hijriDay: day, hijriMonth: month };
  }, []);

  const showTakbeerButton =
    (hijriMonth === 10 && hijriDay >= 1 && hijriDay <= 3) ||
    (hijriMonth === 12 && hijriDay >= 1 && hijriDay <= 13);
  const showTalbiyaButton = hijriMonth === 12 && hijriDay >= 1 && hijriDay <= 13;
  const takbeerLabel = language === 'ar' ? 'تشغيل التكبير' : 'Play Takbeer';
  const talbiyaLabel = language === 'ar' ? 'تشغيل التلبية' : 'Play Talbiya';

  const handleAudioToggle = (type: 'takbeer' | 'talbiya') => {
    const current = type === 'takbeer' ? takbeerAudioRef.current : talbiyaAudioRef.current;
    const other = type === 'takbeer' ? talbiyaAudioRef.current : takbeerAudioRef.current;

    if (!current) return;

    if (other && !other.paused) {
      other.pause();
    }

    if (!current.paused) {
      current.pause();
      setActiveAudio(null);
      return;
    }

    current.play().then(() => setActiveAudio(type)).catch(() => setActiveAudio(null));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const particles = [
    { x: '6%', y: '18%', size: 8, delay: 0, duration: 5 },
    { x: '12%', y: '62%', size: 5, delay: 1.2, duration: 4.2 },
    { x: '22%', y: '82%', size: 11, delay: 2.1, duration: 6 },
    { x: '72%', y: '22%', size: 6, delay: 0.6, duration: 4.8 },
    { x: '84%', y: '60%', size: 9, delay: 1.7, duration: 5.5 },
    { x: '91%', y: '38%', size: 5, delay: 2.8, duration: 3.8 },
    { x: '48%', y: '88%', size: 7, delay: 0.9, duration: 5.2 },
  ];

  return (
    <section className="relative min-h-[75vh] flex flex-col overflow-hidden">

      {/* â”€â”€ Background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 islamic-pattern-geo" />

      {/* Floating soft orbs */}
      <motion.div
        className="absolute top-16 left-8 w-80 h-80 rounded-full bg-accent/15 blur-3xl pointer-events-none"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-12 right-8 w-[28rem] h-[28rem] rounded-full bg-white/8 blur-3xl pointer-events-none"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Floating particles */}
      {!shouldReduceMotion && particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

      {/* Large slowly-rotating Islamic star â€” background right */}
      <motion.div
        className="absolute right-[-6%] top-1/2 -translate-y-1/2 w-[46%] opacity-[0.09] text-white pointer-events-none"
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      >
        <IslamicStar className="w-full h-full" />
      </motion.div>

      {/* Counter-rotating star â€” bottom left */}
      <motion.div
        className="absolute left-[-10%] bottom-0 w-[32%] opacity-[0.05] text-accent pointer-events-none"
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        <IslamicStar className="w-full h-full" />
      </motion.div>

      {/* Crescent â€” top right corner */}
      <motion.div
        className="absolute top-8 right-8 md:top-14 md:right-14 w-14 md:w-20 opacity-25 text-accent pointer-events-none"
        animate={shouldReduceMotion ? {} : { y: [0, -10, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Crescent className="w-full h-full" />
      </motion.div>

      {/* â”€â”€ Date bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="relative z-10 pt-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 120 }}
          className="bg-primary-foreground/10 backdrop-blur-sm py-2 px-4"
        >
          <div className="container grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-2 text-white/90">
            <div className="hidden md:block" />
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="font-arabic text-sm md:text-base">{hijriDate}</span>
              <span className="text-white/50">|</span>
              <span className="text-sm md:text-base">{gregorianDate}</span>
            </div>
            {showTakbeerButton || showTalbiyaButton ? (
              <div className="flex items-center justify-center md:justify-end gap-2">
                {showTakbeerButton ? (
                  <Button
                    type="button"
                    variant="hero-outline"
                    size="sm"
                    onClick={() => handleAudioToggle('takbeer')}
                    aria-pressed={activeAudio === 'takbeer'}
                    className="text-xs md:text-sm px-2 border-white/50 text-white bg-white/10 hover:bg-white/20"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    {takbeerLabel}
                  </Button>
                ) : null}
                {showTalbiyaButton ? (
                  <Button
                    type="button"
                    variant="hero-outline"
                    size="sm"
                    onClick={() => handleAudioToggle('talbiya')}
                    aria-pressed={activeAudio === 'talbiya'}
                    className="text-xs md:text-sm px-2 border-white/50 text-white bg-white/10 hover:bg-white/20"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    {talbiyaLabel}
                  </Button>
                ) : null}
              </div>
            ) : (
              <div className="hidden md:block" />
            )}
          </div>
        </motion.div>
      </div>

      <audio
        ref={takbeerAudioRef}
        src="https://media.way2quran.com/specials/dhul-hijjah/takbeer.mp3"
        onPause={() => setActiveAudio(null)}
        loop
        preload="none"
      />
      <audio
        ref={talbiyaAudioRef}
        src="https://media.way2quran.com/specials/dhul-hijjah/talbiya.mp3"
        onPause={() => setActiveAudio(null)}
        loop
        preload="none"
      />

      {/* â”€â”€ Main content grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="container relative z-10 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 75 }}
            className={`space-y-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}
          >
            {/* Bismillah â€” shimmering gold */}
            <motion.p
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 130 }}
              className="font-arabic text-2xl md:text-3xl shimmer-gold-text"
              style={{ lineHeight: '1.8', paddingBlock: '0.1em' }}
            >
              {t('bismillah')}
            </motion.p>

            {/* App name + subtitle */}
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
                className="font-arabic text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
                style={{ lineHeight: '1.5' }}
              >
                {t('welcome')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                className="font-arabic text-lg md:text-xl text-white/85 max-w-xl"
                style={{ lineHeight: '1.8' }}
              >
                {t('heroSubtitle')}
              </motion.p>
            </div>

            {/* Search bar with glow ring on focus */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              onSubmit={handleSearch}
              className="relative max-w-xl"
            >
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-accent/25 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10" />
                <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-accent duration-200" />
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 ps-12 pe-4 rounded-xl bg-background/95 backdrop-blur-md border-0 text-foreground placeholder:text-muted-foreground shadow-lg focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            </motion.form>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                variant="hero-outline"
                size="xl"
                onClick={() => navigate('/quran')}
                className="group"
              >
                <Book className="w-5 h-5" />
                {t('startReading')}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>

              {/* Primary theme button with sweeping shimmer */}
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/quran')}
                className="group relative overflow-hidden"
              >
                {!shouldReduceMotion && (
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                  />
                )}
                <Headphones className="w-5 h-5 relative z-10" />
                <span className="relative z-10">{t('listenNow')}</span>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
              className="flex flex-wrap gap-8 pt-2"
            >
              {[
                { value: t('quran'), label: t('kareem') },
                { value: '+1000', label: t('reciters') },
                { value: t('hadith'), label: t('sharif') },
                { value: t('hisn'), label: t('muslim') },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.08, type: 'spring', stiffness: 220 }}
                >
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right column â€” Prayer times widget */}
          <motion.div
            initial={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.35, type: 'spring', stiffness: 75 }}
            className="hidden lg:block"
          >
            <PrayerTimesWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
