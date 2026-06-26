export function EnergyField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft breathing color washes */}
      <div
        className="absolute -left-32 top-10 h-[55vh] w-[55vh] rounded-full blur-3xl animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(244,176,0,0.32), transparent 65%)" }}
      />
      <div
        className="absolute right-[-10vh] top-[35vh] h-[60vh] w-[60vh] rounded-full blur-3xl animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(13,187,99,0.28), transparent 65%)", animationDelay: "2.5s" }}
      />
      <div
        className="absolute left-[20vw] bottom-[-15vh] h-[65vh] w-[65vh] rounded-full blur-3xl animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(14,70,184,0.22), transparent 65%)", animationDelay: "4s" }}
      />
      <div
        className="absolute right-[20vw] bottom-[5vh] h-[40vh] w-[40vh] rounded-full blur-3xl animate-breathe"
        style={{ background: "radial-gradient(circle, rgba(107,140,247,0.22), transparent 65%)", animationDelay: "6s" }}
      />

      {/* Flowing energy lines */}
      <svg className="absolute inset-0 h-full w-full animate-drift" preserveAspectRatio="none" viewBox="0 0 1440 900">
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4B000" stopOpacity="0" />
            <stop offset="50%" stopColor="#0DBB63" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0E46B8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[120, 280, 460, 640, 780].map((y, i) => (
          <path
            key={y}
            d={`M -50 ${y} C 360 ${y - 60 + i * 12}, 1080 ${y + 80 - i * 14}, 1500 ${y - 20}`}
            stroke="url(#line-grad)"
            strokeWidth="1"
            fill="none"
          />
        ))}
      </svg>

      <div className="grain absolute inset-0" />
    </div>
  );
}

export function ConnectorLine() {
  return (
    <div className="relative mx-auto h-24 w-px">
      <span
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(17,17,17,0.18), transparent)",
        }}
      />
    </div>
  );
}
