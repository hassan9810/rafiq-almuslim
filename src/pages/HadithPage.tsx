import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquareQuote, Search, Book, Heart, Loader2, ChevronRight, Star } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { hadithCollections, fetchHadith, Hadith } from '@/lib/hadithApi';
import { Input } from '@/components/ui/input';

export default function HadithPage() {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  const [selectedCollection, setSelectedCollection] = useState(hadithCollections[0]);
  const [hadithNumber, setHadithNumber] = useState('');
  const [currentHadith, setCurrentHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const loadHadith = async () => {
    if (!hadithNumber) return;
    setLoading(true);
    const langPrefix = language === 'ar' ? 'ara' : 'eng';
    const hadith = await fetchHadith(`${langPrefix}-${selectedCollection.id}`, parseInt(hadithNumber));
    setCurrentHadith(hadith);
    setLoading(false);
  };

  const loadRandomHadith = async () => {
    setLoading(true);
    // For Ahmad, use maxApiIndex (4305) instead of total hadiths count
    const maxNumber = (selectedCollection as any).maxApiIndex || selectedCollection.hadiths;
    const randomNum = Math.floor(Math.random() * Math.min(maxNumber, 500)) + 1;
    const langPrefix = language === 'ar' ? 'ara' : 'eng';
    const hadith = await fetchHadith(`${langPrefix}-${selectedCollection.id}`, randomNum);
    setCurrentHadith(hadith);
    setHadithNumber(randomNum.toString());
    setLoading(false);
  };

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
              <MessageSquareQuote className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {language === 'ar' ? 'الحديث الشريف' : 'Hadith'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'اقرأ أحاديث النبي صلى الله عليه وسلم من الكتب الستة'
                : 'Read the sayings of Prophet Muhammad ﷺ from the six major collections'}
            </p>
          </motion.div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="browse">
                {language === 'ar' ? 'تصفح' : 'Browse'}
              </TabsTrigger>
              <TabsTrigger value="search">
                {language === 'ar' ? 'بحث' : 'Search'}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              {/* Collections Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {hadithCollections.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedCollection.id === collection.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedCollection(collection)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-arabic text-lg font-bold text-right" dir="rtl">
                              {collection.nameAr}
                            </h3>
                            <p className="text-sm text-muted-foreground">{collection.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{collection.author}</p>
                          </div>
                          <Book className="w-8 h-8 text-primary/50" />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Badge variant="secondary">
                            {collection.hadiths.toLocaleString()} {language === 'ar' ? 'حديث' : 'hadiths'}
                          </Badge>
                          {selectedCollection.id === collection.id && (
                            <ChevronRight className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Hadith Lookup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    {selectedCollection.name}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ar' 
                      ? 'أدخل رقم الحديث للقراءة'
                      : 'Enter hadith number to read'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={language === 'ar' ? 'رقم الحديث...' : 'Hadith number...'}
                      value={hadithNumber}
                      onChange={(e) => setHadithNumber(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadHadith()}
                      min={1}
                      max={(selectedCollection as any).maxApiIndex || selectedCollection.hadiths}
                    />
                    <Button onClick={loadHadith} disabled={loading || !hadithNumber}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'اقرأ' : 'Read')}
                    </Button>
                    <Button variant="outline" onClick={loadRandomHadith} disabled={loading}>
                      {language === 'ar' ? 'عشوائي' : 'Random'}
                    </Button>
                  </div>

                  {currentHadith && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <Card className="bg-muted/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <Badge variant="outline">
                              {language === 'ar' ? 'حديث رقم' : 'Hadith #'}{currentHadith.hadithnumber}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(`${selectedCollection.id}-${currentHadith.hadithnumber}`)}
                            >
                              <Heart 
                                className={`w-5 h-5 ${
                                  favorites.includes(`${selectedCollection.id}-${currentHadith.hadithnumber}`)
                                    ? 'fill-red-500 text-red-500'
                                    : ''
                                }`} 
                              />
                            </Button>
                          </div>
                          
                          <p className={`text-lg leading-relaxed ${language === 'ar' ? 'font-arabic text-right' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            {currentHadith.text}
                          </p>

                          {currentHadith.grades && currentHadith.grades.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <p className="text-sm text-muted-foreground mb-2">
                                {language === 'ar' ? 'التصنيف:' : 'Grades:'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {currentHadith.grades.map((grade, idx) => (
                                  <Badge 
                                    key={idx} 
                                    variant={grade.grade.toLowerCase().includes('sahih') ? 'default' : 'secondary'}
                                  >
                                    {grade.name}: {grade.grade}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="search">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    {language === 'ar' ? 'البحث في الأحاديث' : 'Search Hadiths'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquareQuote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="mb-4">
                      {language === 'ar' 
                        ? 'للبحث، يرجى استخدام رقم الحديث في تبويب "تصفح"' 
                        : 'To search, please use the hadith number in the "Browse" tab'}
                    </p>
                    <p className="text-sm">
                      {language === 'ar' 
                        ? 'اختر مجموعة الأحاديث وأدخل رقم الحديث للقراءة' 
                        : 'Select a hadith collection and enter the hadith number to read'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
