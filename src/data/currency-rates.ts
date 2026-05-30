/**
 * Currencies offered on the pricing UI.
 *
 * Prices are authored explicitly per package in both INR and USD (see
 * service-paypal-prices.ts), so there is no rate-based conversion. INR is a
 * display-only option (PayPal cannot accept INR); USD is the only currency
 * PayPal is charged in.
 */
export type Currency = {
  code: string;
  symbol: string;
  label: string;
};

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", label: "INR" },
  { code: "USD", symbol: "$", label: "USD" },
];

/** The currency PayPal orders are charged in. */
export const PAYPAL_CHARGE_CURRENCY = "USD";

/**
 * Currencies enabled for online (PayPal) checkout. PayPal cannot accept INR,
 * so only USD is chargeable; customers who pick INR are prompted to switch.
 */
export const CHECKOUT_CURRENCIES = ["USD"] as const;

export function isCheckoutSupported(code: string): boolean {
  return (CHECKOUT_CURRENCIES as readonly string[]).includes(code.toUpperCase());
}

/** Display labels for the supported currencies, e.g. "$ USD". */
export function supportedCurrenciesLabel(): string {
  const labels = CHECKOUT_CURRENCIES.map((code) => {
    const c = CURRENCIES.find((x) => x.code === code);
    return c ? `${c.symbol} ${c.code}` : code;
  });
  if (labels.length <= 1) return labels.join("");
  return `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}`;
}
