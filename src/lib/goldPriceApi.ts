// Live precious-metal price fetching for the Zakat calculator.
// Uses only keyless, CORS-enabled endpoints so it works client-side with no API key.
//
// Strategy:
//   1. Spot prices in USD per troy ounce for gold (XAU) and silver (XAG) from gold-api.com.
//   2. FX rates (USD -> target currency) from open.er-api.com.
//   3. Convert troy ounce -> gram and apply FX to return a per-gram price in the chosen currency.
//
// All network failures are caught and surfaced as `null` so the UI can fall back to
// the user's last manually-entered values.

const GRAMS_PER_TROY_OUNCE = 31.1034768;

const GOLD_API = 'https://api.gold-api.com/price'; // /XAU , /XAG  -> { price: USD per oz }
const FX_API = 'https://open.er-api.com/v6/latest/USD'; // { rates: { EUR: .., SAR: .. } }

export interface LivePrices {
  goldPerGram24k: number; // in target currency
  silverPerGram: number; // in target currency
  currency: string;
  timestamp: string; // ISO
  source: string;
}

async function fetchJson<T = unknown>(url: string, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchUsdRate(currency: string): Promise<number> {
  if (currency === 'USD') return 1;
  try {
    const data = await fetchJson<{ rates?: Record<string, number> }>(FX_API);
    const rate = data?.rates?.[currency];
    if (typeof rate === 'number' && rate > 0) return rate;
  } catch (e) {
    console.warn('[goldPriceApi] FX fetch failed, defaulting to USD', e);
  }
  return 1; // fall back to USD-equivalent rather than throwing
}

/**
 * Fetches live gold (24k) and silver spot prices, converted to price-per-gram
 * in the requested currency. Returns null if the metal prices cannot be fetched.
 */
export async function fetchLivePrices(currency: string): Promise<LivePrices | null> {
  try {
    const [gold, silver, usdRate] = await Promise.all([
      fetchJson<{ price?: number }>(`${GOLD_API}/XAU`),
      fetchJson<{ price?: number }>(`${GOLD_API}/XAG`),
      fetchUsdRate(currency),
    ]);

    const goldUsdPerOz = Number(gold?.price);
    const silverUsdPerOz = Number(silver?.price);

    if (!Number.isFinite(goldUsdPerOz) || goldUsdPerOz <= 0) {
      throw new Error('Invalid gold price');
    }

    const goldPerGram24k = (goldUsdPerOz / GRAMS_PER_TROY_OUNCE) * usdRate;
    const silverPerGram =
      Number.isFinite(silverUsdPerOz) && silverUsdPerOz > 0
        ? (silverUsdPerOz / GRAMS_PER_TROY_OUNCE) * usdRate
        : 0;

    return {
      goldPerGram24k: Math.round(goldPerGram24k * 100) / 100,
      silverPerGram: Math.round(silverPerGram * 1000) / 1000,
      currency,
      timestamp: new Date().toISOString(),
      source: 'gold-api.com',
    };
  } catch (e) {
    console.warn('[goldPriceApi] live price fetch failed', e);
    return null;
  }
}
