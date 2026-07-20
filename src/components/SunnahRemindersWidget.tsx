import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Utensils,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { calculatePrayerTimes } from '@/lib/prayerTimes';

/* ── Types ────────────────────────────────────────────────── */

interface HadithEntry {
  text: string;
  source: string;
  grade: string;
}

interface SunnahReminder {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  hadiths: HadithEntry[];
  timeInfo?: string;
  /** true when this reminder is relevant *right now* */
  isActive: boolean;
  /** accent color class */
  color: string;
  bgColor: string;
}

/* ── Helpers ──────────────────────────────────────────────── */

function getHijriDay(): { day: number; month: number } {
  const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
  });
  const parts = formatter.formatToParts(new Date());
  return {
    day: Number(parts.find((p) => p.type === 'day')?.value ?? 0),
    month: Number(parts.find((p) => p.type === 'month')?.value ?? 0),
  };
}

/* ── Component ────────────────────────────────────────────── */

export function SunnahRemindersWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  // Track hadith index per reminder id
  const [hadithIndices, setHadithIndices] = useState<Record<string, number>>({});

  const { location, calculationMethod } = useAppStore();

  const reminders: SunnahReminder[] = useMemo(() => {
    const now = new Date();
    const nowMs = now.getTime();
    const dayOfWeek = now.getDay(); // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
    const { day: hijriDay } = getHijriDay();

    // Get actual prayer times if location is available, otherwise use reasonable defaults
    let fajrMs: number, sunriseMs: number, dhuhrMs: number, maghribMs: number, ishaMs: number;

    if (location) {
      const times = calculatePrayerTimes(location.latitude, location.longitude, now, calculationMethod);
      const find = (name: string) => times.find((t) => t.name === name)?.time.getTime() ?? 0;
      fajrMs = find('Fajr');
      sunriseMs = find('Sunrise');
      dhuhrMs = find('Dhuhr');
      maghribMs = find('Maghrib');
      ishaMs = find('Isha');
    } else {
      // Fallback: approximate times
      const todayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      fajrMs = todayBase.getTime() + 5 * 60 * 60 * 1000;      // ~5:00
      sunriseMs = todayBase.getTime() + 6.25 * 60 * 60 * 1000; // ~6:15
      dhuhrMs = todayBase.getTime() + 12.25 * 60 * 60 * 1000;  // ~12:15
      maghribMs = todayBase.getTime() + 19 * 60 * 60 * 1000;   // ~19:00
      ishaMs = todayBase.getTime() + 20.5 * 60 * 60 * 1000;    // ~20:30
    }

    // Also get yesterday/tomorrow prayer times for cross-day checks
    let prevDayFajrMs: number, prevDayMaghribMs: number;
    if (location) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const prevTimes = calculatePrayerTimes(location.latitude, location.longitude, yesterday, calculationMethod);
      const findPrev = (name: string) => prevTimes.find((t) => t.name === name)?.time.getTime() ?? 0;
      prevDayFajrMs = findPrev('Fajr');
      prevDayMaghribMs = findPrev('Maghrib');
    } else {
      const yesterdayBase = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      prevDayFajrMs = yesterdayBase.getTime() + 5 * 60 * 60 * 1000;
      prevDayMaghribMs = yesterdayBase.getTime() + 19 * 60 * 60 * 1000;
    }

    // ── Fasting logic ──
    // For Monday fasting: remind from Sunday Fajr until Monday Maghrib
    // For Thursday fasting: remind from Wednesday Fajr until Thursday Maghrib
    const isFastingDay =
      (dayOfWeek === 1 && nowMs < maghribMs) ||   // Monday before Maghrib
      (dayOfWeek === 4 && nowMs < maghribMs);      // Thursday before Maghrib

    // Reminder the evening/night before (after Fajr of the previous day)
    const isReminderDay =
      (dayOfWeek === 0 && nowMs >= fajrMs) ||      // Sunday after Fajr
      (dayOfWeek === 3 && nowMs >= fajrMs);         // Wednesday after Fajr

    const isFastingReminderActive = isFastingDay || isReminderDay;

    const isWhiteDay = hijriDay === 13 || hijriDay === 14 || hijriDay === 15;

    // Duha: ~15-20 min after sunrise until ~10-15 min before Dhuhr
    const duhaStart = sunriseMs + 20 * 60 * 1000;        // 20 min after sunrise
    const duhaEnd = dhuhrMs - 15 * 60 * 1000;            // 15 min before Dhuhr
    const isDuhaTime = nowMs >= duhaStart && nowMs <= duhaEnd;

    // Witr & Qiyam: after Isha until next Fajr
    // If now is before Fajr, we're in the window from last night's Isha
    // If now is after Isha, we're in tonight's window
    const isNightPrayerTime =
      (nowMs >= ishaMs) ||                          // After tonight's Isha
      (nowMs < fajrMs && nowMs > prevDayMaghribMs); // Before today's Fajr (i.e., late night from yesterday)
    const isWitrTime = isNightPrayerTime;
    const isQiyamTime = isNightPrayerTime;

    let fastingSubtitle = '🔔 تذكير بالصيام يومي الاثنين والخميس';
    if (isFastingDay) {
      fastingSubtitle = dayOfWeek === 1
        ? '📅 اليوم الاثنين — يوم صيام مستحب'
        : '📅 اليوم الخميس — يوم صيام مستحب';
    } else if (isReminderDay) {
      if (dayOfWeek === 0) {
        fastingSubtitle = '🌙 تذكير: غدًا الاثنين — لا تنسَ نية الصيام';
      } else {
        fastingSubtitle = '🌙 تذكير: غدًا الخميس — لا تنسَ نية الصيام';
      }
    }

    return [
      {
        id: 'monday-thursday-fast',
        icon: <Utensils className="w-5 h-5" />,
        title: 'صيام الاثنين والخميس',
        subtitle: fastingSubtitle,
        hadiths: [
          {
            text: 'رأيتُ رسولَ اللَّهِ ﷺ يصومُ يومَ الاثنينِ والخميسِ فسألتُهُ فقالَ: إنَّ الأعمالَ تُعرَضُ يومَ الاثنينِ والخميسِ، فأحبُّ أن يُرفَعَ عملي وأَنا صائمٌ.',
            source: 'الراوي: أسامة بن زيد | المحدث: ابن حجر العسقلاني | فتح الباري ٤/٢٧٨\nالتخريج: أخرجه أبو داود (٢٤٣٦)، والنسائي (٢٣٥٨)، وأحمد (٢١٨٠١)',
            grade: 'صحيح',
          },
        ],
        isActive: isFastingReminderActive,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
      },
      {
        id: 'white-days',
        icon: <Moon className="w-5 h-5" />,
        title: 'صيام الأيام البيض',
        subtitle: isWhiteDay
          ? `🌕 اليوم ${hijriDay} من الشهر الهجري — يوم أبيض`
          : `📅 الأيام البيض: ١٣ و ١٤ و ١٥ من كل شهر هجري`,
        hadiths: [
          {
            text: 'أمرنا رسولُ اللَّهِ ﷺ أن نصومَ منَ الشَّهرِ ثلاثةَ أيَّامِ البيضِ ثلاثَ عشرةَ وأربعَ عشرةَ وخمسَ عشرة.',
            source: 'الراوي: أبو ذر الغفاري | المحدث: الألباني | صحيح النسائي ٢٤٢٢\nالتخريج: أخرجه النسائي (٢٤٢٢)، والترمذي (٧٦١)، وأحمد (٢١٥٣٧)',
            grade: 'حسن',
          },
        ],
        isActive: isWhiteDay,
        color: 'text-sky-400',
        bgColor: 'bg-sky-400/10',
      },
      {
        id: 'duha-prayer',
        icon: <Sun className="w-5 h-5" />,
        title: 'صلاة الضحى',
        subtitle: isDuhaTime
          ? '☀️ وقت صلاة الضحى الآن!'
          : '⏰ من بعد شروق الشمس بـ ١٥-٢٠ دقيقة حتى قبيل أذان الظهر بـ ١٠-١٥ دقيقة',
        hadiths: [
          {
            text: 'يُصبِحُ على كُلِّ سُلامى مِن أحَدِكُم صَدَقةٌ؛ فكُلُّ تَسبيحةٍ صَدَقةٌ، وكُلُّ تَحميدةٍ صَدَقةٌ، وكُلُّ تَهليلةٍ صَدَقةٌ، وكُلُّ تَكبيرةٍ صَدَقةٌ، وأمرٌ بالمَعروفِ صَدَقةٌ، ونَهيٌ عَنِ المُنكَرِ صَدَقةٌ، ويُجزِئُ مِن ذلك رَكعَتانِ يَركَعُهما مِنَ الضُّحى.',
            source: 'الراوي: أبو ذر الغفاري | المحدث: مسلم | صحيح مسلم ٧٢٠',
            grade: 'صحيح',
          },
          {
            text: 'كان يُصَلِّي الضُّحَى أربعًا، ويزيدُ ما شاءَ اللهُ.',
            source: 'الراوي: عائشة أم المؤمنين | المحدث: الألباني | صحيح الجامع ٤٩٥٩\nالتخريج: أخرجه مسلم (٧١٩)، وأحمد (٢٥١٢٣)، والنسائي في الكبرى (٤٨١)',
            grade: 'صحيح',
          },
        ],
        timeInfo: 'من بعد شروق الشمس وارتفاعها قيد رمح (١٥-٢٠ دقيقة) حتى قبيل أذان الظهر بـ ١٠-١٥ دقيقة',
        isActive: isDuhaTime,
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
      },
      {
        id: 'witr-prayer',
        icon: <Star className="w-5 h-5" />,
        title: 'صلاة الوتر',
        subtitle: isWitrTime
          ? '🌙 وقت صلاة الوتر الآن'
          : '⏰ من بعد العشاء حتى طلوع الفجر',
        hadiths: [
          {
            text: 'أوصاني خَليلي بثَلاثٍ لا أدَعُهنَّ حتَّى أموتَ: صَومِ ثَلاثةِ أيَّامٍ مِن كُلِّ شَهرٍ، وصَلاةِ الضُّحى، ونَومٍ على وِترٍ.',
            source: 'الراوي: أبو هريرة | المحدث: البخاري | صحيح البخاري ١١٧٨\nالتخريج: أخرجه مسلم (٧٢١) باختلاف يسير',
            grade: 'صحيح',
          },
        ],
        timeInfo: 'من بعد العشاء حتى طلوع الفجر',
        isActive: isWitrTime,
        color: 'text-violet-400',
        bgColor: 'bg-violet-400/10',
      },
      {
        id: 'qiyam-layl',
        icon: <Moon className="w-5 h-5" />,
        title: 'قيام الليل',
        subtitle: isQiyamTime
          ? '🌌 وقت قيام الليل — صَلُّوا باللَّيلِ والناسُ نِيام'
          : '⏰ من بعد صلاة العشاء حتى طلوع الفجر',
        hadiths: [
          {
            text: 'أفضَلُ الصَّلاةِ بَعدَ الصَّلاةِ المَكتوبةِ الصَّلاةُ في جَوفِ اللَّيلِ، وأفضَلُ الصِّيامِ بَعدَ شَهرِ رَمَضانَ صيامُ شَهرِ اللهِ المُحَرَّمِ.',
            source: 'الراوي: أبو هريرة | المحدث: مسلم | صحيح مسلم ١١٦٣',
            grade: 'صحيح',
          },
          {
            text: 'كان النبيُّ ﷺ يقومُ من اللَّيل حتى تَتفطَّر قدماه، فقالت عائشةُ: لِمَ تَصنعُ هذا يا رسولَ اللهِ، وقد غفر اللهُ لك ما تقدَّمَ مِن ذنبِك وما تأخَّر؟! قال: أفلا أحبُّ أن أكونَ عبدًا شكُورًا؟!',
            source: 'الراوي: عائشة رضي الله عنها | متفق عليه',
            grade: 'صحيح',
          },
          {
            text: 'يا أيُّها الناسُ، أفْشُوا السَّلام، وأطْعِموا الطَّعام، وصِلُوا الأرحام، وصَلُّوا باللَّيلِ والناسُ نِيام، تَدخلوا الجَنَّةَ بسَلام.',
            source: 'الراوي: عبد الله بن سلام رضي الله عنه | أخرجه الترمذي وابن ماجه',
            grade: 'صحيح',
          },
          {
            text: 'إنَّ في الجَنَّةِ غُرفًا يُرى ظاهرُها من باطنِها، وباطنُها من ظاهرِها، أعدَّها اللهُ تعالى لِمَن أَطعَمَ الطَّعام، وأَلانَ الكلام، وتابَع الصِّيام، وأفْشَى السَّلام، وصَلَّى باللَّيلِ والناسُ نِيام.',
            source: 'الراوي: أبو مالك الأشعري رضي الله عنه | أخرجه أحمد والطبراني',
            grade: 'حسن',
          },
        ],
        timeInfo: 'من بعد صلاة العشاء حتى طلوع الفجر',
        isActive: isQiyamTime,
        color: 'text-indigo-400',
        bgColor: 'bg-indigo-400/10',
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.latitude, location?.longitude, calculationMethod]);

  const activeReminders = reminders.filter((r) => r.isActive);
  const currentReminder = reminders[activeIndex];
  const activeCount = activeReminders.length;

  const currentHadithIndex = hadithIndices[currentReminder?.id] ?? 0;
  const currentHadith = currentReminder?.hadiths[currentHadithIndex] ?? currentReminder?.hadiths[0];
  const hadithCount = currentReminder?.hadiths.length ?? 0;

  const cycleHadith = useCallback(() => {
    if (!currentReminder || hadithCount <= 1) return;
    setHadithIndices((prev) => ({
      ...prev,
      [currentReminder.id]: ((prev[currentReminder.id] ?? 0) + 1) % hadithCount,
    }));
  }, [currentReminder, hadithCount]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % reminders.length);
  }, [reminders.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + reminders.length) % reminders.length);
  }, [reminders.length]);

  if (dismissed) return null;

  return (
    <>
      {/* ── Floating trigger button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0, scale: 0.7, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7, x: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 start-4 z-50 group"
            aria-label="فتح تذكيرات السنن"
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-md group-hover:blur-lg transition-all duration-300" />
              {/* Button body */}
              <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg flex items-center justify-center text-white border-2 border-white/20 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              {/* Active badge */}
              {activeCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -end-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md border border-white/30"
                >
                  {activeCount}
                </motion.div>
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Side panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none md:pointer-events-none"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, x: -320, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -320, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed bottom-4 start-4 z-50 w-[340px] max-h-[85vh] overflow-hidden"
              dir="rtl"
            >
              <div className="relative rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Top gradient stripe */}
                <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                {/* Header */}
                <div className="px-4 pt-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground font-arabic">
                        تذكيرات السنن
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        {activeCount > 0
                          ? `${activeCount} سنّة متاحة الآن`
                          : 'تذكير بالسنن النبوية'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDismissed(true)}
                      className="w-7 h-7 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 flex items-center justify-center transition-colors"
                      aria-label="إخفاء"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-7 h-7 rounded-lg text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 flex items-center justify-center transition-colors"
                      aria-label="طي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex items-center justify-center gap-1.5 pb-2">
                  {reminders.map((r, i) => (
                    <button
                      key={r.id}
                      onClick={() => setActiveIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex
                        ? 'w-6 bg-primary'
                        : r.isActive
                          ? 'w-2 bg-primary/40'
                          : 'w-2 bg-muted-foreground/20'
                        }`}
                      aria-label={r.title}
                    />
                  ))}
                </div>

                {/* Card content — scrollable area */}
                <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentReminder.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {/* Status bar */}
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 ${currentReminder.bgColor}`}
                      >
                        <span className={currentReminder.color}>
                          {currentReminder.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-bold text-sm font-arabic ${currentReminder.color}`}
                          >
                            {currentReminder.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground leading-relaxed truncate">
                            {currentReminder.subtitle}
                          </p>
                        </div>
                        {currentReminder.isActive && (
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
                          />
                        )}
                      </div>

                      {/* Hadith */}
                      <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
                        {/* Hadith toggle header — only if multiple hadiths */}
                        {hadithCount > 1 && (
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/30">
                            <span className="text-[10px] text-muted-foreground">
                              حديث {currentHadithIndex + 1} من {hadithCount}
                            </span>
                            <button
                              onClick={cycleHadith}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${currentReminder.bgColor} ${currentReminder.color} hover:opacity-80`}
                            >
                              <RefreshCw className="w-3 h-3" />
                              حديث آخر
                            </button>
                          </div>
                        )}

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${currentReminder.id}-hadith-${currentHadithIndex}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p
                              className="font-arabic text-[13px] leading-[2.2] text-foreground/90"
                              style={{ lineHeight: '2.2' }}
                            >
                              {currentHadith.text}
                            </p>

                            <div className="mt-3 pt-2 border-t border-border/30 flex items-start gap-2">
                              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary">
                                {currentHadith.grade}
                              </span>
                              <p className="text-[10px] text-muted-foreground leading-relaxed whitespace-pre-line">
                                {currentHadith.source}
                              </p>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      {/* Time info */}
                      {currentReminder.timeInfo && (
                        <div className="mt-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
                          <p className="text-[11px] text-primary/80 font-arabic text-center">
                            ⏰ {currentReminder.timeInfo}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation arrows */}
                  <div className="flex items-center justify-between mt-3">
                    <button
                      onClick={goPrev}
                      className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-muted-foreground">
                      {activeIndex + 1} / {reminders.length}
                    </span>
                    <button
                      onClick={goNext}
                      className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
