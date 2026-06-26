import logo from "@/assets/terra-belle-logo.png.asset.json";

export function Logo({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <img
      src={logo.url}
      alt="Terra Belle Foundation"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
