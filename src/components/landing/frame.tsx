import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FrameProps = {
  id?: string;
  locked?: boolean;
  className?: string;
  /** Extra classes for the inner max-width container. */
  innerClassName?: string;
  backdrop?: ReactNode;
  overlay?: ReactNode;
  children: ReactNode;
};

export const cardRail =
  "-mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0";

/** Sits on each child of a `cardRail`. */
export const cardRailItem = "w-[82%] shrink-0 snap-center md:w-auto md:shrink";

export function Frame({
  id,
  locked = false,
  className,
  innerClassName,
  backdrop,
  overlay,
  children,
}: FrameProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full outline-none",
        locked
          ? "py-16 md:flex md:min-h-dvh md:flex-col md:py-12 md:justify-center-safe"
          : "py-16 md:py-24",
        className,
      )}
    >
      {backdrop}
      <div
        className={cn(
          "relative",
          "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
          innerClassName,
        )}
      >
        {children}
      </div>
      {overlay}
    </section>
  );
}
