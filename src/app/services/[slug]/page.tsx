"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, MouseEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Package {
  sessions: number;
  priceINR: number;
  label: string;
  features: string[];
  highlighted?: boolean;
}

interface ServiceData {
  title: string;
  description: string;
  longDescription: string;
  packages: Package[];
  accentColor: string;
  accentBg: string;
  /** Decorative hero background (Unsplash). */
  heroImage: string;
  heroImageAlt: string;
}

const currencies = [
  { code: "INR", symbol: "₹", rate: 1, label: "INR" },
  { code: "USD", symbol: "$", rate: 0.012, label: "USD" },
  { code: "GBP", symbol: "£", rate: 0.0095, label: "GBP" },
  { code: "EUR", symbol: "€", rate: 0.011, label: "EUR" },
  { code: "AUD", symbol: "A$", rate: 0.018, label: "AUD" },
];

function formatPrice(inr: number, currencyIdx: number): string {
  const c = currencies[currencyIdx];
  const converted = inr * c.rate;
  if (c.code === "INR") {
    return `${c.symbol}${converted.toLocaleString("en-IN")}`;
  }
  return `${c.symbol}${converted.toFixed(converted < 100 ? 2 : 0)}`;
}

const servicesData: Record<string, ServiceData> = {
  "individual-therapy": {
    title: "Individual Therapy",
    description:
      "One-on-one sessions tailored to your unique emotional landscape.",
    longDescription:
      "Individual therapy at Emotivate is a deeply personal experience. Whether you're dealing with anxiety, depression, low self-worth, relationship patterns, or simply wanting to understand yourself better — sessions are designed around your specific needs. Using evidence-based approaches in a warm, non-judgmental space, we work together to uncover patterns, build coping strategies, and create meaningful change.",
    accentColor: "#6EA593",
    accentBg: "rgba(110,165,147,0.1)",
    heroImage:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80",
    heroImageAlt: "Calm, mindful space suggesting reflection and personal growth",
    packages: [
      {
        sessions: 1,
        priceINR: 1499,
        label: "Seed",
        features: [
          "1 × 45-minute session",
          "Personalised approach",
          "Flexible scheduling",
        ],
      },
      {
        sessions: 4,
        priceINR: 5499,
        label: "Bloom",
        features: [
          "4 × 45-minute sessions",
          "Structured therapeutic plan",
          "Between-session support",
          "Progress tracking",
        ],
        highlighted: true,
      },
      {
        sessions: 7,
        priceINR: 10000,
        label: "Thrive",
        features: [
          "7 × 60-minute sessions",
          "Comprehensive treatment plan",
          "Between-session resources",
          "Progress assessments",
        ],
      },
    ],
  },
  "couples-therapy": {
    title: "Couples Therapy",
    description:
      "Strengthen your relationship through deeper understanding and renewed connection.",
    longDescription:
      "Couples therapy at Emotivate helps partners navigate communication breakdowns, recurring conflicts, trust issues, and emotional disconnection. Sessions create a neutral, supportive space where both partners feel heard. Together, we identify unhealthy patterns, improve how you relate to each other, and build tools for lasting connection.",
    accentColor: "#8E7AB8",
    accentBg: "rgba(142,122,184,0.1)",
    heroImage:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1920&q=80",
    heroImageAlt: "Two people together, suggesting partnership and connection",
    packages: [
      {
        sessions: 1,
        priceINR: 1999,
        label: "Seed",
        features: [
          "1 × 60-minute session",
          "Joint assessment",
          "Communication strategies",
          "Flexible scheduling",
        ],
      },
      {
        sessions: 4,
        priceINR: 6999,
        label: "Bloom",
        features: [
          "4 × 60-minute sessions",
          "Relationship assessment",
          "Structured interventions",
          "Take-home exercises",
        ],
        highlighted: true,
      },
      {
        sessions: 7,
        priceINR: 12499,
        label: "Thrive",
        features: [
          "7 × 60-minute sessions",
          "In-depth relationship work",
          "Communication skill-building",
          "Conflict resolution tools",
          "Progress check-ins",
        ],
      },
    ],
  },
  "child-adolescent-therapy": {
    title: "Child & Adolescent Therapy",
    description:
      "Supportive space for young minds to develop emotional resilience.",
    longDescription:
      "Therapy for children and adolescents at Emotivate is adapted to their developmental stage and emotional needs. Whether it's anxiety about school, social struggles, behavioural challenges, or identity exploration — sessions are designed to feel safe, engaging, and age-appropriate. We also work closely with parents to ensure support extends beyond the therapy room.",
    accentColor: "#D4929A",
    accentBg: "rgba(212,146,154,0.1)",
    heroImage:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1920&q=80",
    heroImageAlt: "Child at play outdoors, suggesting growth and a gentle environment",
    packages: [
      {
        sessions: 1,
        priceINR: 1000,
        label: "Seed",
        features: [
          "1 × 45-minute session",
          "Age-appropriate approach",
          "Parent consultation included",
          "Flexible scheduling",
        ],
      },
      {
        sessions: 4,
        priceINR: 5000,
        label: "Bloom",
        features: [
          "4 × 45-minute sessions",
          "Tailored treatment plan",
          "Parent guidance sessions",
          "Progress updates",
        ],
        highlighted: true,
      },
      {
        sessions: 7,
        priceINR: 9000,
        label: "Thrive",
        features: [
          "7 × 45-minute sessions",
          "Comprehensive support plan",
          "Regular parent consultations",
          "Skill-building resources",
          "Progress assessments",
        ],
      },
    ],
  },
  "career-counselling": {
    title: "Career Counselling",
    description:
      "Navigate career uncertainty and transitions with structured guidance.",
    longDescription:
      "Career counselling at Emotivate goes beyond resume advice. We explore the deeper patterns — fear of failure, perfectionism, burnout, imposter syndrome — that shape your career decisions. Through structured self-discovery, skill mapping, and actionable planning, you'll gain clarity on your direction and the confidence to pursue it.",
    accentColor: "#D4A040",
    accentBg: "rgba(212,160,64,0.1)",
    heroImage:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1920&q=80",
    heroImageAlt: "Calm workspace with natural light, suggesting focus and professional growth",
    packages: [
      {
        sessions: 4,
        priceINR: 4999,
        label: "Career programme",
        features: [
          "4 × 45-minute sessions",
          "Career assessments",
          "Structured report",
        ],
      },
    ],
  },
};

function PricingCard({
  pkg,
  index,
  accentColor,
  accentBg,
  currencyIdx,
}: {
  pkg: Package;
  index: number;
  accentColor: string;
  accentBg: string;
  currencyIdx: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const perSession = pkg.priceINR / pkg.sessions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: 0.4 + index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: "800px" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-2xl p-6 md:p-8 flex flex-col h-full transition-all duration-300 cursor-default"
        style={{
          background: pkg.highlighted
            ? `linear-gradient(145deg, rgba(255,255,255,0.9), ${accentBg})`
            : "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(0,0,0,0.03))",
          border: pkg.highlighted
            ? `2px solid ${accentColor}40`
            : "1.5px solid rgba(0,0,0,0.1)",
          borderTop: pkg.highlighted
            ? `2px solid ${accentColor}60`
            : "1.5px solid rgba(255,255,255,0.7)",
          boxShadow: isHovered
            ? `0 20px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)`
            : "0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)"}`,
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {pkg.highlighted && (
          <div
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1 rounded-full text-xs font-medium text-white"
            style={{ background: accentColor }}
          >
            Most Popular
          </div>
        )}

        {/* Hover glow */}
        {isHovered && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${accentColor}15, transparent 70%)`,
            }}
          />
        )}

        <div className="mb-6 relative">
          <p className="text-sm text-[#78778A] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{pkg.label}</p>
          <div className="flex items-baseline gap-1">
            <motion.span
              key={`${currencyIdx}-${pkg.priceINR}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl md:text-4xl font-light text-[#1A1A2E]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {formatPrice(pkg.priceINR, currencyIdx)}
            </motion.span>
          </div>
          <motion.p
            key={`per-${currencyIdx}-${pkg.priceINR}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-xs text-[#9B9AA6] mt-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {formatPrice(perSession, currencyIdx)}/session
          </motion.p>
        </div>

        <div className="space-y-3 flex-1 mb-8">
          {pkg.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <svg
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: accentColor }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-[#68677A]">{feature}</span>
            </div>
          ))}
        </div>

        <a
          href="/#contact"
          className="block text-center py-3.5 rounded-full text-sm font-medium transition-all duration-300"
          style={{
            background: "rgba(0,0,0,0.04)",
            color: "#1A1A2E",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = accentBg;
            e.currentTarget.style.borderColor = `${accentColor}40`;
            e.currentTarget.style.color = accentColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(0,0,0,0.04)";
            e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
            e.currentTarget.style.color = "#1A1A2E";
          }}
        >
          Book Now
        </a>
      </div>
    </motion.div>
  );
}

export default function ServicePage() {
  const params = useParams();
  const slug = params.slug as string;
  const service = servicesData[slug];
  const [currencyIdx, setCurrencyIdx] = useState(0);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F0EBE5" }}>
        <div className="text-center">
          <h1 className="text-4xl font-light text-[#1A1A2E] mb-4">
            Service not found
          </h1>
          <Link
            href="/"
            className="text-teal-soft hover:underline transition-colors duration-300"
          >
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main style={{ background: "#F0EBE5" }} className="min-h-screen">
      <Navbar />

      <section
        className="pt-28 pb-12 md:pt-40 md:pb-24 px-6 relative overflow-hidden"
        style={{ background: "#E8E2DB" }}
      >
        <div className="absolute inset-0 z-0" aria-hidden>
          <Image
            src={service.heroImage}
            alt=""
            fill
            className="object-cover object-center scale-105"
            sizes="100vw"
            priority
          />
          {/* Readability: soften photo so headline and body copy stay AA-friendly */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: `linear-gradient(180deg, rgba(232,226,219,0.88) 0%, rgba(232,226,219,0.82) 40%, rgba(232,226,219,0.76) 100%), linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 55%)`,
            }}
          />
          <div
            className="absolute inset-0 z-[1] opacity-[0.22] mix-blend-multiply pointer-events-none"
            style={{ backgroundColor: service.accentColor }}
          />
        </div>
        <span className="sr-only">{service.heroImageAlt}</span>

        <div
          className="absolute top-0 left-1/2 w-[600px] h-[400px] rounded-full blur-[180px] -translate-x-1/2 opacity-25 z-[2] pointer-events-none"
          style={{ background: service.accentColor }}
        />

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-[#4a4858] hover:text-[#0e0d18] transition-colors duration-300 mb-8"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              All Services
            </Link>

            <h1 className="text-3xl md:text-6xl font-light tracking-tight text-[#0e0d18] mb-6">
              {service.title}
            </h1>
            <p className="text-base md:text-lg text-[#2f2e3d] max-w-2xl mx-auto leading-relaxed">
              {service.longDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 md:pb-32 px-6 pt-12 md:pt-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light text-[#1A1A2E] mb-6">
              Choose your{" "}
              <span style={{ color: service.accentColor }}>package</span>
            </h2>

            {/* Currency selector */}
            <div className="relative inline-block">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "linear-gradient(145deg, rgba(255,255,255,0.8), rgba(0,0,0,0.02))",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)",
                  color: "#1A1A2E",
                }}
              >
                <span style={{ color: service.accentColor }}>{currencies[currencyIdx].symbol}</span>
                {currencies[currencyIdx].label}
                <svg className="w-3.5 h-3.5 text-[#9B9AA6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  style={{ transform: currencyOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {currencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 py-2 rounded-xl z-50 min-w-[160px]"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(16px)",
                    border: "1.5px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  {currencies.map((c, i) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrencyIdx(i); setCurrencyOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200 text-left"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        background: currencyIdx === i ? service.accentBg : "transparent",
                        color: currencyIdx === i ? service.accentColor : "#4A4A5A",
                        fontWeight: currencyIdx === i ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        if (currencyIdx !== i) e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        if (currencyIdx !== i) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span className="w-6 text-center font-medium" style={{ color: service.accentColor }}>{c.symbol}</span>
                      <span>{c.label}</span>
                      {currencyIdx === i && (
                        <svg className="w-3.5 h-3.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ color: service.accentColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          <div
            className={
              service.packages.length === 1
                ? "max-w-md mx-auto w-full"
                : "grid md:grid-cols-3 gap-6"
            }
          >
            {service.packages.map((pkg, i) => (
              <PricingCard
                key={`${pkg.label}-${i}`}
                pkg={pkg}
                index={i}
                accentColor={service.accentColor}
                accentBg={service.accentBg}
                currencyIdx={currencyIdx}
              />
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-center text-xs text-[#9B9AA6] mt-8"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Prices shown in {currencies[currencyIdx].label} are approximate conversions. Final billing in INR.
          </motion.p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
