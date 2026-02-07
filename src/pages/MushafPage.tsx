import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  BookOpen,
  Loader2,
  Home,
  Maximize,
  Minimize
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation } from '@/hooks/useTranslation';
import { Link } from 'react-router-dom';

interface MushafEdition {
  id: string;
  name: string;
  nameAr: string;
  baseUrl: string;
  startPage: number;
  endPage: number;
  extension: string;
  padLength: number;
}

const mushafEditions: MushafEdition[] = [
  {
    id: 'medina',
    name: 'Medina Mushaf',
    nameAr: 'مصحف المدينة المنورة',
    baseUrl: 'https://app.quranflash.com/book/Medina1/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 606,
    extension: 'gif',
    padLength: 4
  },
  {
    id: 'tadabbur',
    name: 'Quran Tadabbur wa Amal',
    nameAr: 'القرآن تدبر وعمل',
    baseUrl: 'https://ia902900.us.archive.org/BookReader/BookReaderImages.php?zip=/23/items/20200310_20200310_1532/%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%AA%D8%AF%D8%A8%D8%B1%20%D9%88%D8%B9%D9%85%D9%84_jp2.zip&file=%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%AA%D8%AF%D8%A8%D8%B1%20%D9%88%D8%B9%D9%85%D9%84_jp2/%D8%A7%D9%84%D9%82%D8%B1%D8%A2%D9%86%20%D8%AA%D8%AF%D8%A8%D8%B1%20%D9%88%D8%B9%D9%85%D9%84_',
    startPage: 1,
    endPage: 616,
    extension: 'jp2&id=20200310_20200310_1532&scale=4&rotate=0',
    padLength: 4
  },
  {
    id: 'ksu',
    name: 'King Saud University',
    nameAr: 'مصحف جامعة الملك سعود',
    baseUrl: 'https://quran.ksu.edu.sa/ayat/safahat1/',
    startPage: 1,
    endPage: 604,
    extension: 'png',
    padLength: 0
  },
  {
    id: 'tajweed',
    name: 'Tajweed Mushaf',
    nameAr: 'مصحف التجويد',
    baseUrl: 'https://app.quranflash.com/book/Tajweed/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 604,
    extension: 'png',
    padLength: 3
  },
  {
    id: 'medinaOld',
    name: 'Old Medina Mushaf',
    nameAr: 'مصحف المدينة القديم',
    baseUrl: 'https://app.quranflash.com/book/MedinaOld/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 607,
    extension: 'png',
    padLength: 4
  },
  {
    id: 'jawami',
    name: 'Jawami Mushaf',
    nameAr: 'مصحف الجوامعي',
    baseUrl: 'https://app.quranflash.com/book/Medina3/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 607,
    extension: 'png',
    padLength: 4
  },
  {
    id: 'tahajod',
    name: 'Tahajod Mushaf',
    nameAr: 'مصحف التهجد',
    baseUrl: 'https://app.quranflash.com/book/Tahajod/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 246,
    extension: 'png',
    padLength: 3
  },
  {
    id: 'shubah',
    name: 'Shubah Mushaf',
    nameAr: 'مصحف رواية شعبة',
    baseUrl: 'https://app.quranflash.com/book/Shubah/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 607,
    extension: 'png',
    padLength: 4
  },
  {
    id: 'shamarly',
    name: 'Shamarly Mushaf',
    nameAr: 'مصحف الشمرلي',
    baseUrl: 'https://app.quranflash.com/book/Shamarly/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 523,
    extension: 'png',
    padLength: 4
  },
  {
    id: 'muallim',
    name: 'Muallim Mushaf',
    nameAr: 'المصحف المعلم',
    baseUrl: 'https://app.quranflash.com/book/Warsh2/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 606,
    extension: 'png',
    padLength: 3
  },
  {
    id: 'douri',
    name: 'Douri Mushaf',
    nameAr: 'مصحف رواية الدوري',
    baseUrl: 'https://app.quranflash.com/book/Douri/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 525,
    extension: 'png',
    padLength: 4
  },
  {
    id: 'medinaNabawiya',
    name: 'Medina Nabawiya Mushaf',
    nameAr: 'مصحف المدينة النبوية',
    baseUrl: 'https://www.mp3quran.net/mushaf2/',
    startPage: 4,
    endPage: 638,
    extension: 'jpg',
    padLength: 0
  },
  {
    id: 'qaloon',
    name: 'Qaloon Mushaf',
    nameAr: 'مصحف قالون',
    baseUrl: 'https://app.quranflash.com/book/Qaloon/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 563,
    extension: 'png',
    padLength: 4
  },
  {
    id: 'warsh',
    name: 'Warsh Mushaf',
    nameAr: 'مصحف ورش',
    baseUrl: 'https://app.quranflash.com/book/Warsh1/epub/EPUB/imgs/',
    startPage: 1,
    endPage: 563,
    extension: 'png',
    padLength: 4
  }
];

export default function MushafPage() {
  const { t, language } = useTranslation();
  const [selectedEdition, setSelectedEdition] = useState<MushafEdition>(mushafEditions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [loading, setLoading] = useState(true);
  const [pageInput, setPageInput] = useState('1');
  const [viewMode, setViewMode] = useState<'single' | 'double'>('single');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mushafContainerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && mushafContainerRef.current) {
        await mushafContainerRef.current.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const getPageUrl = (edition: MushafEdition, page: number): string => {
    if (edition.padLength > 0) {
      const paddedPage = page.toString().padStart(edition.padLength, '0');
      return `${edition.baseUrl}${paddedPage}.${edition.extension}`;
    }
    return `${edition.baseUrl}${page}.${edition.extension}`;
  };

  const handlePrevPage = useCallback(() => {
    if (currentPage > selectedEdition.startPage) {
      setCurrentPage(currentPage - (viewMode === 'double' ? 2 : 1));
      setLoading(true);
    }
  }, [currentPage, selectedEdition.startPage, viewMode]);

  const handleNextPage = useCallback(() => {
    if (currentPage < selectedEdition.endPage) {
      setCurrentPage(currentPage + (viewMode === 'double' ? 2 : 1));
      setLoading(true);
    }
  }, [currentPage, selectedEdition.endPage, viewMode]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (page >= selectedEdition.startPage && page <= selectedEdition.endPage) {
      setCurrentPage(page);
      setLoading(true);
    }
  };

  const handleEditionChange = (editionId: string) => {
    const edition = mushafEditions.find(e => e.id === editionId);
    if (edition) {
      setSelectedEdition(edition);
      setCurrentPage(1);
      setPageInput('1');
      setLoading(true);
    }
  };

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        language === 'ar' ? handleNextPage() : handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        language === 'ar' ? handlePrevPage() : handleNextPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [language, handleNextPage, handlePrevPage]);

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="container max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {language === 'ar' ? 'المصحف الشريف' : 'Holy Quran Mushaf'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' ? 'تصفح صفحات المصحف الشريف' : 'Browse the pages of the Holy Quran'}
            </p>
            
            {/* Link to Text Mushaf */}
            <div className="mt-4">
              <Link to="/mushaf-text">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  {language === 'ar' ? 'المصحف النصي' : 'Text Mushaf'}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Edition Select */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'المصحف:' : 'Edition:'}
                </span>
                <Select value={selectedEdition.id} onValueChange={handleEditionChange}>
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
              </div>

              {/* Page Navigation */}
              <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'صفحة:' : 'Page:'}
                </span>
                <Input
                  type="number"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  min={selectedEdition.startPage}
                  max={selectedEdition.endPage}
                  className="w-20 text-center"
                />
                <span className="text-sm text-muted-foreground">
                  / {selectedEdition.endPage}
                </span>
              </form>

              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Slider
                  value={[zoom]}
                  onValueChange={(val) => setZoom(val[0])}
                  min={50}
                  max={150}
                  step={10}
                  className="w-24"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground w-10">{zoom}%</span>
              </div>

              {/* Fullscreen Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullscreen}
                title={language === 'ar' ? (isFullscreen ? 'إلغاء ملء الشاشة' : 'ملء الشاشة') : (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen')}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>

              {/* View Mode */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'single' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('single')}
                >
                  {language === 'ar' ? 'صفحة' : 'Single'}
                </Button>
                <Button
                  variant={viewMode === 'double' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('double')}
                >
                  {language === 'ar' ? 'صفحتين' : 'Double'}
                </Button>
              </div>
            </div>
          </div>

          {/* Page Display */}
          <div 
            ref={mushafContainerRef} 
            className={`relative bg-card rounded-2xl border border-border overflow-hidden flex items-center justify-center ${isFullscreen ? 'bg-black fixed inset-0 z-50 rounded-none border-none' : 'min-h-[60vh]'}`}
          >
            {/* Fullscreen Controls */}
            {isFullscreen && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-background/90 rounded-full px-3 py-2 shadow-lg pointer-events-auto">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(Math.max(50, zoom - 10));
                  }}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-xs text-foreground min-w-[40px] text-center">{zoom}%</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoom(Math.min(200, zoom + 10));
                  }}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                >
                  <Minimize className="w-4 h-4" />
                  {language === 'ar' ? 'إغلاق' : 'Exit'}
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
              onClick={language === 'ar' ? handleNextPage : handlePrevPage}
              disabled={language === 'ar' ? currentPage >= selectedEdition.endPage : currentPage <= selectedEdition.startPage}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background"
              onClick={language === 'ar' ? handlePrevPage : handleNextPage}
              disabled={language === 'ar' ? currentPage <= selectedEdition.startPage : currentPage >= selectedEdition.endPage}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            {/* Loading Indicator */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Page Images */}
            <div 
              className={`flex justify-center items-center ${viewMode === 'double' ? 'gap-1' : ''} p-4 ${isFullscreen ? 'h-full w-full overflow-auto' : ''}`}
              style={isFullscreen ? { transform: `scale(${zoom / 100})`, transformOrigin: 'center center' } : undefined}
            >
              <motion.img
                key={`${selectedEdition.id}-${currentPage}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={getPageUrl(selectedEdition, currentPage)}
                alt={`Page ${currentPage}`}
                style={{ 
                  width: isFullscreen ? 'auto' : undefined,
                  transform: isFullscreen ? undefined : `scale(${zoom / 100})`,
                  transformOrigin: 'center center',
                  maxWidth: viewMode === 'double' ? (isFullscreen ? '48%' : '45%') : '100%',
                  maxHeight: isFullscreen ? '90vh' : 'auto'
                }}
                className={`rounded-lg shadow-lg ${viewMode === 'single' ? 'mx-auto' : ''} ${isFullscreen ? 'object-contain' : ''}`}
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
              {viewMode === 'double' && currentPage + 1 <= selectedEdition.endPage && (
                <motion.img
                  key={`${selectedEdition.id}-${currentPage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={getPageUrl(selectedEdition, currentPage + 1)}
                  alt={`Page ${currentPage + 1}`}
                  style={{ 
                    width: isFullscreen ? 'auto' : undefined,
                    transform: isFullscreen ? undefined : `scale(${zoom / 100})`,
                    transformOrigin: 'center center',
                    maxWidth: isFullscreen ? '48%' : '45%',
                    maxHeight: isFullscreen ? '90vh' : 'auto'
                  }}
                  className={`rounded-lg shadow-lg ${isFullscreen ? 'object-contain' : ''}`}
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                />
              )}
            </div>
          </div>

          {/* Page Info */}
          <div className="text-center mt-4 text-muted-foreground">
            {language === 'ar' ? `صفحة ${currentPage}` : `Page ${currentPage}`}
            {viewMode === 'double' && currentPage + 1 <= selectedEdition.endPage && (
              <span> - {currentPage + 1}</span>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
