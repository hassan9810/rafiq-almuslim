import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, RotateCcw, Target, TrendingUp, Vibrate,
  ChevronDown, ChevronUp, Plus, Minus, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

interface TasbeehStats {
  totalToday: number;
  totalAllTime: number;
  dailyGoal: number;
  streak: number;
  lastDate: string;
  history: { date: string; count: number }[];
  selectedDhikr: string;
  currentCount: number;
}

const DEFAULT_ADHKAR = [
  { id: 'subhanallah', ar: 'سبحان الله', en: 'SubhanAllah', target: 33 },
  { id: 'alhamdulillah', ar: 'الحمد لله', en: 'Alhamdulillah', target: 33 },
  { id: 'allahuakbar', ar: 'الله أكبر', en: 'Allahu Akbar', target: 33 },
  { id: 'lailaha', ar: 'لا إله إلا الله', en: 'La ilaha illallah', target: 100 },
  { id: 'astaghfirullah', ar: 'أستغفر الله', en: 'Astaghfirullah', target: 100 },
  { id: 'subhanallahwa', ar: 'سبحان الله وبحمده', en: 'SubhanAllahi wa bihamdihi', target: 100 },
  { id: 'lahawla', ar: 'لا حول ولا قوة إلا بالله', en: 'La hawla wa la quwwata illa billah', target: 100 },
  { id: 'salawat', ar: 'اللهم صل على محمد', en: 'Allahumma salli ala Muhammad', target: 100 },
  { id: 'subhanallahazeem', ar: 'سبحان الله العظيم', en: 'SubhanAllah al-Azeem', target: 100 },
];

const GOALS = [33, 50, 100, 200, 300, 500, 1000];

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function loadStats(): TasbeehStats {
  try {
    const raw = localStorage.getItem('tasbeeh-stats');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Reset daily count if new day
      if (parsed.lastDate !== getToday()) {
        // Save yesterday's count to history
        if (parsed.lastDate && parsed.totalToday > 0) {
          parsed.history = [
            { date: parsed.lastDate, count: parsed.totalToday },
            ...(parsed.history || []),
          ].slice(0, 30);
          // Update streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (parsed.lastDate === yesterday.toISOString().split('T')[0]) {
            parsed.streak = (parsed.streak || 0) + 1;
          } else {
            parsed.streak = 0;
          }
        }
        parsed.totalToday = 0;
        parsed.currentCount = 0;
        parsed.lastDate = getToday();
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return {
    totalToday: 0,
    totalAllTime: 0,
    dailyGoal: 100,
    streak: 0,
    lastDate: getToday(),
    history: [],
    selectedDhikr: 'subhanallah',
    currentCount: 0,
  };
}

function saveStats(stats: TasbeehStats) {
  localStorage.setItem('tasbeeh-stats', JSON.stringify(stats));
}

export default function TasbeehPage() {
  const { language } = useTranslation();
  const { direction } = useAppStore();
  const isAr = language === 'ar';

  const [stats, setStats] = useState<TasbeehStats>(loadStats);
  const [vibrateEnabled, setVibrateEnabled] = useState(true);
  const [showStats, setShowStats] = useState(false);

  const currentDhikr = useMemo(
    () => DEFAULT_ADHKAR.find(d => d.id === stats.selectedDhikr) || DEFAULT_ADHKAR[0],
    [stats.selectedDhikr]
  );

  useEffect(() => { saveStats(stats); }, [stats]);

  const handleTap = useCallback(() => {
    setStats(prev => {
      const newCount = prev.currentCount + 1;
      const newTotalToday = prev.totalToday + 1;
      const newTotalAll = prev.totalAllTime + 1;

      // Vibrate at milestones
      if (vibrateEnabled && navigator.vibrate) {
        if (newCount === currentDhikr.target || newCount % 100 === 0) {
          navigator.vibrate([100, 50, 100]);
        } else if (newCount % 33 === 0) {
          navigator.vibrate(50);
        }
      }

      return {
        ...prev,
        currentCount: newCount,
        totalToday: newTotalToday,
        totalAllTime: newTotalAll,
        lastDate: getToday(),
      };
    });
  }, [vibrateEnabled, currentDhikr.target]);

  const resetCurrent = () => {
    setStats(prev => ({ ...prev, currentCount: 0 }));
  };

  const changeDhikr = (id: string) => {
    setStats(prev => ({ ...prev, selectedDhikr: id, currentCount: 0 }));
  };

  const goalProgress = Math.min((stats.totalToday / stats.dailyGoal) * 100, 100);
  const dhikrProgress = Math.min((stats.currentCount / currentDhikr.target) * 100, 100);

  const last7Days = useMemo(() => {
    const days: { date: string; count: number; label: string }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = dateStr === getToday()
        ? stats.totalToday
        : (stats.history.find(h => h.date === dateStr)?.count || 0);
      days.push({
        date: dateStr,
        count,
        label: d.toLocaleDateString(isAr ? 'ar' : 'en', { weekday: 'short' }),
      });
    }
    return days;
  }, [stats.totalToday, stats.history, isAr]);

  const maxDayCount = Math.max(...last7Days.map(d => d.count), 1);

  return (
    <div>
      <main>
        <div className="container max-w-lg py-6">
          {/* Back */}
          <div className="mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {isAr ? 'رجوع' : 'Back'}
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
              <span className="text-2xl">📿</span>
            </div>
            <h1 className="font-arabic text-2xl md:text-3xl font-bold text-foreground mb-1">
              {isAr ? 'التسبيح الإلكتروني' : 'Digital Tasbeeh'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isAr ? 'سبّح واذكر الله مع تتبع أهدافك اليومية' : 'Remember Allah with daily goal tracking'}
            </p>
          </div>

          {/* Dhikr Selector */}
          <Select dir={direction} value={stats.selectedDhikr} onValueChange={changeDhikr}>
            <SelectTrigger className="mb-4">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto bg-popover">
              {DEFAULT_ADHKAR.map(d => (
                <SelectItem key={d.id} value={d.id}>
                  {isAr ? d.ar : d.en} ({d.target})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Counter Circle */}
          <div className="flex flex-col items-center mb-6">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleTap}
              className="relative w-52 h-52 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-primary/30 flex flex-col items-center justify-center select-none cursor-pointer active:border-primary transition-colors focus:outline-none focus:ring-4 focus:ring-ring"
              aria-label={isAr ? 'اضغط للتسبيح' : 'Tap to count'}
            >
              {/* Progress ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 208 208">
                <circle cx="104" cy="104" r="96" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                <circle
                  cx="104" cy="104" r="96" fill="none"
                  stroke="hsl(var(--primary))" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 96}
                  strokeDashoffset={2 * Math.PI * 96 * (1 - dhikrProgress / 100)}
                  className="transition-all duration-300"
                />
              </svg>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={stats.currentCount}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-5xl font-bold text-primary z-10"
                >
                  {stats.currentCount}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm text-muted-foreground z-10 mt-1">
                / {currentDhikr.target}
              </span>
            </motion.button>

            <p className="font-arabic text-xl mt-4 text-foreground font-semibold" dir="rtl">
              {isAr ? currentDhikr.ar : currentDhikr.en}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={resetCurrent} className="gap-1">
                <RotateCcw className="w-3.5 h-3.5" />
                {isAr ? 'إعادة' : 'Reset'}
              </Button>
              <Button
                variant={vibrateEnabled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setVibrateEnabled(!vibrateEnabled)}
                className="gap-1"
              >
                <Vibrate className="w-3.5 h-3.5" />
                {isAr ? 'اهتزاز' : 'Vibrate'}
              </Button>
            </div>
          </div>

          {/* Daily Goal */}
          <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {isAr ? 'الهدف اليومي' : 'Daily Goal'}
                </span>
              </div>
              <Select value={stats.dailyGoal.toString()} onValueChange={v =>
                setStats(prev => ({ ...prev, dailyGoal: parseInt(v) }))
              }>
                <SelectTrigger className="w-24 h-8"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {GOALS.map(g => (
                    <SelectItem key={g} value={g.toString()}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Progress value={goalProgress} className="h-3 mb-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats.totalToday} / {stats.dailyGoal}</span>
              <span>{Math.round(goalProgress)}%</span>
            </div>
            {goalProgress >= 100 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-2 text-primary text-sm font-semibold"
              >
                <Trophy className="w-4 h-4" />
                {isAr ? 'أحسنت! أكملت هدف اليوم 🎉' : 'Great job! Daily goal achieved 🎉'}
              </motion.div>
            )}
          </div>

          {/* Streak */}
          {stats.streak > 0 && (
            <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-lg">🔥</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isAr ? `سلسلة ${stats.streak} يوم` : `${stats.streak}-day streak`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAr ? 'استمر في الذكر يومياً!' : 'Keep remembering Allah daily!'}
                </p>
              </div>
            </div>
          )}

          {/* Stats Toggle */}
          <Button
            variant="ghost"
            className="w-full gap-2 mb-2"
            onClick={() => setShowStats(!showStats)}
          >
            <TrendingUp className="w-4 h-4" />
            {isAr ? 'الإحصائيات' : 'Statistics'}
            {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-muted/50 rounded-xl">
                      <p className="text-lg font-bold text-foreground">{stats.totalToday}</p>
                      <p className="text-xs text-muted-foreground">{isAr ? 'اليوم' : 'Today'}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-xl">
                      <p className="text-lg font-bold text-foreground">{stats.totalAllTime.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{isAr ? 'الإجمالي' : 'All Time'}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-xl">
                      <p className="text-lg font-bold text-foreground">{stats.streak}</p>
                      <p className="text-xs text-muted-foreground">{isAr ? 'سلسلة' : 'Streak'}</p>
                    </div>
                  </div>

                  {/* Bar Chart - Last 7 days */}
                  <h4 className="text-sm font-semibold text-foreground mb-3">
                    {isAr ? 'آخر 7 أيام' : 'Last 7 Days'}
                  </h4>
                  <div className="flex items-end justify-between gap-1 h-24">
                    {last7Days.map(day => (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">{day.count || ''}</span>
                        <div
                          className="w-full rounded-t-md bg-primary/20 transition-all min-h-[4px]"
                          style={{ height: `${(day.count / maxDayCount) * 80}px` }}
                        >
                          <div
                            className="w-full rounded-t-md bg-primary transition-all"
                            style={{ height: day.count >= stats.dailyGoal ? '100%' : '0%' }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{day.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Suggested Adhkar */}
          <div className="bg-card rounded-2xl border border-border/50 p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              {isAr ? 'أذكار مقترحة' : 'Suggested Adhkar'}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {DEFAULT_ADHKAR.filter(d => d.id !== stats.selectedDhikr).slice(0, 4).map(d => (
                <button
                  key={d.id}
                  onClick={() => changeDhikr(d.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors text-start"
                >
                  <div>
                    <p className="font-arabic text-foreground text-sm" dir="rtl">{d.ar}</p>
                    {!isAr && <p className="text-xs text-muted-foreground">{d.en}</p>}
                  </div>
                  <Badge variant="secondary" className="text-xs">{d.target}x</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
