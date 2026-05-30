import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, BookText, Play, Search, Brain, Calendar, Share2, Users } from 'lucide-react';
import { SurahList } from '@/components/SurahList';
import { useTranslation } from '@/hooks/useTranslation';
import { PageHeader } from '@/components/PageHeader';

export default function QuranPage() {
  const { t } = useTranslation();

  const linkClasses = "btn-islamic inline-flex items-center justify-center gap-3 rounded-xl text-base font-semibold transition-all h-auto px-6 py-3";
  const primaryLinkClasses = `${linkClasses} bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl`;
  const outlineLinkClasses = `${linkClasses} border border-primary/30 hover:bg-primary/10 hover:border-accent/50 bg-background`;

  return (
    <div>
      <main>
        {/* Page Header */}
        <div className="container max-w-6xl">
          <PageHeader
            icon={BookOpen}
            title={t('quranKareem')}
            subtitle={t('quranSubtitle')}
          />
        </div>

        {/* Action Buttons */}
        <div className="container max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Link to="/search" className={primaryLinkClasses}>
              <Search className="w-5 h-5" />
              {t('search')}
            </Link>
            <Link to="/mushaf" className={outlineLinkClasses}>
              <BookOpen className="w-5 h-5 text-primary" />
              {t('browseMushaf')}
            </Link>
            <Link to="/reciters" className={outlineLinkClasses}>
              <Users className="w-5 h-5 text-primary" />
              {t('recitersPageTitle')}
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
          </motion.div>
        </div>
        <SurahList />
      </main>
    </div>
  );
}