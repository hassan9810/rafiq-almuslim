import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Play, BookOpen, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { fetchSurahs, type Surah } from '@/lib/quranApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SurahCardProps {
  surah: Surah;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
  animateDelay?: number;
}

function SurahCard({ surah, index, isFavorite, onToggleFavorite, onClick, animateDelay = 0 }: SurahCardProps) {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  return (
    <motion.div
      dir={direction}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: animateDelay }}
      className="surah-card card-islamic gold-hover group relative bg-card hover:bg-primary/5 rounded-xl p-4 border border-border/50 cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      tabIndex={0}
      role="button"
    >
      {/* Surah Number - Islamic octagon */}
      <div className="group-hover:opacity-100 transition-all absolute -top-3 -left-3 w-10 h-10 surah-number bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
        <span className="text-sm font-bold text-primary-foreground">{surah.number}</span>
      </div>

      <div className="pt-4">
        {language === 'ar' ? (
          <>
            <h3 className="font-arabic text-2xl text-foreground mb-1 text-right">
              {surah.name}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">{surah.englishName}</p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-semibold text-foreground mb-1">
              {surah.englishName}
            </h3>
            <p className="font-arabic text-sm text-muted-foreground text-right">{surah.name}</p>
          </>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50">
          <span className="flex items-center gap-2">
            <Badge 
              variant={surah.revelationType === 'Meccan' ? 'default' : 'secondary'} 
              className={`text-xs ${surah.revelationType === 'Meccan' ? 'bg-accent/15 text-accent border-accent/30 hover:bg-accent/20' : 'bg-primary/15 text-primary border-primary/30 hover:bg-primary/20'}`}
            >              {surah.revelationType === 'Meccan' ? t('makki') : t('madani')}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {surah.numberOfAyahs} {t('verses')}
            </span>
          </span>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
          >
            <Star
              className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
                }`}
            />
          </button>

        </div>
      </div>

    </motion.div>
  );
}

export function SurahList() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { surahs, setSurahs, favorites, toggleFavorite, bookmarks, recentReads, direction } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadSurahs = async () => {
      if (surahs.length === 0) {
        const data = await fetchSurahs();
        setSurahs(data);
      }
      setLoading(false);
    };
    loadSurahs();
  }, [surahs.length, setSurahs]);

  const bookmarkedSurahNumbers = [...new Set(bookmarks.map(b => b.surah))];
  const recentSurahNumbers = [...new Map(recentReads.map(r => [r.surah, r.timestamp])).keys()];

  const displayedSurahs = activeTab === 'favorites'
    ? surahs.filter(s => favorites.includes(s.number))
    : activeTab === 'bookmarks'
      ? surahs.filter(s => bookmarkedSurahNumbers.includes(s.number))
      : activeTab === 'recent'
        ? surahs
          .filter(s => recentSurahNumbers.includes(s.number))
          .sort((a, b) => recentSurahNumbers.indexOf(a.number) - recentSurahNumbers.indexOf(b.number))
        : surahs;

  return (
    <section className="pt-6 bg-background">
      <div className="container">
        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8" dir={direction}>
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="all">{t('allSurahs')}</TabsTrigger>
            <TabsTrigger value="favorites">{t('favorites')}</TabsTrigger>
            <TabsTrigger value="bookmarks">{t('bookmarks')}</TabsTrigger>
            <TabsTrigger value="recent">{t('recentReads')}</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Surah Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedSurahs.map((surah, index) => (
              <SurahCard
                key={surah.number}
                surah={surah}
                index={index}
                isFavorite={favorites.includes(surah.number)}
                onToggleFavorite={() => toggleFavorite(surah.number)}
                onClick={() => navigate(`/quran/${surah.number}`)}
                animateDelay={['favorites', 'bookmarks', 'recent'].includes(activeTab) ? 0 : index * 0.015}
              />
            ))}
          </div>
        )}

        {!loading && displayedSurahs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {activeTab === 'favorites' && <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />}
            <p>{t('noItemsToDisplay')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
