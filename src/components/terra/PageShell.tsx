"use client";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SmoothScroll } from "./SmoothScroll";
import { EnergyCursor } from "./Cursor";
import { ParticleNetwork } from "./ParticleNetwork";
import { TopNav } from "./Nav";
import { EnergyDivider } from "./Divider";
import { FlowProvider } from "./FlowContext";

/**
 * Shared chrome for sub-pages (Planet, Ecosystem, Circular, Impact, Verticals).
 * Provides the floating nav, ambient background systems, and a "Return to the
 * journey" footer that loops users back to the cinematic landing experience.
 */
export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <ParticleNetwork />
      <EnergyCursor />
      <FlowProvider>
        <TopNav />

        <main className="relative z-10">
          <section className="relative mx-auto w-full max-w-7xl px-4 pt-28 pb-10 sm:px-6 sm:pt-36 sm:pb-16 md:pt-48 md:pb-24">
            <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.24em] text-mist sm:text-[11px] sm:tracking-[0.28em]">
              <span className="inline-block h-px w-6 bg-mist/40 sm:w-8" />
              <span className="truncate">{eyebrow}</span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(2.1rem,7vw,5rem)] leading-[0.98] tracking-[-0.02em] text-balance sm:mt-5">
              {title}
            </h1>
            {intro && (
              <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-mist sm:mt-6 sm:text-[15px]">
                {intro}
              </p>
            )}
          </section>

          {children}

          <EnergyDivider />

          <section className="relative mx-auto w-full max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
            <div className="text-[10.5px] uppercase tracking-[0.24em] text-mist sm:text-[11px] sm:tracking-[0.28em]">
              Return to the loop
            </div>
            <div className="mt-4 font-display text-[clamp(1.5rem,4.4vw,2.8rem)] leading-tight tracking-tight text-balance">
              Every pathway leads back to the whole.
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8">
              <Link
                to="/"
                data-magnetic
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-5 py-2.5 text-[12px] font-medium text-white transition-all duration-300 hover:shadow-[0_22px_60px_-15px_rgba(244,176,0,0.6)] sm:px-6 sm:py-3 sm:text-[12.5px]"
              >
                <span className="relative z-10">Re-enter the journey</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">↻</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold via-green to-earth transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              </Link>
              <Link
                to="/verticals"
                data-magnetic
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[12px] font-medium backdrop-blur transition hover:border-black/20 sm:px-5 sm:py-2.5 sm:text-[12.5px]"
              >
                Explore the verticals →
              </Link>
            </div>
          </section>
        </main>
      </FlowProvider>
    </>
  );
}
