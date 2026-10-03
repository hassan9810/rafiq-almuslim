import { describe, it, expect } from 'vitest';
import {
  tokenizeQuranText, joinUnits, joinDisplay, wrapUnits, calculateQuranLayout, calculateFrameGeometry,
  pageForProgress, ARABIC_SIZE_RATIO, MIN_FONT_SCALE, type MeasureContext,
} from '@/lib/quranTextLayout';

const PAUSE_ONLY = /^[\u06D6-\u06DC]+$/;

/** Deterministic fake canvas: combining marks have no width, everything else is 0.5em wide. */
function fakeCtx(): MeasureContext {
  const ctx = {
    font: '10px x',
    direction: 'rtl' as CanvasDirection,
    textAlign: 'center' as CanvasTextAlign,
    textBaseline: 'middle' as CanvasTextBaseline,
    measureText(text: string) {
      const size = parseFloat(/(\d+(?:\.\d+)?)px/.exec(ctx.font)?.[1] ?? '10');
      const visible = text.replace(/\p{M}/gu, '').length;
      const width = visible * size * 0.5;
      return {
        width,
        actualBoundingBoxLeft: width / 2,
        actualBoundingBoxRight: width / 2,
        actualBoundingBoxAscent: size * 0.75,
        actualBoundingBoxDescent: size * 0.55,
      } as TextMetrics;
    },
  };
  return ctx;
}

// Tanzil / alquran.cloud style: pause marks are separate space-delimited chunks.
const AL_BAQARAH_2 = 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ';
const AN_NISA_24_START = '۞ وَٱلْمُحْصَنَٰتُ مِنَ ٱلنِّسَآءِ إِلَّا مَا مَلَكَتْ أَيْمَٰنُكُمْ ۖ كِتَٰبَ ٱللَّهِ عَلَيْكُمْ ۚ';

describe('tokenizeQuranText', () => {
  it('keeps pause marks attached to the preceding word', () => {
    const units = tokenizeQuranText(AL_BAQARAH_2);
    expect(units.map((u) => u.text)).toEqual(['ذَٰلِكَ', 'ٱلْكِتَٰبُ', 'لَا', 'رَيْبَ ۛ', 'فِيهِ ۛ', 'هُدًى', 'لِّلْمُتَّقِينَ']);
    expect(units.some((u) => PAUSE_ONLY.test(u.text))).toBe(false);
    expect(units[3].hasPause).toBe(true);
    // Drawn form: the combining pause mark sits directly on its word; nothing else changes.
    expect(units[3].display).toBe('رَيْبَۛ');
    expect(joinDisplay(units)).toBe(AL_BAQARAH_2.replace(/ ([\u06D6-\u06DC])/g, '$1'));
  });

  it('attaches rub-el-hizb (۞) to the following word', () => {
    const units = tokenizeQuranText(AN_NISA_24_START);
    expect(units[0].text).toBe('۞ وَٱلْمُحْصَنَٰتُ');
    expect(units[units.length - 1].text).toBe('عَلَيْكُمْ ۚ');
  });

  it('handles marks written without a space (KFGQPC style)', () => {
    const units = tokenizeQuranText('لَا رَیۡبَۛ فِیهِۛ هُدࣰى');
    expect(units.map((u) => u.text)).toEqual(['لَا', 'رَیۡبَۛ', 'فِیهِۛ', 'هُدࣰى']);
    expect(units[1].hasPause).toBe(true);
  });

  it('never modifies the source text', () => {
    for (const t of [AL_BAQARAH_2, AN_NISA_24_START, 'بِسْمِ  ٱللَّهِ\u00a0ٱلرَّحْمَٰنِ ٱلرَّحِيمِ']) {
      expect(joinUnits(tokenizeQuranText(t))).toBe(t.trim());
    }
  });
});

describe('wrapUnits', () => {
  it('never starts or ends a line with a lone pause mark', () => {
    const ctx = fakeCtx();
    ctx.font = '20px x';
    const text = Array.from({ length: 12 }, () => AL_BAQARAH_2).join(' ');
    for (let maxWidth = 40; maxWidth <= 400; maxWidth += 7) {
      const lines = wrapUnits(ctx, tokenizeQuranText(text), maxWidth);
      for (const l of lines) {
        const words = l.text.split(/\s+/);
        expect(words.some((w) => PAUSE_ONLY.test(w))).toBe(false);
        expect(words.length === 1 && PAUSE_ONLY.test(words[0])).toBe(false);
      }
      expect(lines.map((l) => l.text).join(' ')).toBe(joinDisplay(tokenizeQuranText(text)));
    }
  });
});

describe('calculateQuranLayout', () => {
  const sizes = [[1280, 720], [720, 1280], [1080, 1080]] as const;
  const long = Array.from({ length: 18 }, () => AL_BAQARAH_2).join(' '); // ~ 2:282 length
  const longTranslation = 'And the believers who fear their Lord '.repeat(60);

  for (const [w, h] of sizes) {
    for (const [label, arabic, translation] of [
      ['short', AL_BAQARAH_2, 'This is the Book about which there is no doubt, a guidance for those conscious of Allah.'],
      ['short/no translation', AL_BAQARAH_2, null],
      ['long', long, longTranslation],
      ['long/no translation', long, null],
    ] as const) {
      it(`${w}x${h} ${label}: stays inside the safe area and respects the 60% minimum`, () => {
        const ctx = fakeCtx();
        const layout = calculateQuranLayout(ctx, { width: w, height: h, arabic, translation, fontFamily: 'Amiri', fontScale: 1 });
        const g = calculateFrameGeometry(w, h);
        expect(layout.fits).toBe(true);
        expect(layout.fontSize).toBeGreaterThanOrEqual(Math.round(h * ARABIC_SIZE_RATIO * MIN_FONT_SCALE));
        expect(layout.fontSize).toBeLessThanOrEqual(Math.round(h * ARABIC_SIZE_RATIO));
        for (const page of layout.pages) {
          const top = page.startY - layout.fontSize * 0.75;
          expect(top).toBeGreaterThanOrEqual(g.safeTop - 0.01);
          expect(page.blockHeight).toBeLessThanOrEqual(g.safeBottom - g.safeTop + 0.01);
          const bottom = top + page.blockHeight;
          expect(bottom).toBeLessThanOrEqual(g.safeBottom + 0.01);
        }
        // Every word appears exactly once across all pages, in order.
        expect(layout.pages.flatMap((p) => p.arabicLines).join(' ')).toBe(joinDisplay(tokenizeQuranText(arabic)));
        if (translation) expect(layout.pages.flatMap((p) => p.translationLines).join(' ')).toBe(translation.trim());
        // Pages cover the whole progress range.
        expect(layout.pages[0].progressStart).toBe(0);
        expect(layout.pages[layout.pages.length - 1].progressEnd).toBe(1);
        expect(pageForProgress(layout, 0.999)).toBe(layout.pages[layout.pages.length - 1]);
      });
    }
  }

  it('uses the requested size when the ayah fits', () => {
    const layout = calculateQuranLayout(fakeCtx(), { width: 1280, height: 720, arabic: AL_BAQARAH_2, translation: null, fontFamily: 'Amiri', fontScale: 1 });
    expect(layout.fontSize).toBe(Math.round(720 * ARABIC_SIZE_RATIO));
    expect(layout.strategy).toBe('normal');
    expect(layout.pages).toHaveLength(1);
  });

  it('never goes below the 60% size even when asked for less', () => {
    const layout = calculateQuranLayout(fakeCtx(), { width: 720, height: 1280, arabic: long, translation: longTranslation, fontFamily: 'Amiri', fontScale: 0.3 });
    expect(layout.fontSize).toBe(Math.round(1280 * ARABIC_SIZE_RATIO * MIN_FONT_SCALE));
  });
});
