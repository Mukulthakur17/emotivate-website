"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const faqs = [
  {
    question: "What happens in the first therapy session?",
    answer:
      "Your first session is a gentle introduction. We explore what brings you to therapy, understand your goals, and create a comfortable space for you to share at your own pace. You don't have to prepare anything.",
    icon: "💬",
  },
  {
    question: "Is therapy confidential?",
    answer:
      "Yes — completely. Everything you share remains confidential, except in rare cases where safety might be at risk, as per ethical guidelines.",
    icon: "🔒",
  },
  {
    question: "How do I know if therapy is right for me?",
    answer:
      'If you\'re feeling overwhelmed, confused, stuck, or simply want to understand yourself better, therapy can help. Many clients start even without a "big reason."',
    icon: "🤔",
  },
  {
    question: "How long does therapy take?",
    answer:
      "There's no fixed duration. Some people feel relief in a few sessions; others prefer ongoing support. You choose the pace.",
    icon: "⏳",
  },
  {
    question: "What concerns do you work with?",
    answer:
      "We support mental health challenges like anxiety, depression, low self-esteem, relationship issues, stress, career uncertainty, grief, and emotional patterns that affect daily life.",
    icon: "🧠",
  },
  {
    question: "Do you offer online sessions?",
    answer:
      "Yes, our sessions are fully online and accessible from anywhere — simple and private.",
    icon: "💻",
  },
  {
    question: "How do I book an appointment?",
    answer:
      'You can schedule your session directly through our "Book a Session" page. Once confirmed, you\'ll receive a link and pre-session guidelines.',
    icon: "📅",
  },
  {
    question: "What if I feel nervous about opening up?",
    answer:
      "That's completely normal. You set the pace. There's no pressure to share everything at once — we build trust gradually, and you'll always feel in control of the conversation.",
    icon: "🌱",
  },
];

const accentColors = [
  { border: "#6EA593", bg: "rgba(110,165,147,0.08)" },
  { border: "#8E7AB8", bg: "rgba(142,122,184,0.08)" },
  { border: "#D4929A", bg: "rgba(212,146,154,0.08)" },
  { border: "#6EA593", bg: "rgba(110,165,147,0.08)" },
  { border: "#8E7AB8", bg: "rgba(142,122,184,0.08)" },
  { border: "#D4929A", bg: "rgba(212,146,154,0.08)" },
  { border: "#6EA593", bg: "rgba(110,165,147,0.08)" },
  { border: "#8E7AB8", bg: "rgba(142,122,184,0.08)" },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
  accent,
  isInView,
}: {
  faq: { question: string; answer: string; icon: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  accent: { border: string; bg: string };
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="rounded-xl overflow-hidden transition-all duration-400 cursor-pointer"
        style={{
          background: isOpen
            ? `linear-gradient(145deg, ${accent.bg}, rgba(0,0,0,0.02))`
            : "linear-gradient(145deg, rgba(255,255,255,0.5), rgba(0,0,0,0.05))",
          borderLeft: `3px solid ${isOpen ? accent.border : "transparent"}`,
          borderTop: "1px solid rgba(255,255,255,0.6)",
          boxShadow: isOpen
            ? `0 6px 20px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)`
            : "0 3px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}
        onClick={onToggle}
      >
        <button
          className="w-full flex items-center gap-4 py-5 px-5 text-left group"
          aria-expanded={isOpen}
        >
          <span
            className="text-xl flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300"
            style={{
              background: isOpen ? accent.bg : "rgba(0,0,0,0.03)",
            }}
          >
            {faq.icon}
          </span>
          <span className="flex-1 text-[15px] md:text-base text-offwhite font-medium leading-snug">
            {faq.question}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{
              background: isOpen ? accent.border : "rgba(0,0,0,0.05)",
            }}
          >
            <svg
              className="w-3.5 h-3.5 transition-colors duration-300"
              style={{ color: isOpen ? "#fff" : "#9B9AA6" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="text-[#68677A] leading-relaxed pb-5 px-5 pl-14 md:pl-[4.25rem] text-sm md:text-[15px]">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" ref={ref} className="py-14 md:py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-10 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="md:sticky md:top-28"
          >
            <span className="text-teal-soft/80 text-xs tracking-[0.3em] uppercase">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight leading-tight">
              Common{" "}
              <span className="text-violet-muted">questions</span>
            </h2>
            <p className="mt-4 text-[#78778A] text-sm leading-relaxed">
              Everything you need to know before starting your journey. Can&apos;t find what you&apos;re looking for? Reach out to us directly.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-2 h-2 rounded-full bg-teal-soft" />
                <div className="w-2 h-2 rounded-full bg-violet-muted" />
                <div className="w-2 h-2 rounded-full bg-peach" />
              </div>
              <span className="text-xs text-[#9B9AA6]">{faqs.length} answers ready</span>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.question}
                faq={faq}
                index={i}
                accent={accentColors[i]}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                isInView={isInView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
