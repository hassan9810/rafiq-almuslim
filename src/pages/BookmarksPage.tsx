import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkMinus, ChevronRight, BookOpen, Star } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { fetchSurahs, type Surah } from '@/lib/quranApi';

export default function BookmarksPage() {
  const { t, language } = useTranslation();
  const { direction, bookmarks, removeBookmark, favorites, toggleFavorite } = useAppStore();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurahs = async () => {
      const data = await fetchSurahs();
      setSurahs(data);
      setLoading(false);
    };
    loadSurahs();
  }, []);

  const getSurahName = (surahNum: number) => {
    const surah = surahs.find((s) => s.number === surahNum);
    if (!surah) return `Surah ${surahNum}`;
    return language === 'ar' ? surah.name : surah.englishName;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir={direction}>
        <Header />
        <main className="pt-24 pb-16">
          <div className="container max-w-3xl py-12">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <Header />
      <main className="pt-24 pb-16">
        <div className="container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <Bookmark className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-arabic text-3xl md:text-4xl font-bold mb-2">
              {t('bookmarks')}
            </h1>
            <p className="font-arabic text-muted-foreground max-w-2xl mx-auto">
              {favorites.length} {favorites.length === 1 ? t('favorite') : t('favorites')} · {bookmarks.length} {bookmarks.length === 1 ? t('bookmark') : t('bookmarks')}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
          {/* Favorites Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-12"
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-accent fill-accent" />
              {t('favorites')}
            </h2>
            {favorites.length === 0 ? (
              <div className="py-8 px-6 rounded-2xl border border-dashed border-border bg-card/30 text-center">
                <p className="text-muted-foreground text-sm">{t('noFavorites')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {favorites
                  .slice()
                  .sort((a, b) => a - b)
                  .map((surahNum, index) => (
                    <motion.div
                      key={surahNum}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        to={`/quran/${surahNum}`}
                        className="group flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:bg-card/80 transition-all block"
                      >
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <Star className="w-6 h-6 text-accent fill-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="  font-semibold text-foreground truncate">
                            {getSurahName(surahNum)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {surahs.find((s) => s.number === surahNum)?.numberOfAyahs} {t('verses')}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(surahNum);
                          }}
                          className="opacity-70 hover:opacity-100 hover:text-destructive flex-shrink-0"
                          title={t('removeFavorite')}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
              </div>
            )}
          </motion.section>

          {/* Bookmarks Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary fill-primary" />
              {t('bookmarks')}
            </h2>
          {bookmarks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 px-6 rounded-2xl border border-dashed border-border bg-card/50"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t('noBookmarks')}
              </h2>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                {t('noBookmarksHint')}
              </p>
              <Link to="/quran">
                <Button className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  {t('startReading')}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark, index) => (
                <motion.div
                  key={`${bookmark.surah}-${bookmark.ayah}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    to={`/quran/${bookmark.surah}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:bg-card/80 transition-all block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bookmark className="w-6 h-6 text-primary fill-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="  font-semibold text-foreground truncate">
                        {getSurahName(bookmark.surah)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('ayah')} {bookmark.ayah.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeBookmark(bookmark.surah, bookmark.ayah);
                      }}
                      className="opacity-70 hover:opacity-100 hover:text-destructive flex-shrink-0"
                      title={t('removeBookmark')}
                    >
                      <BookmarkMinus className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          </motion.section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
