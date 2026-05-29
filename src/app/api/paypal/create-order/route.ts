import { NextRequest, NextResponse } from "next/server";
import { PAYPAL_PACKAGE_INR } from "@/data/service-paypal-prices";
import { inrToUsdCharge } from "@/lib/fx-inr";
import {
  paypalCreateOrder,
  paypalGetAccessToken,
  type PayPalMode,
} from "@/lib/paypal";

function resolveAppUrl(req: NextRequest): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const origin = req.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.headers.get("host");
  if (host) {
    const proto = host.startsWith("localhost") ? "http" : "https";
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

function resolveMode(): PayPalMode {
  const m = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  return m === "live" ? "live" : "sandbox";
}

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "PayPal is not configured (missing PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET)." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const slug = (body as { slug?: string }).slug;
  const packageLabel = (body as { packageLabel?: string }).packageLabel;

  if (typeof slug !== "string" || !slug.trim()) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  if (typeof packageLabel !== "string" || !packageLabel.trim()) {
    return NextResponse.json({ error: "Missing packageLabel" }, { status: 400 });
  }

  const bySlug = PAYPAL_PACKAGE_INR[slug];
  if (!bySlug) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }

  const priceInr = bySlug[packageLabel];
  if (priceInr == null || !Number.isFinite(priceInr) || priceInr <= 0) {
    return NextResponse.json({ error: "Unknown package for this service" }, { status: 400 });
  }

  const mode = resolveMode();
  const appUrl = resolveAppUrl(req);
  const returnUrl = `${appUrl}/services/${encodeURIComponent(slug)}?payment=success`;
  const cancelUrl = `${appUrl}/services/${encodeURIComponent(slug)}?payment=cancelled`;

  try {
    // PayPal (sandbox / typical business accounts) cannot accept INR, so the
    // INR price is converted to a USD charge before creating the order.
    const charge = await inrToUsdCharge(priceInr);

    const accessToken = await paypalGetAccessToken(clientId, clientSecret, mode);
    const customId = `${slug}::${packageLabel}`.slice(0, 127);
    const invoiceId = `evo-${slug}-${Date.now()}`.slice(0, 127);

    const { id, approvalUrl } = await paypalCreateOrder(accessToken, mode, {
      amount: charge.value,
      currencyCode: charge.currencyCode,
      description:
        `Emotivate — ${slug} — ${packageLabel} (₹${priceInr})`.slice(0, 127),
      returnUrl,
      cancelUrl,
      customId,
      invoiceId,
    });

    return NextResponse.json({
      approvalUrl,
      orderId: id,
      charged: { value: charge.value, currency: charge.currencyCode },
      priceInr,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "PayPal error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
