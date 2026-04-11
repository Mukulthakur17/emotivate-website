"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={ref} className="py-14 md:py-20 px-6 relative bg-navy-800">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-soft/[0.02] to-transparent" />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl relative overflow-hidden"
        >
          <div className="grid md:grid-cols-5">
            <div className="relative h-48 md:h-auto md:col-span-2">
              <Image
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&q=80"
                alt="Peaceful mindfulness and mental wellness"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 md:hidden" />
            </div>

            <div className="p-8 md:p-12 md:col-span-3 text-center md:text-left">
              <span className="text-teal-soft/80 text-xs tracking-[0.3em] uppercase">
                Get Started
              </span>
              <h2 className="mt-3 text-2xl md:text-4xl font-light tracking-tight mb-4">
                We&apos;d love to hear from you
              </h2>
              <p className="text-[#68677A] max-w-md leading-relaxed mb-8 text-sm">
                You don&apos;t need to have it all figured out. We meet you
                where you are, without judgment and without pressure.
              </p>

              <a
                href="mailto:You.emotivate@gmail.com"
                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-offwhite text-white border border-offwhite rounded-full hover:bg-offwhite/90 transition-all duration-500 hover:shadow-lg text-sm tracking-wide mb-8"
              >
                Contact Us
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>

              <div className="flex flex-wrap items-center justify-center md:justify-between gap-3 md:gap-0 pt-6 border-t border-black/[0.06]">
                <a
                  href="mailto:You.emotivate@gmail.com"
                  className="text-sm text-[#1A1A2E] hover:text-teal-soft transition-colors duration-300"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  You.emotivate@gmail.com
                </a>
                <span className="text-black/15 text-xs hidden md:inline">|</span>
                <a
                  href="https://www.instagram.com/you.emotivate/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1A1A2E] hover:text-violet-muted transition-colors duration-300 inline-flex items-center gap-1.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                  you.emotivate
                </a>
                <span className="text-black/15 text-xs hidden md:inline">|</span>
                <span className="text-sm text-[#68677A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Fully Online</span>
                <span className="text-black/15 text-xs hidden md:inline">|</span>
                <span className="text-sm text-[#68677A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>India &amp; Worldwide</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
