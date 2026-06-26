"use client";
import { useMemo, useState } from "react";

type Node = { id: string; label: string; x: number; y: number; color: string; connects: string[] };

const NODES: Node[] = [
  { id: "technology", label: "Technology", x: 50, y: 14, color: "#0E46B8", connects: ["ai", "research", "infrastructure", "finance"] },
  { id: "ai", label: "Artificial Intelligence", x: 82, y: 28, color: "#6B8CF7", connects: ["technology", "research", "energy"] },
  { id: "energy", label: "Renewable Energy", x: 90, y: 58, color: "#F4B000", connects: ["communities", "environment", "technology", "infrastructure"] },
  { id: "environment", label: "Environmental Stewardship", x: 74, y: 84, color: "#0DBB63", connects: ["communities", "energy", "policy"] },
  { id: "finance", label: "Finance", x: 18, y: 28, color: "#F4B000", connects: ["technology", "research", "education", "policy"] },
  { id: "education", label: "Education", x: 10, y: 58, color: "#6B8CF7", connects: ["research", "communities", "finance"] },
  { id: "research", label: "Research", x: 26, y: 84, color: "#0E46B8", connects: ["technology", "ai", "education", "finance"] },
  { id: "communities", label: "Communities", x: 50, y: 94, color: "#0DBB63", connects: ["education", "environment", "energy", "policy"] },
  { id: "infrastructure", label: "Infrastructure", x: 66, y: 6, color: "#111111", connects: ["technology", "energy"] },
  { id: "policy", label: "Policy", x: 34, y: 6, color: "#7B7B7B", connects: ["finance", "environment", "communities"] },
];

export function EcosystemMap() {
  const [active, setActive] = useState<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);
  const activeNode = active ? byId[active] : null;
  const activeSet = activeNode ? new Set([active!, ...activeNode.connects]) : null;

  return (
    <div className="relative w-full">
      <div className="relative mx-auto aspect-square w-full max-w-3xl">
        {/* SVG edges */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="ecoGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#F4B000" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#F4B000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#ecoGlow)" />
          {NODES.flatMap((n) =>
            n.connects.map((cid) => {
              const c = byId[cid];
              if (!c) return null;
              const key = [n.id, cid].sort().join("-");
              const isLit =
                !!activeSet && (activeSet.has(n.id) && activeSet.has(cid)) &&
                (n.id === active || cid === active);
              return (
                <line
                  key={`${n.id}-${cid}`}
                  data-key={key}
                  x1={n.x}
                  y1={n.y}
                  x2={c.x}
                  y2={c.y}
                  stroke={isLit ? n.color : "#111111"}
                  strokeOpacity={isLit ? 0.55 : active ? 0.04 : 0.09}
                  strokeWidth={isLit ? 0.35 : 0.18}
                  style={{ transition: "all 500ms ease" }}
                />
              );
            })
          )}
        </svg>

        {/* Nodes (HTML so they stay crisp + interactive) */}
        {NODES.map((n) => {
          const dim = !!active && !activeSet?.has(n.id);
          const lit = !!active && activeSet?.has(n.id);
          return (
            <button
              key={n.id}
              type="button"
              data-magnetic
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
              style={{ left: `${n.x}%`, top: `${n.y}%`, opacity: dim ? 0.32 : 1, transition: "opacity 400ms ease" }}
              aria-label={n.label}
            >
              <span
                className="relative flex h-3 w-3 items-center justify-center rounded-full transition-all duration-500"
                style={{
                  background: lit || active === n.id ? n.color : "#fff",
                  border: `1px solid ${n.color}`,
                  boxShadow: active === n.id ? `0 0 0 6px ${n.color}22, 0 0 24px ${n.color}66` : "none",
                  transform: active === n.id ? "scale(1.4)" : "scale(1)",
                }}
              >
                {active === n.id && (
                  <span
                    className="absolute inset-[-10px] rounded-full border"
                    style={{ borderColor: `${n.color}66`, animation: "ecoPulse 2.2s ease-out infinite" }}
                  />
                )}
              </span>
              <span
                className="pointer-events-none mt-2 block whitespace-nowrap text-[10px] uppercase tracking-[0.18em] transition-all duration-300"
                style={{
                  color: active === n.id ? "#111" : "#7B7B7B",
                  transform: active === n.id ? "translateY(0)" : "translateY(-2px)",
                  fontWeight: active === n.id ? 500 : 400,
                }}
              >
                {n.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active description */}
      <div className="mt-10 min-h-[3.5rem] text-center text-[13px] leading-relaxed text-mist">
        {activeNode ? (
          <span>
            <strong className="text-ink">{activeNode.label}</strong> ·{" "}
            connects to{" "}
            {activeNode.connects.map((c, i) => (
              <span key={c}>
                <span style={{ color: byId[c].color }}>{byId[c].label}</span>
                {i < activeNode.connects.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        ) : (
          <span className="opacity-70">Hover any node to trace its connections through the ecosystem.</span>
        )}
      </div>

      <style>{`
        @keyframes ecoPulse {
          0%   { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
