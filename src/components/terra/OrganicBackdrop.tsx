"use client";
import type { ReactNode, CSSProperties } from "react";

/**
 * Organic backdrop — flowing abstract curves, soft blobs and drifting motes
 * that fade into the surrounding section on every edge so the panel dissolves
 * into the page (whether the page is white or dark) instead of sitting on top
 * of it as a hard rectangle.
 *
 * Two surfaces:
 *  - "light" (default): fully transparent base, tinted brand curves at low
 *    opacity. Blends into the site's white background.
 *  - "dark":  deep radial wash for hero bands / cinematic panels, still
 *    feathered to transparent at the edges.
 *
 * Colors come from CSS custom properties (--gold, --green, --earth-blue,
 * --sky-blue) so any theme change propagates automatically. Variants map to
 * each page's brand accents. Override the palette per-instance with `tokens`.
 */

type Tokens = {
  bgA: string;
  bgB: string;
  blob1: string;
  blob2: string;
  mote: string;
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

type Surface = "light" | "dark";

const PRESETS: Record<Variant, Tokens> = {
  green:     { bgA: "#04160e", bgB: "#010805", blob1: "var(--green)",      blob2: "#065f38",           mote: "var(--gold)",     wave: "var(--sky-blue)" },
  deep:      { bgA: "#061225", bgB: "#020814", blob1: "var(--earth-blue)", blob2: "var(--green)",      mote: "var(--sky-blue)", wave: "var(--sky-blue)" },
  gold:      { bgA: "#1a1608", bgB: "#0a0805", blob1: "var(--gold)",       blob2: "#7a5a00",           mote: "var(--gold)",     wave: "var(--gold)"     },
  ink:       { bgA: "#0a0a0a", bgB: "#000000", blob1: "var(--ink)",        blob2: "#2a2a2a",           mote: "var(--gold)",     wave: "var(--mist)"     },
  planet:    { bgA: "#04160e", bgB: "#020a06", blob1: "var(--green)",      blob2: "var(--earth-blue)", mote: "var(--gold)",     wave: "var(--sky-blue)" },
  ecosystem: { bgA: "#050f22", bgB: "#020714", blob1: "var(--earth-blue)", blob2: "var(--green)",      mote: "var(--sky-blue)", wave: "var(--gold)"     },
  circular:  { bgA: "#160f04", bgB: "#0a0602", blob1: "var(--gold)",       blob2: "var(--green)",      mote: "var(--sky-blue)", wave: "var(--green)"    },
  impact:    { bgA: "#161004", bgB: "#0a0702", blob1: "var(--gold)",       blob2: "var(--earth-blue)", mote: "var(--gold)",     wave: "var(--sky-blue)" },
  verticals: { bgA: "#04160e", bgB: "#020a06", blob1: "var(--green)",      blob2: "var(--gold)",       mote: "var(--gold)",     wave: "var(--earth-blue)" },
};

// Radial mask so blobs feather to transparent on every edge — this is the
// blend into the surrounding section (white or dark). Kept generous so no
// hard elliptical boundary is ever visible against the page.
const FEATHER_MASK =
  "radial-gradient(ellipse 95% 95% at 50% 50%, #000 25%, rgba(0,0,0,0.6) 55%, transparent 100%)";

export function OrganicBackdrop({
  children,
  className = "",
  padded = true,
  variant = "green",
  surface = "light",
  tokens,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  variant?: Variant;
  surface?: Surface;
  tokens?: Partial<Tokens>;
}) {
  const p: Tokens = { ...PRESETS[variant], ...tokens };
  const isLight = surface === "light";
  const uid = `${variant}-${surface}`;

  // On light surfaces the container is fully transparent so nothing hard-edges
  // against the page background. On dark surfaces we still feather the wash.
  const bgStyle: CSSProperties = isLight
    ? { background: "transparent" }
    : {
        background: `radial-gradient(120% 120% at 20% 10%, ${p.bgA} 0%, ${p.bgB} 65%, transparent 100%)`,
        WebkitMaskImage: FEATHER_MASK,
        maskImage: FEATHER_MASK,
      };

  // Opacity multipliers: light needs subtle tints, dark can push harder.
  const blobOpA = isLight ? 0.22 : 0.55;
  const blobOpB = isLight ? 0.18 : 0.5;
  const blobOpMid = isLight ? 0.05 : 0.15;
  const moteOp = isLight ? 0.55 : 0.85;
  const curveOp = isLight ? 0.28 : 0.5;
  const waveOp = isLight ? 0.22 : 0.35;

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[2rem] ${padded ? "px-6 py-20 md:px-14 md:py-28" : ""} ${className}`}
      style={bgStyle}
    >
      {/* Organic curves, blobs, motes, wave — all feathered to transparent */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ WebkitMaskImage: FEATHER_MASK, maskImage: FEATHER_MASK }}
      >
        <defs>
          <radialGradient id={`ob-blob-a-${uid}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={p.blob1} stopOpacity={blobOpA} />
            <stop offset="60%" stopColor={p.blob2} stopOpacity={blobOpMid} />
            <stop offset="100%" stopColor={p.blob2} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`ob-blob-b-${uid}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={p.blob2} stopOpacity={blobOpB} />
            <stop offset="70%" stopColor={p.blob1} stopOpacity={blobOpMid * 0.8} />
            <stop offset="100%" stopColor={p.blob1} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`ob-curve-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={p.blob1} stopOpacity="0" />
            <stop offset="50%" stopColor={p.blob1} stopOpacity={curveOp} />
            <stop offset="100%" stopColor={p.blob2} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`ob-curve2-${uid}`} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.wave} stopOpacity="0" />
            <stop offset="50%" stopColor={p.wave} stopOpacity={curveOp * 0.9} />
            <stop offset="100%" stopColor={p.blob1} stopOpacity="0" />
          </linearGradient>
          <filter id={`ob-soft-${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={isLight ? 22 : 30} />
          </filter>
        </defs>

        {/* Soft organic blobs */}
        <g filter={`url(#ob-soft-${uid})`}>
          <ellipse cx="180" cy="180" rx="280" ry="240" fill={`url(#ob-blob-a-${uid})`}>
            <animate attributeName="cx" values="180;260;180" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="180;120;180" dur="22s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="980" cy="220" rx="340" ry="280" fill={`url(#ob-blob-b-${uid})`}>
            <animate attributeName="cx" values="980;900;980" dur="24s" repeatCount="indefinite" />
            <animate attributeName="cy" values="220;300;220" dur="19s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="700" cy="620" rx="400" ry="300" fill={`url(#ob-blob-a-${uid})`}>
            <animate attributeName="cx" values="700;620;700" dur="26s" repeatCount="indefinite" />
            <animate attributeName="cy" values="620;680;620" dur="21s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="220" cy="640" rx="280" ry="220" fill={`url(#ob-blob-b-${uid})`}>
            <animate attributeName="cx" values="220;300;220" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cy" values="640;580;640" dur="23s" repeatCount="indefinite" />
          </ellipse>
        </g>

        {/* Flowing organic curves — the abstractions requested */}
        <g fill="none" strokeLinecap="round">
          <path
            d="M -40 240 C 220 120, 460 360, 720 260 S 1180 200, 1260 340"
            stroke={`url(#ob-curve-${uid})`}
            strokeWidth={isLight ? 1.4 : 1.8}
            opacity={curveOp + 0.1}
          >
            <animate
              attributeName="d"
              dur="24s"
              repeatCount="indefinite"
              values="
                M -40 240 C 220 120, 460 360, 720 260 S 1180 200, 1260 340;
                M -40 260 C 220 160, 460 300, 720 300 S 1180 240, 1260 300;
                M -40 240 C 220 120, 460 360, 720 260 S 1180 200, 1260 340
              "
            />
          </path>
          <path
            d="M -40 520 C 260 620, 500 420, 760 520 S 1180 620, 1260 500"
            stroke={`url(#ob-curve2-${uid})`}
            strokeWidth={isLight ? 1.2 : 1.6}
            opacity={curveOp}
          >
            <animate
              attributeName="d"
              dur="28s"
              repeatCount="indefinite"
              values="
                M -40 520 C 260 620, 500 420, 760 520 S 1180 620, 1260 500;
                M -40 540 C 260 560, 500 480, 760 540 S 1180 580, 1260 520;
                M -40 520 C 260 620, 500 420, 760 520 S 1180 620, 1260 500
              "
            />
          </path>
          <path
            d="M 100 100 C 300 260, 500 60, 780 220 S 1120 420, 1180 620"
            stroke={`url(#ob-curve-${uid})`}
            strokeWidth={isLight ? 1 : 1.4}
            opacity={curveOp * 0.75}
          >
            <animate
              attributeName="d"
              dur="32s"
              repeatCount="indefinite"
              values="
                M 100 100 C 300 260, 500 60, 780 220 S 1120 420, 1180 620;
                M 100 140 C 300 200, 500 120, 780 260 S 1120 380, 1180 600;
                M 100 100 C 300 260, 500 60, 780 220 S 1120 420, 1180 620
              "
            />
          </path>
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
            <circle key={i} cx={m.x} cy={m.y} r={m.r} fill={p.mote} opacity={moteOp}>
              <animate attributeName="opacity" values={`0.15;${moteOp};0.15`} dur={`${m.d}s`} repeatCount="indefinite" />
              <animate attributeName="r" values={`${m.r * 0.6};${m.r};${m.r * 0.6}`} dur={`${m.d}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        {/* Low wave line */}
        <g opacity={waveOp}>
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

      {/* Grain — dark surfaces only, kept subtle */}
      {!isLight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
