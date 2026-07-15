"use client";
import type { ReactNode, CSSProperties } from "react";

/**
 * Dark, organic backdrop — deep blobs, drifting light motes and a soft
 * wave line. Colors inherit from the page's own brand tokens so the backdrop
 * always feels like an extension of the surrounding UI (buttons, text,
 * accents) rather than a generic dark panel.
 *
 * Variants map to the semantic surfaces used across the site. Each variant
 * pulls its colors from CSS custom properties defined in styles.css
 * (--gold, --green, --earth-blue, --sky-blue, --ink, --mist) so a theme
 * change anywhere in the design system propagates here automatically.
 *
 * You can also fully override the palette via the `tokens` prop when a
 * section needs a bespoke tint (e.g. per-vertical hero band).
 */

type Tokens = {
  /** primary background wash (near-black) */
  bgA: string;
  /** deeper background falloff */
  bgB: string;
  /** dominant blob color (usually the page's brand accent) */
  blob1: string;
  /** secondary blob color */
  blob2: string;
  /** drifting light mote color */
  mote: string;
  /** low wave line color */
  wave: string;
};

type Variant =
  | "green"
  | "deep"
  | "gold"
  | "ink"
  | "planet"
  | "ecosystem"
  | "circular"
  | "impact"
  | "verticals";

const PRESETS: Record<Variant, Tokens> = {
  // legacy variants (kept for existing callers)
  green:   { bgA: "#04160e", bgB: "#010805", blob1: "var(--green)",      blob2: "#065f38",         mote: "var(--gold)",  wave: "var(--sky-blue)" },
  deep:    { bgA: "#061225", bgB: "#020814", blob1: "var(--earth-blue)", blob2: "var(--green)",    mote: "var(--sky-blue)", wave: "var(--sky-blue)" },
  gold:    { bgA: "#1a1608", bgB: "#0a0805", blob1: "var(--gold)",       blob2: "#7a5a00",         mote: "var(--gold)",  wave: "var(--gold)" },
  ink:     { bgA: "#0a0a0a", bgB: "#000000", blob1: "var(--ink)",        blob2: "#2a2a2a",         mote: "var(--gold)",  wave: "var(--mist)" },

  // page-branded variants — each mirrors that page's accents & buttons
  planet:      { bgA: "#04160e", bgB: "#020a06", blob1: "var(--green)",      blob2: "var(--earth-blue)", mote: "var(--gold)",     wave: "var(--sky-blue)" },
  ecosystem:   { bgA: "#050f22", bgB: "#020714", blob1: "var(--earth-blue)", blob2: "var(--green)",      mote: "var(--sky-blue)", wave: "var(--gold)"     },
  circular:    { bgA: "#160f04", bgB: "#0a0602", blob1: "var(--gold)",       blob2: "var(--green)",      mote: "var(--sky-blue)", wave: "var(--green)"    },
  impact:      { bgA: "#161004", bgB: "#0a0702", blob1: "var(--gold)",       blob2: "var(--earth-blue)", mote: "var(--gold)",     wave: "var(--sky-blue)" },
  verticals:   { bgA: "#04160e", bgB: "#020a06", blob1: "var(--green)",      blob2: "var(--gold)",       mote: "var(--gold)",     wave: "var(--earth-blue)" },
};

export function OrganicBackdrop({
  children,
  className = "",
  padded = true,
  variant = "green",
  tokens,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  variant?: Variant;
  tokens?: Partial<Tokens>;
}) {
  const p: Tokens = { ...PRESETS[variant], ...tokens };

  const bgStyle: CSSProperties = {
    background: `radial-gradient(120% 120% at 20% 10%, ${p.bgA} 0%, ${p.bgB} 65%, #000 100%)`,
  };

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[2rem] ${padded ? "px-6 py-20 md:px-14 md:py-28" : ""} ${className}`}
      style={bgStyle}
    >
      {/* Organic blobs */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`ob-blob-a-${variant}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={p.blob1} stopOpacity="0.55" />
            <stop offset="60%" stopColor={p.blob2} stopOpacity="0.18" />
            <stop offset="100%" stopColor={p.blob2} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`ob-blob-b-${variant}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={p.blob2} stopOpacity="0.5" />
            <stop offset="70%" stopColor={p.blob1} stopOpacity="0.12" />
            <stop offset="100%" stopColor={p.blob1} stopOpacity="0" />
          </radialGradient>
          <filter id={`ob-soft-${variant}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        <g filter={`url(#ob-soft-${variant})`}>
          <ellipse cx="180" cy="180" rx="260" ry="220" fill={`url(#ob-blob-a-${variant})`}>
            <animate attributeName="cx" values="180;260;180" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="180;120;180" dur="22s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="980" cy="220" rx="320" ry="260" fill={`url(#ob-blob-b-${variant})`}>
            <animate attributeName="cx" values="980;900;980" dur="24s" repeatCount="indefinite" />
            <animate attributeName="cy" values="220;300;220" dur="19s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="700" cy="620" rx="380" ry="280" fill={`url(#ob-blob-a-${variant})`}>
            <animate attributeName="cx" values="700;620;700" dur="26s" repeatCount="indefinite" />
            <animate attributeName="cy" values="620;680;620" dur="21s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="220" cy="640" rx="260" ry="200" fill={`url(#ob-blob-b-${variant})`}>
            <animate attributeName="cx" values="220;300;220" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cy" values="640;580;640" dur="23s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Light motes */}
        <g>
          {[
            { x: 320, y: 220, r: 6, d: 5 },
            { x: 780, y: 180, r: 4, d: 7 },
            { x: 540, y: 380, r: 3, d: 6 },
            { x: 900, y: 500, r: 5, d: 8 },
            { x: 260, y: 480, r: 3, d: 9 },
            { x: 660, y: 620, r: 4, d: 6.5 },
            { x: 1040, y: 340, r: 3, d: 7.5 },
          ].map((m, i) => (
            <circle
              key={i}
              cx={m.x}
              cy={m.y}
              r={m.r}
              fill={p.mote}
              opacity="0.85"
            >
              <animate attributeName="opacity" values="0.2;0.9;0.2" dur={`${m.d}s`} repeatCount="indefinite" />
              <animate attributeName="r" values={`${m.r * 0.6};${m.r};${m.r * 0.6}`} dur={`${m.d}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* Soft wave line */}
        <g opacity="0.35">
          <path
            d="M 60 700 Q 300 660 540 700 T 1140 700"
            fill="none"
            stroke={p.wave}
            strokeWidth="1.2"
          >
            <animate
              attributeName="d"
              dur="14s"
              repeatCount="indefinite"
              values="
                M 60 700 Q 300 660 540 700 T 1140 700;
                M 60 700 Q 300 720 540 690 T 1140 700;
                M 60 700 Q 300 660 540 700 T 1140 700
              "
            />
          </path>
        </g>
      </svg>

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
