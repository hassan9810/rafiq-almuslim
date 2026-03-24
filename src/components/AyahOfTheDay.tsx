import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, RefreshCw, Share2, Copy } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSeasonalAyahList, TOTAL_QURAN_AYAHS } from '@/data/curatedAyahs';

interface AyahData {
  text: string;
  surah: { number: number; name: string; englishName: string };
  numberInSurah: number;
  translation?: string;
}

function getDaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

/**
 * Get ayah reference for today using hybrid approach:
 * - 80% from curated list (seasonal or general)
 * - 20% random from entire Quran (for variety and discovery)
 */
function getTodayAyahReference(): { surah: number; ayah: number } {
  const seed = getDaySeed();
  const curatedList = getSeasonalAyahList();

  // Use modulo to determine if we use curated (0-7) or random (8-9)
  const useRandom = (seed % 10) >= 8; // 20% chance

  if (useRandom) {
    // Random ayah from entire Quran
    // This is a simplified approach - we return a number from 1-6236
    // which will need conversion to surah:ayah in the API call
    const ayahNumber = (seed % TOTAL_QURAN_AYAHS) + 1;
    // For the random approach, we'll use the global ayah number
    return { surah: 0, ayah: ayahNumber }; // surah=0 means use global number
  } else {
    // Pick from curated list
    const index = Math.floor(seed / 10) % curatedList.length;
    return curatedList[index];
  }
}

export function AyahOfTheDay() {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [ayah, setAyah] = useState<AyahData | null>(null);
  const [loading, setLoading] = useState(true);

  const ayahRef = useMemo(() => getTodayAyahReference(), []);

  useEffect(() => {
    let cancelled = false;
    async function fetchAyah() {
      setLoading(true);
      try {
        let arRes, enRes;

        if (ayahRef.surah === 0) {
          // Random mode: use global ayah number (1-6236)
          arRes = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahRef.ayah}/quran-simple`);
          enRes = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahRef.ayah}/en.sahih`);
        } else {
          // Curated mode: use surah:ayah reference
          arRes = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahRef.surah}:${ayahRef.ayah}/quran-simple`);
          enRes = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahRef.surah}:${ayahRef.ayah}/en.sahih`);
        }

        const arData = await arRes.json();
        const enData = await enRes.json();
        if (!cancelled && arData.data) {
          setAyah({
            text: arData.data.text,
            surah: arData.data.surah,
            numberInSurah: arData.data.numberInSurah,
            translation: enData.data?.text,
          });
        }
      } catch (e) {
        console.error('Failed to fetch ayah of the day:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAyah();
    return () => { cancelled = true; };
  }, [ayahRef]);

  const handleCopy = () => {
    if (!ayah) return;
    const text = `${ayah.text}\n\n— ${ayah.surah.name} (${ayah.numberInSurah})`;
    navigator.clipboard.writeText(text);
    toast({ title: language === 'ar' ? 'تم النسخ' : 'Copied!' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden bg-card rounded-2xl border border-border/50 shadow-card"
    >
      {/* Decorative top accent */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="p-5 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">
              {language === 'ar' ? 'آية اليوم' : 'Ayah of the Day'}
            </h3>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy} disabled={!ayah}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-6 bg-muted rounded w-full" />
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2 mt-4" />
          </div>
        ) : ayah ? (
          <div className="space-y-4">
            {/* Arabic text */}
            <p
              className="font-arabic text-xl md:text-2xl leading-loose text-foreground text-right uthmani-text"
              dir="rtl"
              style={{ lineHeight: '2.2' }}
            >
              {ayah.text}
            </p>

            {/* Translation */}
            {language === 'en' && ayah.translation && (
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                {ayah.translation}
              </p>
            )}

            {/* Reference */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="text-xs text-primary font-medium">
                {ayah.surah.name} — {language === 'ar' ? 'الآية' : 'Ayah'} {ayah.numberInSurah}
              </span>
              <span className="text-xs text-muted-foreground">
                {ayah.surah.englishName}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {language === 'ar' ? 'تعذر تحميل الآية' : 'Failed to load ayah'}
          </p>
        )}
      </div>
    </motion.div>
  );
}
