import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { ScrollLink } from "@/components/scroll-link";
import { Frame } from "./frame";
import { hero, heroStats } from "@/lib/landing-data";

export function Hero() {
  return (
    <Frame
      locked
      className="overflow-hidden md:pb-20"
      innerClassName="text-center"
      overlay={
        <ScrollLink
          targetId="proof"
          aria-label="Scroll to the next section"
          className="absolute bottom-5 left-1/2 md:bottom-6 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-faint transition-colors hover:text-subtle sm:flex"
        >
          <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">
            Scroll
          </span>
          <ChevronDown size={16} className="animate-bounce" />
        </ScrollLink>
      }
      backdrop={
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute -top-1/3 left-1/2 h-[70vw] max-h-190 w-[70vw] max-w-190 -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(91,127,255,0.20) 0%, rgba(91,127,255,0.05) 45%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 opacity-[0.35] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
          </div>
        </div>
      }
    >
      <div className="animate-slide-up relative mx-auto w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-linear-to-b from-white/9 via-brand/10 to-brand/22 px-4 py-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:rounded-[2.5rem] sm:px-10 sm:py-10 md:py-8">
        {/* Logo, sitting on the dashed rule that runs across the card. */}
        <div className="relative flex items-center justify-center">
          <span
            aria-hidden
            className="absolute -inset-x-4 top-1/2 border-t border-dashed border-white/15 sm:-inset-x-10"
          />
          <div className="relative rounded-full bg-white px-5 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] sm:px-7 sm:py-3.5">
            <Logo tone="dark" size="md" eager />
          </div>
        </div>

        <ScrollLink
          targetId="how-it-works"
          style={{ animationDelay: "0.04s" }}
          className="animate-slide-up mt-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-subtle backdrop-blur-sm transition-colors hover:border-white/20 hover:text-ink sm:mt-9 sm:text-sm md:mt-7"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          {hero.eyebrow}
        </ScrollLink>

        <h1
          style={{ animationDelay: "0.06s" }}
          className="animate-slide-up mx-auto mt-4 max-w-2xl text-[clamp(1.75rem,1.1rem+3.2vw,3.25rem)] leading-[1.12] tracking-tight sm:mt-5 md:mt-4 md:text-[clamp(1.65rem,1rem+2.8vw,2.75rem)]"
        >
          {hero.title}
          <br />
          <span className="bg-linear-to-r from-brand to-brand-soft bg-clip-text text-transparent">
            {hero.titleAccent}
          </span>
        </h1>

        <p
          style={{ animationDelay: "0.14s" }}
          className="animate-slide-up mx-auto mt-5 max-w-2xl text-sm leading-relaxed md:mt-4 text-subtle sm:text-base"
        >
          {hero.subtitle}
        </p>

        {/* The numbers, in the pill the reference hangs its credibility on. */}
        <div
          style={{ animationDelay: "0.22s" }}
          className="animate-slide-up relative mx-auto mt-6 grid max-w-xl grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-[1.5rem] border border-white/12 bg-white/6 px-2 py-4 backdrop-blur-md sm:mt-8 sm:rounded-[2.25rem] sm:px-6 sm:py-5 md:mt-5 md:py-4"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 8px)",
            }}
          />
          {heroStats.map((stat) => (
            <div key={stat.label} className="relative px-1.5 sm:px-3">
              <div className="font-display text-xl leading-none font-extrabold text-ink sm:text-3xl md:text-2xl">
                {stat.value}
              </div>
              <div className="mt-1.5 text-[0.68rem] leading-snug text-subtle sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{ animationDelay: "0.3s" }}
          className="animate-slide-up mt-7 flex flex-col items-center gap-4 sm:mt-9 md:mt-7"
        >
          <Link
            href="/login"
            className="btn-glow inline-flex w-full max-w-sm items-center justify-center rounded-full bg-brand px-8 py-4 font-display md:py-3.5 text-sm font-extrabold tracking-[0.14em] text-white uppercase transition-transform hover:-translate-y-0.5 sm:text-base"
          >
            {hero.primaryCta}
          </Link>
          {/* <ScrollLink
            targetId="how-it-works"
            className="text-xs font-semibold text-subtle transition-colors hover:text-ink sm:text-sm"
          >
            {hero.secondaryCta}
          </ScrollLink> */}
        </div>
      </div>

      {/* <p className="animate-slide-up mt-4 text-xs text-faint sm:text-sm">
        {hero.note}
      </p> */}
    </Frame>
  );
}
