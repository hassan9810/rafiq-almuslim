import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Share2, Download, Image, Palette, Type,
  Loader2, BookOpen, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { fetchSurahs, fetchSurah, type Surah, type SurahData } from '@/lib/quranApi';

const THEMES = [
  { id: 'emerald', label: 'أخضر', labelEn: 'Emerald', bg: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)', text: '#ecfdf5', accent: '#d4a574' },
  { id: 'gold', label: 'ذهبي', labelEn: 'Gold', bg: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%)', text: '#fefce8', accent: '#f59e0b' },
  { id: 'midnight', label: 'ليلي', labelEn: 'Midnight', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', text: '#f1f5f9', accent: '#94a3b8' },
  { id: 'rose', label: 'وردي', labelEn: 'Rose', bg: 'linear-gradient(135deg, #4c0519 0%, #881337 50%, #9f1239 100%)', text: '#fff1f2', accent: '#fda4af' },
  { id: 'ocean', label: 'بحري', labelEn: 'Ocean', bg: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)', text: '#f0f9ff', accent: '#7dd3fc' },
  { id: 'parchment', label: 'رقي', labelEn: 'Parchment', bg: 'linear-gradient(135deg, #f5f0e8 0%, #ede5d8 50%, #e8dcc8 100%)', text: '#1c1917', accent: '#92400e' },
];

const FONTS = [
  { id: 'amiri', label: 'أميري', family: "'Amiri', serif" },
  { id: 'naskh', label: 'نسخ', family: "'Noto Naskh Arabic', serif" },
  { id: 'sans', label: 'سانس', family: "'Noto Sans Arabic', sans-serif" },
];

export default function ShareAyahPage() {
  const { language } = useTranslation();
  const { direction, surahs, setSurahs } = useAppStore();
  const isAr = language === 'ar';

  const [surahNum, setSurahNum] = useState(1);
  const [surahData, setSurahData] = useState<SurahData | null>(null);
  const [ayahNum, setAyahNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [themeId, setThemeId] = useState('emerald');
  const [fontId, setFontId] = useState('amiri');
  const [fontSize, setFontSize] = useState(28);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentTheme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const currentFont = FONTS.find(f => f.id === fontId) || FONTS[0];

  // Load surahs
  useEffect(() => {
    if (surahs.length === 0) fetchSurahs().then(data => setSurahs(data));
  }, [surahs.length, setSurahs]);

  // Load surah data
  useEffect(() => {
    setLoading(true);
    fetchSurah(surahNum).then(data => {
      setSurahData(data);
      setAyahNum(1);
      setLoading(false);
    });
  }, [surahNum]);

  const currentAyah = surahData?.ayahs.find(a => a.numberInSurah === ayahNum);
  const currentSurah = surahs.find(s => s.number === surahNum);
  const totalAyahs = surahData?.numberOfAyahs || 1;

  const randomAyah = () => {
    const randomSurah = Math.floor(Math.random() * 114) + 1;
    setSurahNum(randomSurah);
  };

  // Generate image on canvas
  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentAyah) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1080;
    canvas.width = W;
    canvas.height = H;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    if (currentTheme.id === 'parchment') {
      grad.addColorStop(0, '#f5f0e8');
      grad.addColorStop(0.5, '#ede5d8');
      grad.addColorStop(1, '#e8dcc8');
    } else if (currentTheme.id === 'emerald') {
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.5, '#065f46');
      grad.addColorStop(1, '#047857');
    } else if (currentTheme.id === 'gold') {
      grad.addColorStop(0, '#451a03');
      grad.addColorStop(0.5, '#78350f');
      grad.addColorStop(1, '#92400e');
    } else if (currentTheme.id === 'midnight') {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#334155');
    } else if (currentTheme.id === 'rose') {
      grad.addColorStop(0, '#4c0519');
      grad.addColorStop(0.5, '#881337');
      grad.addColorStop(1, '#9f1239');
    } else {
      grad.addColorStop(0, '#0c4a6e');
      grad.addColorStop(0.5, '#075985');
      grad.addColorStop(1, '#0369a1');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Decorative border
    ctx.strokeStyle = currentTheme.accent;
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.strokeRect(55, 55, W - 110, H - 110);

    // Corner decorations
    const cornerSize = 30;
    [
      [60, 60], [W - 60, 60], [60, H - 60], [W - 60, H - 60]
    ].forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, cornerSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = currentTheme.accent;
      ctx.fill();
    });

    // Bismillah at top
    ctx.fillStyle = currentTheme.accent;
    ctx.font = `24px ${currentFont.family}`;
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.fillText('﷽', W / 2, 130);

    // Ayah text - word wrap
    const text = currentAyah.text;
    ctx.fillStyle = currentTheme.text;
    ctx.font = `${fontSize}px ${currentFont.family}`;
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    const maxWidth = W - 180;
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const lineHeight = fontSize * 1.8;
    const totalTextHeight = lines.length * lineHeight;
    const startY = (H / 2) - (totalTextHeight / 2) + fontSize;

    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, startY + i * lineHeight);
    });

    // Ayah number decoration
    const ayahBadge = `﴿${ayahNum}﴾`;
    ctx.fillStyle = currentTheme.accent;
    ctx.font = `22px ${currentFont.family}`;
    ctx.fillText(ayahBadge, W / 2, startY + lines.length * lineHeight + 20);

    // Surah name at bottom
    const surahName = currentSurah ? (isAr ? currentSurah.name : currentSurah.englishName) : '';
    ctx.fillStyle = currentTheme.accent;
    ctx.font = `20px ${currentFont.family}`;
    ctx.fillText(`— ${surahName} —`, W / 2, H - 100);

    // App watermark
    ctx.fillStyle = currentTheme.text + '80';
    ctx.font = `14px 'Noto Sans', sans-serif`;
    ctx.fillText('rafiqalmuslim.lovable.app', W / 2, H - 65);
  }, [currentAyah, currentTheme, currentFont, fontSize, ayahNum, currentSurah, isAr]);

  // Regenerate image when settings change
  useEffect(() => {
    if (currentAyah) generateImage();
  }, [currentAyah, generateImage]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `ayah-${surahNum}-${ayahNum}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const shareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGenerating(true);
    try {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob && navigator.share) {
        const file = new File([blob], `ayah-${surahNum}-${ayahNum}.png`, { type: 'image/png' });
        await navigator.share({
          title: isAr ? 'مشاركة آية' : 'Share Ayah',
          files: [file],
        });
      } else {
        downloadImage();
      }
    } catch {
      downloadImage();
    }
    setGenerating(false);
  };

  return (
    <div>
      <main>
        <div className="container max-w-2xl py-6">
          {/* Back */}
          <div className="mb-4">
            <Link to="/quran">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {isAr ? 'رجوع' : 'Back'}
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-3">
              <Share2 className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-arabic text-2xl md:text-3xl font-bold text-foreground mb-1">
              {isAr ? 'مشاركة آية' : 'Share Ayah'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isAr ? 'شارك آية كصورة جميلة على السوشيال ميديا' : 'Share a verse as a beautiful image on social media'}
            </p>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Select dir={direction} value={surahNum.toString()} onValueChange={v => setSurahNum(parseInt(v))}>
              <SelectTrigger><SelectValue placeholder={isAr ? 'السورة' : 'Surah'} /></SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                {(surahs.length > 0 ? surahs : Array.from({ length: 114 }, (_, i) => ({
                  number: i + 1, name: `سورة ${i + 1}`, englishName: `Surah ${i + 1}`
                }))).map((s: any) => (
                  <SelectItem key={s.number} value={s.number.toString()}>
                    {s.number}. {isAr ? s.name : s.englishName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select dir={direction} value={ayahNum.toString()} onValueChange={v => setAyahNum(parseInt(v))}>
                <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto bg-popover">
                  {Array.from({ length: totalAyahs }, (_, i) => i + 1).map(n => (
                    <SelectItem key={n} value={n.toString()}>
                      {isAr ? `آية ${n}` : `Ayah ${n}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={randomAyah} title={isAr ? 'آية عشوائية' : 'Random'}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-card rounded-2xl border border-border/50 p-3 mb-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            )}
          </div>

          {/* Theme Selector */}
          <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {isAr ? 'المظهر' : 'Theme'}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  className={`w-10 h-10 rounded-xl border-2 transition-all ${themeId === theme.id ? 'border-primary scale-110' : 'border-transparent'}`}
                  style={{ background: theme.bg }}
                  title={isAr ? theme.label : theme.labelEn}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 mb-2">
              <Type className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {isAr ? 'الخط' : 'Font'}
              </span>
            </div>
            <div className="flex gap-2">
              {FONTS.map(f => (
                <Button
                  key={f.id}
                  variant={fontId === f.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFontId(f.id)}
                >
                  {f.label}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {isAr ? 'حجم الخط:' : 'Font size:'}
              </span>
              <Slider
                value={[fontSize]}
                min={18}
                max={42}
                step={2}
                onValueChange={([v]) => setFontSize(v)}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">{fontSize}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 gap-2" onClick={shareImage} disabled={generating || !currentAyah}>
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
              {isAr ? 'مشاركة' : 'Share'}
            </Button>
            <Button variant="outline" className="flex-1 gap-2" onClick={downloadImage} disabled={!currentAyah}>
              <Download className="w-4 h-4" />
              {isAr ? 'تحميل' : 'Download'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
