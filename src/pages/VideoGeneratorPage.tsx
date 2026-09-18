import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Video, Play, Square, Download, Loader2, ArrowLeft, Volume2, VolumeX,
  Type, Palette, Film, RefreshCw,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { fetchSurahs, Surah, translations as apiTranslations } from '@/lib/quranApi';
import { fetchSurahForVideo, VideoSurah, VideoAyah } from '@/lib/quranApi';
import {
  EVERY_AYAH_RECITERS, RECITER_CATEGORIES,
  getAyahAudioUrl,
  type EveryAyahReciter,
} from '@/data/everyAyahReciters';
import { Link } from 'react-router-dom';

// ---------------- Config ----------------
type AspectId = '16:9' | '9:16' | '1:1';
const ASPECTS: Record<AspectId, { w: number; h: number; labelEn: string; labelAr: string }> = {
  '16:9': { w: 1280, h: 720, labelEn: 'Landscape 16:9', labelAr: 'أفقي 16:9' },
  '9:16': { w: 720, h: 1280, labelEn: 'Story 9:16', labelAr: 'ستوري 9:16' },
  '1:1': { w: 1080, h: 1080, labelEn: 'Square 1:1', labelAr: 'مربع 1:1' },
};

interface Theme {
  id: string; nameEn: string; nameAr: string;
  from: string; to: string; text: string; accent: string;
}
const THEMES: Theme[] = [
  { id: 'midnight', nameEn: 'Midnight', nameAr: 'ليل', from: '#0f172a', to: '#1e293b', text: '#f8fafc', accent: '#fbbf24' },
  { id: 'emerald', nameEn: 'Emerald', nameAr: 'زمرّد', from: '#022c22', to: '#065f46', text: '#ecfdf5', accent: '#fcd34d' },
  { id: 'royal', nameEn: 'Royal', nameAr: 'ملكي', from: '#1e1b4b', to: '#4c1d95', text: '#f5f3ff', accent: '#fde68a' },
  { id: 'sand', nameEn: 'Sand', nameAr: 'رملي', from: '#78350f', to: '#b45309', text: '#fffbeb', accent: '#fde68a' },
  { id: 'teal', nameEn: 'Mosque', nameAr: 'المسجد', from: '#134e4a', to: '#0f766e', text: '#f0fdfa', accent: '#fcd34d' },
  { id: 'sunset', nameEn: 'Sunset', nameAr: 'غروب', from: '#7c2d12', to: '#9d174d', text: '#fff7ed', accent: '#fde047' },
  { id: 'ink', nameEn: 'Ink', nameAr: 'حبر', from: '#000000', to: '#111827', text: '#ffffff', accent: '#d4af37' },
  { id: 'pearl', nameEn: 'Pearl', nameAr: 'لؤلؤ', from: '#f8fafc', to: '#e2e8f0', text: '#0f172a', accent: '#b45309' },
];

const FONTS = [
  { id: 'Amiri', label: 'Amiri' },
  { id: 'Scheherazade New', label: 'Scheherazade' },
  { id: 'Noto Naskh Arabic', label: 'Naskh' },
  { id: 'QPC Hafs', label: 'Uthmanic (Hafs)' },
  { id: 'Noto Sans Arabic', label: 'Sans Arabic' },
  { id: 'Lateef', label: 'Lateef' },
  { id: 'Markazi Text', label: 'Markazi' },
];

// Filter out translation-only reciters for the video generator
const VIDEO_RECITERS = EVERY_AYAH_RECITERS.filter((r) => r.category !== 'translation');

const TRANSLATIONS = apiTranslations.map((t) => ({
  id: t.code,
  label: `${t.language} — ${t.name}`,
}));

function pickSupportedMime(): string {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ];
  if (typeof MediaRecorder === 'undefined') return '';
  for (const c of candidates) {
    try { if (MediaRecorder.isTypeSupported(c)) return c; } catch { /* ignore */ }
  }
  return '';
}

export default function VideoGeneratorPage() {
  const { t, language } = useTranslation();
  const { direction } = useAppStore();
  const isAr = language === 'ar';

  // Selection
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [ayahFrom, setAyahFrom] = useState(1);
  const [ayahTo, setAyahTo] = useState(1);
  const [surahData, setSurahData] = useState<VideoSurah | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);

  // Design
  const [aspect, setAspect] = useState<AspectId>('9:16');
  const [themeId, setThemeId] = useState('midnight');
  const [useCustom, setUseCustom] = useState(false);
  const [customBg, setCustomBg] = useState('#0f172a');
  const [customText, setCustomText] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Amiri');
  const [fontScale, setFontScale] = useState(1);
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationEdition, setTranslationEdition] = useState('en.hilali');

  // Audio – uses EveryAyah.com reciters (CORS-friendly)
  const [withAudio, setWithAudio] = useState(true);
  const [reciterCategory, setReciterCategory] = useState('all');
  const [selectedReciterId, setSelectedReciterId] = useState(VIDEO_RECITERS[0]?.id ?? 1);
  const [durationPerAyah, setDurationPerAyah] = useState(6);

  const filteredReciters = useMemo(() => {
    if (reciterCategory === 'all') return VIDEO_RECITERS;
    return VIDEO_RECITERS.filter((r) => r.category === reciterCategory);
  }, [reciterCategory]);

  const selectedEveryAyahReciter = useMemo(
    () => VIDEO_RECITERS.find((r) => r.id === selectedReciterId) ?? VIDEO_RECITERS[0],
    [selectedReciterId]
  );

  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fontsReady, setFontsReady] = useState(false);
  const [previewAyahIdx, setPreviewAyahIdx] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelRef = useRef(false);

  const dims = ASPECTS[aspect];
  const theme = THEMES.find((th) => th.id === themeId) || THEMES[0];
  const bgTop = useCustom ? customBg : theme.from;
  const bgBottom = useCustom ? customBg : theme.to;
  const textColor = useCustom ? customText : theme.text;
  const accentColor = useCustom ? customText : theme.accent;

  // Load surah list
  useEffect(() => { fetchSurahs().then(setSurahs); }, []);

  // Load selected surah (arabic + translation) then overlay EveryAyah audio URLs
  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingSurah(true);
      // Fetch text + translation from alquran.cloud (no audio from there)
      const data = await fetchSurahForVideo(selectedSurah, 'ar.alafasy', translationEdition);
      if (!active || !data) { setLoadingSurah(false); return; }
      // Override audio URLs with EveryAyah.com (CORS-friendly)
      const reciterObj = selectedEveryAyahReciter;
      if (reciterObj) {
        data.ayahs = data.ayahs.map((a) => ({
          ...a,
          audio: getAyahAudioUrl(reciterObj, selectedSurah, a.numberInSurah),
        }));
      }
      setSurahData(data);
      setAyahFrom(1);
      setAyahTo(1);
      setPreviewAyahIdx(0);
      setLoadingSurah(false);
    })();
    return () => { active = false; };
  }, [selectedSurah, selectedEveryAyahReciter, translationEdition]);

  // Ensure the chosen Arabic font is loaded before drawing on canvas
  useEffect(() => {
    setFontsReady(false);
    const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fontSet?.load) {
      Promise.all([
        fontSet.load(`bold 48px "${fontFamily}"`),
        fontSet.load(`40px "${fontFamily}"`),
        fontSet.load('28px "Noto Sans"'),
      ]).then(() => setFontsReady(true)).catch(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }
  }, [fontFamily]);

  const ayahsInRange = useCallback((): VideoAyah[] => {
    if (!surahData) return [];
    const lo = Math.min(ayahFrom, ayahTo);
    const hi = Math.max(ayahFrom, ayahTo);
    return surahData.ayahs.filter((a) => a.numberInSurah >= lo && a.numberInSurah <= hi);
  }, [surahData, ayahFrom, ayahTo]);

  // ---------------- Drawing ----------------
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  const drawFrame = useCallback((ayah: VideoAyah | null, progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !ayah) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, bgTop);
    grad.addColorStop(1, bgBottom);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Decorative rounded frame
    const inset = Math.round(Math.min(W, H) * 0.04);
    ctx.save();
    ctx.globalAlpha = 0.35 + 0.25 * Math.sin(progress * Math.PI);
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = Math.max(2, Math.round(Math.min(W, H) * 0.004));
    roundRect(ctx, inset, inset, W - inset * 2, H - inset * 2, inset * 0.6);
    ctx.stroke();
    ctx.restore();

    const fadeIn = Math.min(1, progress * 3);
    const centerX = W / 2;
    const maxWidth = W - inset * 3;

    // Arabic text
    const arSize = Math.round(H * 0.072 * fontScale);
    const arLineHeight = arSize * 1.7;
    ctx.font = `bold ${arSize}px "${fontFamily}", "Amiri", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.direction = 'rtl';
    const arLines = wrapText(ctx, ayah.arabic, maxWidth);

    // Translation text
    let trLines: string[] = [];
    const trSize = Math.round(H * 0.03 * fontScale);
    const trLineHeight = trSize * 1.5;
    if (showTranslation && ayah.translation) {
      ctx.font = `${trSize}px "Noto Sans", "Noto Sans Arabic", sans-serif`;
      ctx.direction = 'ltr';
      trLines = wrapText(ctx, ayah.translation, maxWidth);
    }

    const gap = showTranslation && trLines.length ? H * 0.08 : 0;
    const blockHeight = arLines.length * arLineHeight + gap + trLines.length * trLineHeight;
    let y = H / 2 - blockHeight / 2 + arLineHeight / 2;

    // draw arabic
    ctx.globalAlpha = fadeIn;
    ctx.fillStyle = textColor;
    ctx.direction = 'rtl';
    ctx.font = `bold ${arSize}px "${fontFamily}", "Amiri", serif`;
    for (const l of arLines) {
      ctx.fillText(l, centerX, y);
      y += arLineHeight;
    }

    // After drawing arabic, y is at bottom of last arabic line + arLineHeight
    // The translation starts at: y + gap - arLineHeight + trLineHeight / 2
    // Place divider exactly halfway in the gap
    if (trLines.length) {
      const arabicBottomY = y - arLineHeight / 2; // bottom edge of last arabic line
      const translationTopY = y + gap - arLineHeight; // top edge of first translation line
      const dividerY = (arabicBottomY + translationTopY) / 2;
      ctx.globalAlpha = fadeIn * 0.3;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = Math.max(1, Math.round(H * 0.002));
      const divW = Math.min(maxWidth * 0.3, 200);
      ctx.beginPath();
      ctx.moveTo(centerX - divW / 2, dividerY);
      ctx.lineTo(centerX + divW / 2, dividerY);
      ctx.stroke();
    }

    // draw translation
    if (trLines.length) {
      y += gap - arLineHeight + trLineHeight / 2;
      ctx.globalAlpha = fadeIn * 0.9;
      ctx.direction = 'ltr';
      ctx.font = `${trSize}px "Noto Sans", "Noto Sans Arabic", sans-serif`;
      for (const l of trLines) {
        ctx.fillText(l, centerX, y);
        y += trLineHeight;
      }
    }

    // Reference (surah name + ayah number)
    ctx.globalAlpha = 0.85;
    ctx.direction = isAr ? 'rtl' : 'ltr';
    const refSize = Math.round(H * 0.028);
    ctx.font = `${refSize}px "Noto Sans", "Noto Sans Arabic", sans-serif`;
    ctx.fillStyle = accentColor;
    const name = isAr ? surahData?.nameAr : surahData?.nameEn;
    ctx.fillText(`${name || ''} · ${ayah.numberInSurah}`, centerX, H - inset - refSize);

    // Progress bar
    ctx.globalAlpha = 1;
    const barY = H - inset * 0.55;
    const barW = (W - inset * 2) * Math.max(0, Math.min(1, progress));
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = Math.max(3, Math.round(H * 0.006));
    ctx.beginPath();
    ctx.moveTo(inset, barY);
    ctx.lineTo(inset + barW, barY);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }, [bgTop, bgBottom, textColor, accentColor, fontFamily, fontScale, showTranslation, isAr, surahData]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(null);

  // Preview animation loop (paused while recording)
  useEffect(() => {
    if (isRecording) return;
    const list = ayahsInRange();
    const ayah = list[Math.min(previewAyahIdx, Math.max(0, list.length - 1))] || null;
    if (!ayah) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) { ctx.fillStyle = bgBottom; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      return;
    }
    let raf = 0;
    const start = Date.now();
    const cycle = Math.max(3, durationPerAyah) * 1000;
    const render = () => {
      const p = ((Date.now() - start) % cycle) / cycle;
      drawFrame(ayah, p);
      raf = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(raf);
  }, [isRecording, drawFrame, ayahsInRange, previewAyahIdx, durationPerAyah, bgBottom, aspect, fontsReady]);

  // ---------------- Generation ----------------
  const playAyah = (ayah: VideoAyah, index: number, total: number) =>
    new Promise<void>((resolve) => {
      let audio: HTMLAudioElement | null = null;
      let raf = 0;
      let start = performance.now();
      const durMs = Math.max(2, durationPerAyah) * 1000;
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        cancelAnimationFrame(raf);
        if (audio) { audio.onended = null; audio.onerror = null; try { audio.pause(); } catch { /* noop */ } }
        setRenderProgress(((index + 1) / total) * 100);
        resolve();
      };
      const step = (now: number) => {
        if (cancelRef.current) { finish(); return; }
        let p: number;
        if (audio && audio.duration && isFinite(audio.duration) && audio.duration > 0) {
          p = audio.currentTime / audio.duration;
        } else {
          p = (now - start) / durMs;
        }
        p = Math.max(0, Math.min(1, p));
        drawFrame(ayah, p);
        setRenderProgress(((index + p) / total) * 100);
        if (p >= 1 && !(audio && !audio.ended)) { finish(); return; }
        raf = requestAnimationFrame(step);
      };

      if (withAudio && ayah.audio && audioCtxRef.current && destRef.current) {
        audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.preload = 'auto';
        audio.src = ayah.audio;
        try {
          const node = audioCtxRef.current.createMediaElementSource(audio);
          node.connect(destRef.current);
          node.connect(audioCtxRef.current.destination);
        } catch { /* source already created / unsupported */ }
        audio.onended = finish;
        audio.onerror = () => { start = performance.now(); raf = requestAnimationFrame(step); };
        audio.play()
          .then(() => { start = performance.now(); raf = requestAnimationFrame(step); })
          .catch(() => { start = performance.now(); raf = requestAnimationFrame(step); });
      } else {
        raf = requestAnimationFrame(step);
      }
    });

  const generateVideo = async () => {
    const canvas = canvasRef.current;
    const list = ayahsInRange();
    if (!canvas || list.length === 0) return;

    const mime = pickSupportedMime();
    if (typeof MediaRecorder === 'undefined' || !mime) {
      alert(isAr ? 'متصفحك لا يدعم تسجيل الفيديو' : 'Your browser does not support video recording');
      return;
    }

    setVideoUrl(null);
    setRenderProgress(0);
    cancelRef.current = false;
    setIsRecording(true);

    try {
      const canvasStream = canvas.captureStream(30);
      let combined: MediaStream = canvasStream;

      if (withAudio) {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new Ctx();
        await audioCtxRef.current.resume().catch(() => { /* noop */ });
        destRef.current = audioCtxRef.current.createMediaStreamDestination();
        combined = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...destRef.current.stream.getAudioTracks(),
        ]);
      }

      const recorder = new MediaRecorder(combined, { mimeType: mime });
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      const stopped = new Promise<void>((res) => {
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mime.split(';')[0] });
          setVideoUrl(URL.createObjectURL(blob));
          res();
        };
      });

      recorder.start();

      for (let i = 0; i < list.length; i++) {
        if (cancelRef.current) break;
        await playAyah(list[i], i, list.length);
      }

      if (recorder.state !== 'inactive') recorder.stop();
      await stopped;
    } catch (e) {
      console.error('Video generation failed', e);
      alert(isAr ? 'فشل توليد الفيديو' : 'Video generation failed');
    } finally {
      setIsRecording(false);
      setRenderProgress(0);
      if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => { /* noop */ }); audioCtxRef.current = null; }
      destRef.current = null;
    }
  };

  const stopRecording = () => {
    cancelRef.current = true;
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const list = ayahsInRange();
    const ext = pickSupportedMime().includes('mp4') ? 'mp4' : 'webm';
    const range = list.length > 1 ? `${list[0].numberInSurah}-${list[list.length - 1].numberInSurah}` : `${list[0]?.numberInSurah ?? ''}`;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `ayah-${selectedSurah}-${range}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const ayahOptions = surahData?.ayahs ?? [];

  const rangeList = ayahsInRange();

  return (
    <div>
      <main>
        <div className="container py-6 max-w-6xl">
          <div className="mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />{t('back')}
              </Button>
            </Link>
          </div>

          <PageHeader
            icon={Video}
            title={isAr ? 'مولد فيديوهات الآيات' : 'Ayah Video Generator'}
            subtitle={isAr ? 'صمّم فيديوهات قرآنية بالتلاوة والترجمة بأي مقاس لمشاركتها' : 'Design narrated Quran videos with translation, in any format, ready to share'}
          />

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* -------- Controls -------- */}
            <div className="space-y-6" dir={direction}>
              {/* Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2"><Film className="w-5 h-5" />{isAr ? 'اختر الآيات' : 'Select verses'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isAr ? 'السورة' : 'Surah'}</label>
                    <Select value={selectedSurah.toString()} onValueChange={(v) => setSelectedSurah(parseInt(v))}>
                      <SelectTrigger><SelectValue placeholder={t('selectSurah')} /></SelectTrigger>
                      <SelectContent className="max-h-80">
                        {surahs.map((s) => (
                          <SelectItem key={s.number} value={s.number.toString()}>{s.number}. {isAr ? s.name : s.englishName}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{isAr ? 'من آية' : 'From ayah'}</label>
                      <Select value={ayahFrom.toString()} onValueChange={(v) => { const n = parseInt(v); setAyahFrom(n); if (n > ayahTo) setAyahTo(n); setPreviewAyahIdx(0); }} disabled={loadingSurah}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-80">
                          {ayahOptions.map((a) => <SelectItem key={a.numberInSurah} value={a.numberInSurah.toString()}>{a.numberInSurah}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{isAr ? 'إلى آية' : 'To ayah'}</label>
                      <Select value={ayahTo.toString()} onValueChange={(v) => { setAyahTo(parseInt(v)); setPreviewAyahIdx(0); }} disabled={loadingSurah}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-80">
                          {ayahOptions.filter((a) => a.numberInSurah >= ayahFrom).map((a) => <SelectItem key={a.numberInSurah} value={a.numberInSurah.toString()}>{a.numberInSurah}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {loadingSurah
                      ? (isAr ? 'جاري التحميل…' : 'Loading…')
                      : (isAr ? `${rangeList.length} آية محددة` : `${rangeList.length} verse(s) selected`)}
                  </p>
                </CardContent>
              </Card>

              {/* Design */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2"><Palette className="w-5 h-5" />{isAr ? 'التصميم' : 'Design'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isAr ? 'المقاس' : 'Format'}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(ASPECTS) as AspectId[]).map((a) => (
                        <button key={a} onClick={() => setAspect(a)}
                          className={`p-2 rounded-lg border text-xs font-medium transition ${aspect === a ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted'}`}>
                          {isAr ? ASPECTS[a].labelAr : ASPECTS[a].labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{isAr ? 'الخلفية' : 'Theme'}</label>
                    <div className="grid grid-cols-4 gap-2">
                      {THEMES.map((th) => (
                        <button key={th.id} onClick={() => { setThemeId(th.id); setUseCustom(false); }}
                          title={isAr ? th.nameAr : th.nameEn}
                          className={`h-10 rounded-lg border-2 transition ${themeId === th.id && !useCustom ? 'border-primary scale-105' : 'border-transparent'}`}
                          style={{ background: `linear-gradient(135deg, ${th.from}, ${th.to})` }}>
                          <span className="text-[10px]" style={{ color: th.accent }}>{isAr ? th.nameAr : th.nameEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{isAr ? 'ألوان مخصصة' : 'Custom colors'}</label>
                    <Switch checked={useCustom} onCheckedChange={setUseCustom} />
                  </div>
                  {useCustom && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">{isAr ? 'الخلفية' : 'Background'}</label>
                        <div className="flex gap-2">
                          <Input type="color" value={customBg} onChange={(e) => setCustomBg(e.target.value)} className="w-12 h-10 p-1" />
                          <Input type="text" value={customBg} onChange={(e) => setCustomBg(e.target.value)} className="flex-1" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">{isAr ? 'النص' : 'Text'}</label>
                        <div className="flex gap-2">
                          <Input type="color" value={customText} onChange={(e) => setCustomText(e.target.value)} className="w-12 h-10 p-1" />
                          <Input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} className="flex-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1"><Type className="w-4 h-4" />{isAr ? 'الخط' : 'Font'}</label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{FONTS.map((f) => <SelectItem key={f.id} value={f.id} style={{ fontFamily: f.id }}>{f.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{isAr ? 'حجم الخط' : 'Text size'}: {Math.round(fontScale * 100)}%</label>
                      <Slider value={[fontScale]} min={0.6} max={1.6} step={0.05} onValueChange={([v]) => setFontScale(v)} className="pt-3" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{isAr ? 'إظهار الترجمة' : 'Show translation'}</label>
                    <Switch checked={showTranslation} onCheckedChange={setShowTranslation} />
                  </div>
                  {showTranslation && (
                    <Select value={translationEdition} onValueChange={setTranslationEdition}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{TRANSLATIONS.map((tr) => <SelectItem key={tr.id} value={tr.id}>{tr.label}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>

              {/* Audio */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {withAudio ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}{isAr ? 'الصوت والتوقيت' : 'Audio & timing'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{isAr ? 'إضافة التلاوة' : 'Add recitation'}</label>
                    <Switch checked={withAudio} onCheckedChange={setWithAudio} />
                  </div>
                  {withAudio ? (
                    <div className="space-y-3">
                      <label className="text-sm font-medium">{isAr ? 'تصنيف القراء' : 'Category'}</label>
                      <Select value={reciterCategory} onValueChange={(v) => { setReciterCategory(v); const first = (v === 'all' ? VIDEO_RECITERS : VIDEO_RECITERS.filter((r) => r.category === v))[0]; if (first) setSelectedReciterId(first.id); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{RECITER_CATEGORIES.filter((c) => c.key !== 'translation').map((c) => <SelectItem key={c.key} value={c.key}>{isAr ? c.labelAr : c.labelEn}</SelectItem>)}</SelectContent>
                      </Select>
                      <label className="text-sm font-medium">{isAr ? 'القارئ' : 'Reciter'}</label>
                      <Select value={selectedReciterId.toString()} onValueChange={(v) => setSelectedReciterId(parseInt(v))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-60">{filteredReciters.map((r) => <SelectItem key={r.id} value={r.id.toString()}>{isAr ? r.nameAr : r.nameEn} ({r.bitrate})</SelectItem>)}</SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">{isAr ? 'تُضبط مدة كل آية تلقائياً حسب التلاوة.' : 'Each verse is timed automatically to the recitation.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{isAr ? 'مدة كل آية (ثانية)' : 'Seconds per verse'}: {durationPerAyah}</label>
                      <Slider value={[durationPerAyah]} min={2} max={15} step={1} onValueChange={([v]) => setDurationPerAyah(v)} className="pt-3" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* -------- Preview & output -------- */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{isAr ? 'المعاينة' : 'Preview'}</CardTitle>
                  <CardDescription>{isAr ? `${isAr ? ASPECTS[aspect].labelAr : ASPECTS[aspect].labelEn} · ${dims.w}×${dims.h}` : `${ASPECTS[aspect].labelEn} · ${dims.w}×${dims.h}`}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="mx-auto rounded-xl overflow-hidden border bg-black shadow-lg"
                    style={{ aspectRatio: `${dims.w} / ${dims.h}`, maxHeight: '60vh', width: aspect === '16:9' ? '100%' : 'auto', maxWidth: '100%' }}>
                    <canvas ref={canvasRef} width={dims.w} height={dims.h} className="w-full h-full object-contain" />
                  </div>

                  {isRecording && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2 text-sm text-primary">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isAr ? 'جاري التوليد…' : 'Generating…'} {Math.round(renderProgress)}%
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${renderProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {!isRecording && rangeList.length > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPreviewAyahIdx((i) => Math.max(0, i - 1))} disabled={previewAyahIdx === 0}>‹</Button>
                      <span className="text-xs text-muted-foreground">{isAr ? 'معاينة آية' : 'Preview verse'} {Math.min(previewAyahIdx + 1, rangeList.length)}/{rangeList.length}</span>
                      <Button variant="outline" size="sm" onClick={() => setPreviewAyahIdx((i) => Math.min(rangeList.length - 1, i + 1))} disabled={previewAyahIdx >= rangeList.length - 1}>›</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4 flex-wrap">
                {!isRecording ? (
                  <Button className="flex-1 gap-2" size="lg" onClick={generateVideo} disabled={loadingSurah || rangeList.length === 0 || !fontsReady}>
                    <Play className="w-5 h-5" />{isAr ? 'توليد الفيديو' : 'Generate video'}
                  </Button>
                ) : (
                  <Button className="flex-1 gap-2" size="lg" variant="destructive" onClick={stopRecording}>
                    <Square className="w-5 h-5" />{isAr ? 'إيقاف' : 'Stop'}
                  </Button>
                )}
                {videoUrl && !isRecording && (
                  <Button variant="secondary" className="flex-1 gap-2" size="lg" onClick={handleDownload}>
                    <Download className="w-5 h-5" />{isAr ? 'تحميل' : 'Download'}
                  </Button>
                )}
              </div>

              {videoUrl && !isRecording && (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-lg">{isAr ? 'الفيديو الناتج' : 'Result'}</CardTitle></CardHeader>
                  <CardContent>
                    <video src={videoUrl} controls className="w-full rounded-lg border bg-black" style={{ aspectRatio: `${dims.w} / ${dims.h}`, maxHeight: '60vh' }} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
