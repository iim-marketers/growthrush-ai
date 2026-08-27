"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./motion-primitives";

export function FinalCta() {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
      <Reveal className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 px-6 py-16 text-center sm:px-12 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
          >
            <div
              className="absolute top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(91,127,255,0.22) 0%, rgba(91,127,255,0.06) 40%, transparent 68%)",
              }}
            />
          </div>

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-[clamp(1.75rem,1.2rem+2.4vw,3rem)] leading-tight">
              Your competitors are already running ads
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-subtle sm:text-lg">
              Find out how many customers you are missing this month — free, and
              it takes under a minute.
            </p>
            <Link
              href="/login"
              className="btn-glow group mt-9 inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 font-display text-base font-bold text-white transition-transform hover:-translate-y-0.5 sm:text-lg"
            >
              Get Started
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <p className="mt-4 text-sm text-faint">
              No card needed · 30-day results guarantee
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
