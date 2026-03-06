import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { morningAzkar, eveningAzkar, type Dhikr } from '@/lib/azkarData';

function getDaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function DhikrOfTheDay() {
  const { language } = useTranslation();
  const [counter, setCounter] = useState(0);

  const dhikr: Dhikr = useMemo(() => {
    const hour = new Date().getHours();
    const pool = hour < 15 ? morningAzkar : eveningAzkar;
    const idx = getDaySeed() % pool.length;
    return pool[idx];
  }, []);

  const remaining = Math.max(0, dhikr.count - counter);
  const progress = dhikr.count > 1 ? Math.min(100, (counter / dhikr.count) * 100) : 0;

  const handleTap = () => {
    if (counter < dhikr.count) setCounter(c => c + 1);
  };

  const handleReset = () => setCounter(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden bg-card rounded-2xl border border-border/50 shadow-card"
    >
      {/* Progress bar top */}
      <div className="h-1.5 bg-muted">
        <motion.div
          className="h-full bg-gradient-to-r from-accent to-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Heart className="w-4 h-4 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">
              {language === 'ar' ? 'ذكر اليوم' : 'Dhikr of the Day'}
            </h3>
          </div>
          {dhikr.count > 1 && (
            <button
              onClick={handleReset}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dhikr text */}
        <div
          className="cursor-pointer select-none"
          onClick={handleTap}
        >
          <p
            className="font-arabic text-lg md:text-xl leading-loose text-foreground text-right"
            dir="rtl"
            style={{ lineHeight: '2.2' }}
          >
            {dhikr.text}
          </p>

          {language === 'en' && dhikr.translation && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              {dhikr.translation}
            </p>
          )}
        </div>

        {/* Counter */}
        {dhikr.count > 1 && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">
              {dhikr.reference}
            </span>
            <motion.button
              onClick={handleTap}
              whileTap={{ scale: 0.9 }}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                remaining === 0
                  ? 'bg-primary/10 text-primary'
                  : 'bg-accent/10 text-accent hover:bg-accent/20'
              }`}
            >
              {remaining === 0
                ? (language === 'ar' ? '✓ تم' : '✓ Done')
                : `${counter} / ${dhikr.count}`}
            </motion.button>
          </div>
        )}

        {dhikr.count <= 1 && dhikr.reference && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <span className="text-xs text-muted-foreground">{dhikr.reference}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
