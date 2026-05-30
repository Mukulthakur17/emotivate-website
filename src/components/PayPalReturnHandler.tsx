"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type Status = "processing" | "ok" | "cancel" | "err";

/**
 * After the PayPal redirect: capture the order (success), or surface a cancel /
 * error state — presented as a polished status modal.
 */
export default function PayPalReturnHandler({ slug }: { slug: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const payment = sp.get("payment");
    if (!payment) return;

    if (payment === "cancelled") {
      setStatus("cancel");
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

    setStatus("processing");

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
        setStatus("ok");
      } catch (e) {
        setStatus("err");
        setErrorMsg(e instanceof Error ? e.message : "Payment confirmation failed.");
        sessionStorage.removeItem(seenKey);
      } finally {
        router.replace(`/services/${slug}`, { scroll: false });
      }
    })();
  }, [sp, router, slug]);

  const close = () => setStatus(null);

  // Lock background scroll while the modal is open.
  useEffect(() => {
    if (!status) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [status]);

  const content = {
    processing: {
      title: "Confirming your payment",
      message: "Hang tight for a moment while we confirm your payment with PayPal.",
      accent: "#6B5B95",
      tint: "rgba(107,91,149,0.12)",
    },
    ok: {
      title: "Payment successful",
      message:
        "Thank you! We\u2019ve received your payment. Our team will reach out shortly to arrange your session slotting.",
      accent: "#2E9E6B",
      tint: "rgba(46,158,107,0.12)",
    },
    cancel: {
      title: "Checkout cancelled",
      message:
        "No payment was taken. You can pick up right where you left off whenever you\u2019re ready.",
      accent: "#8A8577",
      tint: "rgba(138,133,119,0.14)",
    },
    err: {
      title: "We couldn\u2019t confirm your payment",
      message:
        errorMsg ||
        "Something went wrong confirming your payment. If you were charged, please contact us and we\u2019ll sort it out.",
      accent: "#C0392B",
      tint: "rgba(192,57,43,0.1)",
    },
  } as const;

  const c = status ? content[status] : null;

  return (
    <AnimatePresence>
      {status && c && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-status-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#1A1A2E]/40 backdrop-blur-sm"
            onClick={status === "processing" ? undefined : close}
          />

          {/* Card */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center"
            style={{
              boxShadow:
                "0 30px 70px rgba(26,26,46,0.28), 0 6px 18px rgba(26,26,46,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {/* Close button (hidden while processing) */}
            {status !== "processing" && (
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#9B9AA6] transition-colors duration-200 hover:bg-black/5 hover:text-[#1A1A2E]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Icon */}
            <div
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: c.tint }}
            >
              {status === "processing" ? (
                <motion.span
                  className="block h-10 w-10 rounded-full border-[3px] border-transparent"
                  style={{ borderTopColor: c.accent, borderRightColor: c.accent }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 0.9 }}
                />
              ) : (
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke={c.accent} strokeWidth={2}>
                  {status === "ok" && (
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                    />
                  )}
                  {status === "cancel" && (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  )}
                  {status === "err" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.008M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z"
                    />
                  )}
                </svg>
              )}
            </div>

            <h2
              id="payment-status-title"
              className="mb-2 text-2xl font-light tracking-tight text-[#1A1A2E]"
            >
              {c.title}
            </h2>
            <p className="text-sm leading-relaxed text-[#68677A]">{c.message}</p>

            {status !== "processing" && (
              <button
                type="button"
                onClick={close}
                className="mt-7 w-full rounded-full py-3.5 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
                style={{ background: c.accent }}
              >
                {status === "ok" ? "Done" : status === "cancel" ? "Back to packages" : "Close"}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
