import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookText, Search, ChevronRight, ChevronLeft, Loader2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchE3rabBySurah, surahNames, E3rabItem } from '@/lib/e3rabApi';

export default function E3rabPage() {
  const { language } = useTranslation();
  const { direction } = useAppStore();
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [e3rabData, setE3rabData] = useState<E3rabItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAyah, setExpandedAyah] = useState<number | null>(null);

  useEffect(() => {
    loadE3rabData(selectedSurah);
  }, [selectedSurah]);

  const loadE3rabData = async (surahNum: number) => {
    setLoading(true);
    const data = await fetchE3rabBySurah(surahNum);
    setE3rabData(data);
    setExpandedAyah(null);
    setLoading(false);
  };

  const currentSurah = surahNames.find(s => s.number === selectedSurah);

  const filteredData = searchQuery
    ? e3rabData.filter(item => 
        item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aya.toString().includes(searchQuery)
      )
    : e3rabData;

  const goToNextSurah = () => {
    if (selectedSurah < 114) {
      setSelectedSurah(selectedSurah + 1);
    }
  };

  const goToPreviousSurah = () => {
    if (selectedSurah > 1) {
      setSelectedSurah(selectedSurah - 1);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-5xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <BookText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-arabic mb-2">
              إعراب القرآن الكريم
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-arabic">
              تعلم إعراب آيات القرآن الكريم مع شرح تفصيلي للقواعد النحوية والصرفية
            </p>
          </motion.div>

          {/* Back to Quran */}
          <div className="mb-6">
            <Link to="/quran">
              <Button variant="outline" className="gap-2">
                <BookOpen className="w-4 h-4" />
                {language === 'ar' ? 'العودة للقرآن' : 'Back to Quran'}
              </Button>
            </Link>
          </div>

          {/* Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Surah Selector */}
                <div className="flex-1">
                  <Select
                    value={selectedSurah.toString()}
                    onValueChange={(value) => setSelectedSurah(parseInt(value))}
                  >
                    <SelectTrigger className="w-full font-arabic">
                      <SelectValue placeholder="اختر السورة" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {surahNames.map((surah) => (
                        <SelectItem 
                          key={surah.number} 
                          value={surah.number.toString()}
                          className="font-arabic"
                        >
                          {surah.number}. {surah.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={direction === 'rtl' ? goToNextSurah : goToPreviousSurah}
                    disabled={direction === 'rtl' ? selectedSurah >= 114 : selectedSurah <= 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={direction === 'rtl' ? goToPreviousSurah : goToNextSurah}
                    disabled={direction === 'rtl' ? selectedSurah <= 1 : selectedSurah >= 114}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={language === 'ar' ? 'البحث في الإعراب...' : 'Search in e3rab...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10 font-arabic"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Surah Info */}
          {currentSurah && (
            <motion.div
              key={selectedSurah}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {selectedSurah}
                      </Badge>
                      <span className="font-arabic text-2xl">{currentSurah.name}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {e3rabData.length} {language === 'ar' ? 'آية' : 'verses'}
                    </span>
                  </CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          )}

          {/* E3rab Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-400px)] min-h-[400px]">
              <div className="space-y-4 pb-8">
                <AnimatePresence mode="popLayout">
                  {filteredData.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          expandedAyah === item.aya ? 'ring-2 ring-primary shadow-lg' : ''
                        }`}
                        onClick={() => setExpandedAyah(expandedAyah === item.aya ? null : item.aya)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* Ayah Number Badge */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-arabic text-primary font-bold">
                                  {item.aya}
                                </span>
                              </div>
                            </div>

                            {/* E3rab Content */}
                            <div className="flex-1 min-w-0">
                              <div 
                                className={`font-arabic text-base leading-loose prose prose-sm max-w-none ${
                                  expandedAyah === item.aya ? '' : 'line-clamp-3'
                                }`}
                                dir="rtl"
                                dangerouslySetInnerHTML={{ __html: item.text }}
                              />
                              
                              {item.text.length > 200 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-primary font-arabic"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedAyah(expandedAyah === item.aya ? null : item.aya);
                                  }}
                                >
                                  {expandedAyah === item.aya 
                                    ? (language === 'ar' ? 'عرض أقل' : 'Show less')
                                    : (language === 'ar' ? 'عرض المزيد' : 'Show more')
                                  }
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredData.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <BookText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground font-arabic">
                      {searchQuery 
                        ? (language === 'ar' ? 'لا توجد نتائج للبحث' : 'No search results')
                        : (language === 'ar' ? 'لا يوجد إعراب لهذه السورة' : 'No e3rab available for this surah')
                      }
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
