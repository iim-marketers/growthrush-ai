"use client";

import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { SectionLabel } from "./how-it-works";
import { testimonials } from "@/lib/landing-data";

export function Results() {
  return (
    <section className="pt-6 pb-12 md:pt-8 md:pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>In their words</SectionLabel>
          <h2 className="mt-4 text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-tight">
            Owners, not marketers
          </h2>
          <p className="mt-4 text-base text-subtle sm:text-lg">
            The people running the shop, the clinic and the classroom.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="flex h-full flex-col rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-sm sm:p-7">
                <blockquote className="flex-1 text-sm leading-relaxed text-subtle">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/15 font-display font-extrabold text-brand">
                    {t.initial}
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink">
                      {t.name}
                    </span>
                    <span className="block text-xs text-faint">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
