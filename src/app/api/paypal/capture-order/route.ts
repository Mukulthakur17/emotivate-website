import { NextRequest, NextResponse } from "next/server";
import {
  paypalCaptureOrder,
  paypalGetAccessToken,
  type PayPalMode,
} from "@/lib/paypal";

function resolveMode(): PayPalMode {
  const m = (process.env.PAYPAL_MODE || "sandbox").toLowerCase();
  return m === "live" ? "live" : "sandbox";
}

export async function POST(req: NextRequest) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "PayPal is not configured." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orderId = (body as { orderId?: string }).orderId;
  if (typeof orderId !== "string" || !orderId.trim()) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const mode = resolveMode();

  try {
    const accessToken = await paypalGetAccessToken(clientId, clientSecret, mode);
    const { status } = await paypalCaptureOrder(accessToken, mode, orderId.trim());
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    const message = e instanceof Error ? e.message : "PayPal capture error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
