import Image from "next/image";
import { cn } from "@/lib/utils";
import { brand } from "@/lib/data";

/**
 * The real wordmark, in two tones. `light` is the white-lettered cut for the
 * dark app surface; `dark` is the black-lettered original, for the white
 * surfaces (the hero's logo pill, print). Both share the purple mark.
 */
const wordmark = {
  light: "/brand/wordmark-light.png",
  dark: "/brand/wordmark.png",
} as const;

/** Height only — the aspect ratio comes from the file (1078 × 166). */
const sizes = {
  sm: "h-5 sm:h-6",
  md: "h-6 sm:h-7",
  lg: "h-8 sm:h-10",
} as const;

export function Logo({
  size = "sm",
  tone = "light",
  className,
  glow = false,
  eager = false,
}: {
  size?: keyof typeof sizes;
  tone?: keyof typeof wordmark;
  className?: string;
  glow?: boolean;
  /** Above the fold: skip lazy-loading. (`priority` is deprecated in Next 16.) */
  eager?: boolean;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src={wordmark[tone]}
        alt={`${brand.name}${brand.suffix}`}
        width={1078}
        height={166}
        sizes="(max-width: 640px) 200px, 260px"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={cn("w-auto", sizes[size])}
        style={
          glow
            ? { filter: "drop-shadow(0 6px 24px rgba(96,69,244,0.45))" }
            : undefined
        }
      />
    </div>
  );
}

/** The mark on its own, for favicons and tight spots. */
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
