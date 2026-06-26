"use client";
import { motion } from "motion/react";
import { Logo } from "./Logo";
import { EnergyField } from "./EnergyField";
import { Magnetic } from "./Interactive";


export function Hero() {
  const headline = ["A", "regenerative", "operating", "system", "for", "the", "planet."];
  return (
    <section id="hero" className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden">
      <EnergyField />

      {/* Slow rotating emblem behind headline */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
      >
        <div className="animate-spin-slow">
          <Logo size={520} />
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex items-center gap-3 rounded-full border border-black/5 bg-white/60 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-mist backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: "var(--green)" }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--green)" }} />
          </span>
          Terra Belle Foundation
        </motion.div>

        <h1 className="font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.98] tracking-[-0.02em] text-balance">
          {headline.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.1, delay: 0.5 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {w === "regenerative" ? <em className="text-gradient-earth not-italic">{w}</em> : w}&nbsp;
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-8 max-w-2xl text-[15px] leading-relaxed text-mist md:text-base"
        >
          One continuous loop where technology, renewable energy, environmental stewardship,
          intelligence, finance and education circulate as a single living ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic strength={0.4}>
            <a
              href="#mission"
              data-magnetic
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-3.5 text-[13px] font-medium text-white transition-all duration-300 hover:shadow-[0_22px_60px_-15px_rgba(244,176,0,0.6)]"
            >
              <span className="relative z-10">Discover Terra Belle</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold via-green to-earth opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ boxShadow: "0 0 0 1px rgba(244,176,0,0.4), 0 0 40px rgba(244,176,0,0.35)" }} />
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href="#future"
              data-magnetic
              className="group rounded-full border border-black/10 bg-white/60 px-7 py-3.5 text-[13px] font-medium backdrop-blur-md transition-all duration-300 hover:border-black/30 hover:bg-white"
            >
              Join the mission <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
          </Magnetic>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.32em] text-mist"
        >
          <div className="flex flex-col items-center gap-2">
            <span>Scroll · One Living Loop</span>
            <span className="h-8 w-px animate-pulse bg-mist/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
