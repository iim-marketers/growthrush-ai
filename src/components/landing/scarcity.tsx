"use client";

import { Reveal } from "./motion-primitives";
import { scarcity } from "@/lib/landing-data";

export function Scarcity() {
  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <Reveal className="mx-auto w-full max-w-4xl">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-orange/25 bg-orange/[0.07] px-6 py-6 text-center sm:flex-row sm:gap-6 sm:text-left">
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange/15 px-3.5 py-1.5 text-xs font-bold tracking-wide text-orange uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange" />
            </span>
            {scarcity.label}
          </span>
          <p className="flex-1 text-sm leading-relaxed text-subtle">
            {scarcity.text}{" "}
            <strong className="text-ink">{scarcity.highlight}</strong>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
