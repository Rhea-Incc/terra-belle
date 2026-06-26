"use client";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function IntroLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-white transition-all duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-24 w-24">
          {/* four energy streams */}
          {[
            { c: "#F4B000", d: "0s" },
            { c: "#0DBB63", d: "0.15s" },
            { c: "#0E46B8", d: "0.3s" },
            { c: "#6B8CF7", d: "0.45s" },
          ].map((s, i) => (
            <span
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid ${s.c}`,
                opacity: 0,
                animation: `loaderRing 1.8s ${s.d} ease-out forwards`,
                transform: `rotate(${i * 90}deg)`,
              }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo size={36} />
          </div>
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-mist">Terra Belle</span>
      </div>
      <style>{`
        @keyframes loaderRing {
          0%   { transform: scale(0.4) rotate(0deg); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: scale(1.05) rotate(180deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
