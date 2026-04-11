"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2C3E50] border-t border-black/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-black/10">
                <Image
                  src="/logo.jpg"
                  alt="Emotivate"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-medium tracking-[0.15em] text-white">
                EMOTIVATE
              </span>
            </Link>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              Therapy that feels human. Growth that feels possible.
              <br />
              Professional online counselling by Sukhmani Walia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-12">
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-4">
                Navigate
              </p>
              <div className="space-y-3">
                {footerLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block text-sm text-white/60 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-4">
                Services
              </p>
              <div className="space-y-3">
                <Link
                  href="/services/individual-therapy"
                  className="block text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  Individual Therapy
                </Link>
                <Link
                  href="/services/couples-therapy"
                  className="block text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  Couples Therapy
                </Link>
                <Link
                  href="/services/child-adolescent-therapy"
                  className="block text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  Child & Adolescent
                </Link>
                <Link
                  href="/services/career-counselling"
                  className="block text-sm text-white/60 hover:text-white transition-colors duration-300"
                >
                  Career Counselling
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Emotivate. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Made with care for your well-being.
          </p>
        </div>
      </div>
    </footer>
  );
}
