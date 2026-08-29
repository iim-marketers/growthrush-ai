"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { Frame } from "./frame";
import { showcaseBrands } from "@/lib/landing-data";
import { brand as company } from "@/lib/data";

/**
 * Frame 2 — credibility, which is the objection that stops most readers right
 * after the pitch. The headline numbers sit in the hero card now, so this
 * frame answers the narrower question: "people like me, using this?"
 */
export function LogoGrid() {
  return (
    <Frame
      locked
      id="proof"
      className="border-y border-white/10 bg-white/[0.02]"
      innerClassName="text-center"
    >
      <Reveal>
        <h2 className="mx-auto max-w-xl text-[clamp(1.35rem,1rem+1.3vw,2rem)] leading-tight">
          Join other fastest-growing local businesses
        </h2>
        <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-brand" />
        <p className="mx-auto mt-5 max-w-md text-sm text-subtle sm:text-base">
          Salons, clinics, coaching centres, studios and D2C brands run their
          Meta ads on growthrush.ai.
        </p>
      </Reveal>

      <Stagger
        gap={0.03}
        className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-14 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-12 lg:grid-cols-7"
      >
        {showcaseBrands.map((brand) => (
          <StaggerItem
            key={brand.src}
            className="flex items-center justify-center"
          >
            <Image
              src={brand.src}
              alt={brand.name}
              width={220}
              height={42}
              className="h-auto w-full max-w-40 opacity-55 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal delay={0.1}>
        <p className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-subtle sm:mt-16 sm:text-sm">
          <span className="text-brand-soft">{company.rating}</span>
          business owners rate us
        </p>
      </Reveal>
    </Frame>
  );
}
