"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Section, Reveal, WordReveal, ParallaxBlock } from "./Section";
import { Logo } from "./Logo";

const PILLARS = [
  { id: "technology", color: "#0E46B8", title: "Technology", body: "Open infrastructure connecting renewable systems, intelligence and capital flows." },
  { id: "energy", color: "#F4B000", title: "Renewable Energy", body: "Distributed solar, wind and storage networks feeding the loop." },
  { id: "environment", color: "#0DBB63", title: "Environmental Stewardship", body: "Restoring soils, watersheds, and forests as living infrastructure." },
  { id: "ai", color: "#6B8CF7", title: "AI & Intelligence", body: "Models that read ecosystems and route resources where they regenerate most." },
  { id: "circular", color: "#0DBB63", title: "Circular Economy", body: "Materials, products and value designed to return — never to waste." },
  { id: "finance", color: "#F4B000", title: "Regenerative Finance", body: "Capital instruments that compound ecological and human dividends." },
];

export function Mission() {
  return (
    <Section id="mission" eyebrow="01 · Mission" index="A continuous loop">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <WordReveal
            text="We design the connective tissue between technology, nature, intelligence and capital — so that progress regenerates the systems it depends on."
            className="font-display text-[clamp(2rem,4.6vw,4rem)] leading-[1.05] tracking-[-0.015em] text-balance"
          />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <Reveal delay={0.2}>
            <p className="text-[15px] leading-relaxed text-mist">
              Terra Belle Foundation operates as an ecosystem rather than an organization.
              Every initiative — research, infrastructure, finance, education — is a node in
              a closed loop where outputs return as inputs.
            </p>
            <div className="mt-10 space-y-4">
              {[
                ["Founded", "2024"],
                ["Continents", "5"],
                ["Living Programs", "32"],
                ["Field Partners", "147"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between border-b border-black/5 pb-3">
                  <span className="text-[12px] uppercase tracking-[0.2em] text-mist">{k}</span>
                  <span className="font-display text-2xl">{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function PillarCard({ p, i }: { p: (typeof PILLARS)[number]; i: number }) {
  return (
    <motion.article
      id={p.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, rotate: -0.4 }}
      className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 transition-all duration-500 hover:shadow-[0_30px_80px_-30px_rgba(17,17,17,0.18)]"
    >
      <div
        className="absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-60"
        style={{ background: `radial-gradient(circle, ${p.color}55, transparent 65%)` }}
      />
      <div
        className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
        style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }}
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.24em] text-mist">0{i + 1}</span>
        <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
      </div>
      <h3 className="mt-8 font-display text-3xl leading-tight tracking-tight">{p.title}</h3>
      <p className="mt-4 text-[14px] leading-relaxed text-mist">{p.body}</p>
      <div className="mt-10 flex items-center gap-2 text-[12px] font-medium">
        <span className="relative">
          Read pillar
          <span
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
            style={{ background: p.color }}
          />
        </span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </motion.article>
  );
}

export function Ecosystem() {
  return (
    <Section id="technology" eyebrow="02 · Ecosystem" index="Six interlocking pillars">
      <Reveal>
        <h2 className="mb-16 max-w-3xl font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-[-0.015em]">
          The Foundation operates as <em className="text-gradient-earth not-italic">six interconnected pillars</em>, each feeding the others.
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <PillarCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </Section>
  );
}

export function Research() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const r = useTransform(scrollYProgress, [0, 1], [0, 360]);
  return (
    <Section id="research" eyebrow="07 · Research" index="Field laboratories">
      <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div ref={ref} className="relative mx-auto aspect-square w-full max-w-md">
            <motion.div style={{ rotate: r }} className="absolute inset-0">
              <Logo size={400} />
            </motion.div>
            <div className="absolute inset-0 rounded-full border border-black/5" />
            <div className="absolute inset-8 rounded-full border border-black/5" />
            <div className="absolute inset-16 rounded-full border border-black/5" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <WordReveal
            text="Research is not separate from action. Every program runs as a living experiment."
            className="font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.01em]"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 text-[15px] leading-relaxed text-mist">
              Twelve field laboratories across five continents — from coastal mangroves
              to high-altitude grids — publish open datasets continuously back into the network.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6">
              {[
                ["Labs", "12"],
                ["Open Datasets", "284"],
                ["Peer Researchers", "1,420"],
                ["Active Studies", "67"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="font-display text-4xl tracking-tight">{v}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-mist">{k}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" eyebrow="08 · Education" index="A generation of stewards">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <WordReveal
            text="We educate the next generation of systems thinkers — fluent in code, ecology, capital and care."
            className="font-display text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.05] tracking-[-0.015em]"
          />
        </div>
      </div>
      <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 md:grid-cols-3">
        {[
          { t: "Terra Academy", d: "Tuition-free curriculum for regenerative engineering, ecology and finance." },
          { t: "Field Fellowships", d: "Year-long residencies embedded inside live ecosystems and labs." },
          { t: "Open Library", d: "Every paper, dataset and lesson released under a regenerative commons license." },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.1}>
            <div className="group h-full bg-white p-10 transition-colors duration-500 hover:bg-[#fafaf8]">
              <div className="font-display text-2xl tracking-tight">{c.t}</div>
              <p className="mt-4 text-[14px] leading-relaxed text-mist">{c.d}</p>
              <div className="mt-12 flex items-center gap-2 text-[12px]">
                <span>Explore</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Finance() {
  return (
    <Section id="finance" eyebrow="09 · Finance" index="Capital that returns">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <ParallaxBlock range={40}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0E46B8] via-[#6B8CF7] to-[#0DBB63] p-10 text-white">
                <div className="absolute inset-0 grain opacity-50" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="text-[11px] uppercase tracking-[0.28em] opacity-80">Regenerative Fund I</div>
                  <div>
                    <div className="font-display text-7xl leading-none tracking-tight">$420M</div>
                    <div className="mt-2 text-sm opacity-80">Deployed across 38 projects</div>
                    <div className="mt-8 grid grid-cols-2 gap-4 text-xs opacity-90">
                      <div><div className="opacity-70">Ecological IRR</div><div className="font-display text-2xl">11.4%</div></div>
                      <div><div className="opacity-70">Co-Investors</div><div className="font-display text-2xl">62</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </ParallaxBlock>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <WordReveal
            text="Capital instruments engineered to compound ecological and human dividends, not extract them."
            className="font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.01em]"
          />
          <Reveal delay={0.15}>
            <p className="mt-8 text-[15px] leading-relaxed text-mist">
              We blend grant, debt and equity into hybrid vehicles that route returns
              to the ecosystems and communities producing them. Liquidity for the planet,
              not from it.
            </p>
            <div className="mt-10 space-y-3">
              {[
                ["Catalytic Grants", "Risk-first funding for early ecological infrastructure."],
                ["Patient Debt", "20–40 year horizons matched to ecosystem timescales."],
                ["Equity Loops", "Returns recirculate into adjacent regenerative projects."],
              ].map(([k, v]) => (
                <div key={k} className="group flex items-start gap-5 border-t border-black/5 pt-4">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-gold transition-all group-hover:w-6" />
                  <div>
                    <div className="text-[14px] font-medium">{k}</div>
                    <div className="mt-1 text-[13px] text-mist">{v}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function Impact() {
  const stats = [
    { v: "2.4M", k: "Tonnes CO₂ sequestered", c: "#0DBB63" },
    { v: "180k", k: "Hectares restored", c: "#0E46B8" },
    { v: "1.2GW", k: "Renewable capacity online", c: "#F4B000" },
    { v: "47", k: "Bioregions active", c: "#6B8CF7" },
  ];
  return (
    <Section id="impact" eyebrow="10 · Impact" index="Measured in living systems">
      <Reveal>
        <h2 className="max-w-4xl font-display text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.05] tracking-[-0.015em]">
          Impact is measured in <em className="not-italic" style={{ color: "var(--green)" }}>living</em> outcomes, audited annually and reported openly.
        </h2>
      </Reveal>
      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.k} delay={i * 0.08}>
            <div className="group relative h-full overflow-hidden bg-white p-10">
              <div
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
                style={{ background: s.c }}
              />
              <div className="font-display text-[clamp(2.4rem,4.6vw,4.2rem)] leading-none tracking-tight">{s.v}</div>
              <div className="mt-3 text-[12px] uppercase tracking-[0.18em] text-mist">{s.k}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Global() {
  const partners = ["MIT Climate", "WWF", "IRENA", "Rocky Mountain Inst.", "UNDP", "Ellen MacArthur", "Stripe Climate", "Patagonia", "EarthShot", "GEF"];
  return (
    <Section id="global" eyebrow="11 · Global" index="A network of networks">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <WordReveal
            text="Terra Belle is built with — never above — the communities, institutions and ecosystems it serves."
            className="font-display text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.01em]"
          />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <Reveal>
            <p className="text-[15px] leading-relaxed text-mist">
              Active in 47 bioregions across five continents, in coalition with research institutions,
              civic networks, indigenous councils and capital partners.
            </p>
          </Reveal>
        </div>
      </div>
      <Reveal delay={0.2}>
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 md:grid-cols-5">
          {partners.map((p) => (
            <div key={p} className="flex items-center justify-center bg-white px-4 py-10 text-center text-[13px] tracking-tight text-mist transition-colors hover:text-ink">
              {p}
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

export function Future() {
  return (
    <Section id="future" eyebrow="12 · Future" index="The loop continues">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <Logo size={64} className="mx-auto" />
        </Reveal>
        <WordReveal
          text="The work has no end. Every cycle returns stronger than the last."
          className="mt-10 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.015em] text-balance"
        />
        <Reveal delay={0.3}>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-relaxed text-mist">
            Join researchers, builders, stewards and investors writing the next chapter
            of a regenerative civilization.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#hero"
              className="group relative overflow-hidden rounded-full bg-ink px-7 py-3.5 text-[13px] font-medium text-white transition-all hover:scale-[1.03]"
            >
              <span className="relative z-10">Join the mission</span>
            </a>
            <a
              href="#research"
              className="rounded-full border border-black/10 px-7 py-3.5 text-[13px] font-medium transition hover:border-black/30"
            >
              Read the field journal →
            </a>
          </div>
          <div className="mt-24 text-[11px] uppercase tracking-[0.32em] text-mist">
            Continue scrolling — the loop returns to its origin
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
