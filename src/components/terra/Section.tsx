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
    <section
      id={id}
      className={`relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:py-32 lg:py-44 ${className}`}
    >
      {(eyebrow || index) && (
        <div className="mb-6 flex items-center justify-between gap-3 text-[10.5px] uppercase tracking-[0.24em] text-mist sm:mb-10 sm:text-[11px] sm:tracking-[0.28em]">
          <span className="flex min-w-0 items-center gap-3">
            <span className="inline-block h-px w-6 shrink-0 bg-mist/40 sm:w-8" />
            <span className="truncate">{eyebrow}</span>
          </span>
          {index && <span className="shrink-0">{index}</span>}
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
