"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * After PayPal redirect: capture the order (success) or show a cancel notice.
 */
export default function PayPalReturnHandler({ slug }: { slug: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [banner, setBanner] = useState<"ok" | "cancel" | "err" | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const payment = sp.get("payment");
    if (!payment) return;

    if (payment === "cancelled") {
      setBanner("cancel");
      setMsg("Checkout was cancelled. You can try again whenever you are ready.");
      router.replace(`/services/${slug}`, { scroll: false });
      return;
    }

    if (payment !== "success") return;

    const orderId = sp.get("token");
    if (!orderId) return;

    const seenKey = `paypal_capture_${orderId}`;
    if (typeof window !== "undefined" && sessionStorage.getItem(seenKey)) {
      router.replace(`/services/${slug}`, { scroll: false });
      return;
    }
    sessionStorage.setItem(seenKey, "1");

    (async () => {
      try {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const data = (await res.json()) as { error?: string; status?: string };
        if (!res.ok) {
          throw new Error(data.error || "Could not confirm payment");
        }
        setBanner("ok");
        setMsg("Payment received. Thank you — we will follow up with you shortly.");
      } catch (e) {
        setBanner("err");
        setMsg(e instanceof Error ? e.message : "Payment confirmation failed.");
        sessionStorage.removeItem(seenKey);
      } finally {
        router.replace(`/services/${slug}`, { scroll: false });
      }
    })();
  }, [sp, router, slug]);

  if (!banner) return null;

  const styles =
    banner === "ok"
      ? "border-emerald-200/80 bg-emerald-50/90 text-emerald-950"
      : banner === "cancel"
        ? "border-stone-200/80 bg-stone-50/95 text-stone-800"
        : "border-red-200/80 bg-red-50/90 text-red-950";

  return (
    <div
      className={`mx-auto mb-4 mt-24 max-w-3xl rounded-xl border px-4 py-3 text-sm md:mt-28 md:px-6 ${styles}`}
      role="status"
    >
      {msg}
    </div>
  );
}
