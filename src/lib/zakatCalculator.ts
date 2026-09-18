export type ZakatType =
  | 'money'
  | 'gold'
  | 'silver'
  | 'stocks'
  | 'trade'
  | 'crypto'
  | 'retirement'
  | 'rental'
  | 'agriculture'
  | 'livestock'
  | 'custom'
  | 'total'
  | 'fitr';

export type NisabBasis = 'gold' | 'silver';

export const ZAKAT_RATE = 0.025; // 2.5% for most wealth (money, gold, silver, trade, stocks...)

// Nisab in grams (classical thresholds)
export const GOLD_NISAB_GRAMS = 85; // 20 mithqal
export const SILVER_NISAB_GRAMS = 595; // 200 dirhams

// Agriculture: 5 wasq ≈ 653 kg of the staple crop
export const AGRICULTURE_NISAB_KG = 653;

// Gold purities (karat -> fraction of pure gold)
export const GOLD_PURITIES: Record<number, number> = {
  24: 1.0,
  22: 22 / 24,
  21: 21 / 24,
  18: 18 / 24,
  14: 14 / 24,
};

/**
 * Returns the current Nisab value in currency for the chosen basis.
 * Gold basis = 85g * gold price/g; Silver basis = 595g * silver price/g.
 * Silver basis is lower, so more people qualify (the more charitable default many scholars recommend).
 */
export function getNisabValue(
  basis: NisabBasis,
  goldPricePerGram: number,
  silverPricePerGram: number
): number {
  return basis === 'silver'
    ? SILVER_NISAB_GRAMS * silverPricePerGram
    : GOLD_NISAB_GRAMS * goldPricePerGram;
}

/** Generic 2.5% zakat on a monetary amount, gated by nisab. */
export function calculateMoneyZakat(amount: number, nisabValue: number): number {
  if (amount < nisabValue || amount <= 0) return 0;
  return amount * ZAKAT_RATE;
}

/**
 * Zakat on gold based on purity. The nisab test is applied on the pure-gold
 * (24k-equivalent) weight; the value is the 24k-equivalent weight * 24k price.
 */
export function calculateGoldZakat(
  weightInGrams: number,
  karat: number,
  pricePerGram24k: number
): number {
  const purity = GOLD_PURITIES[karat] ?? 1;
  const equivalent24kWeight = weightInGrams * purity;
  if (equivalent24kWeight < GOLD_NISAB_GRAMS) return 0;
  return equivalent24kWeight * pricePerGram24k * ZAKAT_RATE;
}

/** Zakat on silver by weight, gated by the 595g nisab. */
export function calculateSilverZakat(weightInGrams: number, pricePerGram: number): number {
  if (weightInGrams < SILVER_NISAB_GRAMS) return 0;
  return weightInGrams * pricePerGram * ZAKAT_RATE;
}

/** Zakat on stocks/investments held for growth (2.5% of market value), gated by nisab. */
export function calculateStocksZakat(value: number, nisabValue: number): number {
  if (value < nisabValue || value <= 0) return 0;
  return value * ZAKAT_RATE;
}

/**
 * Zakat on trade goods: (inventory + cash + good receivables) - liabilities, at 2.5%.
 */
export function calculateTradeZakat(
  inventoryValue: number,
  cash: number,
  receivables: number,
  liabilities: number,
  nisabValue: number
): number {
  const net = inventoryValue + cash + receivables - liabilities;
  if (net < nisabValue || net <= 0) return 0;
  return net * ZAKAT_RATE;
}

/**
 * Zakat on accessible retirement / pension funds. Only the amount the person can
 * actually access/withdraw (net of penalties/tax if they choose) is zakatable at 2.5%.
 */
export function calculateRetirementZakat(accessibleBalance: number, nisabValue: number): number {
  return calculateMoneyZakat(accessibleBalance, nisabValue);
}

/**
 * Zakat on rental income: paid on the net rental income saved (after expenses),
 * treated like cash at 2.5%. The property itself is not zakatable.
 */
export function calculateRentalZakat(netSavedIncome: number, nisabValue: number): number {
  return calculateMoneyZakat(netSavedIncome, nisabValue);
}

export type IrrigationType = 'natural' | 'artificial' | 'mixed';

/** Irrigation determines the agriculture rate: rain-fed 10%, irrigated 5%, mixed 7.5%. */
export function agricultureRate(irrigation: IrrigationType): number {
  switch (irrigation) {
    case 'natural':
      return 0.1;
    case 'artificial':
      return 0.05;
    case 'mixed':
      return 0.075;
  }
}

/**
 * Zakat on crops. Nisab is 653kg of the harvest; when met, the rate depends on
 * irrigation and is applied to the market value of the harvest. Note: agriculture
 * zakat is due at harvest (no hawl/lunar-year wait).
 */
export function calculateAgricultureZakat(
  harvestWeightKg: number,
  harvestValue: number,
  irrigation: IrrigationType
): number {
  if (harvestWeightKg < AGRICULTURE_NISAB_KG || harvestValue <= 0) return 0;
  return harvestValue * agricultureRate(irrigation);
}

// ----------------------------- Livestock -----------------------------
// Livestock zakat is paid in-kind (animals), not in currency. These helpers
// return a human-readable description of what is due per the classical tables.

export type LivestockKind = 'sheep' | 'cattle' | 'camel';

export interface LivestockResult {
  due: boolean;
  reachedNisab: boolean;
  descriptionEn: string;
  descriptionAr: string;
}

export const LIVESTOCK_NISAB: Record<LivestockKind, number> = {
  sheep: 40,
  cattle: 30,
  camel: 5,
};

function sheepDue(n: number): { en: string; ar: string } {
  // 40–120: 1 sheep; 121–200: 2; 201–399: 3; then +1 per additional 100.
  let count: number;
  if (n < 40) count = 0;
  else if (n <= 120) count = 1;
  else if (n <= 200) count = 2;
  else if (n <= 399) count = 3;
  else count = Math.floor(n / 100);
  return {
    en: `${count} sheep/goat`,
    ar: `${count} من الغنم`,
  };
}

function cattleDue(n: number): { en: string; ar: string } {
  // Per 30 head: a 1-year-old calf (tabiʿ); per 40: a 2-year-old (musinnah).
  if (n < 30) return { en: '—', ar: '—' };
  if (n < 40) return { en: '1 one-year-old calf (tabiʿ)', ar: 'تبيع (عجل عمره سنة)' };
  if (n < 60) return { en: '1 two-year-old cow (musinnah)', ar: 'مسنة (بقرة عمرها سنتان)' };
  const t = Math.round(n / 30);
  return {
    en: `approx. ${t} one-year-old calves (per 30 head)`,
    ar: `ما يقارب ${t} تبيع (عن كل 30)`,
  };
}

function camelDue(n: number): { en: string; ar: string } {
  // Simplified classical table for the common ranges.
  if (n < 5) return { en: '—', ar: '—' };
  if (n <= 9) return { en: '1 sheep', ar: 'شاة واحدة' };
  if (n <= 14) return { en: '2 sheep', ar: 'شاتان' };
  if (n <= 19) return { en: '3 sheep', ar: '3 شياه' };
  if (n <= 24) return { en: '4 sheep', ar: '4 شياه' };
  if (n <= 35) return { en: '1 bint makhad (1-yr she-camel)', ar: 'بنت مخاض' };
  if (n <= 45) return { en: '1 bint labun (2-yr she-camel)', ar: 'بنت لبون' };
  if (n <= 60) return { en: '1 hiqqah (3-yr she-camel)', ar: 'حِقّة' };
  if (n <= 75) return { en: '1 jadhaʿah (4-yr she-camel)', ar: 'جَذَعة' };
  if (n <= 90) return { en: '2 bint labun', ar: 'بنتا لبون' };
  if (n <= 120) return { en: '2 hiqqah', ar: 'حِقّتان' };
  const hiqqah = Math.floor(n / 50);
  const bintLabun = Math.floor((n % 50) / 40);
  return {
    en: `${hiqqah} hiqqah + ${bintLabun} bint labun (per 50 / 40)`,
    ar: `${hiqqah} حِقّة + ${bintLabun} بنت لبون (عن كل 50 / 40)`,
  };
}

export function calculateLivestockZakat(kind: LivestockKind, count: number): LivestockResult {
  const nisab = LIVESTOCK_NISAB[kind];
  const reachedNisab = count >= nisab;
  if (!reachedNisab) {
    return {
      due: false,
      reachedNisab: false,
      descriptionEn: `Below nisab (${nisab} head required).`,
      descriptionAr: `لم يبلغ النصاب (يلزم ${nisab} رأس).`,
    };
  }
  const d = kind === 'sheep' ? sheepDue(count) : kind === 'cattle' ? cattleDue(count) : camelDue(count);
  return { due: true, reachedNisab: true, descriptionEn: d.en, descriptionAr: d.ar };
}

// ----------------------------- Combined total -----------------------------

export interface WealthItem {
  amount: number;
  /** true = deducted from the zakatable base (a debt/liability). */
  deductible?: boolean;
}

export interface TotalZakatResult {
  totalAssets: number;
  totalLiabilities: number;
  netWealth: number;
  nisabValue: number;
  reachedNisab: boolean;
  zakatDue: number;
}

/**
 * Aggregates any number of monetary items (assets and liabilities), applies the
 * nisab test ONCE on the net wealth, and returns 2.5% of it if due. This is the
 * correct way to assess a mixed portfolio (cash + gold value + stocks + ...).
 */
export function calculateTotalZakat(items: WealthItem[], nisabValue: number): TotalZakatResult {
  let totalAssets = 0;
  let totalLiabilities = 0;
  for (const it of items) {
    const v = Number(it.amount) || 0;
    if (it.deductible) totalLiabilities += v;
    else totalAssets += v;
  }
  const netWealth = totalAssets - totalLiabilities;
  const reachedNisab = netWealth >= nisabValue && netWealth > 0;
  return {
    totalAssets,
    totalLiabilities,
    netWealth,
    nisabValue,
    reachedNisab,
    zakatDue: reachedNisab ? netWealth * ZAKAT_RATE : 0,
  };
}

/** Zakat al-Fitr = number of people * price of one measure of staple food. */
export function calculateFitrZakat(familyMembers: number, mealPrice: number): number {
  return Math.max(0, familyMembers) * Math.max(0, mealPrice);
}

// --------------------------- Hawl (lunar year) ---------------------------

/** A Hijri/lunar year is ~354.367 days. */
export const LUNAR_YEAR_DAYS = 354.367;

export interface HawlStatus {
  daysElapsed: number;
  daysRemaining: number;
  complete: boolean;
  dueDate: Date;
  progress: number; // 0..1
}

/** Given the date wealth first reached nisab, reports progress toward the lunar-year due date. */
export function getHawlStatus(startISO: string, now: Date = new Date()): HawlStatus {
  const start = new Date(startISO);
  const msPerDay = 86400000;
  const daysElapsed = Math.max(0, (now.getTime() - start.getTime()) / msPerDay);
  const dueDate = new Date(start.getTime() + LUNAR_YEAR_DAYS * msPerDay);
  const daysRemaining = Math.max(0, (dueDate.getTime() - now.getTime()) / msPerDay);
  return {
    daysElapsed: Math.floor(daysElapsed),
    daysRemaining: Math.ceil(daysRemaining),
    complete: daysElapsed >= LUNAR_YEAR_DAYS,
    dueDate,
    progress: Math.min(1, daysElapsed / LUNAR_YEAR_DAYS),
  };
}
