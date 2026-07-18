"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Node = {
  id: string;
  label: string;
  orbit: 0 | 1 | 2 | 3; // 0 = center
  color: string;
  connects: string[];
  size: number; // 0..1 relative
};

// Preserved relationships from the previous ecosystem map,
// re-organised into concentric orbits around the Terra Belle core.
const NODES: Node[] = [
  { id: "core", label: "Terra Belle", orbit: 0, color: "#F4B000", connects: [], size: 1 },

  // Inner orbit — the generative systems
  { id: "technology", label: "Technology", orbit: 1, color: "#0E46B8", connects: ["ai", "research", "infrastructure", "finance"], size: 0.9 },
  { id: "ai", label: "Intelligence", orbit: 1, color: "#6B8CF7", connects: ["technology", "research", "energy"], size: 0.85 },
  { id: "energy", label: "Renewable Energy", orbit: 1, color: "#F4B000", connects: ["communities", "environment", "technology", "infrastructure"], size: 0.95 },

  // Middle orbit — the flowing systems
  { id: "finance", label: "Finance", orbit: 2, color: "#F4B000", connects: ["technology", "research", "education", "policy"], size: 0.75 },
  { id: "research", label: "Research", orbit: 2, color: "#0E46B8", connects: ["technology", "ai", "education", "finance"], size: 0.8 },
  { id: "education", label: "Education", orbit: 2, color: "#6B8CF7", connects: ["research", "communities", "finance"], size: 0.75 },
  { id: "environment", label: "Environment", orbit: 2, color: "#0DBB63", connects: ["communities", "energy", "policy"], size: 0.85 },

  // Outer orbit — the grounding systems
  { id: "communities", label: "Communities", orbit: 3, color: "#0DBB63", connects: ["education", "environment", "energy", "policy"], size: 0.8 },
  { id: "infrastructure", label: "Infrastructure", orbit: 3, color: "#111111", connects: ["technology", "energy"], size: 0.7 },
  { id: "policy", label: "Policy", orbit: 3, color: "#7B7B7B", connects: ["finance", "environment", "communities"], size: 0.7 },
];

// Angular positions per orbit (degrees). Handpicked to keep readable spacing.
const ANGLES: Record<string, number> = {
  technology: -90,
  ai: 30,
  energy: 150,

  finance: -140,
  research: -70,
  education: 20,
  environment: 110,

  communities: 90,
  infrastructure: -30,
  policy: -150,
};

const ORBIT_SPEED = [0, 0.05, -0.035, 0.022]; // rad/s per orbit (0 = static core)

export function EcosystemMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [active, setActive] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  useEffect(() => { activeRef.current = active; }, [active]);

  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);
  const activeNode = active ? byId[active] : null;
  const activeSet = activeNode
    ? new Set([active!, ...(activeNode.connects ?? [])])
    : null;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, cx = 0, cy = 0;
    const orbitRadii = [0, 0, 0, 0];

    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height;
      cx = w / 2; cy = h / 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const base = Math.min(w, h) / 2;
      orbitRadii[0] = 0;
      orbitRadii[1] = base * 0.28;
      orbitRadii[2] = base * 0.58;
      orbitRadii[3] = base * 0.86;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const start = performance.now();
    let raf = 0;

    // Positional state per node (updated each frame).
    const pos: Record<string, { x: number; y: number }> = {};

    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const t = reduce ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, w, h);

      // faint concentric orbit rings (dark on light bg)
      for (let o = 1; o <= 3; o++) {
        ctx.beginPath();
        ctx.arc(cx, cy, orbitRadii[o], 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(17,17,17,${0.10 + (3 - o) * 0.03})`;
        ctx.setLineDash([2, 6]);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // update positions
      for (const n of NODES) {
        if (n.orbit === 0) {
          pos[n.id] = { x: cx, y: cy };
          continue;
        }
        const base = (ANGLES[n.id] ?? 0) * (Math.PI / 180);
        const angle = base + t * ORBIT_SPEED[n.orbit];
        const r = orbitRadii[n.orbit];
        pos[n.id] = { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
      }

      // draw edges (respecting original relationships)
      for (const n of NODES) {
        for (const cid of n.connects) {
          if (n.id > cid) continue; // dedupe
          const a = pos[n.id]; const b = pos[cid];
          if (!a || !b) continue;
          const highlighted =
            !!activeRef.current &&
            (activeRef.current === n.id || activeRef.current === cid);
          const dimmed = !!activeRef.current && !highlighted;
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, n.color);
          grad.addColorStop(1, byId[cid].color);
          ctx.strokeStyle = grad;
          ctx.globalAlpha = highlighted ? 0.85 : dimmed ? 0.08 : 0.28;
          ctx.lineWidth = highlighted ? 1.8 : 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // move node buttons + apply pulse
      for (const n of NODES) {
        const el = nodeRefs.current[n.id];
        if (!el) continue;
        const p = pos[n.id];
        const pulse = 1 + Math.sin(t * 1.6 + n.orbit * 1.2 + n.id.length) * 0.12;
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${pulse})`;
      }
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [byId]);

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-square w-full max-w-3xl overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0" aria-hidden />

        {NODES.map((n) => {
          const dim = !!active && !activeSet?.has(n.id);
          const isCore = n.orbit === 0;
          const dot = 8 + n.size * 12; // px
          return (
            <button
              key={n.id}
              ref={(el) => { nodeRefs.current[n.id] = el; }}
              type="button"
              data-magnetic
              onMouseEnter={() => setActive(n.id)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)}
              onBlur={() => setActive(null)}
              className="absolute left-0 top-0 flex flex-col items-center gap-1.5 outline-none transition-opacity duration-500 will-change-transform"
              style={{ opacity: dim ? 0.28 : 1 }}
              aria-label={n.label}
            >
              <span className="relative grid place-items-center">
                {/* soft halo */}
                <span
                  aria-hidden
                  className="absolute rounded-full blur-md"
                  style={{
                    width: dot * 3.4,
                    height: dot * 3.4,
                    background: n.color,
                    opacity: active === n.id ? 0.55 : isCore ? 0.35 : 0.22,
                    transition: "opacity 400ms ease",
                  }}
                />
                {/* pulsing outer ring */}
                <span
                  aria-hidden
                  className="absolute rounded-full"
                  style={{
                    width: dot * 2,
                    height: dot * 2,
                    border: `1px solid ${n.color}`,
                    opacity: 0.35,
                    animation: `orbitPing ${3.2 + n.orbit * 0.6}s ease-out infinite`,
                  }}
                />
                {/* core dot */}
                <span
                  className="relative rounded-full"
                  style={{
                    width: dot,
                    height: dot,
                    background: n.color,
                    boxShadow: `0 0 ${dot}px ${n.color}aa, inset 0 0 ${dot / 2}px rgba(255,255,255,0.35)`,
                    border: isCore ? "2px solid #fff" : "none",
                  }}
                />
              </span>
              <span
                className="pointer-events-none whitespace-nowrap text-[10px] uppercase tracking-[0.22em] transition-colors"
                style={{
                  color: "#111111",
                  fontWeight: isCore ? 700 : 500,
                  opacity: active === n.id || isCore ? 1 : 0.75,
                  textShadow: "0 1px 6px rgba(255,255,255,0.9), 0 0 2px rgba(255,255,255,0.9)",
                }}
              >
                {n.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 min-h-[3rem] text-center text-[13px] leading-relaxed text-ink/70">
        {activeNode && activeNode.orbit !== 0 ? (
          <span>
            <strong className="text-ink">{activeNode.label}</strong> · connects to{" "}
            {activeNode.connects.map((c, i) => (
              <span key={c}>
                <span style={{ color: byId[c].color, fontWeight: 600 }}>{byId[c].label}</span>
                {i < activeNode.connects.length - 1 ? ", " : ""}
              </span>
            ))}
          </span>
        ) : activeNode?.orbit === 0 ? (
          <span><strong className="text-ink">Terra Belle</strong> · the gravitational core every orbit returns to.</span>
        ) : (
          <span className="opacity-70">Hover any orbiting body to trace its relationships through the ecosystem.</span>
        )}
      </div>

      <style>{`
        @keyframes orbitPing {
          0%   { transform: scale(0.9); opacity: 0.5; }
          80%  { opacity: 0; }
          100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
