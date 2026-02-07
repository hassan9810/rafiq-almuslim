import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Globe, 
  Download,
  FileText,
  Book,
  Loader2,
  ExternalLink,
  Languages,
  BookOpen
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  fetchAvailableTranslations, 
  TranslationEdition,
  languageNames 
} from '@/lib/quranEncApi';

export default function TranslationsPage() {
  const navigate = useNavigate();
  const { language } = useTranslation();
  const { direction } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [translations, setTranslations] = useState<TranslationEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  const isArabic = language === 'ar';

  // Load translations on mount
  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        const localization = language === 'ar' ? 'ar' : 'en';
        const data = await fetchAvailableTranslations(undefined, localization);
        setTranslations(data);
        
        // Extract unique languages
        const languages = [...new Set(data.map(t => t.language_iso_code))].sort();
        setAvailableLanguages(languages);
      } catch (error) {
        console.error('Error loading translations:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTranslations();
  }, [language]);

  // Filter translations with defensive checks for API data
  const filteredTranslations = translations.filter(t => {
    const title = typeof t.title === 'string' ? t.title : '';
    const description = typeof t.description === 'string' ? t.description : '';
    const key = typeof t.key === 'string' ? t.key : '';
    const searchLower = searchQuery.toLowerCase();
    
    const matchesSearch = 
      title.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower) ||
      key.toLowerCase().includes(searchLower);
    
    const matchesLanguage = selectedLanguage === 'all' || t.language_iso_code === selectedLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  // Group by language
  const groupedTranslations = filteredTranslations.reduce((acc, t) => {
    const lang = t.language_iso_code;
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(t);
    return acc;
  }, {} as Record<string, TranslationEdition[]>);

  const getLanguageName = (code: string) => {
    const name = languageNames[code];
    if (name) {
      return isArabic ? name.native : name.en;
    }
    return code.toUpperCase();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(
      isArabic ? 'ar-EG' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  return (
    <div className={`min-h-screen bg-background ${direction === 'rtl' ? 'rtl' : 'ltr'}`} dir={direction}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container max-w-6xl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Languages className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {isArabic ? 'ترجمات القرآن الكريم' : 'Quran Translations'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {isArabic 
                ? 'اكتشف أكثر من 90 ترجمة للقرآن الكريم بلغات متعددة من مصادر موثوقة'
                : 'Discover over 90 Quran translations in multiple languages from trusted sources'
              }
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
              <Input
                placeholder={isArabic ? 'ابحث في الترجمات...' : 'Search translations...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={isArabic ? 'pr-10' : 'pl-10'}
              />
            </div>

            {/* Language Filter */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder={isArabic ? 'اختر اللغة' : 'Select Language'} />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">
                  {isArabic ? 'جميع اللغات' : 'All Languages'}
                </SelectItem>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {getLanguageName(lang)} ({lang.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{translations.length}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'ترجمة متاحة' : 'Translations'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{availableLanguages.length}</p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'لغة' : 'Languages'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {translations.filter(t => t.pdf_url).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'ملف PDF' : 'PDF Files'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">
                  {translations.filter(t => t.epub_url).length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? 'ملف EPUB' : 'EPUB Files'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : selectedLanguage !== 'all' ? (
            // Flat list when language is selected
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTranslations.map((translation) => (
                <TranslationCard 
                  key={translation.key} 
                  translation={translation}
                  isArabic={isArabic}
                  formatDate={formatDate}
                  getLanguageName={getLanguageName}
                  onRead={(key) => navigate(`/translations/${key}/1`)}
                />
              ))}
            </div>
          ) : (
            // Grouped by language
            <div className="space-y-8">
              {Object.entries(groupedTranslations).map(([langCode, langTranslations]) => (
                <motion.div
                  key={langCode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">
                      {getLanguageName(langCode)}
                    </h2>
                    <Badge variant="secondary">{langTranslations.length}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {langTranslations.map((translation) => (
                      <TranslationCard 
                        key={translation.key} 
                        translation={translation}
                        isArabic={isArabic}
                        formatDate={formatDate}
                        getLanguageName={getLanguageName}
                        onRead={(key) => navigate(`/translations/${key}/1`)}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && filteredTranslations.length === 0 && (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isArabic ? 'لا توجد ترجمات مطابقة للبحث' : 'No translations found matching your search'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Translation Card Component
function TranslationCard({ 
  translation, 
  isArabic, 
  formatDate,
  getLanguageName,
  onRead
}: { 
  translation: TranslationEdition;
  isArabic: boolean;
  formatDate: (timestamp: number) => string;
  getLanguageName: (code: string) => string;
  onRead: (key: string) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-all hover:border-primary/50">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2">{translation.title}</CardTitle>
          <Badge variant="outline" className="shrink-0">
            {translation.language_iso_code.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {translation.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {translation.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{isArabic ? 'الإصدار:' : 'Version:'} {translation.version}</span>
          {translation.last_update && (
            <>
              <span>•</span>
              <span>{formatDate(translation.last_update)}</span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {/* Read Button - Primary action */}
          <Button 
            size="sm" 
            className="gap-1"
            onClick={() => onRead(translation.key)}
          >
            <BookOpen className="w-3 h-3" />
            {isArabic ? 'قراءة' : 'Read'}
          </Button>

          {/* Download links */}
          {translation.pdf_url && (
            <a 
              href={translation.pdf_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1">
                <FileText className="w-3 h-3" />
                PDF
              </Button>
            </a>
          )}
          {translation.epub_url && (
            <a 
              href={translation.epub_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1">
                <Book className="w-3 h-3" />
                EPUB
              </Button>
            </a>
          )}
          {translation.database_url && (
            <a 
              href={translation.database_url} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="w-3 h-3" />
                DB
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
