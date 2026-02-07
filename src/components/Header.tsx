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
  BookMarked,
  MessageSquareQuote,
  Shield,
  Languages,
  BookImage
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/quran', icon: BookOpen, labelKey: 'quran' as const },
  { path: '/mushaf', icon: BookImage, labelKey: 'mushaf' as const },
  { path: '/tafsir', icon: BookMarked, labelKey: 'tafsir' as const },
  { path: '/hadith', icon: MessageSquareQuote, labelKey: 'hadith' as const },
  { path: '/translations', icon: Languages, labelKey: 'translations' as const },
  { path: '/azkar', icon: Mic2, labelKey: 'azkar' as const },
  { path: '/hisn-muslim', icon: Shield, labelKey: 'hisnMuslim' as const },
  { path: '/prayer-times', icon: Clock, labelKey: 'prayerTimes' as const },
  { path: '/qibla', icon: Compass, labelKey: 'qibla' as const },
  { path: '/radio', icon: Radio, labelKey: 'radio' as const },
];

export function Header() {
  const { t, language } = useTranslation();
  const { theme, toggleTheme, setLanguage } = useAppStore();
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

  const isHomePage = location.pathname === '/';
  const isDarkMode = theme === 'dark';
  
  // Header background logic
  const getHeaderBg = () => {
    if (isScrolled) {
      return 'bg-background/95 backdrop-blur-md border-b border-border/50';
    }
    if (isHomePage) {
      // Dark mode: same as scrolled state, Light mode: transparent
      return isDarkMode 
        ? 'bg-background/95 backdrop-blur-md border-b border-border/50' 
        : 'bg-transparent';
    }
    return 'bg-background/95 backdrop-blur-md border-b border-border/50';
  };
  
  const headerBg = getHeaderBg();
  
  // Use light text only on homepage in light mode (transparent bg)
  const useLightText = isHomePage && !isScrolled && !isDarkMode;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="font-arabic text-lg text-primary-foreground font-bold">ق</span>
              </div>
              <span className={`text-xl font-bold ${useLightText ? 'text-primary-foreground' : 'text-foreground'}`}>
                {t('appName')}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 lg:hidden bg-background border-b border-border shadow-lg"
          >
            <nav className="container py-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
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
