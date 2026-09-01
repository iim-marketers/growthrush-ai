"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Full-width brand CTA that anchors the bottom of every onboarding step. */
export function CtaButton({
  children,
  className,
  style,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      style={style}
      disabled={disabled}
      className={cn(
        "btn-glow h-auto w-full gap-2 rounded-xl bg-brand px-6 py-4",
        "font-display text-lg font-bold text-white",
        "transition-transform hover:-translate-y-0.5 hover:bg-brand active:translate-y-0",
        /* Drop the lift and the glow when the button is not actionable. */
        "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
        className,
      )}
    >
      {children}
    </Button>
  );
}
