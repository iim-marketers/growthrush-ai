import { cn } from "@/lib/utils";
import { brand } from "@/lib/data";

const sizes = {
  sm: { box: "rounded-lg p-2", icon: 18, text: "text-lg sm:text-xl" },
  md: { box: "rounded-lg p-2", icon: 20, text: "text-xl sm:text-2xl" },
  lg: {
    box: "rounded-xl p-2.5 sm:p-3",
    icon: 32,
    text: "text-3xl sm:text-4xl lg:text-[2.75rem]",
  },
} as const;

export function Logo({
  size = "sm",
  className,
  glow = false,
}: {
  size?: keyof typeof sizes;
  className?: string;
  glow?: boolean;
}) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      <div
        className={cn("flex bg-brand", s.box)}
        style={glow ? { boxShadow: "0 8px 32px rgba(91,127,255,0.4)" } : undefined}
      >
        <TrendIcon size={s.icon} />
      </div>
      <div
        className={cn(
          "font-display font-extrabold tracking-tight text-ink",
          s.text,
        )}
      >
        {brand.name}
        <span className="text-brand">{brand.suffix}</span>
      </div>
    </div>
  );
}

export function TrendIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth={size > 24 ? 2.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 7h6v6" />
      <path d="m22 7-8.5 8.5-5-5L2 17" />
    </svg>
  );
}
