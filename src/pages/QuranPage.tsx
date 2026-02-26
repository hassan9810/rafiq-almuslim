import { Link } from 'react-router-dom';
import { BookOpen, BookText, Play, Search, Brain, Calendar, Share2 } from 'lucide-react';
import { SurahList } from '@/components/SurahList';
import { useTranslation } from '@/hooks/useTranslation';

export default function QuranPage() {
  const { t } = useTranslation();

  const linkClasses = "inline-flex items-center justify-center gap-3 rounded-md text-base font-semibold transition-all h-auto px-6 py-3";
  const primaryLinkClasses = `${linkClasses} bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl`;
  const outlineLinkClasses = `${linkClasses} border border-primary/30 hover:bg-primary/10 hover:border-primary bg-background`;

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
            <Link to="/search" className={primaryLinkClasses}>
              <Search className="w-5 h-5" />
              {t('search')}
            </Link>
            <Link to="/mushaf" className={outlineLinkClasses}>
              <BookOpen className="w-5 h-5 text-primary" />
              {t('browseMushaf')}
            </Link>
            <Link to="/ayah-player" className={outlineLinkClasses}>
              <Play className="w-5 h-5 text-primary" />
              {t('ayahByAyah')}
            </Link>
            <Link to="/e3rab" className={outlineLinkClasses}>
              <BookText className="w-5 h-5 text-primary" />
              {t('quranGrammar')}
            </Link>
            <Link to="/memorization" className={outlineLinkClasses}>
              <Brain className="w-5 h-5 text-primary" />
              {t('memorization')}
            </Link>
            <Link to="/reading-plan" className={outlineLinkClasses}>
              <Calendar className="w-5 h-5 text-primary" />
              {t('readingPlan')}
            </Link>
            <Link to="/share-ayah" className={outlineLinkClasses}>
              <Share2 className="w-5 h-5 text-primary" />
              {t('shareAyah')}
            </Link>
          </div>
        </div>
        <SurahList />
      </main>
    </div>
  );
}