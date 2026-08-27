"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Full-width brand CTA that anchors the bottom of every onboarding step. */
export function CtaButton({
  children,
  className,
  style,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      style={style}
      className={cn(
        "btn-glow h-auto w-full gap-2 rounded-xl bg-brand px-6 py-4",
        "font-display text-lg font-bold text-white",
        "transition-transform hover:-translate-y-0.5 hover:bg-brand active:translate-y-0",
        className,
      )}
    >
      {children}
    </Button>
  );
}
