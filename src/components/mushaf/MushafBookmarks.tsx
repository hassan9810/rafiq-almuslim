import { memo } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMushafStore } from '@/hooks/useMushafStore';
import { useTranslation } from '@/hooks/useTranslation';
import { getSurahForPage, getJuzForPage } from '@/lib/mushafApi';

interface MushafBookmarksProps {
  open: boolean;
  onClose: () => void;
}

export const MushafBookmarks = memo(function MushafBookmarks({
  open,
  onClose
}: MushafBookmarksProps) {
  const { language } = useTranslation();
  const { 
    bookmarks, 
    removeBookmark, 
    setCurrentPage,
    readingHistory,
    lastReadPage
  } = useMushafStore();

  const handleGoToPage = (page: number) => {
    setCurrentPage(page);
    onClose();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            {language === 'ar' ? 'العلامات والسجل' : 'Bookmarks & History'}
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="bookmarks" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="bookmarks" className="flex-1">
              <Bookmark className="w-4 h-4 mr-1" />
              {language === 'ar' ? 'العلامات' : 'Bookmarks'}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <Clock className="w-4 h-4 mr-1" />
              {language === 'ar' ? 'السجل' : 'History'}
            </TabsTrigger>
          </TabsList>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="mt-4">
            {/* Resume Reading */}
            {lastReadPage > 1 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleGoToPage(lastReadPage)}
                className="w-full p-4 mb-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <div className="font-semibold text-primary">
                      {language === 'ar' ? 'استئناف القراءة' : 'Resume Reading'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === 'ar' ? `صفحة ${lastReadPage}` : `Page ${lastReadPage}`}
                    </div>
                  </div>
                </div>
              </motion.button>
            )}

            <ScrollArea className="h-[50vh]">
              {bookmarks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>{language === 'ar' ? 'لا توجد علامات' : 'No bookmarks yet'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarks.map((bookmark, index) => {
                    const surah = getSurahForPage(bookmark.page);
                    const juz = getJuzForPage(bookmark.page);
                    
                    return (
                      <motion.div
                        key={bookmark.page}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <button
                          onClick={() => handleGoToPage(bookmark.page)}
                          className="flex-1 text-right"
                        >
                          <div className="font-semibold">
                            {language === 'ar' ? `صفحة ${bookmark.page}` : `Page ${bookmark.page}`}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {surah && (language === 'ar' ? surah.nameAr : surah.name)}
                            {' • '}
                            {language === 'ar' ? `الجزء ${juz}` : `Juz ${juz}`}
                          </div>
                          {bookmark.note && (
                            <div className="text-xs text-primary mt-1">{bookmark.note}</div>
                          )}
                        </button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeBookmark(bookmark.page)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-4">
            <ScrollArea className="h-[50vh]">
              {readingHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>{language === 'ar' ? 'لا يوجد سجل' : 'No history yet'}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {readingHistory.map((item, index) => {
                    const surah = getSurahForPage(item.page);
                    
                    return (
                      <motion.button
                        key={`${item.page}-${item.timestamp}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleGoToPage(item.page)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-right"
                      >
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {item.page}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {surah && (language === 'ar' ? surah.nameAr : surah.name)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(item.timestamp)}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
});
