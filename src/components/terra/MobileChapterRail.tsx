"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { SECTIONS } from "./Nav";

/**
 * Mobile-first chapter rail.
 * - Floating bottom pill showing current chapter + progress dots.
 * - Tap to expand a sheet of all chapters (focus-trapped, ESC closes).
 * - Vertical swipe gesture on the pill jumps to previous/next chapter.
 * - Fully keyboard accessible (Arrow / Home / End / Enter / Space / Esc).
 * - Respects prefers-reduced-motion and the safe-area inset for notched devices.
 */
export function MobileChapterRail() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dragStartY = useRef<number | null>(null);

  // sync active chapter with viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // lock scroll + esc to close + focus the current item when opened
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    const idx = Math.max(0, SECTIONS.findIndex((s) => s.id === active));
    requestAnimationFrame(() => btnRefs.current[idx]?.focus());
    setFocusIdx(idx);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open, active]);

  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.id === active));
  const progress = (activeIdx / Math.max(1, SECTIONS.length - 1)) * 100;

  const jump = (id: string, closeSheet = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
    if (closeSheet) setOpen(false);
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

  // Swipe-on-pill: vertical drag jumps chapter without opening the sheet.
  const onPillPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    dragStartY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPillPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const start = dragStartY.current;
    dragStartY.current = null;
    if (start == null) return;
    const dy = e.clientY - start;
    const THRESHOLD = 36;
    if (Math.abs(dy) < THRESHOLD) return; // treat as tap → handled by onClick
    e.preventDefault();
    const next = dy < 0 ? activeIdx + 1 : activeIdx - 1; // swipe up → next
    const target = SECTIONS[Math.max(0, Math.min(SECTIONS.length - 1, next))];
    jump(target.id, false);
  };

  const current = SECTIONS[activeIdx];

  return (
    <>
      {/* Floating bottom pill — mobile + small tablet only */}
      <div
        className="fixed inset-x-0 z-40 flex justify-center px-4 md:hidden"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)" }}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          onPointerDown={onPillPointerDown}
          onPointerUp={onPillPointerUp}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="chapter-sheet"
          aria-label={`Chapter ${activeIdx + 1} of ${SECTIONS.length}: ${current.label}. Open chapter navigator. Swipe up or down to move between chapters.`}
          className="group relative flex w-full max-w-sm items-center gap-3 overflow-hidden rounded-full border border-black/5 bg-white/85 px-4 py-3 text-left backdrop-blur-xl shadow-[0_18px_48px_-18px_rgba(17,17,17,0.25)] outline-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ink/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white touch-pan-x"
          style={{ minHeight: 56 }}
        >
          <span
            aria-hidden
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums text-ink"
            style={{ background: "linear-gradient(135deg, rgba(244,176,0,0.18), rgba(13,187,99,0.18))" }}
          >
            {String(activeIdx + 1).padStart(2, "0")}
            <span
              className="absolute inset-[-3px] rounded-full border border-dashed motion-reduce:animate-none"
              style={{ borderColor: "rgba(244,176,0,0.55)", animation: "orbitRingMobile 9s linear infinite" }}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] uppercase tracking-[0.22em] text-ink/70">Chapter {activeIdx + 1} / {SECTIONS.length}</span>
            <span className="block truncate text-[14px] font-medium text-ink">{current.label}</span>
          </span>
          <span aria-hidden className="flex shrink-0 items-center gap-1">
            {SECTIONS.map((s, i) => (
              <span
                key={s.id}
                className="block rounded-full transition-all duration-500"
                style={{
                  width: i === activeIdx ? 14 : 5,
                  height: 5,
                  background: i <= activeIdx ? "linear-gradient(90deg, var(--gold), var(--green))" : "rgba(17,17,17,0.18)",
                }}
              />
            ))}
          </span>
          <span
            aria-hidden
            className="absolute inset-x-3 bottom-1 h-px origin-left rounded-full transition-transform duration-700"
            style={{
              background: "linear-gradient(90deg, var(--gold), var(--green), var(--earth-blue), var(--sky-blue))",
              transform: `scaleX(${progress / 100})`,
            }}
          />
        </button>
      </div>

      {/* Expanded sheet */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!open}
        {...(!open ? { inert: "" as unknown as boolean } : {})}
      >
        {/* backdrop */}
        <div
          className={`absolute inset-0 bg-ink/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          ref={sheetRef}
          id="chapter-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Chapter navigator"
          className={`absolute inset-x-0 bottom-0 rounded-t-[28px] border-t border-black/5 bg-white shadow-[0_-30px_60px_-20px_rgba(17,17,17,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-y-0" : "translate-y-full"}`}
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)" }}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/10" aria-hidden />
          <div className="flex items-center justify-between px-6 pt-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-ink/70">Chapter Navigator</div>
              <div className="mt-1 font-display text-2xl leading-none">Jump to a chapter</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chapter navigator"
              className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/70"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <ol
            className="m-0 mt-4 max-h-[58vh] list-none overflow-y-auto px-3 pb-3"
            aria-label="Chapters"
          >
            {SECTIONS.map((s, i) => {
              const isActive = active === s.id;
              const isPast = i < activeIdx;
              const isFocused = focusIdx === i;
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
                    tabIndex={tabIndex}
                    aria-current={isActive ? "step" : undefined}
                    aria-controls={s.id}
                    aria-label={`Chapter ${i + 1} of ${SECTIONS.length}: ${s.label}${isActive ? ", current chapter" : isPast ? ", completed" : ""}`}
                    className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left outline-none transition-colors duration-200 hover:bg-ink/[0.03] focus-visible:bg-ink/[0.04] focus-visible:ring-2 focus-visible:ring-ink/70"
                    style={{ minHeight: 56 }}
                  >
                    <span
                      aria-hidden
                      className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-[11px] font-semibold tabular-nums"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, var(--gold), var(--green))"
                          : isPast
                            ? "rgba(13,187,99,0.12)"
                            : "rgba(17,17,17,0.04)",
                        color: isActive ? "#fff" : "var(--ink)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium text-ink">{s.label}</span>
                      <span className="block text-[11px] uppercase tracking-[0.22em] text-ink/70">
                        {isActive ? "Currently viewing" : isPast ? "Completed" : "Up next"}
                      </span>
                    </span>
                    {isActive && (
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-full"
                        style={{ background: "var(--ink)", boxShadow: "0 0 10px var(--gold)" }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Chapter ${activeIdx + 1} of ${SECTIONS.length}: ${current.label}`}
      </div>

      <style>{`
        @keyframes orbitRingMobile {
          0%   { transform: rotate(0deg); opacity: 0.7; }
          50%  { opacity: 1; }
          100% { transform: rotate(360deg); opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes orbitRingMobile { from, to { transform: none; opacity: 0.8; } }
        }
      `}</style>
    </>
  );
}
