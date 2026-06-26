"use client";
import { useEffect, useRef } from "react";

/**
 * Living energy network — softly drifting particles that form the
 * invisible ecosystem connecting every section. GPU-friendly canvas,
 * pauses off-screen and respects reduced motion.
 */
export function ParticleNetwork() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    let raf = 0;
    let mouseX = -9999, mouseY = -9999;
    let visible = true;

    const COLORS = ["#F4B000", "#0DBB63", "#0E46B8", "#6B8CF7"];

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string; phase: number };
    let particles: P[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = w * h;
      const count = Math.min(140, Math.max(40, Math.floor(area / 14000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 0.6 + Math.random() * 1.4,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onLeave = () => { mouseX = -9999; mouseY = -9999; };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    const LINK_DIST = 130;
    const MOUSE_DIST = 160;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.phase += 0.004;
        p.x += p.vx + Math.sin(t * 0.0002 + p.phase) * 0.05;
        p.y += p.vy + Math.cos(t * 0.0002 + p.phase) * 0.05;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;

        const dx = mouseX - p.x, dy = mouseY - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_DIST * MOUSE_DIST) {
          const f = (1 - Math.sqrt(d2) / MOUSE_DIST) * 0.04;
          p.x += dx * f;
          p.y += dy * f;
        }
      }

      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.18;
            ctx.strokeStyle = `rgba(17,17,17,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (mouseX > 0) {
        for (const p of particles) {
          const dx = p.x - mouseX, dy = p.y - mouseY;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_DIST * MOUSE_DIST) {
            const alpha = (1 - Math.sqrt(d2) / MOUSE_DIST) * 0.55;
            ctx.strokeStyle = p.c + Math.floor(alpha * 255).toString(16).padStart(2, "0");
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const pulse = 0.7 + Math.sin(t * 0.001 + p.phase) * 0.3;
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.55 * pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    if (!reduce) {
      window.addEventListener("resize", resize);
      window.addEventListener("mousemove", onMouse, { passive: true });
      window.addEventListener("mouseleave", onLeave);
      raf = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
