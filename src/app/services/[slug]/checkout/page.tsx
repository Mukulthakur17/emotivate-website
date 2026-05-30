"use client";

import { motion } from "framer-motion";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { PAYPAL_PACKAGE_PRICES } from "@/data/service-paypal-prices";
import { SERVICE_META } from "@/data/service-meta";
import { COUNTRIES, DEFAULT_COUNTRY_CODE } from "@/data/countries";
import { buildGoogleFormPrefillUrl, GENDER_OPTIONS } from "@/data/google-form";

type FormState = {
  fullName: string;
  age: string;
  gender: string;
  email: string;
  phoneCountry: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  billingCountry: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function CheckoutInner() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();

  const slug = params.slug as string;
  const packageLabel = search.get("package") || "";
  const currency = (search.get("currency") || "USD").toUpperCase();
  const isInr = currency === "INR";

  const meta = SERVICE_META[slug];
  const price = PAYPAL_PACKAGE_PRICES[slug]?.[packageLabel];

  const accent = meta?.accentColor ?? "#6B5B95";
  const accentBg = meta?.accentBg ?? "rgba(107,91,149,0.1)";

  const [form, setForm] = useState<FormState>({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phoneCountry: DEFAULT_COUNTRY_CODE,
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    billingCountry: DEFAULT_COUNTRY_CODE,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const priceLabel = useMemo(() => {
    if (!price) return "";
    if (isInr) return `₹${Math.round(price.inr).toLocaleString("en-IN")}`;
    return `$${Number.isInteger(price.usd) ? price.usd : price.usd.toFixed(2)}`;
  }, [price, isInr]);

  const set = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Please enter your full name";
    const ageNum = Number(form.age);
    if (!form.age.trim()) next.age = "Please enter your age";
    else if (!Number.isFinite(ageNum) || ageNum < 1 || ageNum > 120)
      next.age = "Enter a valid age";
    if (!form.gender) next.gender = "Please select your gender";
    if (!form.email.trim()) next.email = "Please enter your email";
    else if (!emailRe.test(form.email.trim())) next.email = "Enter a valid email";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) next.phone = "Please enter your phone number";
    else if (digits.length < 6) next.phone = "Enter a valid phone number";
    if (isInr) {
      // INR bookings only need enough to prefill the intake form.
      if (!form.city.trim()) next.city = "Please enter your city";
    } else {
      if (!form.address.trim()) next.address = "Please enter your billing address";
      if (!form.postalCode.trim()) next.postalCode = "Please enter your pincode";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setServerError(null);
    if (!validate()) return;

    // INR bookings don't go through PayPal — redirect to the booking (Google)
    // form, prefilled with the details collected here.
    if (isInr) {
      setSubmitting(true);
      const dial = COUNTRIES.find((c) => c.code === form.phoneCountry)?.dial ?? "";
      const countryName = COUNTRIES.find((c) => c.code === form.billingCountry)?.name ?? "";
      const cityCountry = [form.city.trim(), countryName].filter(Boolean).join(", ");
      const url = buildGoogleFormPrefillUrl({
        fullName: form.fullName.trim(),
        age: form.age.trim(),
        gender: form.gender,
        email: form.email.trim(),
        phone: `${dial} ${form.phone.replace(/\D/g, "")}`.trim(),
        cityCountry,
      });
      window.location.href = url;
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          packageLabel,
          currency: "USD",
          payer: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.replace(/\D/g, ""),
            phoneCountry: form.phoneCountry,
            address: {
              line1: form.address.trim(),
              city: form.city.trim(),
              state: form.state.trim(),
              postalCode: form.postalCode.trim(),
              countryCode: form.billingCountry,
            },
          },
        }),
      });
      const data = (await res.json()) as { error?: string; approvalUrl?: string };
      if (!res.ok) throw new Error(data.error || "Could not start checkout");
      if (!data.approvalUrl) throw new Error("Missing PayPal approval link");
      window.location.href = data.approvalUrl;
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  };

  if (!meta || !price) {
    return (
      <main style={{ background: "#F0EBE5" }} className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-24 px-6 text-center">
          <h1 className="text-3xl font-light text-[#1A1A2E] mb-4">Package not found</h1>
          <p className="text-[#68677A] mb-8">
            We couldn&rsquo;t find that package. Please go back and choose again.
          </p>
          <Link
            href={`/services/${slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white"
            style={{ background: accent }}
          >
            Back to service
          </Link>
        </div>
      </main>
    );
  }

  const inputBase =
    "w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] bg-white/70 border transition-all duration-200 outline-none focus:bg-white";

  const fieldError = (k: keyof FormState) =>
    errors[k] ? (
      <p className="text-xs text-[#c0392b] mt-1.5">{errors[k]}</p>
    ) : null;

  const borderFor = (k: keyof FormState) =>
    errors[k] ? "#e0a0a0" : "rgba(0,0,0,0.12)";

  return (
    <main style={{ background: "#F0EBE5" }} className="min-h-screen">
      <Navbar />

      <section className="pt-28 md:pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/services/${slug}`}
              className="inline-flex items-center gap-2 text-sm text-[#4a4858] hover:text-[#0e0d18] transition-colors duration-300 mb-6"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </Link>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#0e0d18] mb-2">
              Complete your booking
            </h1>
            <p className="text-[#68677A] text-sm md:text-base">
              {isInr
                ? "Enter your details to continue to the booking form."
                : "Enter your details to continue to secure payment."}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-10 items-start">
            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(0,0,0,0.02))",
                border: "1.5px solid rgba(0,0,0,0.08)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="Jane Doe"
                    className={inputBase}
                    style={{ borderColor: borderFor("fullName") }}
                  />
                  {fieldError("fullName")}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                      Age
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={form.age}
                      onChange={(e) => set("age", e.target.value)}
                      placeholder="28"
                      className={inputBase}
                      style={{ borderColor: borderFor("age") }}
                    />
                    {fieldError("age")}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                      Gender
                    </label>
                    <select
                      value={form.gender}
                      onChange={(e) => set("gender", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm bg-white/70 border outline-none focus:bg-white transition-all duration-200"
                      style={{ borderColor: borderFor("gender"), color: form.gender ? "#1A1A2E" : "#9B9AA6" }}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g} style={{ color: "#1A1A2E" }}>
                          {g}
                        </option>
                      ))}
                    </select>
                    {fieldError("gender")}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="jane@example.com"
                    className={inputBase}
                    style={{ borderColor: borderFor("email") }}
                  />
                  {fieldError("email")}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={form.phoneCountry}
                      onChange={(e) => set("phoneCountry", e.target.value)}
                      className="px-3 py-3 rounded-xl text-sm text-[#1A1A2E] bg-white/70 border outline-none focus:bg-white transition-all duration-200 max-w-[130px]"
                      style={{ borderColor: "rgba(0,0,0,0.12)" }}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={`dial-${c.code}`} value={c.code}>
                          {c.flag} {c.dial}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="98765 43210"
                      className={inputBase}
                      style={{ borderColor: borderFor("phone") }}
                    />
                  </div>
                  {fieldError("phone")}
                </div>

                {!isInr && (
                  <div>
                    <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                      Billing Address
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="House / Street / Area"
                      className={inputBase}
                      style={{ borderColor: borderFor("address") }}
                    />
                    {fieldError("address")}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="City"
                      className={inputBase}
                      style={{ borderColor: borderFor("city") }}
                    />
                    {fieldError("city")}
                  </div>
                  {isInr ? (
                    <div>
                      <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                        Country
                      </label>
                      <select
                        value={form.billingCountry}
                        onChange={(e) => set("billingCountry", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] bg-white/70 border outline-none focus:bg-white transition-all duration-200"
                        style={{ borderColor: "rgba(0,0,0,0.12)" }}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={`country-${c.code}`} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                        State / Region
                      </label>
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) => set("state", e.target.value)}
                        placeholder="State"
                        className={inputBase}
                        style={{ borderColor: "rgba(0,0,0,0.12)" }}
                      />
                    </div>
                  )}
                </div>

                {!isInr && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={form.postalCode}
                        onChange={(e) => set("postalCode", e.target.value)}
                        placeholder="560001"
                        className={inputBase}
                        style={{ borderColor: borderFor("postalCode") }}
                      />
                      {fieldError("postalCode")}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#68677A] mb-2 uppercase tracking-wide">
                        Country
                      </label>
                      <select
                        value={form.billingCountry}
                        onChange={(e) => set("billingCountry", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] bg-white/70 border outline-none focus:bg-white transition-all duration-200"
                        style={{ borderColor: "rgba(0,0,0,0.12)" }}
                      >
                        {COUNTRIES.map((c) => (
                          <option key={`country-${c.code}`} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {serverError && (
                <div
                  className="mt-6 rounded-xl p-3 text-sm"
                  style={{ background: "rgba(192,57,43,0.07)", border: "1px solid rgba(192,57,43,0.25)", color: "#a5331f" }}
                >
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: accent }}
              >
                {submitting
                  ? isInr
                    ? "Redirecting…"
                    : "Redirecting to PayPal…"
                  : isInr
                  ? "Continue to booking form"
                  : `Proceed to Pay ${priceLabel}`}
              </button>
              <p className="text-center text-xs text-[#9B9AA6] mt-3">
                {isInr
                  ? "You\u2019ll be taken to our secure booking form, pre-filled with your details, to complete your booking."
                  : "You\u2019ll be securely redirected to PayPal to complete the payment."}
              </p>
            </motion.form>

            {/* Order summary */}
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl p-6 md:p-7 lg:sticky lg:top-28"
              style={{
                background: `linear-gradient(145deg, rgba(255,255,255,0.92), ${accentBg})`,
                border: `1.5px solid ${accent}33`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)",
              }}
            >
              <p className="text-xs uppercase tracking-wide text-[#9B9AA6] mb-1">Order summary</p>
              <h2 className="text-xl font-medium text-[#1A1A2E] mb-1">{meta.title}</h2>
              <p className="text-sm font-medium mb-5" style={{ color: accent }}>
                {packageLabel} package
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#68677A]">Package total</span>
                  <span className="text-[#1A1A2E] font-medium">{priceLabel}</span>
                </div>
                <div className="h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
                <div className="flex items-center justify-between">
                  <span className="text-[#1A1A2E] font-medium">Total due</span>
                  <span className="text-lg font-semibold" style={{ color: accent }}>{priceLabel}</span>
                </div>
              </div>

              <p className="text-xs text-[#9B9AA6] mt-5 leading-relaxed">
                {isInr
                  ? "For INR bookings, you\u2019ll complete your booking via our secure booking form. Your details are used only to prefill that form."
                  : "Billed in USD via PayPal. Your details are used only to process this booking and prefill your payment."}
              </p>
            </motion.aside>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutInner />
    </Suspense>
  );
}
