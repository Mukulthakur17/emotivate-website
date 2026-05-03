import { NextRequest, NextResponse } from "next/server";
import {
  paypalGetAccessToken,
  paypalGetOrder,
  paypalVerifyWebhookSignature,
  type PayPalMode,
} from "@/lib/paypal";
import { sendPaymentReceiptEmails } from "@/lib/payment-emails";

export const dynamic = "force-dynamic";

const emailedCaptureIds = new Set<string>();

function resolveMode(): PayPalMode {
  const m = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  return m === "live" ? "live" : "sandbox";
}

type CaptureResource = {
  id?: string;
  amount?: { currency_code?: string; value?: string };
  custom_id?: string;
  supplementary_data?: { related_ids?: { order_id?: string } };
};

type WebhookBody = {
  id?: string;
  event_type?: string;
  resource?: CaptureResource;
};

function parseCustomId(customId: string | undefined): string {
  if (!customId?.trim()) return "Emotivate package";
  const [slug, label] = customId.split("::");
  if (!slug) return customId;
  if (!label) return slug.replace(/-/g, " ");
  const title = slug.replace(/-/g, " ");
  return `${title} — ${label}`;
}

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "PayPal not configured" }, { status: 503 });
  }
  if (!webhookId) {
    return NextResponse.json(
      { error: "PAYPAL_WEBHOOK_ID is required for webhook verification." },
      { status: 503 }
    );
  }

  let body: WebhookBody;
  try {
    body = (await req.json()) as WebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mode = resolveMode();

  const authAlgo = req.headers.get("paypal-auth-algo") ?? "";
  const certUrl = req.headers.get("paypal-cert-url") ?? "";
  const transmissionId = req.headers.get("paypal-transmission-id") ?? "";
  const transmissionSig = req.headers.get("paypal-transmission-sig") ?? "";
  const transmissionTime = req.headers.get("paypal-transmission-time") ?? "";

  if (
    !authAlgo ||
    !certUrl ||
    !transmissionId ||
    !transmissionSig ||
    !transmissionTime
  ) {
    return NextResponse.json({ error: "Missing PayPal transmission headers" }, { status: 400 });
  }

  try {
    const accessToken = await paypalGetAccessToken(clientId, clientSecret, mode);
    const ok = await paypalVerifyWebhookSignature(accessToken, mode, {
      authAlgo,
      certUrl,
      transmissionId,
      transmissionSig,
      transmissionTime,
      webhookId,
      webhookEvent: body,
    });
    if (!ok) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 502 });
  }

  if (body.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ ok: true, ignored: body.event_type });
  }

  const resource = body.resource;
  const captureId = resource?.id;
  if (!captureId) {
    return NextResponse.json({ error: "Missing capture id" }, { status: 400 });
  }

  if (emailedCaptureIds.has(captureId)) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const orderId = resource?.supplementary_data?.related_ids?.order_id;
  if (!orderId) {
    return NextResponse.json({ error: "Missing order_id on capture" }, { status: 400 });
  }

  let customerEmail: string | undefined;
  let customerName: string | undefined;
  let packageSummary = parseCustomId(resource?.custom_id);

  try {
    const accessToken = await paypalGetAccessToken(
      clientId,
      clientSecret,
      mode
    );
    const order = await paypalGetOrder(accessToken, mode, orderId);
    customerEmail = order.payer?.email_address?.trim();
    const gn = order.payer?.name?.given_name;
    const sn = order.payer?.name?.surname;
    customerName = [gn, sn].filter(Boolean).join(" ").trim() || undefined;
    const unitCustom = order.purchase_units?.[0]?.custom_id;
    if (unitCustom) {
      packageSummary = parseCustomId(unitCustom);
    }
  } catch (e) {
    console.error("[paypal webhook] get order failed", e);
    return NextResponse.json({ error: "Could not load order" }, { status: 502 });
  }

  const cur = resource.amount?.currency_code ?? "INR";
  const val = resource.amount?.value ?? "?";
  const amountLabel = `${cur} ${val}`;

  try {
    await sendPaymentReceiptEmails({
      customerEmail,
      customerName,
      amountLabel,
      captureId,
      orderId,
      packageSummary,
    });
    emailedCaptureIds.add(captureId);
  } catch (e) {
    console.error("[paypal webhook] email failed", e);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
