import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FrameProps = {
  id?: string;
  className?: string;
  innerClassName?: string;
  backdrop?: ReactNode;
  children: ReactNode;
};

export const cardRail =
  "-mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0";

export const cardRailItem = "w-[82%] shrink-0 snap-center md:w-auto md:shrink";

export function Frame({
  id,
  className,
  innerClassName,
  backdrop,
  children,
}: FrameProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full py-16 outline-none md:py-10 lg:py-12",
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
    </section>
  );
}
