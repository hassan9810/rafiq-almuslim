import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Check, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/PageHeader';
import { useReadingPlanStore } from '@/store/useReadingPlanStore';

// Quran has 604 pages, 30 juz
const TOTAL_PAGES = 604;

interface ReadingPlan {
  days: number;
  pagesPerDay: number;
  label: { ar: string; en: string };
}

const PLANS: ReadingPlan[] = [
  { days: 7, pagesPerDay: Math.ceil(TOTAL_PAGES / 7), label: { ar: 'ختمة في أسبوع', en: 'Khatmah in 7 Days' } },
  { days: 15, pagesPerDay: Math.ceil(TOTAL_PAGES / 15), label: { ar: 'ختمة في 15 يوم', en: 'Khatmah in 15 Days' } },
  { days: 30, pagesPerDay: Math.ceil(TOTAL_PAGES / 30), label: { ar: 'ختمة في شهر', en: 'Khatmah in 30 Days' } },
  { days: 60, pagesPerDay: Math.ceil(TOTAL_PAGES / 60), label: { ar: 'ختمة في شهرين', en: 'Khatmah in 60 Days' } },
];

export default function ReadingPlanPage() {
  const { t, language } = useTranslation();
  const isAr = language === 'ar';

  const { plan: planState, startPlan: startPlanStore, resetPlan: resetPlanStore, toggleDay } = useReadingPlanStore();
  const [selectedPlanDays, setSelectedPlanDays] = useState(30);

  const activePlan = PLANS.find(p => p.days === planState?.planDays);

  const startPlan = () => {
    startPlanStore(selectedPlanDays);
  };

  const resetPlan = () => {
    resetPlanStore();
  };

  const todayIndex = useMemo(() => {
    if (!planState) return 0;
    const start = new Date(planState.startDate);
    const now = new Date();
    const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.min(diff, planState.planDays - 1);
  }, [planState]);

  const progressPct = planState
    ? Math.round((planState.completedDays.length / planState.planDays) * 100)
    : 0;

  const isComplete = planState && planState.completedDays.length >= planState.planDays;

  return (
    <div>
      <main>
        <div className="container max-w-3xl py-6">
          <div className="mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t('back')}
              </Button>
            </Link>
          </div>

          {/* Header */}
          <PageHeader
            icon={Calendar}
            title={t('dailyReadingPlan')}
            subtitle={t('readingPlanSubtitle')}
          />

          {!planState ? (
            /* Plan Selection */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="bg-card rounded-2xl border border-border/50 p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {t('chooseYourPlan')}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {PLANS.map(plan => (
                    <button
                      key={plan.days}
                      onClick={() => setSelectedPlanDays(plan.days)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        selectedPlanDays === plan.days
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <p className="font-bold text-lg text-foreground">{plan.days}</p>
                      <p className="text-xs text-muted-foreground">{t('days')}</p>
                      <p className="text-sm font-medium text-primary mt-1">
                        {t('pagesPerDay', { count: plan.pagesPerDay })}
                      </p>
                    </button>
                  ))}
                </div>
                <Button className="w-full mt-6" size="lg" onClick={startPlan}>
                  <Calendar className="w-5 h-5 me-2" />
                  {t('startPlan')}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Active Plan */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Progress Card */}
              <div className="hero-gradient rounded-3xl p-6 text-center islamic-pattern">
                {isComplete ? (
                  <>
                    <Trophy className="w-12 h-12 text-primary-foreground mx-auto mb-2" />
                    <h2 className="text-2xl font-bold text-primary-foreground">
                      {t('congratsKhatmah')}
                    </h2>
                  </>
                ) : (
                  <>
                    <p className="text-primary-foreground/70 text-sm mb-1">
                      {isAr ? activePlan?.label.ar : activePlan?.label.en}
                    </p>
                    <p className="text-5xl font-bold text-primary-foreground mb-1">{progressPct}%</p>
                    <p className="text-primary-foreground/80 text-sm">
                      {planState.completedDays.length} / {planState.planDays} {t('days')}
                    </p>
                    <div className="mt-3 h-3 bg-primary-foreground/20 rounded-full overflow-hidden max-w-xs mx-auto">
                      <div className="h-full bg-primary-foreground rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                  </>
                )}
              </div>

              {/* Today's Assignment */}
              {!isComplete && activePlan && (
                <div className="bg-card rounded-2xl border border-border/50 p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    {`📖 ${t('todaysReading', { day: todayIndex + 1 })}`}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {t('readPages', { from: todayIndex * activePlan.pagesPerDay + 1, to: Math.min((todayIndex + 1) * activePlan.pagesPerDay, TOTAL_PAGES) })}
                  </p>
                  <div className="flex gap-2">
                    <Link to={`/mushaf`} className="flex-1">
                      <Button variant="outline" className="w-full gap-2">
                        <BookOpen className="w-4 h-4" />
                        {t('openMushaf')}
                      </Button>
                    </Link>
                    <Button
                      onClick={() => toggleDay(todayIndex)}
                      variant={planState.completedDays.includes(todayIndex) ? 'default' : 'outline'}
                      className="gap-2"
                    >
                      <Check className="w-4 h-4" />
                      {planState.completedDays.includes(todayIndex)
                        ? t('done')
                        : t('completeDayAction')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Days Grid */}
              <div className="bg-card rounded-2xl border border-border/50 p-5">
                <h3 className="font-semibold text-foreground mb-3">
                  {t('dailyProgress')}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: planState.planDays }, (_, i) => {
                    const done = planState.completedDays.includes(i);
                    const isToday = i === todayIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => toggleDay(i)}
                        className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                          done
                            ? 'bg-primary text-primary-foreground'
                            : isToday
                              ? 'bg-primary/20 border-2 border-primary text-primary'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset */}
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={resetPlan} className="gap-2 text-muted-foreground">
                  <RotateCcw className="w-4 h-4" />
                  {t('resetPlan')}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
