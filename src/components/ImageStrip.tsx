"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

interface ImageStripProps {
  src: string;
  alt: string;
}

export default function ImageStrip({ src, alt }: ImageStripProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1.2 }}
      className="relative w-full h-48 md:h-64 overflow-hidden my-4"
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/20 to-navy-900/60" />
    </motion.div>
  );
}
