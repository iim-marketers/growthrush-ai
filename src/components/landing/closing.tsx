"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./motion-primitives";
import { Frame } from "./frame";
import { hero } from "@/lib/landing-data";

const reassurances = [
  "No card needed",
  "Your budget stays in your account",
  "You approve every ad",
] as const;

export function Closing() {
  return (
    <Frame
      locked
      className="overflow-hidden border-t border-white/10"
      innerClassName="text-center"
      backdrop={
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute bottom-[-30%] left-1/2 h-[60vw] max-h-155 w-[60vw] max-w-155 -translate-x-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(91,127,255,0.22) 0%, rgba(91,127,255,0.06) 45%, transparent 70%)",
            }}
          />
        </div>
      }
    >
      <Reveal>
        <h2 className="mx-auto max-w-2xl text-[clamp(2rem,1.3rem+3vw,3.5rem)] leading-[1.08] tracking-tight">
          Your next customer is{" "}
          <span className="bg-linear-to-r from-brand to-brand-soft bg-clip-text text-transparent">
            already scrolling.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">
          {hero.note}. Set your budget, approve your first ad, and let the
          enquiries come to your WhatsApp.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-9 flex justify-center">
          <Link
            href="/login"
            className="btn-glow group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 font-display text-base font-bold text-white transition-transform hover:-translate-y-0.5 sm:w-auto sm:text-lg"
          >
            {hero.primaryCta}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <ul className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-8">
          {reassurances.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm whitespace-nowrap text-subtle"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check size={12} strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
    </Frame>
  );
}
