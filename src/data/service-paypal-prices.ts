/**
 * Trusted, explicit prices per service package — must match `packages[]`
 * (priceINR / priceUSD + pkg.label) in `src/app/services/[slug]/page.tsx`.
 *
 * INR is for display only (PayPal cannot accept INR). USD is what PayPal is
 * actually charged.
 */
export type PackagePrice = { inr: number; usd: number };

export const PAYPAL_PACKAGE_PRICES: Record<
  string,
  Record<string, PackagePrice>
> = {
  "individual-therapy": {
    Seed: { inr: 1499, usd: 20 },
    Bloom: { inr: 5499, usd: 70 },
    Thrive: { inr: 10000, usd: 125 },
  },
  "couples-therapy": {
    Seed: { inr: 1999, usd: 25 },
    Bloom: { inr: 6999, usd: 90 },
    Thrive: { inr: 12499, usd: 160 },
  },
  "child-adolescent-therapy": {
    Seed: { inr: 1500, usd: 20 },
    Bloom: { inr: 5000, usd: 65 },
    Thrive: { inr: 9000, usd: 110 },
  },
  "career-counselling": {
    "Career programme": { inr: 4999, usd: 65 },
  },
};
