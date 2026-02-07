import { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMushafStore } from '@/hooks/useMushafStore';
import { useTranslation } from '@/hooks/useTranslation';
import { surahNames, surahPageMap } from '@/lib/mushafApi';
import { searchQuran } from '@/lib/quranApi';

interface SearchResult {
  surah: number;
  surahName: string;
  surahNameAr: string;
  ayah: number;
  text: string;
  page: number;
}

interface MushafSearchProps {
  open: boolean;
  onClose: () => void;
}

export const MushafSearch = memo(function MushafSearch({
  open,
  onClose
}: MushafSearchProps) {
  const { language } = useTranslation();
  const { setCurrentPage } = useMushafStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'surah' | 'text'>('surah');

  // Filter surahs by name
  const filteredSurahs = surahNames.filter(surah => {
    const searchLower = query.toLowerCase();
    return (
      surah.name.toLowerCase().includes(searchLower) ||
      surah.nameAr.includes(query) ||
      surah.number.toString() === query
    );
  });

  // Search Quran text
  const handleTextSearch = useCallback(async () => {
    if (!query.trim() || query.length < 2) return;
    
    setIsSearching(true);
    try {
      const data = await searchQuran(query);
      if (data && data.matches) {
        const searchResults: SearchResult[] = data.matches.slice(0, 20).map((match: any) => {
          const surah = surahNames.find(s => s.number === match.surah.number);
          // Estimate page from surah
          const startPage = surahPageMap[match.surah.number];
          const nextSurahPage = surahPageMap[match.surah.number + 1] || 604;
          const ayahRatio = match.numberInSurah / match.surah.numberOfAyahs;
          const estimatedPage = Math.floor(startPage + (nextSurahPage - startPage) * ayahRatio);
          
          return {
            surah: match.surah.number,
            surahName: surah?.name || match.surah.englishName,
            surahNameAr: surah?.nameAr || match.surah.name,
            ayah: match.numberInSurah,
            text: match.text,
            page: Math.min(estimatedPage, 604)
          };
        });
        setResults(searchResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  // Go to result
  const goToResult = (page: number) => {
    setCurrentPage(page);
    onClose();
  };

  // Go to surah
  const goToSurah = (surahNumber: number) => {
    const page = surahPageMap[surahNumber];
    if (page) {
      setCurrentPage(page);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            {language === 'ar' ? 'البحث في المصحف' : 'Search Mushaf'}
          </DialogTitle>
        </DialogHeader>

        {/* Search Type Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={searchType === 'surah' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('surah')}
          >
            {language === 'ar' ? 'السور' : 'Surahs'}
          </Button>
          <Button
            variant={searchType === 'text' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSearchType('text')}
          >
            {language === 'ar' ? 'النص' : 'Text'}
          </Button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchType === 'text') {
                handleTextSearch();
              }
            }}
            placeholder={
              searchType === 'surah'
                ? (language === 'ar' ? 'ابحث عن سورة...' : 'Search for surah...')
                : (language === 'ar' ? 'ابحث في القرآن...' : 'Search in Quran...')
            }
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Text Search Button */}
        {searchType === 'text' && (
          <Button
            onClick={handleTextSearch}
            disabled={isSearching || query.length < 2}
            className="mt-2"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            {language === 'ar' ? 'بحث' : 'Search'}
          </Button>
        )}

        {/* Results */}
        <ScrollArea className="flex-1 mt-4">
          {searchType === 'surah' ? (
            // Surah Results
            <div className="space-y-2">
              {filteredSurahs.map((surah) => (
                <motion.button
                  key={surah.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => goToSurah(surah.number)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-right"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {surah.number}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">
                      {language === 'ar' ? surah.nameAr : surah.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? `صفحة ${surahPageMap[surah.number]}` : `Page ${surahPageMap[surah.number]}`}
                    </div>
                  </div>
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          ) : (
            // Text Results
            <div className="space-y-2">
              {results.map((result, index) => (
                <motion.button
                  key={`${result.surah}-${result.ayah}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => goToResult(result.page)}
                  className="w-full text-right p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-primary">
                      {language === 'ar' ? result.surahNameAr : result.surahName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({result.surah}:{result.ayah})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 arabic-text text-lg leading-relaxed">
                    {result.text}
                  </p>
                </motion.button>
              ))}
              
              {results.length === 0 && query && !isSearching && searchType === 'text' && (
                <div className="text-center py-8 text-muted-foreground">
                  {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});
