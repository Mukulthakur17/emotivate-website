export type PayPalMode = "sandbox" | "live";

export function paypalApiBase(mode: PayPalMode): string {
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function paypalGetAccessToken(
  clientId: string,
  clientSecret: string,
  mode: PayPalMode
): Promise<string> {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${paypalApiBase(mode)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("PayPal auth: missing access_token");
  }
  return json.access_token;
}

export async function paypalCreateOrder(
  accessToken: string,
  mode: PayPalMode,
  params: {
    amountInr: string;
    description: string;
    returnUrl: string;
    cancelUrl: string;
  }
): Promise<{ id: string; approvalUrl: string }> {
  const res = await fetch(`${paypalApiBase(mode)}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "INR",
            value: params.amountInr,
          },
          description: params.description.slice(0, 127),
        },
      ],
      application_context: {
        brand_name: "Emotivate",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    }),
  });

  const data = (await res.json()) as {
    id?: string;
    links?: { rel: string; href: string }[];
    message?: string;
  };

  if (!res.ok) {
    throw new Error(
      data.message || `PayPal create order failed (${res.status})`
    );
  }

  const approve = data.links?.find((l) => l.rel === "approve");
  if (!data.id || !approve?.href) {
    throw new Error("PayPal create order: missing id or approve link");
  }

  return { id: data.id, approvalUrl: approve.href };
}

export async function paypalCaptureOrder(
  accessToken: string,
  mode: PayPalMode,
  orderId: string
): Promise<{ status: string; raw: unknown }> {
  const res = await fetch(
    `${paypalApiBase(mode)}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    }
  );

  const raw = await res.json();
  if (!res.ok) {
    const msg =
      typeof raw === "object" && raw && "message" in raw
        ? String((raw as { message?: string }).message)
        : res.statusText;
    throw new Error(`PayPal capture failed (${res.status}): ${msg}`);
  }

  const status =
    typeof raw === "object" && raw && "status" in raw
      ? String((raw as { status?: string }).status)
      : "UNKNOWN";

  return { status, raw };
}
