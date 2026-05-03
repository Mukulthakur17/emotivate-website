import nodemailer from "nodemailer";

const DEFAULT_OWNER = "you.emotivate@gmail.com";

function getTransporter() {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_APP_PASSWORD?.trim();
  if (!user || !pass) {
    throw new Error("Missing SMTP_USER or SMTP_APP_PASSWORD (Gmail app password).");
  }
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

function ownerInbox(): string {
  return (process.env.PAYMENT_NOTIFY_EMAIL || DEFAULT_OWNER).trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Owner notification first, then customer receipt (if PayPal returned a payer email).
 */
export async function sendPaymentReceiptEmails(opts: {
  customerEmail?: string;
  customerName?: string;
  amountLabel: string;
  captureId: string;
  orderId: string;
  packageSummary: string;
}): Promise<void> {
  const from = process.env.SMTP_USER?.trim();
  if (!from) {
    throw new Error("SMTP_USER must be set (Gmail address used to send mail).");
  }

  const owner = ownerInbox();
  const transporter = getTransporter();
  const name = opts.customerName?.trim() || "there";
  const safeName = escapeHtml(name);
  const safeAmount = escapeHtml(opts.amountLabel);
  const safePkg = escapeHtml(opts.packageSummary);
  const safeCapture = escapeHtml(opts.captureId);
  const safeOrder = escapeHtml(opts.orderId);
  const buyer =
    opts.customerEmail?.trim() ||
    "(PayPal did not return a payer email — check the PayPal dashboard for this capture.)";

  const ownerHtml = `
    <p><strong>New payment</strong></p>
    <ul>
      <li><strong>Amount:</strong> ${safeAmount}</li>
      <li><strong>Package:</strong> ${safePkg}</li>
      <li><strong>Buyer email:</strong> ${escapeHtml(buyer)}</li>
      <li><strong>Buyer name:</strong> ${safeName}</li>
      <li><strong>PayPal capture ID:</strong> ${safeCapture}</li>
      <li><strong>PayPal order ID:</strong> ${safeOrder}</li>
    </ul>
  `;

  await transporter.sendMail({
    from: `"Emotivate" <${from}>`,
    to: owner,
    subject: `[Emotivate] Payment ${opts.amountLabel} — ${opts.packageSummary}`,
    text: `Payment received\nAmount: ${opts.amountLabel}\nPackage: ${opts.packageSummary}\nBuyer: ${buyer}\nCapture: ${opts.captureId}\nOrder: ${opts.orderId}`,
    html: ownerHtml,
  });

  if (opts.customerEmail?.trim()) {
    const customerHtml = `
    <p>Hi ${safeName},</p>
    <p>Thank you — we've received your payment of <strong>${safeAmount}</strong> for <strong>${safePkg}</strong> at Emotivate.</p>
    <p>We'll follow up with you shortly about next steps for your sessions.</p>
    <p style="margin-top:1.5rem;color:#555;font-size:13px;">If you didn't make this payment, please reply to this email right away.</p>
    <p style="margin-top:1rem;color:#888;font-size:12px;">PayPal capture ID: ${safeCapture}<br/>Order ID: ${safeOrder}</p>
  `;

    await transporter.sendMail({
      from: `"Emotivate" <${from}>`,
      to: opts.customerEmail.trim(),
      replyTo: owner,
      subject: "We received your payment — Emotivate",
      text: `Hi ${name},\n\nWe've received your payment of ${opts.amountLabel} for ${opts.packageSummary}.\n\nWe'll follow up shortly.\n\nPayPal capture: ${opts.captureId}\nOrder: ${opts.orderId}`,
      html: customerHtml,
    });
  }
}
