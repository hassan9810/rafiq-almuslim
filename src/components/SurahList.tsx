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
}

function SurahCard({ surah, index, isFavorite, onToggleFavorite, onClick }: SurahCardProps) {
  const { t, language } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="surah-card group relative bg-card rounded-xl p-4 border border-border/50 cursor-pointer"
      onClick={onClick}
    >
      {/* Surah Number */}
      <div className="absolute -top-3 -left-3 w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
        <span className="text-sm font-bold text-primary-foreground">{surah.number}</span>
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-accent/10 transition-colors"
      >
        <Star 
          className={`w-4 h-4 transition-colors ${
            isFavorite ? 'fill-accent text-accent' : 'text-muted-foreground'
          }`} 
        />
      </button>

      <div className="pt-4">
        {/* Arabic Name */}
        <h3 className="font-arabic text-2xl text-foreground mb-1 text-right">
          {surah.name}
        </h3>
        
        {/* English Name (Transliteration only) */}
        <p className="text-sm font-medium text-foreground">{surah.englishName}</p>

        {/* Meta Info */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
          <Badge variant={surah.revelationType === 'Meccan' ? 'default' : 'secondary'} className="text-xs">
            {surah.revelationType === 'Meccan' ? t('makki') : t('madani')}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {surah.numberOfAyahs} {t('verses')}
          </span>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button variant="emerald" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <BookOpen className="w-4 h-4" />
          {t('quran')}
        </Button>
        <Button variant="gold" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

export function SurahList() {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { surahs, setSurahs, favorites, toggleFavorite } = useAppStore();
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

  const displayedSurahs = activeTab === 'favorites' 
    ? surahs.filter(s => favorites.includes(s.number))
    : surahs;

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{t('quran')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {language === 'ar' 
              ? 'تصفح جميع سور القرآن الكريم مع التلاوة والترجمة'
              : 'Explore all 114 surahs of the Holy Quran with recitation and translation'}
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">{t('allSurahs')}</TabsTrigger>
            <TabsTrigger value="favorites">{t('favorites')}</TabsTrigger>
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
              />
            ))}
          </div>
        )}

        {activeTab === 'favorites' && favorites.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No favorite surahs yet. Click the star icon on any surah to add it to favorites.</p>
          </div>
        )}
      </div>
    </section>
  );
}
