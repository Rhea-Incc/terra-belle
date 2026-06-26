"use client";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export const SECTIONS = [
  { id: "genesis", label: "Genesis" },
  { id: "planet", label: "Planet" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "circular", label: "Circular Economy" },
  { id: "impact", label: "Impact Engine" },
  { id: "collaboration", label: "Collaboration" },
  { id: "future", label: "Future" },
];

export function TopNav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > last && y > 120) setHidden(true);
      else setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden ? "-translate-y-32 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div
        className="flex items-center gap-6 rounded-full border border-black/5 px-5 py-2.5 backdrop-blur-xl transition-all duration-500"
        style={{
          background: scrolled ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.55)",
          boxShadow: scrolled ? "0 18px 40px -20px rgba(17,17,17,0.18)" : "var(--shadow-soft)",
        }}
      >
        <a href="#genesis" data-magnetic className="group flex items-center gap-2">
          <span className="relative">
            <Logo size={22} />
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ boxShadow: "0 0 18px rgba(244,176,0,0.6)" }} />
          </span>
          <span className="text-[13px] font-medium tracking-tight">Terra Belle</span>
        </a>
        <span className="hidden h-4 w-px bg-black/10 sm:block" />
        <nav className="hidden items-center gap-5 text-[12.5px] text-mist sm:flex">
          {[
            { id: "planet", label: "Planet" },
            { id: "ecosystem", label: "Ecosystem" },
            { id: "circular", label: "Circular" },
            { id: "impact", label: "Impact" },
          ].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-magnetic
              className="group relative transition hover:text-ink"
            >
              {s.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-gold via-green to-earth transition-transform duration-500 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <a
          href="#collaboration"
          data-magnetic
          className="group relative overflow-hidden rounded-full bg-ink px-3.5 py-1.5 text-[12px] font-medium text-white transition-all duration-300 hover:scale-[1.04]"
        >
          <span className="relative z-10">Join</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-gold via-green to-earth transition-transform duration-500 group-hover:translate-x-0" />
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

  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.id === active));

  return (
    <nav className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block" aria-label="Section progress">
      {/* spine */}
      <span
        className="absolute right-[5px] top-0 h-full w-px"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(17,17,17,0.12), transparent)" }}
      />
      <ul className="relative flex flex-col gap-5">
        {SECTIONS.map((s, i) => {
          const isActive = active === s.id;
          const isPast = i < activeIdx;
          return (
            <li
              key={s.id}
              className="group relative flex items-center justify-end"
              onMouseEnter={() => setHover(s.id)}
              onMouseLeave={() => setHover(null)}
            >
              <span
                className={`pointer-events-none absolute right-8 whitespace-nowrap text-[11px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  hover === s.id || isActive ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
                }`}
                style={{ color: isActive ? "var(--ink)" : "var(--mist)" }}
              >
                {s.label}
              </span>
              <a href={`#${s.id}`} data-magnetic className="relative block h-3 w-3" aria-label={s.label}>
                {/* core node */}
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500"
                  style={{
                    width: isActive ? 8 : 6,
                    height: isActive ? 8 : 6,
                    background: isActive
                      ? "var(--ink)"
                      : isPast
                      ? "linear-gradient(135deg, var(--gold), var(--green))"
                      : "transparent",
                    border: isActive || isPast ? "none" : "1px solid rgba(17,17,17,0.25)",
                  }}
                />
                {/* orbiting energy ring on active */}
                {isActive && (
                  <>
                    <span
                      className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                      style={{ borderColor: "rgba(244,176,0,0.5)", animation: "orbitRing 4s linear infinite" }}
                    />
                    <span
                      className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        background: "var(--gold)",
                        boxShadow: "0 0 8px var(--gold)",
                        transformOrigin: "0 0",
                        animation: "orbitDot 4s linear infinite",
                      }}
                    />
                  </>
                )}
              </a>
            </li>
          );
        })}
      </ul>
      <style>{`
        @keyframes orbitRing {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity: 0.6; }
          50%  { transform: translate(-50%,-50%) rotate(180deg) scale(1.15); opacity: 1; }
          100% { transform: translate(-50%,-50%) rotate(360deg) scale(1); opacity: 0.6; }
        }
        @keyframes orbitDot {
          from { transform: translate(-50%,-50%) rotate(0deg) translateX(12px); }
          to   { transform: translate(-50%,-50%) rotate(360deg) translateX(12px); }
        }
      `}</style>
    </nav>
  );
}
