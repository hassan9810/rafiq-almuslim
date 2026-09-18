import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Columns, ArrowLeft, Loader2, Plus, GripVertical, ChevronDown, Trash2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { tafsirEditions, fetchTafsir, TafsirAyah } from '@/lib/tafsirApi';
import { fetchSurah, fetchSurahs, Surah, SurahData } from '@/lib/quranApi';

// Default tafsirs to show: Ibn Kathir (ar), Saadi (ar), Qurtubi (ar), Tabari (ar)
const DEFAULT_TAFSIRS = ['ar-tafsir-ibn-kathir', 'ar-tafseer-al-saddi', 'ar-tafseer-al-qurtubi', 'ar-tafsir-al-tabari'];

export default function TafsirComparePage() {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  const isAr = language === 'ar';

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  
  // The selected tafsir slugs for columns (max 4, min 1)
  const [columns, setColumns] = useState<string[]>(DEFAULT_TAFSIRS.slice(0, 2));
  
  // Loaded data: mapping of tafsirSlug -> array of TafsirAyah for the current surah
  const [tafsirData, setTafsirData] = useState<Record<string, TafsirAyah[]>>({});
  const [loadingTafsirs, setLoadingTafsirs] = useState<Record<string, boolean>>({});
  const [loadingSurah, setLoadingSurah] = useState(false);

  useEffect(() => {
    fetchSurahs().then(setSurahs);
  }, []);

  // Load surah data (verses)
  useEffect(() => {
    async function loadSurah() {
      setLoadingSurah(true);
      const surah = await fetchSurah(selectedSurah);
      setSurahData(surah);
      setLoadingSurah(false);
      setSelectedAyah(1); // Reset ayah when surah changes
    }
    loadSurah();
  }, [selectedSurah]);

  // Load tafsir data for a specific column if missing
  const loadTafsirColumn = async (slug: string, surah: number) => {
    setLoadingTafsirs(prev => ({ ...prev, [slug]: true }));
    try {
      const data = await fetchTafsir(slug, surah);
      setTafsirData(prev => ({ ...prev, [slug]: data }));
    } catch (e) {
      console.error('Failed to load tafsir', slug, e);
    } finally {
      setLoadingTafsirs(prev => ({ ...prev, [slug]: false }));
    }
  };

  // When columns or surah change, ensure data is loaded
  useEffect(() => {
    columns.forEach(slug => {
      loadTafsirColumn(slug, selectedSurah);
    });
  }, [columns, selectedSurah]);

  const handleAddColumn = () => {
    if (columns.length >= 4) return;
    const available = tafsirEditions.find(e => !columns.includes(e.slug))?.slug || tafsirEditions[0].slug;
    setColumns([...columns, available]);
  };

  const handleRemoveColumn = (index: number) => {
    if (columns.length <= 1) return;
    const newCols = [...columns];
    newCols.splice(index, 1);
    setColumns(newCols);
  };

  const handleChangeColumn = (index: number, newSlug: string) => {
    const newCols = [...columns];
    newCols[index] = newSlug;
    setColumns(newCols);
  };

  const currentAyahText = surahData?.ayahs.find(a => a.numberInSurah === selectedAyah)?.text || '';

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Top Header area (compact) */}
      <div className="border-b bg-card z-10 shrink-0 shadow-sm">
        <div className="container py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/tafsir">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Columns className="w-5 h-5 text-primary" />
                <h1 className="font-semibold">{isAr ? 'مقارنة التفاسير' : 'Tafsir Comparison'}</h1>
              </div>
            </div>

            {/* Selectors */}
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(parseInt(v))}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder={t('selectSurah')} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {surahs.map((surah) => (
                    <SelectItem key={surah.number} value={surah.number.toString()}>
                      {surah.number}. {isAr ? surah.name : surah.englishName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={selectedAyah.toString()} 
                onValueChange={(v) => setSelectedAyah(parseInt(v))}
                disabled={loadingSurah || !surahData}
              >
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue placeholder={t('ayah')} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {surahData?.ayahs.map((ayah) => (
                    <SelectItem key={ayah.numberInSurah} value={ayah.numberInSurah.toString()}>
                      {t('ayah')} {ayah.numberInSurah}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* View Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddColumn} 
                disabled={columns.length >= 4}
                className="gap-1 h-9"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{isAr ? 'إضافة تفسير' : 'Add Tafsir'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex-1 flex flex-col overflow-hidden container py-4">
        
        {/* Ayah Display */}
        <div className="bg-card rounded-xl p-6 shadow-sm border mb-4 text-center">
          {loadingSurah ? (
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          ) : (
            <>
              <p className="font-quran text-2xl leading-loose text-foreground" dir="rtl">
                {currentAyahText} 
                <span className="inline-block mx-2 text-primary font-bold">
                  ﴿{isAr ? selectedAyah.toLocaleString('ar-EG') : selectedAyah}﴾
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                {isAr ? surahData?.name : surahData?.englishName} - {t('ayah')} {selectedAyah}
              </p>
            </>
          )}
        </div>

        {/* Resizable Panels */}
        <div className="flex-1 min-h-0 bg-background rounded-xl border overflow-hidden">
          {columns.length > 0 ? (
            <PanelGroup direction={direction === 'rtl' ? 'horizontal' : 'horizontal'} className="h-full">
              {columns.map((slug, index) => {
                const editionInfo = tafsirEditions.find(e => e.slug === slug);
                const isLoading = loadingTafsirs[slug];
                const data = tafsirData[slug];
                const ayahTafsir = data?.find(a => a.ayah === selectedAyah);
                
                return (
                  <React.Fragment key={`${index}-${slug}`}>
                    <Panel id={`panel-${index}`} minSize={20} order={index}>
                      <div className="flex flex-col h-full bg-card relative">
                        {/* Column Header */}
                        <div className="shrink-0 p-3 border-b flex items-center justify-between gap-2 bg-muted/20">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 justify-start gap-2 flex-1 px-2 font-semibold">
                                <span className="truncate flex-1 text-start">
                                  {isAr ? editionInfo?.nameAr || editionInfo?.name : editionInfo?.name}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 opacity-50 shrink-0" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0" align="start">
                              <ScrollArea className="h-80">
                                <div className="p-2 flex flex-col gap-1">
                                  {tafsirEditions.map(ed => (
                                    <Button
                                      key={ed.slug}
                                      variant={ed.slug === slug ? 'secondary' : 'ghost'}
                                      className="justify-start text-start px-2 py-1.5 h-auto whitespace-normal"
                                      onClick={() => handleChangeColumn(index, ed.slug)}
                                    >
                                      <div>
                                        <div className="font-medium text-sm">
                                          {isAr ? ed.nameAr || ed.name : ed.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5">
                                          {isAr ? ed.authorAr || ed.author : ed.author}
                                        </div>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </ScrollArea>
                            </PopoverContent>
                          </Popover>

                          {columns.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveColumn(index)}
                              className="text-muted-foreground hover:text-destructive shrink-0 h-7 w-7"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>

                        {/* Column Content */}
                        <ScrollArea className="flex-1 p-4">
                          {isLoading ? (
                            <div className="flex items-center justify-center h-32">
                              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                          ) : ayahTafsir ? (
                            <div 
                              className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed"
                              dir={['arabic', 'urdu', 'persian'].includes(editionInfo?.language || '') ? 'rtl' : 'ltr'}
                            >
                              <div 
                                className={`text-base ${['arabic', 'urdu', 'persian'].includes(editionInfo?.language || '') ? 'font-arabic text-right' : 'text-left'}`}
                                dangerouslySetInnerHTML={{ __html: ayahTafsir.text }} 
                              />
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground py-8">
                              {t('noData')}
                            </div>
                          )}
                        </ScrollArea>
                      </div>
                    </Panel>
                    
                    {/* Resize Handle (not after last element) */}
                    {index < columns.length - 1 && (
                      <PanelResizeHandle className="w-1 bg-border/50 hover:bg-primary/50 transition-colors flex items-center justify-center cursor-col-resize group z-10">
                        <div className="w-4 h-6 rounded-sm bg-border group-hover:bg-primary flex items-center justify-center transition-colors">
                          <GripVertical className="w-2.5 h-2.5 text-background" />
                        </div>
                      </PanelResizeHandle>
                    )}
                  </React.Fragment>
                );
              })}
            </PanelGroup>
          ) : null}
        </div>
      </div>
    </div>
  );
}
