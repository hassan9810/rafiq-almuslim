import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Mic2,
  Radio,
  Compass,
  Clock,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Settings,
  BookMarked,
  Bookmark,
  MessageSquareQuote,
  Shield,
  Languages,
  BookImage
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore, type ThemeColorId } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { path: '/quran', icon: BookOpen, labelKey: 'quran' as const },
  { path: '/mushaf', icon: BookImage, labelKey: 'mushaf' as const },
  { path: '/bookmarks', icon: Bookmark, labelKey: 'bookmarks' as const },
  { path: '/tafsir', icon: BookMarked, labelKey: 'tafsir' as const },
  { path: '/hadith', icon: MessageSquareQuote, labelKey: 'hadith' as const },
  { path: '/translations', icon: Languages, labelKey: 'translations' as const },
  { path: '/azkar', icon: Mic2, labelKey: 'azkar' as const },
  { path: '/hisn-muslim', icon: Shield, labelKey: 'hisnMuslim' as const },
  { path: '/prayer-times', icon: Clock, labelKey: 'prayerTimes' as const },
  { path: '/qibla', icon: Compass, labelKey: 'qibla' as const },
  { path: '/radio', icon: Radio, labelKey: 'radio' as const },
];
 
type QuranFontId = 'uthmanic' | 'amiri' | 'noto' | 'noto-naskh' | 'scheherazade';

const THEME_COLOR_SWATCHES: { id: ThemeColorId; swatch: string }[] = [
  { id: 'emerald', swatch: 'hsl(158, 64%, 28%)' },
  { id: 'gold', swatch: 'hsl(43, 74%, 42%)' },
  { id: 'teal', swatch: 'hsl(170, 55%, 32%)' },
  { id: 'blue', swatch: 'hsl(217, 70%, 42%)' },
  { id: 'violet', swatch: 'hsl(263, 70%, 42%)' },
  { id: 'rose', swatch: 'hsl(350, 65%, 45%)' },
  { id: 'orange', swatch: 'hsl(25, 85%, 45%)' },
  { id: 'sky', swatch: 'hsl(199, 89%, 42%)' },
  { id: 'cyan', swatch: 'hsl(187, 75%, 38%)' },
  { id: 'lime', swatch: 'hsl(84, 65%, 35%)' },
];

const QURAN_FONT_OPTIONS: { id: QuranFontId; labelKey: 'quranFontUthmanic' | 'quranFontAmiri' | 'quranFontNoto' | 'quranFontNotoNaskh' | 'quranFontScheherazade' }[] = [
  { id: 'uthmanic', labelKey: 'quranFontUthmanic' },
  { id: 'amiri', labelKey: 'quranFontAmiri' },
  { id: 'noto', labelKey: 'quranFontNoto' },
  { id: 'noto-naskh', labelKey: 'quranFontNotoNaskh' },
  { id: 'scheherazade', labelKey: 'quranFontScheherazade' },
];

export function Header() {
  const { t, language } = useTranslation();
  const { theme, toggleTheme, setLanguage, themeColor, setThemeColor, quranFont, setQuranFont, direction } = useAppStore();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Solid header so nav and buttons are always visible (no transparent/light-text on homepage)
  const headerBg = 'bg-background/95 backdrop-blur-md border-b border-border/50';
  const useLightText = false;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <div className="container max-w-[1600px]">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-lg text-primary-foreground font-bold">ق</span>
              </div>
              <span className={`text-xl font-bold ${useLightText ? 'text-primary-foreground' : 'text-foreground'}`}>
                {t('appName')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 flex-nowrap flex-shrink-0 min-w-0">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : useLightText
                        ? 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className={useLightText ? 'text-primary-foreground hover:bg-primary-foreground/10' : ''}
              >
                <Globe className="w-4 h-4" />
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleTheme}
                className={useLightText ? 'text-primary-foreground hover:bg-primary-foreground/10' : ''}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Settings: App Color + Quran Font */}
              <DropdownMenu dir={direction}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={useLightText ? 'text-primary-foreground hover:bg-primary-foreground/10' : ''}
                    aria-label={t('settings')}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>{t('appColor')}</DropdownMenuLabel>
                  <div className="grid grid-cols-5 gap-1 py-1.5">
                    {THEME_COLOR_SWATCHES.map(({ id, swatch }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setThemeColor(id)}
                        className={`h-5 w-5 rounded border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 ${themeColor === id ? 'border-foreground ring-2 ring-primary ring-offset-1' : 'border-transparent'}`}
                        style={{ backgroundColor: swatch }}
                        aria-label={id}
                        aria-pressed={themeColor === id}
                      />
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{t('quranFont')}</DropdownMenuLabel>
                  {QURAN_FONT_OPTIONS.map(({ id, labelKey }) => (
                    <DropdownMenuItem
                      key={id}
                      onClick={() => setQuranFont(id)}
                      className={quranFont === id ? 'bg-primary/15 text-primary font-medium' : ''}
                    >
                      {t(labelKey)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={`lg:hidden ${useLightText ? 'text-primary-foreground hover:bg-primary-foreground/10' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Gold accent line */}
      {isScrolled && (
        <div className="fixed top-16 inset-x-0 h-[1px] z-50 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-background border-b border-border shadow-lg islamic-pattern-light"
          >
            <nav className="container py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
