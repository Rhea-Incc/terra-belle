"use client";
import { useEffect, useRef } from "react";

/**
 * Energy-node cursor: glowing orb + fading trail + magnetic pull on
 * [data-magnetic] targets + ripple on click.
 */
export function EnergyCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0;
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mx = w / 2, my = h / 2;
    let rx = mx, ry = my;
    let dx = mx, dy = my;
    const trail: { x: number; y: number }[] = [];
    const ripples: { x: number; y: number; r: number; a: number }[] = [];

    let magnetTarget: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest?.("[data-magnetic]") as HTMLElement | null;
      magnetTarget = el || null;
    };
    const onDown = (e: MouseEvent) => {
      ripples.push({ x: e.clientX, y: e.clientY, r: 0, a: 1 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);

      let tx = mx, ty = my;
      if (magnetTarget) {
        const r = magnetTarget.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        tx = mx + (cx - mx) * 0.3;
        ty = my + (cy - my) * 0.3;
      }

      dx += (tx - dx) * 0.35;
      dy += (ty - dy) * 0.35;
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;

      if (dotRef.current) dotRef.current.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0)`;
      if (ringRef.current) {
        const scale = magnetTarget ? 1.8 : 1;
        ringRef.current.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0) scale(${scale})`;
        ringRef.current.style.opacity = magnetTarget ? "1" : "0.7";
      }

      trail.push({ x: dx, y: dy });
      if (trail.length > 22) trail.shift();

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < trail.length - 1; i++) {
        const p = trail[i], n = trail[i + 1];
        const alpha = (i / trail.length) * 0.5;
        ctx.strokeStyle = `rgba(244,176,0,${alpha})`;
        ctx.lineWidth = 1 + (i / trail.length) * 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 6;
        r.a *= 0.94;
        ctx.strokeStyle = `rgba(14,70,184,${r.a * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        if (r.a < 0.02) ripples.splice(i, 1);
      }
    };
    raf = requestAnimationFrame(loop);

    document.documentElement.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", resize);
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-[99] hidden md:block" />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-10 w-10 rounded-full transition-opacity duration-300 md:block"
        style={{
          background: "radial-gradient(circle, rgba(244,176,0,0.22), transparent 70%)",
          mixBlendMode: "multiply",
        }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden h-2 w-2 rounded-full md:block"
        style={{
          background: "var(--earth-blue)",
          boxShadow: "0 0 12px rgba(14,70,184,0.6)",
        }}
      />
    </>
  );
}
