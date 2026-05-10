import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Check, RotateCcw, Trophy, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from '@/components/ui/accordion';
import { useTranslation } from '@/hooks/useTranslation';
import { PageHeader } from '@/components/PageHeader';
import { useReadingPlanStore } from '@/store/useReadingPlanStore';
import { fetchPageAyahs, surahNames } from '@/lib/mushafApi';

// Quran has 604 pages, 30 juz
const TOTAL_PAGES = 604;

function DayAyahDetails({ startPage, endPage }: { startPage: number; endPage: number }) {
  const { t, language } = useTranslation();
  const isAr = language === 'ar';
  const [rangeInfo, setRangeInfo] = useState<{ start?: { surah: number; ayah: number }; end?: { surah: number; ayah: number } }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    const load = async () => {
      const [startData, endData] = await Promise.all([
        fetchPageAyahs(startPage),
        startPage === endPage ? Promise.resolve(null) : fetchPageAyahs(endPage),
      ]);
      if (!isActive) return;
      const startAyah = startData?.ayahs?.[0];
      const endAyahList = endData?.ayahs ?? startData?.ayahs ?? [];
      const endAyah = endAyahList[endAyahList.length - 1];
      setRangeInfo({
        start: startAyah ? { surah: startAyah.surah, ayah: startAyah.ayah } : undefined,
        end: endAyah ? { surah: endAyah.surah, ayah: endAyah.ayah } : undefined,
      });
      setLoading(false);
    };
    load();
    return () => { isActive = false; };
  }, [startPage, endPage]);

  const formatAyahRange = (value?: { surah: number; ayah: number }) => {
    if (!value) return '';
    const surah = surahNames.find((s) => s.number === value.surah);
    const surahLabel = surah ? (isAr ? surah.nameAr : surah.name) : String(value.surah);
    return `${t('surahName')} ${surahLabel} • ${t('ayahName')} ${value.ayah}`;
  };

  if (loading) return <div className="p-3 text-center text-xs text-muted-foreground animate-pulse">{isAr ? 'جاري الحساب...' : 'Calculating...'}</div>;

  return (
    <div className="px-2 py-1 space-y-1 text-xs">
      {rangeInfo?.start && (
        <p className="text-foreground"><span className="text-muted-foreground me-1">{isAr ? 'من:' : 'From:'}</span> {formatAyahRange(rangeInfo.start)}</p>
      )}
      {rangeInfo?.end && (
        <p className="text-foreground"><span className="text-muted-foreground me-1">{isAr ? 'إلى:' : 'To:'}</span> {formatAyahRange(rangeInfo.end)}</p>
      )}
    </div>
  );
}

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
  const [planMode, setPlanMode] = useState<'preset' | 'custom'>('preset');
  const [customDays, setCustomDays] = useState(10);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(TOTAL_PAGES);
  const [rangeInfo, setRangeInfo] = useState<{
    start?: { surah: number; ayah: number };
    end?: { surah: number; ayah: number };
  }>({});
  const [day1Info, setDay1Info] = useState<{
    start?: { surah: number; ayah: number };
    end?: { surah: number; ayah: number };
  }>({});
  const [todayRangeInfo, setTodayRangeInfo] = useState<{
    start?: { surah: number; ayah: number };
    end?: { surah: number; ayah: number };
  }>({});

  const planStartPage = planState?.startPage ?? 1;
  const planEndPage = planState?.endPage ?? TOTAL_PAGES;
  const planRangePages = Math.max(1, planEndPage - planStartPage + 1);
  const planPagesPerDay = planState ? Math.ceil(planRangePages / planState.planDays) : 0;

  const activePlan = PLANS.find(p => p.days === planState?.planDays && planStartPage === 1 && planEndPage === TOTAL_PAGES);
  const activePlanLabel = activePlan
    ? (isAr ? activePlan.label.ar : activePlan.label.en)
    : t('customPlan');

  const effectivePlanDays = planMode === 'custom' ? customDays : selectedPlanDays;
  const selectedRangePages = Math.max(1, endPage - startPage + 1);
  const selectedPagesPerDay = Math.ceil(selectedRangePages / effectivePlanDays);
  const calcDay1End = Math.min(startPage + selectedPagesPerDay - 1, endPage);

  const startPlan = () => {
    startPlanStore(effectivePlanDays, startPage, endPage);
  };

  const resetPlan = () => {
    resetPlanStore();
  };

  useEffect(() => {
    if (!planState) return;
    setStartPage(planState.startPage ?? 1);
    setEndPage(planState.endPage ?? TOTAL_PAGES);
  }, [planState]);

  useEffect(() => {
    let isActive = true;
    const loadRangeInfo = async () => {
      const [startData, endData, day1EndData] = await Promise.all([
        fetchPageAyahs(startPage),
        startPage === endPage ? Promise.resolve(null) : fetchPageAyahs(endPage),
        startPage === calcDay1End ? Promise.resolve(null) : fetchPageAyahs(calcDay1End),
      ]);
      if (!isActive) return;
      const startAyah = startData?.ayahs?.[0];
      
      const endAyahList = endData?.ayahs ?? startData?.ayahs ?? [];
      const endAyah = endAyahList[endAyahList.length - 1];

      const day1EndAyahList = day1EndData?.ayahs ?? startData?.ayahs ?? [];
      const day1EndAyah = day1EndAyahList[day1EndAyahList.length - 1];

      setRangeInfo({
        start: startAyah ? { surah: startAyah.surah, ayah: startAyah.ayah } : undefined,
        end: endAyah ? { surah: endAyah.surah, ayah: endAyah.ayah } : undefined,
      });
      setDay1Info({
        start: startAyah ? { surah: startAyah.surah, ayah: startAyah.ayah } : undefined,
        end: day1EndAyah ? { surah: day1EndAyah.surah, ayah: day1EndAyah.ayah } : undefined,
      });
    };
    loadRangeInfo();
    return () => {
      isActive = false;
    };
  }, [startPage, endPage, calcDay1End]);

  const formatAyahRange = (value?: { surah: number; ayah: number }) => {
    if (!value) return '';
    const surah = surahNames.find((s) => s.number === value.surah);
    const surahLabel = surah ? (isAr ? surah.nameAr : surah.name) : String(value.surah);
    return `${t('surahName')} ${surahLabel} • ${t('ayahName')} ${value.ayah}`;
  };

  const todayIndex = useMemo(() => {
    if (!planState) return 0;
    for (let i = 0; i < planState.planDays; i++) {
      if (!planState.completedDays.includes(i)) {
        return i;
      }
    }
    return planState.planDays - 1;
  }, [planState]);

  const todayStartPageAlloc = planState ? planStartPage + todayIndex * planPagesPerDay : 1;
  const todayEndPageAlloc = planState ? Math.min(planStartPage + (todayIndex + 1) * planPagesPerDay - 1, planEndPage) : 1;

  useEffect(() => {
    let isActive = true;
    if (!planState) return;
    const loadTodayRange = async () => {
      const [startData, endData] = await Promise.all([
        fetchPageAyahs(todayStartPageAlloc),
        todayStartPageAlloc === todayEndPageAlloc ? Promise.resolve(null) : fetchPageAyahs(todayEndPageAlloc),
      ]);
      if (!isActive) return;
      const startAyah = startData?.ayahs?.[0];
      const endAyahList = endData?.ayahs ?? startData?.ayahs ?? [];
      const endAyah = endAyahList[endAyahList.length - 1];
      setTodayRangeInfo({
        start: startAyah ? { surah: startAyah.surah, ayah: startAyah.ayah } : undefined,
        end: endAyah ? { surah: endAyah.surah, ayah: endAyah.ayah } : undefined,
      });
    };
    loadTodayRange();
    return () => { isActive = false; };
  }, [planState, todayStartPageAlloc, todayEndPageAlloc]);

  const progressPct = planState
    ? Math.round((planState.completedDays.length / planState.planDays) * 100)
    : 0;

  const isComplete = planState && planState.completedDays.length >= planState.planDays;

  return (
    <div>
      <main>
        <div className="container max-w-3xl py-6">
          <div className="mb-4">
            <Link to="/quran">
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
                      onClick={() => {
                        setSelectedPlanDays(plan.days);
                        setCustomDays(plan.days);
                        setStartPage(1);
                        setEndPage(TOTAL_PAGES);
                        setPlanMode('preset');
                      }}
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
                <div className="mt-6 rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-foreground">{t('customPlan')}</p>
                    <Badge variant={planMode === 'custom' ? 'default' : 'secondary'}>
                      {t('customDays')}
                    </Badge>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">{t('customDays')}</p>
                    <Input
                      type="number"
                      min={1}
                      max={365}
                      value={customDays}
                      onChange={(event) => {
                        const nextValue = Math.max(1, Math.min(365, Number(event.target.value) || 1));
                        setCustomDays(nextValue);
                        setStartPage(1);
                        setEndPage(TOTAL_PAGES);
                        setPlanMode('custom');
                        setSelectedPlanDays(0);
                      }}
                      className="h-9 w-full sm:w-1/2"
                    />
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-xl border border-border/50 bg-card p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">{t('planPreview')}</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{t('pageRange', { from: startPage, to: endPage })} ({t('pagesCount', { count: selectedRangePages })})</p>
                        {rangeInfo.start && (
                          <p className="text-foreground">{t('fromAyahRange', { range: formatAyahRange(rangeInfo.start) })}</p>
                        )}
                        {rangeInfo.end && (
                          <p className="text-foreground">{t('toAyahRange', { range: formatAyahRange(rangeInfo.end) })}</p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {t('dailyGoal')} - {t('pagesPerDay', { count: selectedPagesPerDay })}
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{t('readPages', { from: startPage, to: calcDay1End })}</p>
                        {day1Info.start && (
                          <p className="text-foreground">{t('fromAyahRange', { range: formatAyahRange(day1Info.start) })}</p>
                        )}
                        {day1Info.end && (
                          <p className="text-foreground">{t('toAyahRange', { range: formatAyahRange(day1Info.end) })}</p>
                        )}
                      </div>
                    </div>
                  </div>
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
                      {activePlanLabel}
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
              {!isComplete && (
                <div className="bg-card rounded-2xl border border-border/50 p-5">
                  <h3 className="font-semibold text-foreground mb-2">
                    {`📖 ${t('todaysReading', { day: todayIndex + 1 })}`}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {t('readPages', {
                      from: planStartPage + todayIndex * planPagesPerDay,
                      to: Math.min(planStartPage + (todayIndex + 1) * planPagesPerDay - 1, planEndPage),
                    })}
                  </p>
                  <div className="text-sm text-muted-foreground mb-3">
                    {todayRangeInfo.start && (
                      <p className="text-foreground">{t('fromAyahRange', { range: formatAyahRange(todayRangeInfo.start) })}</p>
                    )}
                    {todayRangeInfo.end && (
                      <p className="text-foreground">{t('toAyahRange', { range: formatAyahRange(todayRangeInfo.end) })}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/mushaf-text`} className="flex-1">
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
                    const isCurrentTarget = i === todayIndex;
                    const isLocked = i > todayIndex;
                    return (
                      <button
                        key={i}
                        disabled={isLocked}
                        onClick={() => toggleDay(i)}
                        className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                          done
                            ? 'bg-primary text-primary-foreground'
                            : isCurrentTarget
                              ? 'bg-primary/20 border-2 border-primary text-primary'
                              : isLocked
                                ? 'bg-muted/50 text-muted-foreground/30 cursor-not-allowed'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2">
                      <Calendar className="w-4 h-4" />
                      {t('planPreview')}
                    </Button>
                  </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto w-[95vw] sm:max-w-md rounded-2xl p-5" dir={isAr ? 'rtl' : 'ltr'}>
                    <DialogHeader>
                      <DialogTitle className="text-start">{t('planPreview')}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-3">
                      {Array.from({ length: planState.planDays }, (_, i) => {
                        const sPage = planStartPage + i * planPagesPerDay;
                        const ePage = Math.min(planStartPage + (i + 1) * planPagesPerDay - 1, planEndPage);
                        return (
                          <div key={i} className="rounded-xl border border-border/50 bg-card overflow-hidden">
                            <div className="bg-muted/30 px-4 py-2 border-b border-border/50 flex justify-between items-center text-sm">
                              <span className="font-semibold">{isAr ? 'اليوم' : 'Day'} {i + 1}</span>
                              <span className="text-muted-foreground text-xs ms-auto">
                                ({isAr ? 'صفحة' : 'Page'} {sPage} - {ePage})
                              </span>
                            </div>
                            <div className="p-2">
                              <DayAyahDetails startPage={sPage} endPage={ePage} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="ghost" onClick={resetPlan} className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive">
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
