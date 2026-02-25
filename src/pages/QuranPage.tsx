import { Link } from 'react-router-dom';
import { BookOpen, BookText, Play, Search, Brain, Calendar, Share2 } from 'lucide-react';
import { SurahList } from '@/components/SurahList';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function QuranPage() {
  const { t } = useTranslation();

  return (
    <div>
      <main>
        {/* Page Header */}
        <div className="container max-w-6xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold text-foreground mb-2">
              {t('quranKareem')}
            </h1>
            <p className="font-arabic text-muted-foreground max-w-2xl mx-auto">
              {t('quranSubtitle')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="container max-w-6xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/search">
              <Button className="gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all">
                <Search className="w-5 h-5" />
                {t('search')}
              </Button>
            </Link>
            <Link to="/mushaf">
              <Button variant="outline" className="gap-3 px-6 py-3 h-auto text-base font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary transition-all">
                <BookOpen className="w-5 h-5 text-primary" />
                {t('browseMushaf')}
              </Button>
            </Link>
            <Link to="/ayah-player">
              <Button variant="outline" className="gap-3 px-6 py-3 h-auto text-base font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary transition-all">
                <Play className="w-5 h-5 text-primary" />
                {t('ayahByAyah')}
              </Button>
            </Link>
            <Link to="/e3rab">
              <Button variant="outline" className="gap-3 px-6 py-3 h-auto text-base font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary transition-all">
                <BookText className="w-5 h-5 text-primary" />
                {t('quranGrammar')}
              </Button>
            </Link>
            <Link to="/memorization">
              <Button variant="outline" className="gap-3 px-6 py-3 h-auto text-base font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary transition-all">
                <Brain className="w-5 h-5 text-primary" />
                {t('memorization')}
              </Button>
            </Link>
            <Link to="/reading-plan">
              <Button variant="outline" className="gap-3 px-6 py-3 h-auto text-base font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary transition-all">
                <Calendar className="w-5 h-5 text-primary" />
                {t('readingPlan')}
              </Button>
            </Link>
            <Link to="/share-ayah">
              <Button variant="outline" className="gap-3 px-6 py-3 h-auto text-base font-semibold border-primary/30 hover:bg-primary/10 hover:border-primary transition-all">
                <Share2 className="w-5 h-5 text-primary" />
                {t('shareAyah')}
              </Button>
            </Link>
          </div>
        </div>
        <SurahList />
      </main>
    </div>
  );
}