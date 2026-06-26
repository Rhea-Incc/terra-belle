"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  index,
  children,
  className = "",
}: {
  id: string;
  eyebrow?: string;
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-6 py-32 md:py-44 ${className}`}>
      {(eyebrow || index) && (
        <div className="mb-10 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-mist">
          <span className="flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-mist/40" />
            {eyebrow}
          </span>
          {index && <span>{index}</span>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function WordReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <h2 className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}&nbsp;
        </motion.span>
      ))}
    </h2>
  );
}

export function ParallaxBlock({ children, range = 60 }: { children: ReactNode; range?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
