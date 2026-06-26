"use client";
import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; label: string; tier: number };

const PARTNERS: Star[] = [
  { x: 0.15, y: 0.22, r: 5, label: "Research Institutions", tier: 0 },
  { x: 0.32, y: 0.65, r: 4, label: "Civic Networks", tier: 1 },
  { x: 0.48, y: 0.18, r: 6, label: "Climate Funds", tier: 0 },
  { x: 0.62, y: 0.48, r: 5, label: "Indigenous Councils", tier: 0 },
  { x: 0.78, y: 0.28, r: 4, label: "Universities", tier: 1 },
  { x: 0.85, y: 0.7, r: 5, label: "Energy Co-ops", tier: 0 },
  { x: 0.22, y: 0.85, r: 4, label: "Open Source Coalitions", tier: 1 },
  { x: 0.55, y: 0.82, r: 5, label: "Sovereign Wealth", tier: 0 },
  { x: 0.4, y: 0.4, r: 6, label: "Multilateral Orgs", tier: 0 },
  { x: 0.7, y: 0.12, r: 3.5, label: "Startups", tier: 1 },
  { x: 0.08, y: 0.55, r: 3.5, label: "Local Governments", tier: 1 },
  { x: 0.9, y: 0.45, r: 3.5, label: "Field Labs", tier: 1 },
];

export function PartnerConstellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = ref.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mouse.current.x = e.clientX - r.left;
      mouse.current.y = e.clientY - r.top;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let t = 0;
    const stars = PARTNERS.map((p) => ({ ...p, phase: Math.random() * Math.PI * 2 }));

    const loop = () => {
      raf = requestAnimationFrame(loop);
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      // edges
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const ax = a.x * w, ay = a.y * h;
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const bx = b.x * w, by = b.y * h;
          const dx = ax - bx, dy = ay - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const max = Math.min(w, h) * 0.38;
          if (dist < max) {
            let alpha = (1 - dist / max) * 0.16;
            if (mouse.current.active) {
              const mdx = (ax + bx) / 2 - mouse.current.x;
              const mdy = (ay + by) / 2 - mouse.current.y;
              const md = Math.sqrt(mdx * mdx + mdy * mdy);
              if (md < 180) alpha += (1 - md / 180) * 0.5;
            }
            ctx.strokeStyle = `rgba(14,70,184,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }

      // stars
      stars.forEach((s) => {
        const x = s.x * w, y = s.y * h;
        const pulse = 0.7 + Math.sin(t * 2 + s.phase) * 0.3;
        ctx.fillStyle = s.tier === 0 ? "#F4B000" : "#0DBB63";
        ctx.globalAlpha = 0.18 * pulse;
        ctx.beginPath();
        ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(x, y, s.r * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-white via-[#fafaf6] to-white">
      <canvas ref={ref} className="absolute inset-0" />
      {PARTNERS.map((p) => (
        <span
          key={p.label}
          className="pointer-events-none absolute -translate-x-1/2 translate-y-3 whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-mist"
          style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
        >
          {p.label}
        </span>
      ))}
    </div>
  );
}
