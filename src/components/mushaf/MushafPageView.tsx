import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMushafStore } from '@/hooks/useMushafStore';
import { useTranslation } from '@/hooks/useTranslation';
import { getPageUrl, hasSajda, getSurahForPage, getJuzForPage } from '@/lib/mushafApi';

interface MushafPageViewProps {
  onSwipe?: (direction: 'left' | 'right') => void;
}

export const MushafPageView = memo(function MushafPageView({
  onSwipe
}: MushafPageViewProps) {
  const { language } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingPages, setLoadingPages] = useState<Set<number>>(new Set());
  const [errorPages, setErrorPages] = useState<Set<number>>(new Set());

  const {
    currentPage,
    setCurrentPage,
    currentEdition,
    viewMode,
    zoom,
    settings,
    isBookmarked
  } = useMushafStore();

  // Preload adjacent pages
  useEffect(() => {
    const pagesToPreload = [currentPage - 2, currentPage - 1, currentPage + 1, currentPage + 2];
    pagesToPreload.forEach(page => {
      if (page >= currentEdition.startPage && page <= currentEdition.endPage) {
        const img = new Image();
        img.src = getPageUrl(currentEdition, page);
      }
    });
  }, [currentPage, currentEdition]);

  // Handle keyboard navigation
  const handleKeyNav = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      const delta = viewMode === 'double' ? 2 : 1;
      const newPage = language === 'ar' ? currentPage + delta : currentPage - delta;
      if (newPage >= currentEdition.startPage && newPage <= currentEdition.endPage) {
        setCurrentPage(newPage);
      }
    } else if (e.key === 'ArrowRight') {
      const delta = viewMode === 'double' ? 2 : 1;
      const newPage = language === 'ar' ? currentPage - delta : currentPage + delta;
      if (newPage >= currentEdition.startPage && newPage <= currentEdition.endPage) {
        setCurrentPage(newPage);
      }
    }
  }, [currentPage, currentEdition, viewMode, language, setCurrentPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNav);
    return () => window.removeEventListener('keydown', handleKeyNav);
  }, [handleKeyNav]);

  // Handle image load
  const handleImageLoad = (page: number) => {
    setLoadingPages(prev => {
      const next = new Set(prev);
      next.delete(page);
      return next;
    });
  };

  // Handle image error
  const handleImageError = (page: number) => {
    setLoadingPages(prev => {
      const next = new Set(prev);
      next.delete(page);
      return next;
    });
    setErrorPages(prev => new Set(prev).add(page));
  };

  // Start loading for page
  const startLoading = (page: number) => {
    setLoadingPages(prev => new Set(prev).add(page));
    setErrorPages(prev => {
      const next = new Set(prev);
      next.delete(page);
      return next;
    });
  };

  // Handle swipe gesture
  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        onSwipe?.(language === 'ar' ? 'right' : 'left');
      } else {
        onSwipe?.(language === 'ar' ? 'left' : 'right');
      }
    }
  };

  // Navigate pages
  const navigatePrev = () => {
    const delta = viewMode === 'double' ? 2 : 1;
    const newPage = currentPage - delta;
    if (newPage >= currentEdition.startPage) {
      setCurrentPage(newPage);
    }
  };

  const navigateNext = () => {
    const delta = viewMode === 'double' ? 2 : 1;
    const newPage = currentPage + delta;
    if (newPage <= currentEdition.endPage) {
      setCurrentPage(newPage);
    }
  };

  // Page component
  const PageImage = ({ page, position }: { page: number; position: 'left' | 'right' | 'single' }) => {
    const isLoading = loadingPages.has(page);
    const hasError = errorPages.has(page);
    const pageHasSajda = hasSajda(page);
    const pageSurah = getSurahForPage(page);
    const pageJuz = getJuzForPage(page);
    const pageIsBookmarked = isBookmarked(page);

    useEffect(() => {
      startLoading(page);
    }, [page]);

    return (
      <div className={`relative ${position === 'single' ? 'w-full' : 'w-1/2'} flex items-center justify-center`}>
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 z-10 gap-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <span className="text-sm text-muted-foreground">
              {language === 'ar' ? 'فشل تحميل الصفحة' : 'Failed to load page'}
            </span>
          </div>
        )}

        {/* Markers */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Page Number */}
          <div className="bg-card/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium shadow-sm">
            {page}
          </div>

          {/* Juz Marker */}
          {juzPageMap[pageJuz] === page && (
            <div className="bg-accent/90 text-accent-foreground rounded-full px-3 py-1 text-xs font-medium shadow-sm">
              {language === 'ar' ? `الجزء ${pageJuz}` : `Juz ${pageJuz}`}
            </div>
          )}

          {/* Sajda Marker */}
          {pageHasSajda && (
            <div className="bg-destructive/90 text-destructive-foreground rounded-full px-2 py-1 text-xs font-medium shadow-sm">
              ۩
            </div>
          )}

          {/* Bookmark Marker */}
          {pageIsBookmarked && (
            <div className="bg-primary/90 text-primary-foreground rounded-full px-2 py-1 text-xs shadow-sm">
              🔖
            </div>
          )}
        </div>

        {/* Surah Info */}
        {pageSurah && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-card/90 backdrop-blur-sm rounded-full px-4 py-1 text-sm shadow-sm">
            {language === 'ar' ? pageSurah.nameAr : pageSurah.name}
          </div>
        )}

        {/* Page Image */}
        <motion.img
          key={`${currentEdition.id}-${page}`}
          src={getPageUrl(currentEdition, page)}
          alt={`Page ${page}`}
          onLoad={() => handleImageLoad(page)}
          onError={() => handleImageError(page)}
          className={`max-h-[80vh] object-contain rounded-lg shadow-lg transition-transform ${
            settings.nightMode ? 'invert brightness-90 hue-rotate-180' : ''
          }`}
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center center'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          draggable={false}
        />
      </div>
    );
  };

  // Get the juz page map for markers
  const juzPageMap: { [key: number]: number } = {};
  for (let juz = 1; juz <= 30; juz++) {
    juzPageMap[juz] = Math.ceil((juz * 604) / 30);
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full min-h-[60vh] flex items-center justify-center ${
        settings.nightMode ? 'bg-neutral-900' : 'bg-parchment'
      } rounded-2xl overflow-hidden`}
    >
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-card/80 hover:bg-card shadow-lg h-12 w-12"
        onClick={language === 'ar' ? navigateNext : navigatePrev}
        disabled={language === 'ar' ? currentPage >= currentEdition.endPage : currentPage <= currentEdition.startPage}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-card/80 hover:bg-card shadow-lg h-12 w-12"
        onClick={language === 'ar' ? navigatePrev : navigateNext}
        disabled={language === 'ar' ? currentPage <= currentEdition.startPage : currentPage >= currentEdition.endPage}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Page Container */}
      <motion.div
        className={`flex ${viewMode === 'double' ? 'flex-row-reverse' : ''} items-center justify-center w-full p-4 gap-2`}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="popLayout">
          {viewMode === 'single' ? (
            <PageImage key={currentPage} page={currentPage} position="single" />
          ) : (
            <>
              {/* In RTL: right page is lower number, left page is higher */}
              <PageImage 
                key={currentPage} 
                page={currentPage} 
                position="right" 
              />
              {currentPage + 1 <= currentEdition.endPage && (
                <PageImage 
                  key={currentPage + 1} 
                  page={currentPage + 1} 
                  position="left" 
                />
              )}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});
