export type PayPalMode = "sandbox" | "live";

export function paypalApiBase(mode: PayPalMode): string {
  return mode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

type PayPalErrorBody = {
  name?: string;
  message?: string;
  debug_id?: string;
  details?: Array<{ issue?: string; description?: string; field?: string }>;
};

/**
 * Builds a human-readable error from a PayPal error response, surfacing the
 * specific `details[].issue` (e.g. CURRENCY_NOT_SUPPORTED) which the generic
 * top-level `message` hides.
 */
function paypalErrorMessage(
  status: number,
  body: PayPalErrorBody,
  fallback: string
): string {
  const parts: string[] = [];
  if (body.name) parts.push(body.name);
  if (body.message) parts.push(body.message);

  const detail = body.details?.[0];
  if (detail?.issue) {
    parts.push(
      `[${detail.issue}]${detail.description ? ` ${detail.description}` : ""}`
    );
  }

  const base = parts.length ? parts.join(" — ") : fallback;
  const suffix = body.debug_id ? ` (debug_id: ${body.debug_id})` : "";
  return `PayPal ${status}: ${base}${suffix}`;
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
    let parsed: PayPalErrorBody = {};
    const text = await res.text();
    try {
      parsed = JSON.parse(text) as PayPalErrorBody;
    } catch {
      parsed = { message: text };
    }
    throw new Error(
      paypalErrorMessage(res.status, parsed, "auth failed (check credentials)")
    );
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
    amount: string;
    currencyCode: string;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    customId: string;
    invoiceId: string;
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
            currency_code: params.currencyCode,
            value: params.amount,
          },
          description: params.description.slice(0, 127),
          custom_id: params.customId.slice(0, 127),
          invoice_id: params.invoiceId.slice(0, 127),
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
  } & PayPalErrorBody;

  if (!res.ok) {
    throw new Error(
      paypalErrorMessage(res.status, data, "create order failed")
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
    throw new Error(
      paypalErrorMessage(res.status, (raw ?? {}) as PayPalErrorBody, "capture failed")
    );
  }

  const status =
    typeof raw === "object" && raw && "status" in raw
      ? String((raw as { status?: string }).status)
      : "UNKNOWN";

  return { status, raw };
}

export type PayPalOrderDetails = {
  id: string;
  payer?: {
    email_address?: string;
    name?: { given_name?: string; surname?: string };
  };
  purchase_units?: Array<{
    custom_id?: string;
    amount?: { currency_code?: string; value?: string };
  }>;
};

export async function paypalGetOrder(
  accessToken: string,
  mode: PayPalMode,
  orderId: string
): Promise<PayPalOrderDetails> {
  const res = await fetch(
    `${paypalApiBase(mode)}/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = (await res.json()) as PayPalOrderDetails & PayPalErrorBody;
  if (!res.ok) {
    throw new Error(
      paypalErrorMessage(res.status, data, "get order failed")
    );
  }
  if (!data.id) {
    throw new Error("PayPal get order: missing id");
  }
  return data;
}

export async function paypalVerifyWebhookSignature(
  accessToken: string,
  mode: PayPalMode,
  params: {
    authAlgo: string;
    certUrl: string;
    transmissionId: string;
    transmissionSig: string;
    transmissionTime: string;
    webhookId: string;
    webhookEvent: unknown;
  }
): Promise<boolean> {
  const res = await fetch(
    `${paypalApiBase(mode)}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_algo: params.authAlgo,
        cert_url: params.certUrl,
        transmission_id: params.transmissionId,
        transmission_sig: params.transmissionSig,
        transmission_time: params.transmissionTime,
        webhook_id: params.webhookId,
        webhook_event: params.webhookEvent,
      }),
    }
  );
  const data = (await res.json()) as {
    verification_status?: string;
    message?: string;
  };
  if (!res.ok) {
    return false;
  }
  return data.verification_status === "SUCCESS";
}
