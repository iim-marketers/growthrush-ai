import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FrameProps = {
  id?: string;
  /**
   * Lock the section to one screenful **from `md` up**: it fills the viewport
   * and centres its content, so a reader who stops here lands on a complete,
   * composed screen.
   *
   * Phones opt out entirely. Mobile browsers grow and shrink the viewport as
   * their address bar hides and reappears, so a page of `dvh`-tall sections
   * re-lays-out mid-gesture — every frame changes height at once and the
   * scroll position is pulled to a new offset. That is the scroll "sticking"
   * and then jumping on the way back up. Below `md` the frames are ordinary
   * padded sections that just scroll.
   *
   * `min-h` rather than `h`, and `safe center` rather than plain centring, so
   * a frame whose content genuinely outgrows the viewport (a very short
   * laptop, large text settings) simply grows downward instead of clipping
   * its own top off the screen.
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
 * A three-up card grid that becomes a swipeable rail on phones.
 *
 * Stacking three cards vertically is what pushed the narrative frames past one
 * screen on mobile — the grid is the cause, not the card design. Laid out
 * side by side the same content fits a phone screen with room to spare, and
 * the partially visible next card is its own affordance that more exists.
 *
 * The snapping here is horizontal and scoped to this track. It is not the
 * page-level vertical snap that was removed: there is no free vertical scroll
 * for it to drag the reader back out of.
 */
export const cardRail =
  "-mx-4 flex snap-x snap-mandatory overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0";

/** Sits on each child of a `cardRail`. */
export const cardRailItem = "w-[82%] shrink-0 snap-center md:w-auto md:shrink";

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
            //
            // The full-height treatment starts at `md`, the same breakpoint at
            // which `cardRail` becomes a grid: on phones the cards are a
            // horizontal rail and the frame is a plain scrolling section.
            "py-16 md:flex md:min-h-dvh md:flex-col md:py-12 md:[justify-content:safe_center]"
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
