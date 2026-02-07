import { memo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Search,
  Moon,
  Sun,
  Settings,
  Volume2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  LayoutGrid,
  FileText,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMushafStore } from '@/hooks/useMushafStore';
import { useTranslation } from '@/hooks/useTranslation';

interface MushafToolbarProps {
  onSearchClick: () => void;
  onSettingsClick: () => void;
}

export const MushafToolbar = memo(function MushafToolbar({
  onSearchClick,
  onSettingsClick
}: MushafToolbarProps) {
  const { language } = useTranslation();
  const {
    currentPage,
    zoom,
    setZoom,
    viewMode,
    setViewMode,
    isFullscreen,
    setIsFullscreen,
    settings,
    updateSettings,
    isBookmarked,
    addBookmark,
    removeBookmark
  } = useMushafStore();

  const isPageBookmarked = isBookmarked(currentPage);

  const toggleBookmark = () => {
    if (isPageBookmarked) {
      removeBookmark(currentPage);
    } else {
      addBookmark({ page: currentPage });
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg px-4 py-3"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left Section - View Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'single' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('single')}
                  className="h-8 px-3"
                >
                  <FileText className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {language === 'ar' ? 'صفحة واحدة' : 'Single Page'}
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === 'double' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('double')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {language === 'ar' ? 'صفحتين' : 'Double Page'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(zoom - 10)}
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Slider
              value={[zoom]}
              onValueChange={([val]) => setZoom(val)}
              min={50}
              max={200}
              step={10}
              className="w-20"
            />
            <span className="text-xs text-muted-foreground min-w-[35px]">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(zoom + 10)}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Center Section - Main Actions */}
        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isPageBookmarked ? 'default' : 'outline'}
                size="icon"
                onClick={toggleBookmark}
                className={isPageBookmarked ? 'bg-accent text-accent-foreground' : ''}
              >
                {isPageBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === 'ar' ? (isPageBookmarked ? 'إزالة العلامة' : 'إضافة علامة') : (isPageBookmarked ? 'Remove Bookmark' : 'Add Bookmark')}
            </TooltipContent>
          </Tooltip>

          {/* Search */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onSearchClick}>
                <Search className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === 'ar' ? 'البحث' : 'Search'}
            </TooltipContent>
          </Tooltip>

          {/* Translation Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.showTranslation ? 'default' : 'outline'}
                size="icon"
                onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
              >
                <Languages className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === 'ar' ? 'الترجمة' : 'Translation'}
            </TooltipContent>
          </Tooltip>

          {/* Night Mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.nightMode ? 'default' : 'outline'}
                size="icon"
                onClick={() => updateSettings({ nightMode: !settings.nightMode })}
              >
                {settings.nightMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === 'ar' ? 'الوضع الليلي' : 'Night Mode'}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right Section - Settings & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Settings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onSettingsClick}>
                <Settings className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === 'ar' ? 'الإعدادات' : 'Settings'}
            </TooltipContent>
          </Tooltip>

          {/* Fullscreen */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {language === 'ar' ? (isFullscreen ? 'إلغاء ملء الشاشة' : 'ملء الشاشة') : (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
});
