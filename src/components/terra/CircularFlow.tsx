"use client";
import { FLOWS, useFlow, type FlowId } from "./FlowContext";

const ORDER: FlowId[] = ["energy", "capital", "knowledge", "regeneration"];
const ARCS: Record<FlowId, { from: number; to: number }> = {
  energy: { from: 0, to: 90 },
  capital: { from: 90, to: 180 },
  knowledge: { from: 180, to: 270 },
  regeneration: { from: 270, to: 360 },
};
const DESCRIPTIONS: Record<FlowId, string> = {
  energy: "Solar and wind generation flows into communities and powers regenerative industry.",
  capital: "Returns recirculate into ecological infrastructure rather than extract from it.",
  knowledge: "Open research and education feed new tools, models and policy frameworks.",
  regeneration: "Restored ecosystems return as carbon sinks, water cycles and living capital.",
};

const R = 130;
const CX = 170;
const CY = 170;

function polar(angle: number, r = R) {
  const a = ((angle - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function arcPath(from: number, to: number, r = R) {
  const s = polar(from, r);
  const e = polar(to, r);
  const large = to - from > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function CircularFlow() {
  const { active, setActive } = useFlow();

  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div className="relative mx-auto w-full max-w-md">
        <svg viewBox="0 0 340 340" className="h-auto w-full">
          <defs>
            <radialGradient id="cfCore" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#F4B000" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F4B000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r={R} fill="url(#cfCore)" />
          <circle cx={CX} cy={CY} r={R - 30} fill="none" stroke="#11111110" />
          <circle cx={CX} cy={CY} r={R + 18} fill="none" stroke="#11111108" />

          {ORDER.map((id) => {
            const f = FLOWS[id];
            const { from, to } = ARCS[id];
            const isActive = active === id;
            const dim = !!active && !isActive;
            return (
              <g
                key={id}
                style={{ cursor: "pointer", transition: "opacity 400ms ease" }}
                opacity={dim ? 0.2 : 1}
                onMouseEnter={() => setActive(id)}
                onMouseLeave={() => setActive(null)}
              >
                <path
                  d={arcPath(from + 6, to - 6)}
                  stroke={f.color}
                  strokeWidth={isActive ? 9 : 5}
                  strokeLinecap="round"
                  fill="none"
                  style={{ transition: "stroke-width 400ms ease" }}
                />
                <circle r={isActive ? 5 : 3.5} fill={f.color}>
                  <animateMotion dur={isActive ? "3.5s" : "8s"} repeatCount="indefinite" path={arcPath(from + 6, to - 6)} />
                </circle>
                {(() => {
                  const mid = (from + to) / 2;
                  const p = polar(mid, R + 38);
                  return (
                    <text
                      x={p.x}
                      y={p.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="11"
                      fontWeight={isActive ? 600 : 500}
                      fill={isActive ? f.color : "#111"}
                      style={{ letterSpacing: "0.2em", textTransform: "uppercase", transition: "all 300ms ease" }}
                    >
                      {f.label}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          <circle cx={CX} cy={CY} r="32" fill="#fff" stroke="#11111110" />
          <text x={CX} y={CY - 2} textAnchor="middle" fontSize="9" fill="#7B7B7B" style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}>
            One
          </text>
          <text x={CX} y={CY + 10} textAnchor="middle" fontSize="9" fill="#7B7B7B" style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Loop
          </text>
        </svg>
      </div>

      <div>
        <ul className="space-y-3">
          {ORDER.map((id) => {
            const f = FLOWS[id];
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(id)}
                  onBlur={() => setActive(null)}
                  className="group w-full rounded-2xl border border-black/5 bg-white p-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(17,17,17,0.18)]"
                  style={{ borderColor: isActive ? `${f.color}55` : undefined }}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full" style={{ background: f.color, boxShadow: `0 0 12px ${f.color}` }} />
                    <span className="text-[12px] font-medium uppercase tracking-[0.2em]" style={{ color: isActive ? f.color : "var(--ink)" }}>
                      {f.label}
                    </span>
                    <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-mist">
                      → {f.chapters.join(" · ")}
                    </span>
                  </div>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-mist">{DESCRIPTIONS[id]}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
