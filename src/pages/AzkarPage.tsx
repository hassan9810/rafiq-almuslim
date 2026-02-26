import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Bed, Plane, RotateCcw, Check, ChevronLeft, ChevronRight, Vibrate, Mic2, BarChart3, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { useAzkarStore, type AzkarCategory as StoreAzkarCategory } from '@/store/useAzkarStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAzkarByCategory, Dhikr } from '@/lib/azkarData';
import { getIslamicDayKey } from '@/lib/islamicDay';

type Category = 'morning' | 'evening' | 'sleep' | 'travel' | 'general';

const categories: { id: Category; icon: any; labelEn: string; labelAr: string }[] = [
  { id: 'morning', icon: Sun, labelEn: 'Morning', labelAr: 'الصباح' },
  { id: 'evening', icon: Moon, labelEn: 'Evening', labelAr: 'المساء' },
  { id: 'sleep', icon: Bed, labelEn: 'Sleep', labelAr: 'النوم' },
  { id: 'travel', icon: Plane, labelEn: 'Travel', labelAr: 'السفر' },
  { id: 'general', icon: RotateCcw, labelEn: 'Tasbih', labelAr: 'التسبيح' },
];

export default function AzkarPage() {
  const { t, language } = useTranslation();
  const { direction, location } = useAppStore();
  const getDayState = useAzkarStore((s) => s.getDayState);
  const setDayState = useAzkarStore((s) => s.setDayState);

  const dayKey = getIslamicDayKey(location?.latitude ?? null, location?.longitude ?? null);

  const [activeCategory, setActiveCategory] = useState<Category>('morning');
  const [azkar, setAzkar] = useState<Dhikr[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState<Record<number, number>>({});
  const [tasbihCount, setTasbihCount] = useState(0);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  // Restore from store when Islamic day or category changes (same day = restore; new day = empty)
  useEffect(() => {
    const categoryAzkar = getAzkarByCategory(activeCategory);
    setAzkar(categoryAzkar);
    const dayState = getDayState(dayKey);
    const catState = dayState.byCategory[activeCategory];
    const countsNum: Record<number, number> = {};
    for (const [id, c] of Object.entries(catState.counts)) countsNum[Number(id)] = c;
    setCounts(countsNum);
    setCurrentIndex(Math.min(catState.currentIndex, Math.max(0, categoryAzkar.length - 1)));
    setTasbihCount(dayState.tasbihCount);
  }, [activeCategory, dayKey, getDayState]);

  const currentDhikr = azkar[currentIndex];
  const currentCount = counts[currentDhikr?.id] || 0;
  const isComplete = currentDhikr && currentCount >= currentDhikr.count;

  const vibrate = useCallback((pattern: number | number[]) => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, [vibrationEnabled]);

  const incrementCount = () => {
    if (!currentDhikr) return;
    
    const newCount = currentCount + 1;
    setCounts(prev => ({ ...prev, [currentDhikr.id]: newCount }));

    // Vibrate on milestones
    if (newCount === 33 || newCount === 99 || newCount === currentDhikr.count) {
      vibrate([100, 50, 100]);
    } else {
      vibrate(30);
    }

    // Auto-advance when complete
    if (newCount >= currentDhikr.count && currentIndex < azkar.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500);
    }
  };

  const handleTasbihClick = () => {
    const newCount = tasbihCount + 1;
    setTasbihCount(newCount);
    
    if (newCount % 33 === 0) {
      vibrate([100, 50, 100, 50, 100]);
    } else if (newCount % 11 === 0) {
      vibrate([50, 30, 50]);
    } else {
      vibrate(20);
    }
  };

  const resetTasbih = () => {
    setTasbihCount(0);
    vibrate([100, 100, 100]);
  };

  const goNext = () => {
    if (currentIndex < azkar.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Persist to store whenever counts, currentIndex, or tasbihCount change
  useEffect(() => {
    const countsStr: Record<string, number> = {};
    for (const [id, c] of Object.entries(counts)) countsStr[id] = c;
    const byCategory: Partial<Record<StoreAzkarCategory, { counts: Record<string, number>; currentIndex: number }>> = {
      [activeCategory]: { counts: countsStr, currentIndex },
    };
    setDayState(dayKey, { tasbihCount, byCategory });
  }, [dayKey, activeCategory, counts, currentIndex, tasbihCount, setDayState]);

  const completedCount = Object.entries(counts).filter(
    ([id, count]) => {
      const dhikr = azkar.find(d => d.id === parseInt(id));
      return dhikr && count >= dhikr.count;
    }
  ).length;

  const totalProgress = azkar.length > 0 ? (completedCount / azkar.length) * 100 : 0;

  return (
    <div>
      <main>
        <div className="container max-w-4xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Mic2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold mb-2">
              {t('azkar')}
            </h1>
            <p className="font-arabic text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'أذكار الصباح والمساء والنوم والسفر'
                : 'Morning, Evening, Sleep and Travel Remembrances'}
            </p>
          </motion.div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as Category)} className="space-y-6" dir={direction}>
            <TabsList className="grid grid-cols-5 w-full">
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex flex-col gap-1 py-3">
                  <cat.icon className="w-5 h-5" />
                  <span className="text-xs hidden sm:block">
                    {language === 'ar' ? cat.labelAr : cat.labelEn}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tasbih Counter - Special for General Category */}
            <AnimatePresence mode="wait">
              {activeCategory === 'general' ? (
                <TabsContent value="general" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="text-center">
                      <CardHeader>
                        <CardTitle className="font-arabic text-2xl">
                          {t('digitalTasbih')}
                        </CardTitle>
                        <CardDescription>
                          {t('digitalTasbihDescription')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Counter Display */}
                        <motion.button
                          onClick={handleTasbihClick}
                          whileTap={{ scale: 0.95 }}
                          className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl cursor-pointer hover:shadow-primary/25 transition-shadow"
                        >
                          <span className="text-6xl font-bold text-primary-foreground">
                            {tasbihCount}
                          </span>
                        </motion.button>

                        {/* Progress Indicators */}
                        <div className="flex justify-center gap-4">
                          <Badge variant={tasbihCount >= 33 ? 'default' : 'outline'}>33</Badge>
                          <Badge variant={tasbihCount >= 66 ? 'default' : 'outline'}>66</Badge>
                          <Badge variant={tasbihCount >= 99 ? 'default' : 'outline'}>99</Badge>
                          <Badge variant={tasbihCount >= 100 ? 'default' : 'outline'}>100</Badge>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4">
                          <Button variant="outline" onClick={resetTasbih}>
                            <RotateCcw className="w-4 h-4 me-2" />
                            {t('reset')}
                          </Button>
                          <Button
                            variant={vibrationEnabled ? 'default' : 'outline'}
                            onClick={() => setVibrationEnabled(!vibrationEnabled)}
                          >
                            <Vibrate className="w-4 h-4 me-2" />
                            {t('vibrate')}
                          </Button>
                        </div>

                        {/* Link to Advanced Tasbeeh */}
                        <Link to="/tasbeeh">
                          <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <BarChart3 className="w-5 h-5 text-primary" />
                                </div>
                                <div className="text-start">
                                  <p className="text-sm font-semibold text-foreground">
                                    {language === 'ar' ? 'المسبحة المتقدمة' : 'Advanced Tasbeeh'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {language === 'ar' ? 'إحصائيات يومية • أهداف • تتبع تقدمك' : 'Daily stats • Goals • Track your progress'}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>
                        </Link>

                        {/* Quick Azkar */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                          {azkar.map((dhikr) => (
                            <Card key={dhikr.id} className="text-center p-4">
                              <p className="font-arabic text-lg mb-2">{dhikr.text}</p>
                              <p className="text-sm text-muted-foreground">{dhikr.translation}</p>
                              <Badge className="mt-2">{dhikr.count}x</Badge>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              ) : (
                <TabsContent value={activeCategory} className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Progress Bar */}
                    <Card className="mb-4">
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {t('progress')}
                          </span>
                          <span className="text-sm font-medium">
                            {completedCount}/{azkar.length}
                          </span>
                        </div>
                        <Progress value={totalProgress} className="h-2" />
                      </CardContent>
                    </Card>

                    {/* Current Dhikr Card */}
                    {currentDhikr && (
                      <Card className="overflow-hidden">
                        <CardHeader className="bg-primary/5">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              {currentIndex + 1} / {azkar.length}
                            </Badge>
                            {isComplete && (
                              <Badge className="bg-green-500">
                                <Check className="w-3 h-3 me-1" />
                                {t('complete')}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                          {/* Arabic Text */}
                          <motion.button
                            onClick={incrementCount}
                            whileTap={{ scale: 0.98 }}
                            disabled={isComplete}
                            className="w-full text-center cursor-pointer disabled:cursor-default"
                          >
                            <p className="font-arabic text-2xl md:text-3xl leading-loose text-right" dir={direction}>
                              {currentDhikr.text}
                            </p>
                          </motion.button>

                          {/* Translation */}
                          {currentDhikr.translation && (
                            <p className="text-muted-foreground text-center">
                              {currentDhikr.translation}
                            </p>
                          )}

                          {/* Counter */}
                          <div className="flex items-center justify-center gap-4">
                            <motion.div
                              key={currentCount}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="text-4xl font-bold text-primary"
                            >
                              {currentCount}
                            </motion.div>
                            <span className="text-2xl text-muted-foreground">/</span>
                            <span className="text-2xl text-muted-foreground">{currentDhikr.count}</span>
                          </div>

                          {/* Progress for this dhikr */}
                          <Progress 
                            value={(currentCount / currentDhikr.count) * 100} 
                            className="h-3"
                          />

                          {/* Reference */}
                          {currentDhikr.reference && (
                            <p className="text-xs text-center text-muted-foreground">
                              {currentDhikr.reference}
                            </p>
                          )}

                          {/* Navigation */}
                          <div className="flex items-center justify-between pt-4">
                            <Button
                              variant="outline"
                              onClick={goPrev}
                              disabled={currentIndex === 0}
                            >
                              <ChevronLeft className="w-4 h-4 me-1" />
                              {t('previous')}
                            </Button>
                            
                            <Button
                              onClick={incrementCount}
                              disabled={isComplete}
                              size="lg"
                              className="px-8"
                            >
                              {t('count')}
                            </Button>

                            <Button
                              variant="outline"
                              onClick={goNext}
                              disabled={currentIndex === azkar.length - 1}
                            >
                              {t('next')}
                              <ChevronRight className="w-4 h-4 ms-1" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
        </div>
      </main>

    </div>
  );
}
