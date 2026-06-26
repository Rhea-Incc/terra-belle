"use client";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export const SECTIONS = [
  { id: "hero", label: "Origin" },
  { id: "mission", label: "Mission" },
  { id: "technology", label: "Technology" },
  { id: "energy", label: "Energy" },
  { id: "environment", label: "Environment" },
  { id: "ai", label: "Intelligence" },
  { id: "circular", label: "Circular" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" },
  { id: "finance", label: "Finance" },
  { id: "impact", label: "Impact" },
  { id: "global", label: "Global" },
  { id: "future", label: "Future" },
];

export function TopNav() {
  return (
    <header className="fixed left-1/2 top-6 z-50 -translate-x-1/2">
      <div className="flex items-center gap-6 rounded-full border border-black/5 bg-white/70 px-5 py-2.5 backdrop-blur-xl"
           style={{ boxShadow: "var(--shadow-soft)" }}>
        <a href="#hero" className="flex items-center gap-2">
          <Logo size={22} />
          <span className="text-[13px] font-medium tracking-tight">Terra Belle</span>
        </a>
        <span className="hidden h-4 w-px bg-black/10 sm:block" />
        <nav className="hidden items-center gap-5 text-[12.5px] text-mist sm:flex">
          <a href="#mission" className="transition hover:text-ink">Mission</a>
          <a href="#technology" className="transition hover:text-ink">Ecosystem</a>
          <a href="#research" className="transition hover:text-ink">Research</a>
          <a href="#impact" className="transition hover:text-ink">Impact</a>
        </nav>
        <a
          href="#future"
          className="rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white transition hover:opacity-90"
        >
          Join
        </a>
      </div>
    </header>
  );
}

export function SideTimeline() {
  const [active, setActive] = useState("hero");
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col gap-3">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li
              key={s.id}
              className="group relative flex items-center justify-end"
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
            >
              <span
                className={`pointer-events-none absolute right-7 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] transition-all duration-300 ${
                  hover === s.id || isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
                }`}
                style={{ color: isActive ? "var(--ink)" : "var(--mist)" }}
              >
                {s.label}
              </span>
              <a
                href={`#${s.id}`}
                className="block transition-all"
                aria-label={s.label}
              >
                <span
                  className="block rounded-full transition-all duration-500"
                  style={{
                    width: isActive ? 22 : 14,
                    height: 2,
                    background: isActive
                      ? "linear-gradient(90deg, var(--gold), var(--green), var(--earth-blue))"
                      : "rgba(17,17,17,0.18)",
                    boxShadow: isActive ? "0 0 12px rgba(244,176,0,0.4)" : "none",
                  }}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
