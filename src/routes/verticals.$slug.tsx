import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Section, Reveal } from "@/components/terra/Section";
import { Tilt } from "@/components/terra/Interactive";
import { EnergyDivider } from "@/components/terra/Divider";
import { JourneyLoop } from "@/components/terra/JourneyLoop";
import {
  PartnerApplyDialog,
  type PartnerApplyScope,
} from "@/components/terra/PartnerApplyDialog";
import { getVertical } from "@/lib/verticals-data";

export const Route = createFileRoute("/verticals/$slug")({
  loader: ({ params }) => {
    const v = getVertical(params.slug);
    if (!v) throw notFound();
    return { slug: v.slug };
  },
  head: ({ params }) => {
    const v = getVertical(params.slug);
    if (!v) {
      return {
        meta: [
          { title: "Vertical not found — Terra Belle" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        { title: `${v.title} — Terra Belle Foundation` },
        { name: "description", content: v.summary },
        { property: "og:title", content: `${v.title} — Terra Belle Foundation` },
        { property: "og:description", content: v.summary },
      ],
    };
  },
  notFoundComponent: VerticalNotFound,
  component: VerticalDetail,
});

function VerticalNotFound() {
  return (
    <Section id="not-found">
      <p className="text-mist">
        This vertical hasn't taken root yet.{" "}
        <Link to="/verticals" className="text-ink underline">
          Back to all verticals
        </Link>
      </p>
    </Section>
  );
}

function VerticalDetail() {
  const { slug } = Route.useLoaderData();
  const v = getVertical(slug)!;
  const Icon = v.Icon;
  const rootRef = useRef<HTMLDivElement>(null);
  const [applyScope, setApplyScope] = useState<PartnerApplyScope | null>(null);
  const openApply = (scope: PartnerApplyScope) => setApplyScope(scope);
  const closeApply = () => setApplyScope(null);

  // On slug change, scroll the detail into view so the visitor sees the newly
  // selected vertical — while the grid above stays intact.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // Give the layout a beat to settle after the grid re-renders.
    const id = window.setTimeout(() => {
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }, 60);
    return () => window.clearTimeout(id);
  }, [slug]);

  return (
    <div ref={rootRef} id={`vertical-${v.slug}`} aria-label={`${v.title} — detail`}>
      <EnergyDivider />

      {/* Hero band */}
      <Section id={`hero-${v.slug}`} eyebrow={`${v.category} · Vertical`}>
        <motion.div
          key={v.slug}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/85 p-10 backdrop-blur md:p-16"
        >
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
            style={{ background: v.color }}
          />
          <div
            aria-hidden
            className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{ background: v.color }}
          />

          <div className="relative flex items-center gap-4">
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl"
              style={{ background: v.color + "22" }}
            >
              <Icon size={28} color={v.color} />
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-mist">{v.eyebrow}</div>
              <div className="mt-1 font-display text-[1.15rem] leading-tight tracking-tight">
                {v.title}
              </div>
            </div>
          </div>

          <p className="relative mt-8 max-w-3xl font-display text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.01em] text-balance">
            {v.hero}
          </p>

          <div className="relative mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {v.metrics.map((m, i) => (
              <Reveal key={m.label} delay={i * 0.08}>
                <div className="rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur">
                  <div
                    className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-none"
                    style={{ color: v.color }}
                  >
                    {m.value}
                  </div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-mist">
                    {m.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Mission / Vision */}
      <Section id={`purpose-${v.slug}`} eyebrow="Purpose">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-2xl border border-black/5 bg-white/80 p-8 backdrop-blur">
              <div
                aria-hidden
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ background: `linear-gradient(180deg, ${v.color}, transparent)` }}
              />
              <div className="text-[11px] uppercase tracking-[0.28em] text-mist">Mission</div>
              <p className="mt-4 font-display text-[1.35rem] leading-snug tracking-tight text-ink/90">
                {v.mission}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-black/5 bg-white/80 p-8 backdrop-blur">
              <div
                aria-hidden
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ background: `linear-gradient(180deg, ${v.color}, transparent)` }}
              />
              <div className="text-[11px] uppercase tracking-[0.28em] text-mist">Vision</div>
              <p className="mt-4 font-display text-[1.35rem] leading-snug tracking-tight text-ink/90">
                {v.vision}
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Goals + Drives */}
      <Section id={`goals-${v.slug}`} eyebrow="Goals & Drives">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/5 bg-white/80 p-8 backdrop-blur">
            <div className="text-[11px] uppercase tracking-[0.28em] text-mist">Strategic goals</div>
            <ol className="mt-6 space-y-4">
              {v.goals.map((g, i) => (
                <Reveal key={g} delay={i * 0.06}>
                  <li className="flex items-start gap-4">
                    <span
                      className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-medium"
                      style={{ background: v.color + "18", color: v.color }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14.5px] leading-relaxed text-ink/85">{g}</span>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white/80 p-8 backdrop-blur">
            <div className="text-[11px] uppercase tracking-[0.28em] text-mist">What drives it</div>
            <ul className="mt-6 space-y-3">
              {v.drives.map((d, i) => (
                <Reveal key={d} delay={i * 0.06}>
                  <li className="flex items-start gap-3">
                    <motion.span
                      aria-hidden
                      className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: v.color, boxShadow: `0 0 8px ${v.color}` }}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    />
                    <span className="text-[14px] leading-relaxed text-ink/85">{d}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id={`projects-${v.slug}`} eyebrow="Active Projects" index={`0${v.projects.length}`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {v.projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <Tilt>
                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/85 p-7 backdrop-blur">
                  <div
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-[3px]"
                    style={{ background: `linear-gradient(180deg, ${v.color}, transparent)` }}
                  />
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-mist">
                    <span>{p.location ?? "Global"}</span>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
                      style={{ background: v.color + "18", color: v.color }}
                    >
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{ background: v.color, boxShadow: `0 0 6px ${v.color}` }}
                      />
                      {p.status}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.2rem] leading-tight tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-mist">{p.detail}</p>

                  {/* Project-level CTA */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() =>
                        openApply({ kind: "project", vertical: v, project: p })
                      }
                      data-magnetic
                      aria-haspopup="dialog"
                      aria-controls="partner-apply-dialog"
                      className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-ink/80 transition hover:text-ink"
                    >
                      Partner on this project
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  </div>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Partners */}
      <Section id={`partners-${v.slug}`} eyebrow="Aligned institutions">
        <div className="flex flex-wrap gap-2">
          {v.partners.map((p) => (
            <span
              key={p}
              className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[12.5px] text-ink/80 backdrop-blur"
            >
              {p}
            </span>
          ))}
        </div>
      </Section>

      {/* CTAs — vertical-level */}
      <Section id={`join-${v.slug}`} eyebrow="Join the vertical">
        <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/85 p-10 backdrop-blur md:p-14">
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(80% 60% at 20% 0%, ${v.color}18 0%, transparent 60%)`,
            }}
          />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-xl">
              <div className="text-[11px] uppercase tracking-[0.28em] text-mist">Partner with us</div>
              <div className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] leading-tight tracking-tight">
                Move {v.short} forward — as an institution, funder, researcher or community.
              </div>
              <p className="mt-4 text-[14px] text-mist">
                Choose the depth of collaboration. Anchor the whole vertical, or plug into a single
                project already in motion.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openApply({ kind: "vertical", vertical: v })}
                data-magnetic
                aria-haspopup="dialog"
                aria-controls="partner-apply-dialog"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-6 py-3 text-[12.5px] font-medium text-white transition-all duration-300 hover:shadow-[0_22px_60px_-15px_rgba(244,176,0,0.6)]"
              >
                <span className="relative z-10">Partner at vertical level</span>
                <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold via-green to-earth transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
              </button>
              <a
                href={`#projects-${v.slug}`}
                data-magnetic
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-[12.5px] font-medium backdrop-blur transition hover:border-black/25"
              >
                Or pick a project ↑
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Journey Loop — motion language mirrors the chapter rail */}
      <Section id={`journey-${v.slug}`} eyebrow="Continue the loop">
        <JourneyLoop active={v} />
      </Section>

      <PartnerApplyDialog
        open={applyScope !== null}
        onOpenChange={(o) => (o ? null : closeApply())}
        scope={applyScope}
      />
    </div>
  );
}
