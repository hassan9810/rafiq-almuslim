import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMushafStore } from '@/hooks/useMushafStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  surahNames, 
  surahPageMap, 
  juzPageMap, 
  getJuzForPage,
  getSurahForPage,
  mushafEditions,
  MushafEdition
} from '@/lib/mushafApi';

interface MushafNavigatorProps {
  onPageChange?: (page: number) => void;
}

export const MushafNavigator = memo(function MushafNavigator({
  onPageChange
}: MushafNavigatorProps) {
  const { language } = useTranslation();
  const {
    currentPage,
    setCurrentPage,
    currentEdition,
    setCurrentEdition,
    viewMode
  } = useMushafStore();

  const [pageInput, setPageInput] = useState(currentPage.toString());

  const currentSurah = getSurahForPage(currentPage);
  const currentJuz = getJuzForPage(currentPage);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= currentEdition.startPage && page <= currentEdition.endPage) {
      setCurrentPage(page);
      onPageChange?.(page);
    }
  };

  const navigatePage = (delta: number) => {
    const step = viewMode === 'double' ? 2 : 1;
    const newPage = currentPage + (delta * step);
    if (newPage >= currentEdition.startPage && newPage <= currentEdition.endPage) {
      setCurrentPage(newPage);
      setPageInput(newPage.toString());
      onPageChange?.(newPage);
    }
  };

  const goToSurah = (surahNumber: string) => {
    const page = surahPageMap[parseInt(surahNumber)];
    if (page) {
      setCurrentPage(page);
      setPageInput(page.toString());
      onPageChange?.(page);
    }
  };

  const goToJuz = (juzNumber: string) => {
    const page = juzPageMap[parseInt(juzNumber)];
    if (page) {
      setCurrentPage(page);
      setPageInput(page.toString());
      onPageChange?.(page);
    }
  };

  const handleEditionChange = (editionId: string) => {
    const edition = mushafEditions.find(e => e.id === editionId);
    if (edition) {
      setCurrentEdition(edition);
      // Adjust page if out of bounds
      if (currentPage < edition.startPage) {
        setCurrentPage(edition.startPage);
        setPageInput(edition.startPage.toString());
      } else if (currentPage > edition.endPage) {
        setCurrentPage(edition.endPage);
        setPageInput(edition.endPage.toString());
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg px-4 py-3"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Edition Select */}
        <Select value={currentEdition.id} onValueChange={handleEditionChange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mushafEditions.map((edition) => (
              <SelectItem key={edition.id} value={edition.id}>
                {language === 'ar' ? edition.nameAr : edition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2">
          {/* Go to First Page */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigatePage(-currentPage + currentEdition.startPage)}
            disabled={currentPage <= currentEdition.startPage}
            className="h-9 w-9"
          >
            {language === 'ar' ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigatePage(language === 'ar' ? 1 : -1)}
            disabled={language === 'ar' ? currentPage >= currentEdition.endPage : currentPage <= currentEdition.startPage}
            className="h-9 w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Page Input */}
          <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
            <Input
              type="number"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              min={currentEdition.startPage}
              max={currentEdition.endPage}
              className="w-16 text-center h-9"
            />
            <span className="text-sm text-muted-foreground">
              / {currentEdition.endPage}
            </span>
          </form>

          {/* Next Page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigatePage(language === 'ar' ? -1 : 1)}
            disabled={language === 'ar' ? currentPage <= currentEdition.startPage : currentPage >= currentEdition.endPage}
            className="h-9 w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Go to Last Page */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigatePage(currentEdition.endPage - currentPage)}
            disabled={currentPage >= currentEdition.endPage}
            className="h-9 w-9"
          >
            {language === 'ar' ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick Navigation */}
        <div className="flex items-center gap-2">
          {/* Surah Select */}
          <Select onValueChange={goToSurah} value={currentSurah?.number.toString()}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={language === 'ar' ? 'السورة' : 'Surah'} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {surahNames.map((surah) => (
                <SelectItem key={surah.number} value={surah.number.toString()}>
                  {surah.number}. {language === 'ar' ? surah.nameAr : surah.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Juz Select */}
          <Select onValueChange={goToJuz} value={currentJuz.toString()}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder={language === 'ar' ? 'الجزء' : 'Juz'} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <SelectItem key={juz} value={juz.toString()}>
                  {language === 'ar' ? `الجزء ${juz}` : `Juz ${juz}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Current Position Info */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-4 h-4" />
          <span>
            {currentSurah && (language === 'ar' ? currentSurah.nameAr : currentSurah.name)}
          </span>
          <span className="text-primary">|</span>
          <span>
            {language === 'ar' ? `الجزء ${currentJuz}` : `Juz ${currentJuz}`}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
