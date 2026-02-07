import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Home,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Search,
  Settings,
  Volume2,
  Moon,
  Sun,
  Languages,
  LayoutGrid,
  FileText,
  List
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Link } from 'react-router-dom';
import { 
  surahNames, 
  surahPageMap, 
  juzPageMap, 
  getJuzForPage,
  getSurahForPage,
  hasSajda,
  fetchPageWithTranslation,
  PageAyahs,
  isHizbStart,
  isQuarterStart
} from '@/lib/mushafApi';
import { translations } from '@/lib/quranApi';

// Convert to Arabic numerals
const toArabicNumerals = (num: number): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(digit => arabicNumerals[parseInt(digit)] || digit).join('');
};

// Persisted settings
interface TextMushafSettings {
  fontSize: number;
  showTranslation: boolean;
  translationEdition: string;
  nightMode: boolean;
  lineHeight: number;
}

export default function TextMushafPage() {
  const { language } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { bookmarks, addBookmark, removeBookmark } = useAppStore();
  
  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'single' | 'double'>('single');
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageInput, setPageInput] = useState('1');
  
  // Content state
  const [pageData, setPageData] = useState<PageAyahs | null>(null);
  const [secondPageData, setSecondPageData] = useState<PageAyahs | null>(null);
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBookmarksList, setShowBookmarksList] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  // Settings
  const [settings, setSettings] = useState<TextMushafSettings>(() => {
    const saved = localStorage.getItem('text-mushaf-settings');
    return saved ? JSON.parse(saved) : {
      fontSize: 28,
      showTranslation: false,
      translationEdition: 'en.sahih',
      nightMode: false,
      lineHeight: 2.5
    };
  });

  // Save settings
  useEffect(() => {
    localStorage.setItem('text-mushaf-settings', JSON.stringify(settings));
  }, [settings]);

  // Current position info
  const currentSurah = getSurahForPage(currentPage);
  const currentJuz = getJuzForPage(currentPage);
  const pageHasSajda = hasSajda(currentPage);

  // Check if page is bookmarked
  const isPageBookmarked = bookmarks.some(b => b.surah === currentPage && b.ayah === 0);

  // Toggle bookmark
  const toggleBookmark = () => {
    if (isPageBookmarked) {
      removeBookmark(currentPage, 0);
    } else {
      addBookmark(currentPage, 0);
    }
  };

  // Fetch page content
  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        const data = await fetchPageWithTranslation(
          currentPage, 
          settings.showTranslation ? settings.translationEdition : undefined
        );
        setPageData(data);
        
        // Load second page for double view
        if (viewMode === 'double' && currentPage < 604) {
          const secondData = await fetchPageWithTranslation(
            currentPage + 1,
            settings.showTranslation ? settings.translationEdition : undefined
          );
          setSecondPageData(secondData);
        } else {
          setSecondPageData(null);
        }
      } catch (error) {
        console.error('Error loading page:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [currentPage, viewMode, settings.showTranslation, settings.translationEdition]);

  // Navigation
  const handlePrevPage = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    if (currentPage > 1) {
      setCurrentPage(Math.max(1, currentPage - step));
    }
  }, [currentPage, viewMode]);

  const handleNextPage = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    if (currentPage < 604) {
      setCurrentPage(Math.min(604, currentPage + step));
    }
  }, [currentPage, viewMode]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= 1 && page <= 604) {
      setCurrentPage(page);
    }
  };

  // Go to surah
  const goToSurah = (surahNumber: string) => {
    const page = surahPageMap[parseInt(surahNumber)];
    if (page) {
      setCurrentPage(page);
      setPageInput(page.toString());
    }
  };

  // Go to juz
  const goToJuz = (juzNumber: string) => {
    const page = juzPageMap[parseInt(juzNumber)];
    if (page) {
      setCurrentPage(page);
      setPageInput(page.toString());
    }
  };

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      console.log('Key pressed:', e.key);
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (language === 'ar') {
          handleNextPage();
        } else {
          handlePrevPage();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (language === 'ar') {
          handlePrevPage();
        } else {
          handleNextPage();
        }
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [language, handleNextPage, handlePrevPage, toggleFullscreen]);

  // Update page input when page changes
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Page component
  const PageContent = ({ data, pageNum }: { data: PageAyahs | null; pageNum: number }) => {
    const pageSurah = getSurahForPage(pageNum);
    const pageJuz = getJuzForPage(pageNum);
    const pageSajda = hasSajda(pageNum);
    const isJuzStart = Object.values(juzPageMap).includes(pageNum);

    if (!data) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }

    // Group ayahs by surah
    const groupedAyahs: { [surahNum: number]: typeof data.ayahs } = {};
    data.ayahs.forEach(ayah => {
      if (!groupedAyahs[ayah.surah]) {
        groupedAyahs[ayah.surah] = [];
      }
      groupedAyahs[ayah.surah].push(ayah);
    });

    // Calculate actual font size and line height
    const actualFontSize = settings.fontSize * (zoom / 100);
    const actualLineHeight = settings.lineHeight;

    return (
      <div 
        className={`mushaf-page rounded-xl p-6 md:p-8 h-full overflow-y-auto ${
          settings.nightMode ? 'dark-mushaf-page' : ''
        }`}
        dir="rtl"
        style={{
          '--quran-font-size': `${actualFontSize}px`,
          '--quran-line-height': actualLineHeight,
        } as React.CSSProperties}
      >
        {/* Page Markers */}
        <div className="flex items-center justify-between mb-4 text-sm flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 font-medium">
              {language === 'ar' ? toArabicNumerals(pageNum) : pageNum}
            </span>
            {isJuzStart && (
              <span className="bg-accent/20 text-accent-foreground rounded-full px-2 py-0.5 text-xs juz-marker">
                ۞ {language === 'ar' ? `الجزء ${toArabicNumerals(pageJuz)}` : `Juz ${pageJuz}`}
              </span>
            )}
            {/* Hizb marker */}
            {(() => {
              const hizbStart = isHizbStart(pageNum);
              if (hizbStart) {
                return (
                  <span className="bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 text-xs">
                    ۞ {language === 'ar' ? `الحزب ${toArabicNumerals(hizbStart)}` : `Hizb ${hizbStart}`}
                  </span>
                );
              }
              return null;
            })()}
            {/* Quarter (Rub) marker */}
            {(() => {
              const quarterStart = isQuarterStart(pageNum);
              if (quarterStart && quarterStart.position !== 1) {
                // Don't show quarter marker if it's the start of a Hizb (position 1)
                // Calculate which Hizb this quarter belongs to
                const hizbNumber = Math.ceil(quarterStart.quarter / 4);
                const quarterNames = { 
                  2: `ربع الحزب ${toArabicNumerals(hizbNumber)}`, 
                  3: `نصف الحزب ${toArabicNumerals(hizbNumber)}`, 
                  4: `ثلاثة أرباع الحزب ${toArabicNumerals(hizbNumber)}` 
                };
                const quarterNamesEn = { 
                  2: `¼ Hizb ${hizbNumber}`, 
                  3: `½ Hizb ${hizbNumber}`, 
                  4: `¾ Hizb ${hizbNumber}` 
                };
                return (
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                    ۞ {language === 'ar' ? quarterNames[quarterStart.position as 2 | 3 | 4] : quarterNamesEn[quarterStart.position as 2 | 3 | 4]}
                  </span>
                );
              }
              return null;
            })()}
          </div>
          {pageSajda && (
            <span className="bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-full px-2 py-0.5 text-xs">
              ۩ {language === 'ar' ? 'سجدة' : 'Sajda'}
            </span>
          )}
        </div>

        {/* Ayahs Content */}
        <div className="space-y-6">
          {Object.entries(groupedAyahs).map(([surahNum, ayahs]) => {
            const surah = surahNames.find(s => s.number === parseInt(surahNum));
            const isFirstAyah = ayahs[0].ayah === 1;

            return (
              <div key={surahNum}>
                {/* Surah Header */}
                {isFirstAyah && (
                  <div className="text-center mb-6">
                    <div className="inline-block bg-primary/10 rounded-xl px-6 py-3 mb-4">
                      <h2 className="text-xl md:text-2xl font-bold surah-header-text text-primary">
                        {language === 'ar' ? surah?.nameAr : surah?.name}
                      </h2>
                    </div>
                    {/* Bismillah - except for Surah 9 (At-Tawbah) */}
                    {parseInt(surahNum) !== 9 && parseInt(surahNum) !== 1 && (
                      <div className="bismillah-golden text-2xl md:text-3xl mb-4 uthmani-text">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </div>
                    )}
                  </div>
                )}

                {/* Ayahs */}
                <div 
                  className="uthmani-text text-right"
                  style={{
                    fontSize: 'var(--quran-font-size, 1.75rem)',
                    lineHeight: 'var(--quran-line-height, 2.5)',
                  }}
                >
                  {ayahs.map((ayah, idx) => (
                    <span key={`${ayah.surah}-${ayah.ayah}`} className="inline">
                      <span className="hover:bg-accent/10 rounded transition-colors">
                        {ayah.text}
                      </span>
                      <span className="ayah-number mx-1">
                        {ayah.ayah.toLocaleString('ar-SA')}
                      </span>
                      {settings.showTranslation && ayah.translation && (
                        <div className="block text-sm text-muted-foreground mt-2 mb-4 text-right font-sans" style={{ direction: 'ltr', textAlign: 'left' }}>
                          {ayah.translation}
                        </div>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Surah Name Footer */}
        {pageSurah && (
          <div className="text-center mt-6 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">
              {language === 'ar' ? pageSurah.nameAr : pageSurah.name}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Night mode class for the entire page
  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col bg-background"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header - Always uses global theme, not affected by Text Mushaf night mode */}
      {!isFullscreen && <Header />}
      
      {/* Main content wrapper - Night mode applies only here */}
      <div className={`flex-1 flex flex-col ${settings.nightMode ? 'bg-neutral-950 text-neutral-100' : ''}`}>
        <main className={`flex-1 flex flex-col ${isFullscreen ? '' : 'pt-20 pb-24'}`}>
        {/* Page Header */}
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="container max-w-7xl py-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Link to="/">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={settings.nightMode ? '!text-neutral-100 hover:!bg-neutral-800' : ''}
                  >
                    <Home className="w-5 h-5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <BookOpen className={`w-6 h-6 ${settings.nightMode ? 'text-emerald-400' : 'text-primary'}`} />
                  <h1 className={`text-xl md:text-2xl font-bold ${settings.nightMode ? 'text-neutral-100' : 'text-foreground'}`}>
                    {language === 'ar' ? 'المصحف النصي' : 'Text Mushaf'}
                  </h1>
                </div>
              </div>

              {/* Link to Image Mushaf */}
              <Link to="/mushaf">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`gap-2 ${settings.nightMode ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}`}
                >
                  <BookOpen className="w-4 h-4" />
                  {language === 'ar' ? 'المصحف المصور' : 'Image Mushaf'}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Toolbar */}
        <div className={`container max-w-7xl ${isFullscreen ? 'absolute top-4 left-1/2 -translate-x-1/2 z-50' : ''}`}>
          <AnimatePresence>
            {(showControls || !isFullscreen) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`backdrop-blur-md border rounded-2xl shadow-lg px-4 py-3 ${
                  settings.nightMode 
                    ? 'bg-neutral-900/95 border-neutral-700 text-neutral-100' 
                    : 'bg-card/95 border-border'
                }`}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* View Mode */}
                  <div className={`flex items-center rounded-lg p-1 ${settings.nightMode ? 'bg-neutral-800' : 'bg-muted'}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'single' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('single')}
                          className={`h-8 px-3 ${settings.nightMode && viewMode !== 'single' ? 'text-neutral-100 hover:bg-neutral-700' : ''}`}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'صفحة واحدة' : 'Single Page'}</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={viewMode === 'double' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('double')}
                          className={`h-8 px-3 ${settings.nightMode && viewMode !== 'double' ? 'text-neutral-100 hover:bg-neutral-700' : ''}`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'صفحتين' : 'Double Page'}</TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Zoom */}
                  <div className={`flex items-center gap-2 rounded-lg px-3 py-1 ${settings.nightMode ? 'bg-neutral-800' : 'bg-muted'}`}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-7 w-7 ${settings.nightMode ? 'text-neutral-100 hover:bg-neutral-700' : ''}`}
                      onClick={() => setZoom(Math.max(50, zoom - 10))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className={`text-xs min-w-[35px] text-center ${settings.nightMode ? 'text-neutral-100' : ''}`}>{zoom}%</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-7 w-7 ${settings.nightMode ? 'text-neutral-100 hover:bg-neutral-700' : ''}`}
                      onClick={() => setZoom(Math.min(150, zoom + 10))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isPageBookmarked ? 'default' : 'outline'}
                          size="icon"
                          onClick={toggleBookmark}
                          className={`${isPageBookmarked ? 'bg-accent text-accent-foreground' : ''} ${settings.nightMode && !isPageBookmarked ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}`}
                        >
                          {isPageBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'علامة' : 'Bookmark'}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowBookmarksList(true)}
                          className={settings.nightMode ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'كل العلامات' : 'All Bookmarks'}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={settings.showTranslation ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setSettings(s => ({ ...s, showTranslation: !s.showTranslation }))}
                          className={settings.nightMode && !settings.showTranslation ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}
                        >
                          <Languages className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'الترجمة' : 'Translation'}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={settings.nightMode ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setSettings(s => ({ ...s, nightMode: !s.nightMode }))}
                          className={settings.nightMode ? '!bg-emerald-600 hover:!bg-emerald-700' : ''}
                        >
                          {settings.nightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'الوضع الليلي' : 'Night Mode'}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setShowSettings(true)}
                          className={settings.nightMode ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'الإعدادات' : 'Settings'}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={toggleFullscreen}
                          className={settings.nightMode ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}
                        >
                          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{language === 'ar' ? 'ملء الشاشة' : 'Fullscreen'}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigator */}
        {!isFullscreen && (
          <div className="container max-w-7xl mt-4">
            <div className={`backdrop-blur-md border rounded-2xl shadow-lg px-4 py-3 ${
              settings.nightMode 
                ? 'bg-neutral-900/95 border-neutral-700 text-neutral-100' 
                : 'bg-card/95 border-border'
            }`}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Page Input */}
                <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
                  <span className={`text-sm ${settings.nightMode ? 'text-neutral-400' : 'text-muted-foreground'}`}>{language === 'ar' ? 'صفحة:' : 'Page:'}</span>
                  <Input
                    type="number"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    min={1}
                    max={604}
                    className={`w-16 text-center h-9 ${settings.nightMode ? '!bg-neutral-800 !border-neutral-600 !text-neutral-100' : ''}`}
                  />
                  <span className={`text-sm ${settings.nightMode ? 'text-neutral-400' : 'text-muted-foreground'}`}>/ {language === 'ar' ? toArabicNumerals(604) : 604}</span>
                </form>

                {/* Navigation - Arrows swapped: Right arrow first (forward/next), Left arrow second (backward/prev) */}
                <div className="flex items-center gap-2">
                  {/* Forward arrow (next page - higher number) */}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleNextPage} 
                    disabled={currentPage >= 604}
                    className={settings.nightMode ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  {/* Backward arrow (previous page - lower number) */}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handlePrevPage} 
                    disabled={currentPage <= 1}
                    className={settings.nightMode ? '!border-neutral-600 !text-neutral-100 !bg-neutral-800 hover:!bg-neutral-700' : ''}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>

                {/* Surah Select */}
                <Select onValueChange={goToSurah} value={currentSurah?.number.toString()}>
                  <SelectTrigger className={`w-40 ${settings.nightMode ? '!bg-neutral-800 !border-neutral-600 !text-neutral-100' : ''}`}>
                    <SelectValue placeholder={language === 'ar' ? 'السورة' : 'Surah'} />
                  </SelectTrigger>
                  <SelectContent className={`max-h-60 ${settings.nightMode ? 'bg-neutral-800 border-neutral-600' : ''}`}>
                    {surahNames.map((surah) => (
                      <SelectItem 
                        key={surah.number} 
                        value={surah.number.toString()}
                        className={settings.nightMode ? 'text-neutral-100 focus:bg-neutral-700 focus:text-neutral-100' : ''}
                      >
                        {surah.number}. {language === 'ar' ? surah.nameAr : surah.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Juz Select */}
                <Select onValueChange={goToJuz} value={currentJuz.toString()}>
                  <SelectTrigger className={`w-28 ${settings.nightMode ? '!bg-neutral-800 !border-neutral-600 !text-neutral-100' : ''}`}>
                    <SelectValue placeholder={language === 'ar' ? 'الجزء' : 'Juz'} />
                  </SelectTrigger>
                  <SelectContent className={`max-h-60 ${settings.nightMode ? 'bg-neutral-800 border-neutral-600' : ''}`}>
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                      <SelectItem 
                        key={juz} 
                        value={juz.toString()}
                        className={settings.nightMode ? 'text-neutral-100 focus:bg-neutral-700 focus:text-neutral-100' : ''}
                      >
                        {language === 'ar' ? `الجزء ${juz}` : `Juz ${juz}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Current Info */}
                <div className={`hidden lg:flex items-center gap-2 text-sm ${settings.nightMode ? 'text-neutral-400' : 'text-muted-foreground'}`}>
                  <BookOpen className="w-4 h-4" />
                  <span>{currentSurah && (language === 'ar' ? currentSurah.nameAr : currentSurah.name)}</span>
                  <span className={settings.nightMode ? 'text-emerald-400' : 'text-primary'}>|</span>
                  <span>{language === 'ar' ? `الجزء ${currentJuz}` : `Juz ${currentJuz}`}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${isFullscreen ? 'p-4' : 'container max-w-7xl py-6'}`}>
          {/* Navigation Arrows */}
          {/* Right arrow - in Arabic goes to previous page (lower number) */}
          <Button
            variant="ghost"
            size="icon"
            className={`fixed right-2 top-1/2 -translate-y-1/2 z-30 shadow-lg h-12 w-12 rounded-full ${
              settings.nightMode 
                ? '!bg-neutral-800 hover:!bg-neutral-700 !text-neutral-100' 
                : 'bg-card/80 hover:bg-card'
            }`}
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Left arrow - in Arabic goes to next page (higher number) */}
          <Button
            variant="ghost"
            size="icon"
            className={`fixed left-2 top-1/2 -translate-y-1/2 z-30 shadow-lg h-12 w-12 rounded-full ${
              settings.nightMode 
                ? '!bg-neutral-800 hover:!bg-neutral-700 !text-neutral-100' 
                : 'bg-card/80 hover:bg-card'
            }`}
            onClick={handleNextPage}
            disabled={currentPage >= 604}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Loading */}
          {loading && (
            <div className={`absolute inset-0 flex items-center justify-center z-20 ${settings.nightMode ? 'bg-neutral-950/50' : 'bg-background/50'}`}>
              <Loader2 className={`w-8 h-8 animate-spin ${settings.nightMode ? 'text-emerald-400' : 'text-primary'}`} />
            </div>
          )}

          {/* Pages */}
          <div className={`flex ${viewMode === 'double' ? 'flex-row gap-4' : 'justify-center'} h-full min-h-[60vh]`} dir="rtl">
            <AnimatePresence mode="popLayout">
              {viewMode === 'single' ? (
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="w-full max-w-3xl mx-auto mushaf-shadow rounded-xl"
                >
                  <PageContent data={pageData} pageNum={currentPage} />
                </motion.div>
              ) : (
                <>
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-1/2 mushaf-shadow rounded-xl"
                  >
                    <PageContent data={pageData} pageNum={currentPage} />
                  </motion.div>
                  {currentPage < 604 && (
                    <motion.div
                      key={currentPage + 1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-1/2 mushaf-shadow rounded-xl"
                    >
                      <PageContent data={secondPageData} pageNum={currentPage + 1} />
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Position Info */}
        {!isFullscreen && (
          <div className="container max-w-7xl">
            <div className="flex items-center justify-center gap-4 py-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {currentSurah && (language === 'ar' ? currentSurah.nameAr : currentSurah.name)}
              </span>
              <span className="text-primary">|</span>
              <span>{language === 'ar' ? `الجزء ${toArabicNumerals(currentJuz)}` : `Juz ${currentJuz}`}</span>
              <span className="text-primary">|</span>
              <span>{language === 'ar' ? `صفحة ${toArabicNumerals(currentPage)}` : `Page ${currentPage}`}</span>
              {pageHasSajda && (
                <>
                  <span className="text-primary">|</span>
                  <span className="text-destructive">۩ {language === 'ar' ? 'سجدة' : 'Sajda'}</span>
                </>
              )}
            </div>
          </div>
        )}
        </main>
      </div>

      {/* Settings Sheet */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-80">
          <SheetHeader>
            <SheetTitle>{language === 'ar' ? 'إعدادات المصحف' : 'Mushaf Settings'}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Font Size */}
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'حجم الخط' : 'Font Size'}</Label>
              <div className="flex items-center gap-3">
                <span className="text-xs">A</span>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={([val]) => setSettings(s => ({ ...s, fontSize: val }))}
                  min={18}
                  max={48}
                  step={2}
                  className="flex-1"
                />
                <span className="text-lg">A</span>
                <span className="text-xs text-muted-foreground w-8">{settings.fontSize}px</span>
              </div>
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'تباعد الأسطر' : 'Line Height'}</Label>
              <Slider
                value={[settings.lineHeight]}
                onValueChange={([val]) => setSettings(s => ({ ...s, lineHeight: val }))}
                min={1.5}
                max={4}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Night Mode */}
            <div className="flex items-center justify-between">
              <Label>{language === 'ar' ? 'الوضع الليلي' : 'Night Mode'}</Label>
              <Switch
                checked={settings.nightMode}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, nightMode: checked }))}
              />
            </div>

            {/* Show Translation */}
            <div className="flex items-center justify-between">
              <Label>{language === 'ar' ? 'إظهار الترجمة' : 'Show Translation'}</Label>
              <Switch
                checked={settings.showTranslation}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, showTranslation: checked }))}
              />
            </div>

            {/* Translation Edition */}
            {settings.showTranslation && (
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'نسخة الترجمة' : 'Translation'}</Label>
                <Select
                  value={settings.translationEdition}
                  onValueChange={(val) => setSettings(s => ({ ...s, translationEdition: val }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {translations.map((t) => (
                      <SelectItem key={t.code} value={t.code}>
                        {t.name} ({t.language})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Bookmarks List Dialog */}
      <Dialog open={showBookmarksList} onOpenChange={setShowBookmarksList}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{language === 'ar' ? 'العلامات المحفوظة' : 'Saved Bookmarks'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            {bookmarks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {language === 'ar' ? 'لا توجد علامات محفوظة' : 'No bookmarks saved'}
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bookmark, index) => {
                  const surah = getSurahForPage(bookmark.surah);
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                      onClick={() => {
                        setCurrentPage(bookmark.surah);
                        setShowBookmarksList(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium">
                            {language === 'ar' ? `صفحة ${bookmark.surah}` : `Page ${bookmark.surah}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {surah && (language === 'ar' ? surah.nameAr : surah.name)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(bookmark.surah, bookmark.ayah);
                        }}
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      {!isFullscreen && <Footer />}
    </div>
  );
}
