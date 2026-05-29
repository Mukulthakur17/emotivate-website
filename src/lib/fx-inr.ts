/**
 * Currency conversion from INR to a PayPal-charge currency (USD).
 *
 * Prices are authored in INR (see service-paypal-prices.ts) but the PayPal
 * sandbox / typical business account cannot accept INR, so the charge is
 * converted to USD before the order is created.
 *
 * Uses the free Frankfurter API (ECB reference rates). Falls back to a
 * conservative fixed rate if the network call fails so checkout never breaks.
 */

const FALLBACK_INR_PER_USD = 86; // ~1 USD; updated periodically as a safety net.
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

let cached: { rate: number; fetchedAt: number } | null = null;

/** Returns how many INR equal 1 USD (e.g. ~86). */
async function getInrPerUsd(): Promise<number> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.rate;
  }

  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=INR",
      { signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const data = (await res.json()) as { rates?: { INR?: number } };
      const rate = data.rates?.INR;
      if (typeof rate === "number" && Number.isFinite(rate) && rate > 0) {
        cached = { rate, fetchedAt: Date.now() };
        return rate;
      }
    }
  } catch {
    // fall through to fallback
  }

  return FALLBACK_INR_PER_USD;
}

export type ConvertedAmount = {
  /** Amount string formatted to 2 decimals, e.g. "17.43". */
  value: string;
  currencyCode: "USD";
  /** INR→USD rate actually used (INR per 1 USD). */
  inrPerUsd: number;
};

/** Converts an INR amount to a USD charge amount for PayPal. */
export async function inrToUsdCharge(amountInr: number): Promise<ConvertedAmount> {
  const inrPerUsd = await getInrPerUsd();
  const usd = amountInr / inrPerUsd;
  // PayPal requires at least 0.01; round to 2 decimals.
  const value = Math.max(0.01, Math.round(usd * 100) / 100).toFixed(2);
  return { value, currencyCode: "USD", inrPerUsd };
}
