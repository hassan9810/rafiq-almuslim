import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen,
  Loader2,
  ArrowLeft,
  Languages,
  Info
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  fetchSurahTranslation,
  fetchAvailableTranslations,
  TranslationEdition,
  TranslationAyah
} from '@/lib/quranEncApi';
import { fetchSurahs, Surah } from '@/lib/quranApi';

export default function TranslationReaderPage() {
  const { translationKey, surahNumber } = useParams();
  const navigate = useNavigate();
  const { language } = useTranslation();
  const { direction } = useAppStore();
  
  const [translation, setTranslation] = useState<TranslationEdition | null>(null);
  const [translations, setTranslations] = useState<TranslationEdition[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahs, setAyahs] = useState<TranslationAyah[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);

  const isArabic = language === 'ar';
  const surahNum = surahNumber ? parseInt(surahNumber) : 1;

  // Load translations list and surahs on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [translationsData, surahsData] = await Promise.all([
          fetchAvailableTranslations(undefined, language === 'ar' ? 'ar' : 'en'),
          fetchSurahs()
        ]);
        setTranslations(translationsData);
        setSurahs(surahsData);
        
        // Find current translation
        if (translationKey) {
          const found = translationsData.find(t => t.key === translationKey);
          setTranslation(found || null);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    loadInitialData();
  }, [language, translationKey]);

  // Load surah translation when params change
  useEffect(() => {
    const loadSurahTranslation = async () => {
      if (!translationKey || !surahNumber) return;
      
      setLoadingAyahs(true);
      try {
        const data = await fetchSurahTranslation(translationKey, surahNum);
        setAyahs(data);
      } catch (error) {
        console.error('Error loading surah translation:', error);
      } finally {
        setLoadingAyahs(false);
        setLoading(false);
      }
    };
    loadSurahTranslation();
  }, [translationKey, surahNumber, surahNum]);

  const currentSurah = surahs.find(s => s.number === surahNum);

  const goToSurah = (num: number) => {
    if (num >= 1 && num <= 114) {
      navigate(`/translations/${translationKey}/${num}`);
    }
  };

  const changeTranslation = (key: string) => {
    navigate(`/translations/${key}/${surahNum}`);
  };

  if (loading && !ayahs.length) {
    return (
      <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
        <Header />
        <main className="pt-20 pb-16">
          <div className="container max-w-4xl">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-1/2" />
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link to="/translations" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" />
            {isArabic ? 'العودة للترجمات' : 'Back to Translations'}
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Languages className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold line-clamp-1">
                  {translation?.title || translationKey}
                </h1>
                {translation?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {translation.description}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Surah Selector */}
            <Select value={surahNum.toString()} onValueChange={(v) => goToSurah(parseInt(v))}>
              <SelectTrigger className="flex-1">
                <BookOpen className="w-4 h-4 mr-2" />
                <SelectValue placeholder={isArabic ? 'اختر السورة' : 'Select Surah'} />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50 max-h-[300px]">
                {surahs.map((surah) => (
                  <SelectItem key={surah.number} value={surah.number.toString()}>
                    {surah.number}. {isArabic ? surah.name : surah.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Translation Selector */}
            <Select value={translationKey} onValueChange={changeTranslation}>
              <SelectTrigger className="flex-1">
                <Languages className="w-4 h-4 mr-2" />
                <SelectValue placeholder={isArabic ? 'اختر الترجمة' : 'Select Translation'} />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50 max-h-[300px]">
                {translations.map((t) => (
                  <SelectItem key={t.key} value={t.key}>
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Surah Info */}
          {currentSurah && (
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold font-arabic">{currentSurah.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {currentSurah.englishName} - {currentSurah.englishNameTranslation}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {currentSurah.numberOfAyahs} {isArabic ? 'آية' : 'verses'}
                    </Badge>
                    <Badge variant="outline">
                      {currentSurah.revelationType === 'Meccan' 
                        ? (isArabic ? 'مكية' : 'Meccan')
                        : (isArabic ? 'مدنية' : 'Medinan')
                      }
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ayahs */}
          {loadingAyahs ? (
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {ayahs.map((ayah, index) => (
                <motion.div
                  key={ayah.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      {/* Ayah Number */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">{ayah.aya}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {isArabic ? 'آية' : 'Verse'} {ayah.aya}
                        </Badge>
                      </div>

                      {/* Arabic Text */}
                      <p className="text-xl md:text-2xl font-arabic leading-loose mb-4 text-foreground" dir="rtl">
                        {ayah.arabic_text}
                        <span className="inline-block mx-2 text-primary">
                          ﴿{parseInt(ayah.aya).toLocaleString('ar-EG')}﴾
                        </span>
                      </p>

                      {/* Translation */}
                      <p 
                        className="text-base leading-relaxed text-muted-foreground"
                        dir={translation?.direction || 'ltr'}
                      >
                        {ayah.translation}
                      </p>

                      {/* Footnotes */}
                      {ayah.footnotes && (
                        <Accordion type="single" collapsible className="mt-4">
                          <AccordionItem value="footnotes" className="border-none">
                            <AccordionTrigger className="py-2 text-sm text-primary hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                {isArabic ? 'الحواشي' : 'Footnotes'}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground whitespace-pre-wrap">
                                {ayah.footnotes}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-4">
            <Button
              variant="outline"
              onClick={() => goToSurah(surahNum - 1)}
              disabled={surahNum <= 1}
              className="flex-1"
            >
              <ChevronRight className="w-4 h-4 ml-2" />
              {isArabic ? 'السورة السابقة' : 'Previous Surah'}
            </Button>
            <Button
              variant="outline"
              onClick={() => goToSurah(surahNum + 1)}
              disabled={surahNum >= 114}
              className="flex-1"
            >
              {isArabic ? 'السورة التالية' : 'Next Surah'}
              <ChevronLeft className="w-4 h-4 mr-2" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
