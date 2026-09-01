"use client";

import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { Frame, cardRail, cardRailItem } from "./frame";
import { steps } from "@/lib/landing-data";

/** Frame 3 — the mechanism, in three steps. */
export function HowItWorks() {
  return (
    <Frame locked id="how-it-works">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-4 text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-tight">
          Live in three steps
        </h2>
        <p className="mt-4 text-base text-subtle sm:text-lg">
          No agency calls, no proposals, no six-week onboarding.
        </p>
      </Reveal>

      <Stagger className={`relative mt-14 gap-6 md:grid-cols-3 ${cardRail}`}>
        {/* Connecting rule behind the cards on wide screens. */}
        <div
          className="pointer-events-none absolute top-13 right-[16%] left-[16%] hidden h-px bg-linear-to-r from-transparent via-white/15 to-transparent md:block"
          aria-hidden
        />
        {steps.map((step) => (
          <StaggerItem key={step.n} className={cardRailItem}>
            <div className="relative h-full rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-white/20 sm:p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand/12 font-display text-base font-extrabold text-brand">
                {step.n}
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-subtle">
                {step.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Frame>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-bold tracking-[0.12em] text-brand uppercase">
      {children}
    </span>
  );
}
