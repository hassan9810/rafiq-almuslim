import { Link } from 'react-router-dom';
import { BookOpen, BookText } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SurahList } from '@/components/SurahList';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

export default function QuranPage() {
  const { language } = useTranslation();
  const { direction } = useAppStore();

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <Header />
      <main className="pt-24 pb-16">
        {/* Page Header */}
        <div className="container max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold text-foreground mb-2">
              {language === 'ar' ? 'القرآن الكريم' : 'Quran'}
            </h1>
            <p className="font-arabic text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' ? 'اقرأ واستمع إلى القرآن الكريم' : 'Read and listen to the Holy Quran'}
            </p>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="container max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
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