"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const quotes = [
  "Creating a space where you can safely explore the parts of yourself you've been taught to hide.",
  "Healing begins the moment you feel heard.",
  "You don't have to be broken to need therapy; you just have to be human and ready to grow.",
  "In the space between who you were and who you will be, lies the opportunity for profound growth.",
];

export default function Hero() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1920&q=80"
          alt=""
          fill
          className="object-cover opacity-[0.04]"
          priority
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(107,91,149,0.9) 0%, rgba(136,176,75,0.85) 100%)" }} />

      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 50%, rgba(107,91,149,0.3), transparent 50%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 50%, rgba(136,176,75,0.3), transparent 50%)" }} />

      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 3, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] w-16 h-16 border border-white/10 rounded-2xl hidden md:block"
      />
      <motion.div
        animate={{ y: [10, -12, 10], rotate: [0, -3, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[25%] left-[10%] w-12 h-12 border border-white/10 rounded-full hidden md:block"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
            Therapy that feels{" "}
            <span className="text-white italic" style={{ fontFamily: "'Playfair Display', serif" }}>human</span>.
            <br />
            Growth that feels{" "}
            <span className="text-white italic" style={{ fontFamily: "'Playfair Display', serif" }}>possible</span>.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-6 md:mt-8 h-20 md:h-16 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentQuote}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-base md:text-lg text-white/70 font-light italic max-w-xl mx-auto leading-relaxed"
            >
              &ldquo;{quotes[currentQuote]}&rdquo;
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 md:mt-24"
        >
          <a
            href="#services"
            className="group inline-flex items-center gap-2 px-9 py-4 bg-white text-[#6B5B95] font-medium rounded-full hover:bg-white/90 transition-all duration-500 hover:shadow-lg text-sm tracking-wide"
          >
            Explore our Services
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
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-white/40 rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
