/**
 * INR totals for PayPal — must match `packages[].priceINR` + `pkg.label` in
 * `src/app/services/[slug]/page.tsx` (servicesData).
 */
export const PAYPAL_PACKAGE_INR: Record<string, Record<string, number>> = {
  "individual-therapy": {
    Seed: 1499,
    Bloom: 5499,
    Thrive: 10000,
  },
  "couples-therapy": {
    Seed: 1999,
    Bloom: 6999,
    Thrive: 12499,
  },
  "child-adolescent-therapy": {
    Seed: 1000,
    Bloom: 5000,
    Thrive: 9000,
  },
  "career-counselling": {
    "Career programme": 4999,
  },
};
