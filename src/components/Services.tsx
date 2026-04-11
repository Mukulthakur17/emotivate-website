"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";

interface ServiceData {
  title: string;
  slug: string;
  description: string;
  gradient: string;
  glowColor: string;
  dotColor: string;
  sketchColor: string;
  image: string;
  imageAlt: string;
}

const services: ServiceData[] = [
  {
    title: "Individual Therapy",
    slug: "individual-therapy",
    description:
      "One-on-one sessions tailored to your unique emotional landscape — helping you navigate anxiety, self-worth, and life transitions with clarity.",
    gradient: "linear-gradient(135deg, #6EA593, #8E7AB8)",
    glowColor: "rgba(110,165,147,0.4)",
    dotColor: "bg-teal-soft",
    sketchColor: "#6EA593",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&q=80",
    imageAlt: "Calm therapy session in a peaceful setting",
  },
  {
    title: "Couples Therapy",
    slug: "couples-therapy",
    description:
      "Strengthen your relationship through deeper understanding, better communication, and tools to reconnect authentically.",
    gradient: "linear-gradient(135deg, #8E7AB8, #D4929A)",
    glowColor: "rgba(142,122,184,0.4)",
    dotColor: "bg-violet-muted",
    sketchColor: "#8E7AB8",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    imageAlt: "Couple holding hands walking together",
  },
  {
    title: "Child & Adolescent Therapy",
    slug: "child-adolescent-therapy",
    description:
      "Supportive space for young minds to develop emotional resilience, navigate social challenges, and build healthy coping strategies.",
    gradient: "linear-gradient(135deg, #D4929A, #FBBF24)",
    glowColor: "rgba(212,146,154,0.4)",
    dotColor: "bg-peach",
    sketchColor: "#D4929A",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80",
    imageAlt: "Happy child in a sunlit field",
  },
  {
    title: "Career Counselling",
    slug: "career-counselling",
    description:
      "Navigate career uncertainty, transitions, and burnout with structured guidance, self-discovery, and actionable direction.",
    gradient: "linear-gradient(135deg, #D4A040, #6EA593)",
    glowColor: "rgba(212,160,64,0.4)",
    dotColor: "bg-amber-400",
    sketchColor: "#D4A040",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80",
    imageAlt: "Professional workspace with notebook and laptop",
  },
];

function ServiceCard({ service, index, isInView }: { service: ServiceData; index: number; isInView: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
    rotateX.set((y - 0.5) * -12);
    rotateY.set((x - 0.5) * 12);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.15 + index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <Link
          href={`/services/${service.slug}`}
          className="group block relative overflow-hidden rounded-2xl h-full transition-shadow duration-500"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.85), rgba(240,235,229,0.7))",
            border: isHovered ? `1.5px solid rgba(0,0,0,0.15)` : "1.5px solid rgba(0,0,0,0.1)",
            boxShadow: isHovered
              ? `0 20px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`
              : "0 4px 14px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}
        >
          {/* Mouse-following glow spotlight */}
          <motion.div
            className="absolute w-[200px] h-[200px] rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${service.glowColor}, transparent 70%)`,
              left: `calc(${mouseX.get() * 100}% - 100px)`,
              top: `calc(${mouseY.get() * 100}% - 100px)`,
              opacity: isHovered ? 1 : 0,
            }}
            animate={{
              left: `calc(${mouseX.get() * 100}% - 100px)`,
              top: `calc(${mouseY.get() * 100}% - 100px)`,
            }}
          />

          {/* Animated gradient border on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: service.gradient,
              opacity: isHovered ? 0.12 : 0,
              transition: "opacity 0.4s ease",
            }}
          />

          <div className="relative flex items-center p-7 md:p-8">
            <div className="flex-1 pr-4" style={{ transform: "translateZ(20px)" }}>
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className={`w-2.5 h-2.5 rounded-full ${service.dotColor}`}
                  animate={isHovered ? { scale: [1, 1.4, 1] } : {}}
                  transition={{ duration: 0.6 }}
                />
                <h3 className="text-lg font-medium text-offwhite">
                  {service.title}
                </h3>
              </div>
              <p className="text-[#68677A] leading-relaxed text-sm mb-5">
                {service.description}
              </p>
              <motion.span
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
                style={{ color: isHovered ? service.sketchColor : "#87869A" }}
              >
                View packages
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  animate={isHovered ? { x: [0, 4, 0] } : { x: 0 }}
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.span>
            </div>

            {/* Image with float animation on hover */}
            <motion.div
              className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0 rounded-xl overflow-hidden relative"
              style={{ transform: "translateZ(40px)" }}
              animate={isHovered
                ? { y: [0, -6, 0], scale: 1.05 }
                : { y: 0, scale: 1 }
              }
              transition={{
                duration: 2.5,
                repeat: isHovered ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80px, 112px"
              />
            </motion.div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="services" ref={ref} className="py-14 md:py-20 px-6 relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-soft/[0.04] rounded-full blur-[180px]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-teal-soft/80 text-xs tracking-[0.3em] uppercase">
            Services
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
            Explore what&apos;s right for{" "}
            <span className="text-teal-soft">you</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <ServiceCard
              key={service.slug}
              service={service}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
