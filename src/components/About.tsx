"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const clientsFeel = [
  "Truly seen, without judgment",
  "Gently challenged, without pressure",
  "Deeply supported, without fostering dependence",
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="py-16 md:py-20 px-6 relative bg-navy-800">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-violet-muted/5 rounded-full blur-[180px] -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <span className="text-teal-soft/80 text-xs tracking-[0.3em] uppercase">
            About
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
            Hi, I&apos;m{" "}
            <span className="text-violet-muted">Sukhmani</span>.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto md:mx-0 w-[240px] md:w-full"
          >
            <div className="relative w-full h-full min-h-[280px] rounded-2xl overflow-hidden">
              <Image
                src="/about-sukhmani.jpg"
                alt="Sukhmani Walia — Counselling Psychologist"
                fill
                className="object-cover object-[center_20%]"
                sizes="320px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-muted/8 to-teal-soft/8 rounded-[1.5rem] blur-2xl -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <p className="text-base md:text-lg text-[#55546A] leading-relaxed">
              I am a Counselling Psychologist and the founder of Emotivate. Over
              the years, I have had the privilege of working with teenagers,
              adults, and couples navigating anxiety, self-doubt, relationship
              challenges, and significant life transitions.
            </p>

            <p className="text-base md:text-lg text-[#55546A] leading-relaxed">
              My therapeutic approach is warm, thoughtful, and gently direct.
              Beyond listening with care, I support you in identifying patterns,
              understanding your emotional responses, and developing healthier,
              more sustainable ways of coping and relating.
            </p>

            <div>
              <p className="text-base md:text-lg text-[#55546A] leading-relaxed mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                Clients often share that in our work together they feel:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {clientsFeel.map((item, i) => {
                  const colors = ["#6EA593", "#8E7AB8", "#D4929A"];
                  const icons = ["✦", "✦", "✦"];
                  return (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.7 + i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl"
                      style={{
                        background: "linear-gradient(145deg, rgba(255,255,255,0.6), rgba(0,0,0,0.02))",
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.5)",
                      }}
                    >
                      <span className="text-base flex-shrink-0" style={{ color: colors[i] }}>{icons[i]}</span>
                      <span className="text-sm font-medium text-[#1A1A2E] leading-snug">{item}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <p className="text-base md:text-lg text-[#55546A] leading-relaxed">
              Therapy with me is collaborative and attuned to your unique needs.
              It can be structured when helpful, always grounded in evidence-based
              practice, and delivered in a way that feels human, authentic, and
              accessible.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
