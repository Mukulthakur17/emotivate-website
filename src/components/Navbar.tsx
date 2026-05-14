"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#why", label: "Why Emotivate" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Plain <nav>: avoid motion y:-100 — Chrome/WebKit can leave fixed headers off-screen if animation/hydration misbehaves. */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] w-full transition-[box-shadow] duration-500 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 bg-white/95 [transform:translateZ(0)]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,243,248,0.95))",
          borderBottom: "1px solid rgba(255,255,255,0.7)",
          boxShadow: isScrolled
            ? "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)"
            : "0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden ring-1 ring-black/10 group-hover:ring-black/20 transition-all duration-300">
              <Image
                src="/logo.jpg"
                alt="Emotivate"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-lg font-semibold tracking-[0.15em] text-[#1A1A2E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              EMOTIVATE
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#1A1A2E] hover:text-violet-muted transition-colors duration-300 relative group"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-teal-soft group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <a
            href="#contact"
            className="hidden lg:inline-flex px-6 py-2.5 text-sm font-medium bg-[#1A1A2E] text-white border border-[#1A1A2E] rounded-full hover:bg-[#1A1A2E]/90 transition-all duration-300 hover:shadow-lg"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Contact Us
          </a>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileOpen}
          >
            <motion.span
              animate={
                isMobileOpen
                  ? { rotate: 45, y: 6, width: 24 }
                  : { rotate: 0, y: 0, width: 24 }
              }
              transition={{ duration: 0.3 }}
              className="h-0.5 bg-offwhite block origin-center"
            />
            <motion.span
              animate={isMobileOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: 16 }}
              transition={{ duration: 0.2 }}
              className="h-0.5 bg-offwhite block"
            />
            <motion.span
              animate={
                isMobileOpen
                  ? { rotate: -45, y: -6, width: 24 }
                  : { rotate: 0, y: 0, width: 24 }
              }
              transition={{ duration: 0.3 }}
              className="h-0.5 bg-offwhite block origin-center"
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] backdrop-blur-2xl lg:hidden"
            style={{ background: "rgba(28,27,46,0.97)" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-2xl font-light text-white/90 hover:text-teal-soft transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                onClick={() => setIsMobileOpen(false)}
                className="mt-4 px-8 py-3.5 text-base bg-white/[0.08] border border-white/20 text-white rounded-full hover:bg-white/[0.12] transition-all duration-300"
              >
                Contact Us
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
