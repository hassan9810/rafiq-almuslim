import { Link } from 'react-router-dom';
import { Heart, Github, Mail, Send } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { t, language } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="font-arabic text-lg text-primary-foreground font-bold">ق</span>
              </div>
              <span className="text-xl font-bold text-foreground">{t('appName')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' 
                ? 'رفيقك الروحي لتلاوة القرآن والتعلم والصلوات اليومية'
                : 'Your spiritual companion for Quran recitation, learning, and daily prayers'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/quran" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('quran')}</Link></li>
              <li><Link to="/tafsir" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('tafsir')}</Link></li>
              <li><Link to="/hadith" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('hadith')}</Link></li>
              <li><Link to="/translations" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('translations')}</Link></li>
              <li><Link to="/prayer-times" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('prayerTimes')}</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === 'ar' ? 'الميزات' : 'Features'}
            </h3>
            <ul className="space-y-2">
              <li><Link to="/hisn-muslim" className="text-sm text-muted-foreground hover:text-primary transition-colors">{language === 'ar' ? 'حصن المسلم' : 'Hisn Muslim'}</Link></li>
              <li><Link to="/radio" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('radio')}</Link></li>
              <li><Link to="/qibla" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('qibla')}</Link></li>
              <li><Link to="/azkar" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('azkar')}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {language === 'ar' ? 'تواصل معنا' : 'Connect'}
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
              <a 
                href="https://github.com/hassan9810" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="mailto:ahmed.hassan.shehatah@gmail.com" 
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {t('appName')}.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            {language === 'ar' ? 'صُنع بـ' : 'Made with'} <Heart className="w-4 h-4 text-destructive fill-destructive" /> {language === 'ar' ? 'للمسلمين' : 'for the Ummah'}
          </p>
        </div>
      </div>
    </footer>
  );
}