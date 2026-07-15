"use client";
import { motion } from "motion/react";
import { Section, Reveal, WordReveal } from "./Section";
import { Magnetic } from "./Interactive";
import { Logo } from "./Logo";
import { EcosystemMap } from "./EcosystemMap";
import { CircularFlow } from "./CircularFlow";
import { CountUp } from "./CountUp";
import { PartnerConstellation } from "./Constellation";
import { FLOWS, useFlow } from "./FlowContext";
import { OrganicBackdrop } from "./OrganicBackdrop";

/** Top-of-chapter indicator that lights up when a CircularFlow is energising this chapter. */
function FlowAccent({ chapter }: { chapter: string }) {
  const { active } = useFlow();
  const flow = active ? FLOWS[active] : null;
  const energised = !!flow && flow.chapters.includes(chapter);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-6 top-0 h-px origin-left transition-all duration-700"
      style={{
        background: energised
          ? `linear-gradient(90deg, transparent, ${flow!.color}, transparent)`
          : "rgba(17,17,17,0.04)",
        transform: energised ? "scaleX(1)" : "scaleX(0.4)",
        opacity: energised ? 1 : 0.5,
        boxShadow: energised ? `0 0 18px ${flow!.color}88` : "none",
      }}
    />
  );
}

/* ---------- Shared atoms ---------- */

function ChapterMeta({ index, title, arc }: { index: string; title: string; arc: string }) {
  return (
    <div className="mb-12 grid grid-cols-1 items-end gap-6 md:grid-cols-12">
      <div className="md:col-span-6">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-mist">
          <span className="inline-block h-px w-8 bg-mist/40" />
          Chapter {index}
        </div>
        <div className="mt-3 font-display text-[clamp(2.6rem,5.4vw,4.4rem)] leading-[0.98] tracking-[-0.02em]">{title}</div>
      </div>
      <div className="md:col-span-4 md:col-start-9">
        <div className="text-[11px] uppercase tracking-[0.22em] text-mist">Arc · {arc}</div>
      </div>
    </div>
  );
}

function Bridge({ from, to, label }: { from: string; to: string; label: string }) {
  const { active } = useFlow();
  const flow = active ? FLOWS[active] : null;
  const contextual = flow?.bridges[from];
  const display = contextual ?? label;
  const color = flow?.color;
  return (
    <Reveal delay={0.1}>
      <div className="mx-auto mt-24 max-w-3xl border-t border-black/5 pt-10 text-center">
        <div
          className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.28em] transition-colors duration-500"
          style={{ color: flow ? color : undefined }}
        >
          {flow && (
            <span
              className="h-1.5 w-1.5 rounded-full transition-all"
              style={{ background: color, boxShadow: `0 0 10px ${color}` }}
            />
          )}
          {flow ? `${flow.label} flow` : "Next"}
        </div>
        <a
          href={`#${to}`}
          data-magnetic
          className="group mt-3 inline-flex items-baseline gap-3 font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-snug tracking-tight transition-colors duration-500"
          style={{ color: flow ? color : undefined }}
        >
          <span>{display}</span>
          <span className="transition-transform duration-500 group-hover:translate-x-2">↓</span>
        </a>
      </div>
    </Reveal>
  );
}

function CTAPill({ href, label, color = "#111" }: { href: string; label: string; color?: string }) {
  return (
    <Magnetic strength={0.3}>
      <a
        href={href}
        data-magnetic
        className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-[12.5px] font-medium backdrop-blur transition-all duration-300 hover:border-black/20"
      >
        <span className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
        <span className="relative z-10">{label}</span>
        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    </Magnetic>
  );
}

/* ---------- 02 · Planet ---------- */

export function PlanetChapter() {
  const rings = [
    { v: 1.5, k: "°C warming threshold approaching", c: "#F4B000" },
    { v: 8, k: "billion people sharing one biosphere", c: "#6B8CF7" },
    { v: 75, k: "% of ecosystems requiring restoration", c: "#0DBB63", suffix: "%" },
    { v: 6, k: "trillion USD needed annually", c: "#0E46B8", prefix: "$", suffix: "T" },
  ];

  return (
    <Section id="planet" eyebrow="02 · The Planet" index="Understand">
      <FlowAccent chapter="planet" />
      <ChapterMeta index="02" title="The Planet" arc="Understand" />

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <WordReveal
            text="Our greatest challenges are deeply connected — and so are their solutions."
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.015em] text-balance"
          />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Reveal delay={0.2}>
            <p className="text-[15px] leading-relaxed text-mist">
              Climate, biodiversity, energy access, food security, capital flows — they are not separate problems.
              They are signals from one interdependent system asking for a coordinated answer.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 md:grid-cols-4">
        {rings.map((r, i) => (
          <Reveal key={r.k} delay={i * 0.08}>
            <div className="group relative h-full overflow-hidden bg-white p-8">
              <div
                className="absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: r.c }}
              />
              <div className="relative font-display text-[clamp(2rem,3.8vw,3.4rem)] leading-none tracking-tight">
                <CountUp to={r.v} prefix={r.prefix ?? ""} suffix={r.suffix ?? ""} decimals={r.v < 10 ? 1 : 0} />
              </div>
              <div className="relative mt-3 text-[12px] leading-relaxed text-mist">{r.k}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <Bridge from="planet" to="ecosystem" label="If the challenges are connected, the answer must be too." />
    </Section>
  );
}

/* ---------- 03 · Ecosystem ---------- */

export function EcosystemChapter() {
  return (
    <Section id="ecosystem" eyebrow="03 · The Ecosystem" index="Discover">
      <FlowAccent chapter="ecosystem" />
      <ChapterMeta index="03" title="The Ecosystem" arc="Discover" />

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <WordReveal
            text="Progress happens when every system strengthens the next."
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.015em]"
          />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Reveal delay={0.15}>
            <p className="text-[15px] leading-relaxed text-mist">
              Ten interlocking domains operate as one organism. Technology powers intelligence,
              intelligence routes capital, capital regenerates land, land sustains communities — and
              communities, in turn, redefine what technology is for.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <CTAPill href="#circular" label="Explore the Ecosystem" color="#F4B000" />
              <CTAPill href="#collaboration" label="Become a Partner" color="#0DBB63" />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-20">
        <Reveal delay={0.1}>
          <OrganicBackdrop variant="green">
            <div className="mb-10 text-center">
              <div className="text-[11px] uppercase tracking-[0.28em] text-green">Orbital System</div>
              <div className="mt-2 font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-tight tracking-tight text-white">
                Ten domains, one gravity.
              </div>
            </div>
            <EcosystemMap />
          </OrganicBackdrop>
        </Reveal>
      </div>

      <Bridge from="ecosystem" to="circular" label="Each connection becomes a flow that never ends." />
    </Section>
  );
}

/* ---------- 04 · Circular Economy ---------- */

export function CircularChapter() {
  return (
    <Section id="circular" eyebrow="04 · The Circular Economy" index="Discover">
      <FlowAccent chapter="circular" />
      <ChapterMeta index="04" title="The Circular Economy" arc="Discover" />

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <WordReveal
            text="Nothing is wasted. Everything creates new value."
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.015em]"
          />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <Reveal delay={0.15}>
            <p className="text-[15px] leading-relaxed text-mist">
              Energy, capital, knowledge and regeneration circulate as a single loop — each output
              becomes another system's input. Follow any current to see cause become effect.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-20">
        <Reveal delay={0.1}>
          <OrganicBackdrop variant="deep">
            <CircularFlow />
          </OrganicBackdrop>
        </Reveal>
      </div>

      <Bridge from="circular" to="impact" label="When loops turn, outcomes compound." />
    </Section>
  );
}

/* ---------- 05 · Impact Engine ---------- */

export function ImpactChapter() {
  const metrics = [
    { v: 1.2, suffix: "GW", k: "Clean energy generated", c: "#F4B000" },
    { v: 2.4, suffix: "M t", k: "Carbon emissions reduced", c: "#0DBB63", decimals: 1 },
    { v: 380, k: "Communities reached", c: "#6B8CF7" },
    { v: 67, k: "Research initiatives supported", c: "#0E46B8" },
    { v: 9400, k: "Educational opportunities created", c: "#0DBB63" },
    { v: 420, prefix: "$", suffix: "M", k: "Investment mobilized", c: "#F4B000" },
    { v: 147, k: "Partnerships formed", c: "#0E46B8" },
  ];

  return (
    <Section id="impact" eyebrow="05 · The Impact Engine" index="Connect">
      <FlowAccent chapter="impact" />
      <ChapterMeta index="05" title="The Impact Engine" arc="Connect" />

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <WordReveal
            text="Impact is measured by what keeps growing."
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.015em]"
          />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <Reveal delay={0.15}>
            <p className="text-[15px] leading-relaxed text-mist">
              A living dashboard, not an annual report. Every metric is auditable, openly published,
              and connected to the others — because outcomes never stand alone.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 md:grid-cols-4 lg:grid-cols-7">
        {metrics.map((m, i) => (
          <Reveal key={m.k} delay={i * 0.06}>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden bg-white p-7">
              <div
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                style={{ background: m.c }}
              />
              <div className="text-[10px] uppercase tracking-[0.22em] text-mist">Live</div>
              <div>
                <div className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none tracking-tight">
                  <CountUp to={m.v} prefix={m.prefix ?? ""} suffix={m.suffix ?? ""} decimals={m.decimals ?? 0} />
                </div>
                <div className="mt-3 text-[11.5px] leading-snug text-mist">{m.k}</div>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em]" style={{ color: m.c }}>
                <span className="h-1 w-1 rounded-full" style={{ background: m.c, boxShadow: `0 0 8px ${m.c}` }} />
                Growing
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CTAPill href="#collaboration" label="Support Research" color="#0E46B8" />
          <CTAPill href="#collaboration" label="Invest in Regeneration" color="#F4B000" />
        </div>
      </Reveal>

      <Bridge from="impact" to="collaboration" label="Numbers grow because people do." />
    </Section>
  );
}

/* ---------- 06 · Collaboration ---------- */

export function CollaborationChapter() {
  return (
    <Section id="collaboration" eyebrow="06 · The Collaboration Network" index="Connect">
      <FlowAccent chapter="collaboration" />
      <ChapterMeta index="06" title="The Collaboration Network" arc="Connect" />

      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <WordReveal
            text="Every partnership expands what is possible."
            className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-[-0.015em]"
          />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <Reveal delay={0.15}>
            <p className="text-[15px] leading-relaxed text-mist">
              A constellation of researchers, institutions, innovators, governments, investors and
              communities — each illuminating the others.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <CTAPill href="#future" label="Become a Partner" color="#0DBB63" />
              <CTAPill href="#future" label="Collaborate on Innovation" color="#6B8CF7" />
              <CTAPill href="#future" label="Join the Community" color="#F4B000" />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-20">
        <Reveal delay={0.1}>
          <PartnerConstellation />
        </Reveal>
      </div>

      <Bridge from="collaboration" to="future" label="A constellation only grows brighter from here." />
    </Section>
  );
}

/* ---------- 07 · Future (loop) ---------- */

export function FutureChapter() {
  const words = ["The", "future", "is", "built", "one", "connected", "system", "at", "a", "time."];
  return (
    <Section id="future" eyebrow="07 · The Future" index="Return">
      <FlowAccent chapter="future" />
      <ChapterMeta index="07" title="The Future" arc="Imagine · Participate · Return" />

      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="relative mx-auto mb-12 h-24 w-24">
            <span className="absolute inset-0 rounded-full border border-gold/40 animate-spin-slow" />
            <span className="absolute inset-2 rounded-full border border-green/40" style={{ animation: "spin-slow 22s linear infinite reverse" }} />
            <span className="absolute inset-4 rounded-full border border-earth/40 animate-spin-slow" />
            <Logo size={64} className="absolute inset-[14px]" />
          </div>
        </Reveal>

        <h2 className="font-display text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1.02] tracking-[-0.02em] text-balance">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}&nbsp;
            </motion.span>
          ))}
        </h2>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-8 max-w-2xl text-[15px] leading-relaxed text-mist">
            Terra Belle Foundation is not a destination — it is a continuous platform where
            technology, environmental stewardship, finance, research, education and human
            collaboration reinforce one another. Choose any pathway into the ecosystem.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Magnetic strength={0.4}>
              <a
                href="#genesis"
                data-magnetic
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-7 py-3.5 text-[13px] font-medium text-white transition-all duration-300 hover:shadow-[0_22px_60px_-15px_rgba(244,176,0,0.6)]"
              >
                <span className="relative z-10">Begin the loop again</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">↻</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold via-green to-earth transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              </a>
            </Magnetic>
            <CTAPill href="#collaboration" label="Learn More" color="#0E46B8" />
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-16 text-[11px] uppercase tracking-[0.28em] text-mist">
            Awaken · Understand · Discover · Connect · Imagine · Participate · Return
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
