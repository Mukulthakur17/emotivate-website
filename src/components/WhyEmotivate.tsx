"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const features = [
  {
    title: "Affordable",
    description:
      "Quality mental health care shouldn't be a privilege. Our pricing makes therapy accessible to everyone.",
    icon: "\uD83D\uDCB0",
    color: "#6EA593",
  },
  {
    title: "Whenever, Wherever",
    description:
      "Fully online sessions that fit your schedule. No commute, no waiting rooms — just you and your therapist.",
    icon: "\uD83C\uDF0D",
    color: "#8E7AB8",
  },
  {
    title: "Modern Psychology for Real Life",
    description:
      "Evidence-based approaches that actually fit your daily life — not textbook theories.",
    icon: "\uD83E\uDDE0",
    color: "#D4929A",
  },
  {
    title: "Growth Beyond Crises",
    description:
      "Therapy isn't just for difficult times. It's for anyone ready to understand themselves and evolve intentionally.",
    icon: "\uD83C\uDF31",
    color: "#6EA593",
  },
  {
    title: "Easy Ongoing Care",
    description:
      "Simple booking, flexible packages, and consistent support designed around your journey.",
    icon: "\uD83E\uDD1D",
    color: "#8E7AB8",
  },
];

export default function WhyEmotivate() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="why" ref={ref} className="py-14 md:py-20 relative overflow-hidden bg-navy-800">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-muted/[0.04] rounded-full blur-[160px] -translate-y-1/2" />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 px-6"
        >
          <span className="text-teal-soft/80 text-xs tracking-[0.3em] uppercase">
            Why Us
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
            What makes Emotivate{" "}
            <span className="text-violet-muted">special</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto px-6"
        >
          {/* Desktop: horizontal accordion */}
          <div className="hidden md:flex h-[380px] gap-4">
            {features.map((feature, i) => {
              const isActive = activeIndex === i;
              return (
                <motion.div
                  key={feature.title}
                  onClick={() => setActiveIndex(i)}
                  animate={{ flex: isActive ? 5 : 0.7 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.28, -0.03, 0, 0.99],
                  }}
                  className="relative rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}20)`,
                    boxShadow: "0px 8px 24px -5px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col justify-center p-8">
                    <motion.div
                      animate={{
                        opacity: isActive ? 0 : 1,
                        scale: isActive ? 0.8 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="text-5xl" style={{ filter: isActive ? "blur(4px)" : "none", transition: "filter 0.3s" }}>
                        {feature.icon}
                      </span>
                    </motion.div>

                    <motion.div
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 20,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: isActive ? 0.3 : 0,
                      }}
                      className="relative z-10"
                    >
                      <span className="text-5xl block mb-5" role="img" aria-label={feature.title}>
                        {feature.icon}
                      </span>
                      <h3 className="text-xl font-medium text-offwhite mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-[#68677A] leading-relaxed text-sm max-w-md">
                        {feature.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: vertical accordion */}
          <div className="flex flex-col gap-3 md:hidden">
            {features.map((feature, i) => {
              const isActive = activeIndex === i;
              return (
                <motion.div
                  key={feature.title}
                  onClick={() => setActiveIndex(i)}
                  animate={{ height: isActive ? 200 : 64 }}
                  transition={{
                    duration: 0.5,
                    ease: [0.28, -0.03, 0, 0.99],
                  }}
                  className="relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}40, ${feature.color}20)`,
                    boxShadow: "0px 8px 24px -5px rgba(0,0,0,0.08)",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <div className="flex items-center gap-4 px-5 h-16">
                    <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                    <h3 className="text-base font-medium text-offwhite">{feature.title}</h3>
                    <motion.svg
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-4 h-4 ml-auto flex-shrink-0 text-[#68677A]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </div>
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: isActive ? 0.2 : 0 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-[#68677A] leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
