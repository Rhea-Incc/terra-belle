"use client";
import type { ReactNode } from "react";

/**
 * Dark, organic backdrop — deep green blobs, drifting light motes and a soft
 * wave line. Wrap any section that should feel like it's being viewed through
 * living tissue (Ecosystem orbit, Circular flow, stewardship stats, hero bands).
 *
 * Contents render on top with automatic light-on-dark text via `text-white/…`.
 */
export function OrganicBackdrop({
  children,
  className = "",
  padded = true,
  variant = "green",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  variant?: "green" | "deep" | "gold";
}) {
  const palette =
    variant === "gold"
      ? { a: "#1a1608", b: "#0a0805", blob1: "#F4B000", blob2: "#7a5a00", mote: "#F4B000", wave: "#F4B000" }
      : variant === "deep"
        ? { a: "#061225", b: "#020814", blob1: "#0E46B8", blob2: "#0DBB63", mote: "#6B8CF7", wave: "#6B8CF7" }
        : { a: "#04160e", b: "#010805", blob1: "#0DBB63", blob2: "#065f38", mote: "#5cffb0", wave: "#6B8CF7" };

  return (
    <div
      className={`relative isolate overflow-hidden rounded-[2rem] ${padded ? "px-6 py-20 md:px-14 md:py-28" : ""} ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 20% 10%, ${palette.a} 0%, ${palette.b} 65%, #000 100%)`,
      }}
    >
      {/* Organic blobs */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="ob-blob-a" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={palette.blob1} stopOpacity="0.55" />
            <stop offset="60%" stopColor={palette.blob2} stopOpacity="0.18" />
            <stop offset="100%" stopColor={palette.blob2} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ob-blob-b" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={palette.blob2} stopOpacity="0.5" />
            <stop offset="70%" stopColor={palette.blob1} stopOpacity="0.12" />
            <stop offset="100%" stopColor={palette.blob1} stopOpacity="0" />
          </radialGradient>
          <filter id="ob-soft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        <g filter="url(#ob-soft)">
          <ellipse cx="180" cy="180" rx="260" ry="220" fill="url(#ob-blob-a)">
            <animate attributeName="cx" values="180;260;180" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="180;120;180" dur="22s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="980" cy="220" rx="320" ry="260" fill="url(#ob-blob-b)">
            <animate attributeName="cx" values="980;900;980" dur="24s" repeatCount="indefinite" />
            <animate attributeName="cy" values="220;300;220" dur="19s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="700" cy="620" rx="380" ry="280" fill="url(#ob-blob-a)">
            <animate attributeName="cx" values="700;620;700" dur="26s" repeatCount="indefinite" />
            <animate attributeName="cy" values="620;680;620" dur="21s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="220" cy="640" rx="260" ry="200" fill="url(#ob-blob-b)">
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
              fill={palette.mote}
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
            stroke={palette.wave}
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
