import { Link } from 'react-router-dom';
import { Heart, Github, Mail, Send } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { IslamicDivider } from './IslamicDivider';

export function Footer() {
  const { t, language } = useTranslation();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Islamic pattern overlay */}
      <div className="absolute inset-0 islamic-pattern-light pointer-events-none" />

      <div className="container py-12 relative z-10">
        {/* Ornamental divider at top */}
        <IslamicDivider className="mb-8" variant="gold" width={280} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent/80 flex items-center justify-center shadow-glow">
                <span className="font-arabic text-lg text-primary-foreground font-bold">ق</span>
              </div>
              <span className="text-xl font-bold text-gradient-emerald">{t('appName')}</span>
            </div>
            <p className="font-arabic text-sm text-muted-foreground">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-arabic font-semibold text-foreground mb-4">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/quran" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('quran')}</Link></li>
              <li><Link to="/tafsir" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('tafsir')}</Link></li>
              <li><Link to="/hadith" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('hadith')}</Link></li>
              <li><Link to="/translations" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('translations')}</Link></li>
              <li><Link to="/prayer-times" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('prayerTimes')}</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-arabic font-semibold text-foreground mb-4">
              {t('features')}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/hisn-muslim" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('hisnMuslim')}</Link></li>
              <li><Link to="/radio" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('radio')}</Link></li>
              <li><Link to="/qibla" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('qibla')}</Link></li>
              <li><Link to="/azkar" onClick={scrollToTop} className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('azkar')}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t('connect')}
            </h3>
            <div className="flex gap-3">
              <a
                href="https://t.me/ah_9810"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
              {/* <a 
                href="https://github.com/hassan9810" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a> */}
              <a
                href="mailto:rafeeq.almuslim@gmail.com"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12">
          <IslamicDivider className="mb-6" variant="muted" width={160} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {t('appName')}.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {t('madeWith')} <Heart className="w-4 h-4 text-destructive fill-destructive" /> {t('forTheUmmah')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}