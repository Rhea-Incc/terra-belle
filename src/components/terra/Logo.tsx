import logoUrl from "@/assets/terra-belle-logo.png";

export function Logo({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <img
      src={logoUrl}
      alt="Terra Belle Foundation"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
