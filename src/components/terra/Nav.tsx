"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

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
  const [active, setActive] = useState("genesis");
  const [hover, setHover] = useState<string | null>(null);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
  const progress = (activeIdx / Math.max(1, SECTIONS.length - 1)) * 100;

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move focus into the destination section for screen-reader users.
    const prevTab = el.getAttribute("tabindex");
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    if (prevTab === null) {
      // leave -1 so the section stays programmatically focusable; harmless.
    }
  };

  const focusAt = (idx: number) => {
    const clamped = (idx + SECTIONS.length) % SECTIONS.length;
    btnRefs.current[clamped]?.focus();
    setFocusIdx(clamped);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        focusAt(idx + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        focusAt(idx - 1);
        break;
      case "Home":
        e.preventDefault();
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        focusAt(SECTIONS.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        jump(SECTIONS[idx].id);
        break;
    }
  };

  return (
    <nav
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:block"
      aria-label="Chapter progress"
    >
      <ol
        className="relative flex flex-col items-end gap-9 py-6 pr-3 list-none m-0"
        aria-label={`Chapter ${activeIdx + 1} of ${SECTIONS.length}: ${SECTIONS[activeIdx].label}`}
      >
        {/* gear spine */}
        <span
          aria-hidden
          className="absolute right-[10px] top-3 bottom-3 w-[2px] rounded-full"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(17,17,17,0.12) 15%, rgba(17,17,17,0.12) 85%, transparent)" }}
        />
        {/* progress fill */}
        <span
          aria-hidden
          className="absolute right-[10px] top-3 w-[2px] rounded-full transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            height: `calc(${progress}% * 0.94 + 0px)`,
            background: "linear-gradient(to bottom, #F4B000, #0DBB63, #0E46B8, #6B8CF7)",
            boxShadow: "0 0 12px rgba(244,176,0,0.35)",
          }}
        />

        {SECTIONS.map((s, i) => {
          const isActive = active === s.id;
          const isPast = i < activeIdx;
          const isHover = hover === s.id;
          const isFocused = focusIdx === i;
          // Roving tabindex: only the active (or currently focused) button is in the tab order.
          const tabIndex = (focusIdx === null ? isActive : isFocused) ? 0 : -1;
          return (
            <li key={s.id} className="m-0 p-0">
              <button
                ref={(el) => {
                  btnRefs.current[i] = el;
                }}
                type="button"
                onClick={() => {
                  setFocusIdx(i);
                  jump(s.id);
                }}
                onKeyDown={(e) => onKeyDown(e, i)}
                onMouseEnter={() => setHover(s.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => {
                  setHover(s.id);
                  setFocusIdx(i);
                }}
                onBlur={() => setHover(null)}
                tabIndex={tabIndex}
                className="group relative flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label={`Chapter ${i + 1} of ${SECTIONS.length}: ${s.label}${isActive ? ", current chapter" : isPast ? ", completed" : ""}`}
                aria-current={isActive ? "step" : undefined}
                aria-controls={s.id}
              >
                {/* floating label / preview */}
                <span
                  aria-hidden
                  className={`pointer-events-none whitespace-nowrap rounded-full border border-black/5 bg-white/85 px-3 py-1 text-[10px] uppercase tracking-[0.22em] backdrop-blur transition-all duration-300 ${
                    isActive || isHover || isFocused ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                  }`}
                  style={{ color: isActive ? "var(--ink)" : "var(--mist)", boxShadow: isActive ? "0 10px 24px -12px rgba(17,17,17,0.2)" : undefined }}
                >
                  <span className="mr-2 font-semibold tabular-nums" style={{ color: "var(--ink)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </span>

                {/* indent / gear tooth */}
                <span
                  aria-hidden
                  className="relative flex items-center justify-center rounded-full bg-white transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    width: isActive ? 22 : 14,
                    height: isActive ? 22 : 14,
                    border: "1px solid rgba(17,17,17,0.18)",
                    borderColor: isActive ? "var(--ink)" : isPast ? "rgba(13,187,99,0.55)" : "rgba(17,17,17,0.18)",
                    boxShadow: isActive
                      ? "0 0 0 4px rgba(255,255,255,0.95), 0 8px 24px -10px rgba(17,17,17,0.25)"
                      : "0 0 0 3px rgba(255,255,255,0.95)",
                    transform: isHover && !isActive ? "translateX(-3px) scale(1.1)" : isActive ? "translateX(-4px)" : "translateX(0)",
                  }}
                >
                  {isActive ? (
                    <>
                      <span
                        className="absolute inset-[-6px] rounded-full border motion-reduce:animate-none"
                        style={{ borderColor: "rgba(244,176,0,0.55)", borderStyle: "dashed", animation: "orbitRing 8s linear infinite" }}
                      />
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--ink)", boxShadow: "0 0 8px var(--gold)" }}
                      />
                    </>
                  ) : isPast ? (
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "linear-gradient(135deg, var(--gold), var(--green))" }}
                    />
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Chapter ${activeIdx + 1} of ${SECTIONS.length}: ${SECTIONS[activeIdx].label}`}
      </div>
      <style>{`
        @keyframes orbitRing {
          0%   { transform: rotate(0deg); opacity: 0.7; }
          50%  { opacity: 1; }
          100% { transform: rotate(360deg); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes orbitRing { from, to { transform: none; opacity: 0.8; } }
        }
      `}</style>
    </nav>
  );
}

