import { Link } from 'react-router-dom';
import { BookOpen, BookText } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SurahList } from '@/components/SurahList';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function QuranPage() {
  const { language } = useTranslation();

  return (
    <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <main className="pt-20">
        {/* Action Buttons */}
        <div className="container max-w-6xl py-6">
          <div className="flex flex-wrap gap-3">
            <Link to="/mushaf">
              <Button className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                <BookOpen className="w-5 h-5" />
                {language === 'ar' ? 'تصفح المصحف الشريف' : 'Browse Mushaf'}
              </Button>
            </Link>
            <Link to="/e3rab">
              <Button variant="outline" className="gap-3 px-6 py-3 h-auto text-base font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary transition-all">
                <BookText className="w-5 h-5 text-primary" />
                {language === 'ar' ? 'إعراب القرآن الكريم' : 'Quran Grammar (E3rab)'}
              </Button>
            </Link>
          </div>
        </div>
        <SurahList />
      </main>
      <Footer />
    </div>
  );
}