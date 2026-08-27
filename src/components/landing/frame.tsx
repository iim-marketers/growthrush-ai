import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FrameProps = {
  id?: string;
  /**
   * Lock the section to one screenful: it fills the viewport and centres its
   * content, so a reader who stops here lands on a complete, composed screen.
   *
   * `min-h` rather than `h`, and `safe center` rather than plain centring, so
   * a frame whose content genuinely outgrows the viewport (a phone, a very
   * short laptop, large text settings) simply grows downward instead of
   * clipping its own top off the screen.
   */
  locked?: boolean;
  className?: string;
  /** Extra classes for the inner max-width container. */
  innerClassName?: string;
  /**
   * Absolutely-positioned decoration rendered behind the content, outside the
   * max-width container (ambient glows, grids). Kept inside the frame so it
   * can never drive page scroll.
   */
  backdrop?: ReactNode;
  /**
   * Foreground element positioned against the frame itself rather than the
   * content column — the scroll cue on frame 1, for instance.
   */
  overlay?: ReactNode;
  children: ReactNode;
};

/**
 * One scroll of the landing page.
 *
 * The page is composed as a sequence of these rather than as a stack of
 * free-height sections, so scroll boundaries land on whole ideas instead of
 * on dead space or half a card.
 */
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
          ? // Deliberately no scroll-snap. Snapping pulls the reader back to
            // the frame edge whenever they nudge the page within its
            // threshold, which reads as the page fighting them. The frames
            // still compose as one screenful each; where the reader stops is
            // left to the reader.
            "flex min-h-dvh flex-col [justify-content:safe_center] py-10 sm:py-12"
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
