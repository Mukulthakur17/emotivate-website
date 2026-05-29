/**
 * Single source of truth for display + charge currency conversion.
 *
 * `rate` = multiply an INR amount by this to get the amount in that currency.
 * These are fixed rates (update manually when needed). Both the pricing UI and
 * the PayPal charge use these same values so the displayed price always matches
 * what the customer is actually charged.
 */
export type CurrencyRate = {
  code: string;
  symbol: string;
  rate: number;
  label: string;
};

export const CURRENCIES: CurrencyRate[] = [
  { code: "INR", symbol: "₹", rate: 1, label: "INR" },
  { code: "USD", symbol: "$", rate: 0.012, label: "USD" },
  { code: "GBP", symbol: "£", rate: 0.0095, label: "GBP" },
  { code: "EUR", symbol: "€", rate: 0.011, label: "EUR" },
  { code: "AUD", symbol: "A$", rate: 0.018, label: "AUD" },
];

/** Fallback charge currency when the requested one isn't supported. */
export const PAYPAL_CHARGE_CURRENCY = "USD";

/**
 * Currencies enabled for online (PayPal) checkout. PayPal accepts these, so
 * orders are created and charged in the selected currency. INR is excluded —
 * PayPal cannot accept INR — so customers selecting it are prompted to switch.
 */
export const CHECKOUT_CURRENCIES = ["USD", "EUR", "GBP", "AUD"] as const;

export function isCheckoutSupported(code: string): boolean {
  return (CHECKOUT_CURRENCIES as readonly string[]).includes(code.toUpperCase());
}

/** Display labels for the supported currencies, e.g. "USD, EUR or GBP". */
export function supportedCurrenciesLabel(): string {
  const labels = CHECKOUT_CURRENCIES.map((code) => {
    const c = CURRENCIES.find((x) => x.code === code);
    return c ? `${c.symbol} ${c.code}` : code;
  });
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;
}

/**
 * Converts an INR amount to a PayPal charge in the requested currency, using
 * the same fixed rates the UI displays (so the PayPal total matches the
 * on-screen price). If the requested currency isn't PayPal-supported (INR),
 * it falls back to USD.
 */
export function inrToCurrencyCharge(
  amountInr: number,
  requestedCode: string
): { value: string; currencyCode: string; fellBack: boolean } {
  const wanted = requestedCode?.toUpperCase() || PAYPAL_CHARGE_CURRENCY;
  const supported = isCheckoutSupported(wanted);
  const code = supported ? wanted : PAYPAL_CHARGE_CURRENCY;

  const currency =
    CURRENCIES.find((c) => c.code === code) ??
    CURRENCIES.find((c) => c.code === PAYPAL_CHARGE_CURRENCY)!;

  const converted = amountInr * currency.rate;
  const value = Math.max(0.01, Math.round(converted * 100) / 100).toFixed(2);
  return { value, currencyCode: currency.code, fellBack: !supported };
}
