import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2, BookOpen, Hash, ArrowRight, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from '@/hooks/useTranslation';
import { initQuranSearch, performAdvancedQuranSearch } from '@/lib/quranSearchApi';
import { type ScoredQuranText, getHighlightRanges, normalizeArabic } from 'quran-search-engine';


function computeFinalScore(
  result: ScoredQuranText,
  query: string
): number {
  const normalizedQuery = normalizeArabic(query).trim();
  const normalizedVerse = normalizeArabic(result.standard).trim();

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const verseTokens = normalizedVerse.split(/\s+/).filter(Boolean);

  let score = result.matchScore;

  // 1. Exact Phrase Boost (Strongest Signal)
  if (normalizedVerse.includes(normalizedQuery)) {
    score += 50;
  }

  // 2. Starts With Boost
  if (normalizedVerse.startsWith(normalizedQuery)) {
    score += 30;
  }

  // 3. Ordered Adjacent Tokens Boost
  const phrasePattern = queryTokens.join(" ");
  if (normalizedVerse.includes(phrasePattern)) {
    score += 20;
  }

  // 4. Coverage Boost (All Tokens Matched)
  const matchedCount = queryTokens.filter(token =>
    verseTokens.includes(token)
  ).length;

  if (matchedCount === queryTokens.length) {
    score += 15;
  }

  // 5. Early Position Boost
  const firstMatchIndex = verseTokens.findIndex(token =>
    queryTokens.includes(token)
  );

  if (firstMatchIndex >= 0) {
    score += Math.max(10 - firstMatchIndex, 0);
  }

  // 6. Noise Penalty
  const noise = result.matchedTokens.length - queryTokens.length;
  if (noise > 3) {
    score -= noise;
  }

  return score;
}

/**
 * Renders Quranic text with highlights based on search matches.
 */
function HighlightedVerse({ verse }: { verse: ScoredQuranText }) {
  const ranges = getHighlightRanges(verse.uthmani, verse.matchedTokens, verse.tokenTypes);

  if (ranges.length === 0) return <>{verse.uthmani}</>;

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range, i) => {
    if (cursor < range.start) {
      parts.push(verse.uthmani.slice(cursor, range.start));
    }

    const highlightClass =
      range.matchType === 'exact' ? 'bg-primary/20 text-primary-foreground font-bold rounded px-0.5' :
        range.matchType === 'lemma' ? 'bg-amber-200/40 text-amber-900 rounded px-0.5' :
          'bg-blue-200/40 text-blue-900 rounded px-0.5';

    parts.push(
      <span key={`${range.start}-${range.end}-${i}`} className={highlightClass}>
        {verse.uthmani.slice(range.start, range.end)}
      </span>
    );

    cursor = range.end;
  });

  if (cursor < verse.uthmani.length) {
    parts.push(verse.uthmani.slice(cursor));
  }

  return <>{parts}</>;
}

export default function SearchPage() {
  const { t, language, direction } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ScoredQuranText[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isEnglishWarning, setIsEnglishWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: searchContext, isLoading: isLoadingDataset } = useQuery({
    queryKey: ['quran-search-context'],
    queryFn: initQuranSearch,
    staleTime: Infinity,
  });

  // Scroll to top when results change
  useEffect(() => {
    if (results.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [results.length]);

  useEffect(() => {
    if (!searchContext || query.trim().length < 2 || isEnglishWarning) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await performAdvancedQuranSearch(query, searchContext);

        const sortedResults = [...response.results]
          .map(result => ({
            ...result,
            finalScore: computeFinalScore(result, query)
          }))
          .sort((a, b) => b.finalScore - a.finalScore);

        setResults(sortedResults as ScoredQuranText[]);
        setSearchParams({ q: query }, { replace: true });
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, searchContext, setSearchParams, isEnglishWarning]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const containsEnglish = /[a-zA-Z]/.test(value);
    setIsEnglishWarning(containsEnglish);
    setQuery(value);
  };

  const handleResultClick = (result: ScoredQuranText) => {
    navigate(`/quran/${result.sura_id}?ayah=${result.aya_id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Search className="w-8 h-8 text-primary" />
            {t('search')}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar'
              ? 'ابحث في نص القرآن الكريم باستخدام الكلمات أو الجذور'
              : 'Search the Quran text using words or roots'}
          </p>
        </div>

        <div className="sticky top-24 z-30 bg-background/95 backdrop-blur-sm pb-4 -mx-2 px-2">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              ref={inputRef}
              autoFocus
              value={query}
              onChange={handleInputChange}
              placeholder={t('searchPlaceholder')}
              className="pl-12 pr-12 h-14 text-xl rounded-2xl border-primary/20 shadow-sm focus-visible:ring-primary/30 transition-all bg-card"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-transparent"
                onClick={() => {
                  setQuery('');
                  setIsEnglishWarning(false);
                  setSearchParams({}, { replace: true });
                  inputRef.current?.focus();
                }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            )}
          </div>

          <AnimatePresence>
            {isEnglishWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm font-bold">
                    {language === 'ar' ? 'تنبيه: الكتابة باللغة الإنجليزية' : 'Warning: English detected'}
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    {language === 'ar'
                      ? 'يرجى استخدام الحروف العربية فقط للبحث في نص القرآن الكريم.'
                      : 'Please use Arabic characters only to search in the Quran text.'}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                {isLoadingDataset ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {language === 'ar' ? 'جاري تحميل محرك البحث...' : 'Initializing search engine...'}
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {language === 'ar' ? 'المحرك الذكي جاهز' : 'Smart engine ready'}
                  </>
                )}
              </span>
            </div>

            {results.length > 0 && (
              <Badge variant="secondary" className="font-medium text-primary bg-primary/10 border-primary/20">
                {language === 'ar'
                  ? `تم العثور على ${results.length} نتيجة`
                  : `Found ${results.length} results`}
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">
                {language === 'ar' ? 'جاري البحث في آيات الله...' : 'Searching through the verses...'}
              </p>
            </div>
          ) : results.length > 0 ? (
            <ScrollArea className="h-auto">
              <div className="grid gap-4 pb-10">
                {results.map((result, index) => (
                  <motion.button
                    key={`${result.sura_id}:${result.aya_id}:${index}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.4) }}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-right p-5 md:p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-md transition-all group relative overflow-hidden flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0 h-5 border-primary/20 text-primary">
                          {t('juz')} {result.juz_id}
                        </Badge>
                        {result.matchType && result.matchType !== 'exact' && (
                          <Badge variant="outline" className="text-[10px] py-0 h-5 bg-amber-50 text-amber-700 border-amber-200">
                            {result.matchType === 'lemma' ? (language === 'ar' ? 'كلمة' : 'lemma') : (language === 'ar' ? 'جذر' : 'root')}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        <span className="font-arabic">{result.sura_name}</span>
                        <span className="text-sm opacity-60 font-medium">({result.aya_id})</span>
                      </div>
                    </div>

                    <p className="text-2xl leading-relaxed arabic-text text-foreground/90 font-medium">
                      <HighlightedVerse verse={result} />
                    </p>

                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-primary font-medium flex items-center gap-1">
                        {language === 'ar' ? 'عرض السورة' : 'View Surah'}
                        <ArrowRight className={`w-3 h-3 ${direction === 'rtl' ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          ) : query.trim().length >= 2 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-dashed border-border/60">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('noSearchResults')}</h3>
              <p className="text-muted-foreground max-w-sm px-6">
                {language === 'ar'
                  ? 'لم نجد نتائج مطابقة لبحثك. جرب استخدام كلمات أبسط أو ابحث عن الجذر.'
                  : 'We couldn\'t find any matches. Try using simpler keywords or search for the word root.'
                }
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center opacity-40">
              <Hash className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">
                {language === 'ar'
                  ? 'ابدأ بكتابة أي كلمة من القرآن الكريم'
                  : 'Start typing any word from the Holy Quran'}
              </p>
              <p className="text-sm mt-1">
                {language === 'ar'
                  ? 'مثل: "الحمد"، "الرحمن"، "يؤمنون"'
                  : 'Example: "Alhamdulillah", "Rahman", "Believe"'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
