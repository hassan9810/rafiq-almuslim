/**
 * Quran-aware text layout for the Ayah Video Generator canvas.
 *
 * Responsibilities (pure functions, no React):
 *  - tokenizeQuranText(): split Uthmani text into indivisible visual units so
 *    pause (waqf) marks, rub-el-hizb / sajdah signs and stray combining marks
 *    stay glued to the word they belong to.
 *  - wrapUnits(): greedy line wrapping over those units using real canvas metrics.
 *  - calculateFrameGeometry(): safe area inside the decorative frame, derived
 *    only from the canvas width/height (works for 16:9, 9:16, 1:1, anything).
 *  - calculateQuranLayout(): picks the largest Arabic font size (never below the
 *    60% user-scale equivalent) at which the ayah + translation fit inside the
 *    safe area, then falls back to tighter spacing and finally to splitting the
 *    ayah into timed pages, so the text is never clipped or drawn outside the frame.
 *
 * The original text is never modified: units keep the exact whitespace that
 * separated them, so joining the lines back together reproduces the source.
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Smallest user font scale (matches the Text size slider minimum). */
export const MIN_FONT_SCALE = 0.6;
/** Arabic font size as a fraction of canvas height at 100% scale. */
export const ARABIC_SIZE_RATIO = 0.072;
/** Translation font size as a fraction of canvas height at 100% scale. */
export const TRANSLATION_SIZE_RATIO = 0.03;

interface Spacing {
  arabicLineHeight: number; // multiple of Arabic font size
  translationLineHeight: number; // multiple of translation font size
  gap: number; // Arabic ink bottom → translation ink top, multiple of Arabic font size
}
const NORMAL_SPACING: Spacing = { arabicLineHeight: 1.7, translationLineHeight: 1.5, gap: 0.6 };
const TIGHT_SPACING: Spacing = { arabicLineHeight: 1.45, translationLineHeight: 1.3, gap: 0.35 };

/** Quranic pause (waqf) marks: ۖ ۗ ۘ ۙ ۚ ۛ ۜ */
const PAUSE_MARK_RE = /[\u06D6-\u06DC]/;

/**
 * A whitespace-separated chunk made only of these characters belongs to the
 * PREVIOUS word: combining marks (\p{M}, includes the waqf marks and Quranic
 * small high letters), end-of-ayah sign, sajdah sign, Arabic full stop,
 * Arabic-Indic digits, ornate parentheses and invisible joiners/direction marks.
 */
// The class intentionally lists combining marks on their own (they are matched as standalone chunks).
const ATTACH_TO_PREVIOUS_RE =
  // eslint-disable-next-line no-misleading-character-class
  /^[\p{M}\u06D4\u06D6-\u06DD\u06E9\u0660-\u0669\u06F0-\u06F9\uFD3E\uFD3F\u200C-\u200F\u2060]+$/u;

/** A chunk made only of these belongs to the NEXT word: ۞ (rub el hizb). */
const ATTACH_TO_NEXT_RE = /^[\u06DE]+$/;

/** Chunks made only of combining marks (waqf marks, small high letters...) render ON the previous glyph. */
const COMBINING_ONLY_RE = /^\p{M}+$/u;

/** Any Hebrew/Arabic-script character → translation should be drawn RTL. */
const RTL_CHAR_RE = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFC]/;

// ---------------------------------------------------------------------------
// Tokenization
// ---------------------------------------------------------------------------

export interface TextUnit {
  /** Exact whitespace that preceded this unit in the source ('' for the first unit). */
  leading: string;
  /** Exact source text of the unit (may contain internal whitespace, e.g. "رَيْبَ ۛ"). */
  text: string;
  /**
   * What is drawn on the canvas. Identical to `text` except that a combining pause mark which the
   * source separates from its word with a space ("رَيْبَ ۛ", alquran.cloud/Tanzil style) is drawn
   * directly on that word ("رَيْبَۛ"), as in the printed Mushaf. No character is added, removed or
   * replaced in the data — only that separating whitespace is not drawn.
   */
  display: string;
  /** True when the unit carries a Quranic pause mark (a natural stopping point). */
  hasPause: boolean;
}

function splitWithSeparators(text: string): { sep: string; word: string }[] {
  const parts: { sep: string; word: string }[] = [];
  const re = /(\s*)(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) parts.push({ sep: m[1], word: m[2] });
  return parts;
}

/**
 * Splits Quranic text into indivisible visual units. Pause marks and other
 * annotation-only chunks are merged with the word they belong to (keeping the
 * original whitespace between them), so a line can never start with — or
 * consist only of — a detached pause mark or diacritic.
 */
export function tokenizeQuranText(text: string): TextUnit[] {
  const units: TextUnit[] = [];
  let prefix: { sep: string; text: string } | null = null; // pending ۞ waiting for its word

  for (const { sep, word } of splitWithSeparators(text)) {
    if (ATTACH_TO_NEXT_RE.test(word)) {
      if (prefix) prefix.text += sep + word;
      else prefix = { sep, text: word };
      continue;
    }
    if (ATTACH_TO_PREVIOUS_RE.test(word)) {
      if (prefix) { prefix.text += sep + word; continue; }
      const last = units[units.length - 1];
      if (last) {
        last.text += sep + word;
        last.display += COMBINING_ONLY_RE.test(word) ? word : sep + word;
        if (PAUSE_MARK_RE.test(word)) last.hasPause = true;
        continue;
      }
      // Nothing before it (should not happen in real data) → keep as its own unit.
    }
    if (prefix) {
      const t = prefix.text + sep + word;
      units.push({ leading: prefix.sep, text: t, display: t, hasPause: PAUSE_MARK_RE.test(word) });
      prefix = null;
    } else {
      units.push({ leading: sep, text: word, display: word, hasPause: PAUSE_MARK_RE.test(word) });
    }
  }
  if (prefix) {
    const last = units[units.length - 1];
    if (last) { last.text += prefix.sep + prefix.text; last.display += prefix.sep + prefix.text; }
    else units.push({ leading: prefix.sep, text: prefix.text, display: prefix.text, hasPause: false });
  }
  if (units.length) units[0].leading = '';
  return units;
}

/** Plain whitespace tokenization (used for translations). */
export function tokenizePlainText(text: string): TextUnit[] {
  const units = splitWithSeparators(text).map(({ sep, word }) => ({ leading: sep, text: word, display: word, hasPause: false }));
  if (units.length) units[0].leading = '';
  return units;
}

/** Re-joins units exactly as they appeared in the source (used by tests / sanity checks). */
export function joinUnits(units: TextUnit[]): string {
  return units.map((u, i) => (i === 0 ? u.text : u.leading + u.text)).join('');
}

/** Joins units as they are drawn (see TextUnit.display). */
export function joinDisplay(units: TextUnit[]): string {
  return units.map((u, i) => (i === 0 ? u.display : u.leading + u.display)).join('');
}

export function isRtlText(text: string): boolean {
  return RTL_CHAR_RE.test(text);
}

// ---------------------------------------------------------------------------
// Measuring & wrapping
// ---------------------------------------------------------------------------

/** Minimal subset of CanvasRenderingContext2D used by the layout (easy to fake in tests). */
export type MeasureContext = Pick<CanvasRenderingContext2D, 'font' | 'direction' | 'textAlign' | 'textBaseline' | 'measureText'>;

/** Ink width of a line: the larger of the advance width and the real glyph bounding box. */
export function measureLineWidth(ctx: MeasureContext, text: string): number {
  const m = ctx.measureText(text);
  const box = (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0);
  return Math.max(m.width, box);
}

export interface WrappedLine {
  text: string;
  width: number;
  endsWithPause: boolean;
}

/**
 * Greedy wrapping that never breaks inside a unit (lines contain the units' `display` form). A unit wider than maxWidth
 * gets its own line (the caller detects this through `width`).
 */
export function wrapUnits(ctx: MeasureContext, units: TextUnit[], maxWidth: number): WrappedLine[] {
  const lines: WrappedLine[] = [];
  let cur = '';
  let curWidth = 0;
  let curPause = false;
  for (const u of units) {
    const candidate = cur ? cur + u.leading + u.display : u.display;
    const w = measureLineWidth(ctx, candidate);
    if (cur && w > maxWidth) {
      lines.push({ text: cur, width: curWidth, endsWithPause: curPause });
      cur = u.display;
      curWidth = measureLineWidth(ctx, cur);
    } else {
      cur = candidate;
      curWidth = w;
    }
    curPause = u.hasPause;
  }
  if (cur) lines.push({ text: cur, width: curWidth, endsWithPause: curPause });
  return lines;
}

/** Convenience wrapper: tokenize with Quran rules and wrap. */
export function wrapQuranText(ctx: MeasureContext, text: string, maxWidth: number): WrappedLine[] {
  return wrapUnits(ctx, tokenizeQuranText(text), maxWidth);
}

/** Max ink ascent/descent of a set of lines (relative to a 'middle' baseline). */
function measureExtents(ctx: MeasureContext, lines: WrappedLine[], fontSize: number): { ascent: number; descent: number } {
  let ascent = 0;
  let descent = 0;
  for (const l of lines) {
    const m = ctx.measureText(l.text);
    ascent = Math.max(ascent, m.actualBoundingBoxAscent ?? fontSize * 0.6);
    descent = Math.max(descent, m.actualBoundingBoxDescent ?? fontSize * 0.6);
  }
  return { ascent, descent };
}

// ---------------------------------------------------------------------------
// Frame geometry
// ---------------------------------------------------------------------------

export interface FrameGeometry {
  width: number;
  height: number;
  /** Distance of the decorative frame from the canvas edge. */
  inset: number;
  /** Padding between the frame and the text. */
  innerPad: number;
  centerX: number;
  safeTop: number;
  safeBottom: number;
  safeWidth: number;
  referenceY: number;
  referenceSize: number;
  progressBarY: number;
}

export function calculateFrameGeometry(width: number, height: number): FrameGeometry {
  const minDim = Math.min(width, height);
  const inset = Math.round(minDim * 0.04);
  const innerPad = Math.round(minDim * 0.03);
  const referenceSize = Math.round(height * 0.028);
  const referenceY = height - inset - referenceSize; // 'middle' baseline of the reference line
  const safeTop = inset + innerPad;
  const safeBottom = referenceY - referenceSize * 0.75 - innerPad * 0.6;
  return {
    width,
    height,
    inset,
    innerPad,
    centerX: width / 2,
    safeTop,
    safeBottom,
    safeWidth: width - 2 * (inset + innerPad),
    referenceY,
    referenceSize,
    progressBarY: height - inset * 0.55,
  };
}

// ---------------------------------------------------------------------------
// Fitting
// ---------------------------------------------------------------------------

export const arabicFontString = (size: number, family: string) => `bold ${size}px "${family}", "Amiri", serif`;
export const translationFontString = (size: number) => `${size}px "Noto Sans", "Noto Sans Arabic", sans-serif`;

export interface QuranLayoutInput {
  width: number;
  height: number;
  arabic: string;
  /** null/empty when translation is hidden or unavailable. */
  translation: string | null;
  fontFamily: string;
  fontScale: number;
}

export interface QuranLayoutPage {
  arabicLines: string[];
  translationLines: string[];
  /** 'middle' baseline Y of the first Arabic line. */
  startY: number;
  /** 'middle' baseline Y of the first translation line. */
  translationStartY: number;
  dividerY: number | null;
  blockHeight: number;
  /** Portion of the ayah's progress (0..1) during which this page is shown. */
  progressStart: number;
  progressEnd: number;
}

export interface QuranLayout {
  geometry: FrameGeometry;
  fontSize: number;
  lineHeight: number;
  translationFontSize: number;
  translationLineHeight: number;
  arabicFont: string;
  translationFont: string;
  translationDirection: CanvasDirection;
  /** One page normally; several only when the ayah cannot fit even at the minimum size. */
  pages: QuranLayoutPage[];
  /** How the fit was achieved (useful for debugging/tests). */
  strategy: 'normal' | 'tight' | 'paged';
  /** False only in the degenerate case where even one line per page cannot fit. */
  fits: boolean;
}

interface Attempt {
  arSize: number;
  trSize: number;
  spacing: Spacing;
  arLines: WrappedLine[];
  trLines: WrappedLine[];
  arExt: { ascent: number; descent: number };
  trExt: { ascent: number; descent: number };
  widthOk: boolean;
}

function blockHeightOf(a: Attempt, arCount: number, trCount: number): number {
  if (arCount === 0) return 0;
  const arH = (arCount - 1) * a.arSize * a.spacing.arabicLineHeight + a.arExt.ascent + a.arExt.descent;
  if (trCount === 0) return arH;
  const trH = (trCount - 1) * a.trSize * a.spacing.translationLineHeight + a.trExt.ascent + a.trExt.descent;
  return arH + a.arSize * a.spacing.gap + trH;
}

function attempt(
  ctx: MeasureContext,
  arUnits: TextUnit[],
  trUnits: TextUnit[],
  trRtl: boolean,
  arSize: number,
  spacing: Spacing,
  input: QuranLayoutInput,
  maxWidth: number,
): Attempt {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'rtl';
  ctx.font = arabicFontString(arSize, input.fontFamily);
  const arLines = wrapUnits(ctx, arUnits, maxWidth);
  const arExt = measureExtents(ctx, arLines, arSize);

  const trSize = Math.max(1, Math.round(arSize * (TRANSLATION_SIZE_RATIO / ARABIC_SIZE_RATIO)));
  let trLines: WrappedLine[] = [];
  let trExt = { ascent: 0, descent: 0 };
  if (trUnits.length) {
    ctx.direction = trRtl ? 'rtl' : 'ltr';
    ctx.font = translationFontString(trSize);
    trLines = wrapUnits(ctx, trUnits, maxWidth);
    trExt = measureExtents(ctx, trLines, trSize);
  }
  const widthOk = [...arLines, ...trLines].every((l) => l.width <= maxWidth + 0.5);
  return { arSize, trSize, spacing, arLines, trLines, arExt, trExt, widthOk };
}

function fitsWhole(a: Attempt, availableHeight: number): boolean {
  return a.widthOk && blockHeightOf(a, a.arLines.length, a.trLines.length) <= availableHeight;
}

/** Character weight used for page timing — base letters only, so diacritics don't skew it. */
function weightOf(text: string): number {
  return Math.max(1, text.replace(/[\s\p{M}]/gu, '').length);
}

/**
 * Splits an attempt into N pages. Arabic lines are split evenly, nudging each
 * break by one line when that lands right after a pause mark (a natural
 * recitation stop). Translation lines are split proportionally to the Arabic
 * text of each page, and each page is timed by its share of the Arabic text.
 */
function paginate(a: Attempt, n: number): { arabic: WrappedLine[]; translation: WrappedLine[]; start: number; end: number }[] {
  const ar = a.arLines;
  const breaks: number[] = [0];
  for (let k = 1; k < n; k++) {
    const target = Math.round((k * ar.length) / n);
    const prev = breaks[breaks.length - 1];
    let chosen = target;
    for (const cand of [target, target - 1, target + 1]) {
      if (cand > prev && cand < ar.length && ar[cand - 1].endsWithPause) { chosen = cand; break; }
    }
    chosen = Math.min(Math.max(chosen, prev + 1), ar.length - (n - k));
    breaks.push(chosen);
  }
  breaks.push(ar.length);

  const weights = ar.map((l) => weightOf(l.text));
  const total = weights.reduce((s, w) => s + w, 0);
  const pages: { arabic: WrappedLine[]; translation: WrappedLine[]; start: number; end: number }[] = [];
  let cum = 0;
  let trPrev = 0;
  for (let k = 0; k < n; k++) {
    const slice = ar.slice(breaks[k], breaks[k + 1]);
    const start = cum / total;
    cum += weights.slice(breaks[k], breaks[k + 1]).reduce((s, w) => s + w, 0);
    const end = k === n - 1 ? 1 : cum / total;
    const trEnd = k === n - 1 ? a.trLines.length : Math.round(end * a.trLines.length);
    pages.push({ arabic: slice, translation: a.trLines.slice(trPrev, Math.max(trPrev, trEnd)), start, end });
    trPrev = Math.max(trPrev, trEnd);
  }
  return pages;
}

function buildPage(
  a: Attempt,
  arabic: WrappedLine[],
  translation: WrappedLine[],
  g: FrameGeometry,
  progressStart: number,
  progressEnd: number,
): QuranLayoutPage {
  const available = g.safeBottom - g.safeTop;
  const blockHeight = blockHeightOf(a, arabic.length, translation.length);
  const top = blockHeight <= available ? g.safeTop + (available - blockHeight) / 2 : g.safeTop;
  const arLH = a.arSize * a.spacing.arabicLineHeight;
  const startY = top + a.arExt.ascent;
  const arabicBottom = startY + Math.max(0, arabic.length - 1) * arLH + a.arExt.descent;
  const gap = translation.length ? a.arSize * a.spacing.gap : 0;
  return {
    arabicLines: arabic.map((l) => l.text),
    translationLines: translation.map((l) => l.text),
    startY,
    translationStartY: arabicBottom + gap + a.trExt.ascent,
    dividerY: translation.length ? arabicBottom + gap / 2 : null,
    blockHeight,
    progressStart,
    progressEnd,
  };
}

function finalize(
  a: Attempt,
  g: FrameGeometry,
  family: string,
  trRtl: boolean,
  strategy: QuranLayout['strategy'],
  pages: QuranLayoutPage[],
  fits: boolean,
): QuranLayout {
  return {
    geometry: g,
    fontSize: a.arSize,
    lineHeight: a.arSize * a.spacing.arabicLineHeight,
    translationFontSize: a.trSize,
    translationLineHeight: a.trSize * a.spacing.translationLineHeight,
    arabicFont: arabicFontString(a.arSize, family),
    translationFont: translationFontString(a.trSize),
    translationDirection: trRtl ? 'rtl' : 'ltr',
    pages,
    strategy,
    fits,
  };
}

/**
 * Computes the full layout for one ayah on a canvas of the given size.
 *
 * Strategy, in order:
 *  1. Normal spacing — binary-search the largest Arabic size between the
 *     60%-scale minimum and the user's requested size that fits.
 *  2. Minimum size + tighter line height / gap.
 *  3. Minimum size, normal spacing, split into the fewest timed pages that fit
 *     (breaks prefer pause marks). Text is never clipped or shrunk below the minimum.
 */
export function calculateQuranLayout(ctx: MeasureContext, input: QuranLayoutInput): QuranLayout {
  const g = calculateFrameGeometry(input.width, input.height);
  const available = Math.max(1, g.safeBottom - g.safeTop);
  const maxWidth = Math.max(1, g.safeWidth);

  const arUnits = tokenizeQuranText(input.arabic);
  const trText = (input.translation || '').trim();
  const trUnits = trText ? tokenizePlainText(trText) : [];
  const trRtl = isRtlText(trText);

  const scale = Math.max(MIN_FONT_SCALE, input.fontScale);
  const maxSize = Math.max(1, Math.round(input.height * ARABIC_SIZE_RATIO * scale));
  const minSize = Math.min(maxSize, Math.max(1, Math.round(input.height * ARABIC_SIZE_RATIO * MIN_FONT_SCALE)));

  const run = (size: number, spacing: Spacing) => attempt(ctx, arUnits, trUnits, trRtl, size, spacing, input, maxWidth);
  const family = input.fontFamily;
  const single = (a: Attempt, strategy: QuranLayout['strategy']) =>
    finalize(a, g, family, trRtl, strategy, [buildPage(a, a.arLines, a.trLines, g, 0, 1)], true);

  // 1. Requested size, then binary search down to the minimum.
  const top = run(maxSize, NORMAL_SPACING);
  if (fitsWhole(top, available)) return single(top, 'normal');

  const atMin = maxSize === minSize ? top : run(minSize, NORMAL_SPACING);
  if (fitsWhole(atMin, available)) {
    let lo = minSize; // fits
    let hi = maxSize; // does not fit
    let best = atMin;
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      const a = run(mid, NORMAL_SPACING);
      if (fitsWhole(a, available)) { lo = mid; best = a; } else { hi = mid; }
    }
    return single(best, 'normal');
  }

  // 2. Minimum size with tighter spacing.
  const tight = run(minSize, TIGHT_SPACING);
  if (fitsWhole(tight, available)) return single(tight, 'tight');

  // 3. Paginate at the minimum size with normal spacing.
  const pageable = atMin;
  const maxPages = Math.max(1, pageable.arLines.length);
  for (let n = 2; n <= maxPages; n++) {
    const parts = paginate(pageable, n);
    const ok = pageable.widthOk && parts.every((p) => blockHeightOf(pageable, p.arabic.length, p.translation.length) <= available);
    if (ok) {
      const pages = parts.map((p) => buildPage(pageable, p.arabic, p.translation, g, p.start, p.end));
      return finalize(pageable, g, family, trRtl, 'paged', pages, true);
    }
  }
  // Degenerate fallback (a single line + its translation share cannot fit): one line per page, tight spacing.
  const fallbackParts = paginate(tight, Math.max(1, tight.arLines.length));
  const pages = fallbackParts.map((p) => buildPage(tight, p.arabic, p.translation, g, p.start, p.end));
  const fits = tight.widthOk && pages.every((p) => p.blockHeight <= available);
  return finalize(tight, g, family, trRtl, 'paged', pages, fits);
}

/** Page to display for a given ayah progress (0..1). */
export function pageForProgress(layout: QuranLayout, progress: number): QuranLayoutPage {
  const { pages } = layout;
  for (const p of pages) if (progress < p.progressEnd) return p;
  return pages[pages.length - 1];
}

/** Small LRU cache so layouts are computed once per (ayah, settings, size), not per frame. */
export function createLayoutCache(maxEntries = 128) {
  const cache = new Map<string, QuranLayout>();
  return (ctx: MeasureContext, input: QuranLayoutInput, version: number | string = 0): QuranLayout => {
    const key = [input.width, input.height, input.fontFamily, input.fontScale, version, input.arabic, input.translation ?? ''].join('\u0001');
    const hit = cache.get(key);
    if (hit) {
      cache.delete(key);
      cache.set(key, hit);
      return hit;
    }
    const layout = calculateQuranLayout(ctx, input);
    cache.set(key, layout);
    if (cache.size > maxEntries) cache.delete(cache.keys().next().value as string);
    return layout;
  };
}
