import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookMarked, Search, ChevronDown, Book, Languages, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { tafsirEditions, fetchTafsir, TafsirAyah } from '@/lib/tafsirApi';
import { fetchSurah, fetchSurahs, Surah, SurahData } from '@/lib/quranApi';

export default function TafsirPage() {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedTafsir, setSelectedTafsir] = useState(tafsirEditions[0].slug);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [tafsirData, setTafsirData] = useState<TafsirAyah[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSurahs().then(setSurahs);
  }, []);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [surah, tafsir] = await Promise.all([
        fetchSurah(selectedSurah),
        fetchTafsir(selectedTafsir, selectedSurah)
      ]);
      setSurahData(surah);
      setTafsirData(tafsir);
      setLoading(false);
    }
    loadData();
  }, [selectedSurah, selectedTafsir]);

  const currentTafsirEdition = tafsirEditions.find(e => e.slug === selectedTafsir);
  
  const filteredEditions = tafsirEditions.filter(edition => {
    const query = searchQuery.toLowerCase();
    const nameMatch = edition.name.toLowerCase().includes(query);
    const nameArMatch = edition.nameAr?.includes(searchQuery) || false;
    const authorMatch = edition.author.toLowerCase().includes(query);
    const authorArMatch = edition.authorAr?.includes(searchQuery) || false;
    const langMatch = edition.language.toLowerCase().includes(query);
    
    return nameMatch || nameArMatch || authorMatch || authorArMatch || langMatch;
  });

  const groupedEditions = filteredEditions.reduce((acc, edition) => {
    const lang = edition.language;
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(edition);
    return acc;
  }, {} as Record<string, typeof tafsirEditions>);

  return (
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
              <BookMarked className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'ar' ? 'التفسير' : 'Tafsir'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'اقرأ تفسير القرآن الكريم من أشهر المفسرين'
                : 'Read Quran interpretation from renowned scholars'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Tafsir Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    {language === 'ar' ? 'اختر التفسير' : 'Select Tafsir'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={language === 'ar' ? 'ابحث...' : 'Search...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4 pr-4">
                      {Object.entries(groupedEditions).map(([lang, editions]) => (
                        <div key={lang}>
                          <h4 className="text-sm font-semibold text-muted-foreground mb-2 capitalize">
                            {lang}
                          </h4>
                          <div className="space-y-1">
                            {editions.map((edition) => (
                              <button
                                key={edition.slug}
                                onClick={() => setSelectedTafsir(edition.slug)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                  selectedTafsir === edition.slug
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                }`}
                              >
                                <div className="font-medium">
                                  {language === 'ar' && edition.nameAr ? edition.nameAr : edition.name}
                                </div>
                                <div className={`text-xs ${selectedTafsir === edition.slug ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                  {language === 'ar' && edition.authorAr ? edition.authorAr : edition.author}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              {/* Surah Selector */}
              <Card className="mb-6">
                <CardContent className="py-4">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Book className="w-5 h-5 text-primary" />
                      <span className="font-medium">
                        {language === 'ar' ? 'السورة:' : 'Surah:'}
                      </span>
                    </div>
                    <Select
                      value={selectedSurah.toString()}
                      onValueChange={(v) => setSelectedSurah(parseInt(v))}
                    >
                      <SelectTrigger className="w-[280px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-[300px]">
                          {surahs.map((surah) => (
                            <SelectItem key={surah.number} value={surah.number.toString()}>
                              {surah.number}. {surah.englishName} - {surah.name}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Tafsir Content */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-arabic text-2xl">
                        {surahData?.name}
                      </CardTitle>
                    <p className="text-muted-foreground">
                      {surahData?.englishName}
                    </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {language === 'ar' && currentTafsirEdition?.nameAr ? currentTafsirEdition.nameAr : currentTafsirEdition?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language === 'ar' && currentTafsirEdition?.authorAr ? currentTafsirEdition.authorAr : currentTafsirEdition?.author}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-6 pr-4">
                        {surahData?.ayahs.map((ayah, index) => {
                          const tafsirAyah = tafsirData?.find(t => t.ayah === ayah.numberInSurah) || tafsirData?.[index];
                          return (
                            <div key={ayah.number} className="border-b border-border/50 pb-6 last:border-0">
                              {/* Ayah */}
                              <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                  {ayah.numberInSurah}
                                </div>
                                <p className="font-arabic text-2xl leading-loose text-right flex-1" dir="rtl">
                                  {ayah.text}
                                </p>
                              </div>
                              
                              {/* Tafsir */}
                              {tafsirAyah && (
                                <div className="bg-muted/50 rounded-lg p-4 ml-14">
                                  <p className={`leading-relaxed ${currentTafsirEdition?.language === 'arabic' ? 'font-arabic text-right text-lg' : ''}`}
                                     dir={currentTafsirEdition?.language === 'arabic' ? 'rtl' : 'ltr'}>
                                    {tafsirAyah.text}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
