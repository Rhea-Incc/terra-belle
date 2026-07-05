import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageShell } from "@/components/terra/PageShell";
import { Section, Reveal } from "@/components/terra/Section";
import { Tilt } from "@/components/terra/Interactive";
import { EnergyDivider } from "@/components/terra/Divider";
import { getVertical, VERTICALS } from "@/lib/verticals-data";

export const Route = createFileRoute("/verticals/$slug")({
  loader: ({ params }) => {
    const v = getVertical(params.slug);
    if (!v) throw notFound();
    return { slug: v.slug };
  },
  head: ({ params }) => {
    const v = getVertical(params.slug);
    if (!v) {
      return { meta: [{ title: "Vertical not found — Terra Belle" }, { name: "robots", content: "noindex" }] };
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
  component: VerticalDetailPage,
});

function VerticalNotFound() {
  return (
    <PageShell eyebrow="Not Found" title="This vertical hasn't taken root yet.">
      <Section id="not-found">
        <Link to="/verticals" className="text-ink underline">
          ← Back to all verticals
        </Link>
      </Section>
    </PageShell>
  );
}

function VerticalDetailPage() {
  const { slug } = Route.useLoaderData();
  const v = getVertical(slug)!;
  const Icon = v.Icon;
  const siblings = VERTICALS.filter((x) => x.slug !== v.slug);

  return (
    <PageShell eyebrow={v.eyebrow} title={v.title} intro={v.summary}>
      {/* Hero band */}
      <Section id="hero">
        <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-white/80 p-10 backdrop-blur md:p-16">
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full opacity-40 blur-3xl"
            style={{ background: v.color }}
          />
          <div
            aria-hidden
            className="absolute -left-16 bottom--16 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{ background: v.color }}
          />
          <div className="relative flex items-center gap-4">
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl"
              style={{ background: v.color + "22" }}
            >
              <Icon size={28} color={v.color} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-mist">
              {v.category} · Vertical
            </span>
          </div>

          <p className="relative mt-8 max-w-3xl font-display text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.1] tracking-[-0.01em] text-balance">
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
        </div>
      </Section>

      {/* Phases — the living cycle */}
      <Section id="phases" eyebrow="The Cycle" index={`0${v.phases.length}`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {v.phases.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <Tilt>
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/85 p-7 backdrop-blur">
                  <div
                    aria-hidden
                    className="absolute left-0 top-0 h-full w-[3px]"
                    style={{
                      background: `linear-gradient(180deg, ${v.color}, transparent)`,
                    }}
                  />
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-mist">
                    <span>Phase {String(i + 1).padStart(2, "0")}</span>
                    <motion.span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: v.color }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                    />
                  </div>
                  <h3 className="mt-4 font-display text-[1.35rem] leading-tight tracking-tight">
                    {p.name}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-mist">{p.detail}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Bridges + Partners */}
      <Section id="bridges" eyebrow="Interconnections">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-mist">
              Bridges to other verticals
            </div>
            <ul className="mt-6 space-y-3">
              {v.bridges.map((b) => (
                <li key={b.slug}>
                  <Link
                    to="/verticals/$slug"
                    params={{ slug: b.slug }}
                    className="group flex items-start gap-3 rounded-xl border border-black/5 bg-white/70 p-5 backdrop-blur transition-all duration-300 hover:border-black/20 hover:shadow-[0_18px_50px_-25px_rgba(17,17,17,0.3)]"
                  >
                    <span
                      className="mt-1.5 inline-block h-1.5 w-6 rounded-full transition-all duration-500 group-hover:w-10"
                      style={{ background: v.color, boxShadow: `0 0 10px ${v.color}` }}
                    />
                    <span className="flex-1 text-[14px] text-ink/85">{b.label}</span>
                    <span className="text-mist transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-mist">Working with</div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {v.partners.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[12.5px] text-ink/80 backdrop-blur"
                >
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 rounded-2xl border border-black/5 bg-white/70 p-6 backdrop-blur">
              <div className="text-[11px] uppercase tracking-[0.28em] text-mist">On the ground</div>
              <ul className="mt-4 space-y-2 text-[13.5px] text-ink/85">
                {v.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span
                      className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: v.color, boxShadow: `0 0 8px ${v.color}` }}
                    />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <EnergyDivider />

      {/* Sibling verticals */}
      <Section id="siblings" eyebrow="Continue the loop">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {siblings.slice(0, 3).map((s) => {
            const SIcon = s.Icon;
            return (
              <Link
                key={s.slug}
                to="/verticals/$slug"
                params={{ slug: s.slug }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white/80 p-6 backdrop-blur transition-shadow hover:shadow-[0_24px_60px_-30px_rgba(17,17,17,0.3)]"
              >
                <div
                  aria-hidden
                  className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-60"
                  style={{ background: s.color }}
                />
                <div className="relative flex items-center gap-3">
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{ background: s.color + "18" }}
                  >
                    <SIcon size={18} color={s.color} />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-mist">
                    {s.category}
                  </span>
                </div>
                <div className="relative mt-4 font-display text-[1.15rem] leading-tight">
                  {s.short}
                </div>
                <div className="relative mt-4 text-[10px] uppercase tracking-[0.24em] text-ink/60 transition-transform group-hover:translate-x-1">
                  Enter →
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10">
          <Link
            to="/verticals"
            className="inline-flex items-center gap-2 text-[12.5px] font-medium text-ink/70 hover:text-ink"
          >
            ← All verticals
          </Link>
        </div>
      </Section>
    </PageShell>
  );
}
