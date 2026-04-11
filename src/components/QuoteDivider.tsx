"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function QuoteDivider({ quote }: { quote: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="py-10 md:py-14 px-6" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-3xl mx-auto text-center"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/[0.18] to-transparent" />
          <svg className="w-4 h-4 text-violet-muted/50 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 9 6 9 9C9 10.5 10 11.7 11.3 12C10 12.3 9 13.5 9 15C9 18 12 22 12 22C12 22 15 18 15 15C15 13.5 14 12.3 12.7 12C14 11.7 15 10.5 15 9C15 6 12 2 12 2Z" />
            <path d="M2 12C2 12 6 9 9 9C10.5 9 11.7 10 12 11.3C12.3 10 13.5 9 15 9C18 9 22 12 22 12C22 12 18 15 15 15C13.5 15 12.3 14 12 12.7C11.7 14 10.5 15 9 15C6 15 2 12 2 12Z" opacity="0.7" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/[0.18] to-transparent" />
        </div>
        <p className="text-lg md:text-xl font-light text-[#78778A] italic leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center gap-3 mt-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/[0.18] to-transparent" />
          <svg className="w-4 h-4 text-teal-soft/50 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 9 6 9 9C9 10.5 10 11.7 11.3 12C10 12.3 9 13.5 9 15C9 18 12 22 12 22C12 22 15 18 15 15C15 13.5 14 12.3 12.7 12C14 11.7 15 10.5 15 9C15 6 12 2 12 2Z" />
            <path d="M2 12C2 12 6 9 9 9C10.5 9 11.7 10 12 11.3C12.3 10 13.5 9 15 9C18 9 22 12 22 12C22 12 18 15 15 15C13.5 15 12.3 14 12 12.7C11.7 14 10.5 15 9 15C6 15 2 12 2 12Z" opacity="0.7" />
          </svg>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-black/[0.18] to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
