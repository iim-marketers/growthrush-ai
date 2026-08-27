"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { Frame } from "./frame";
import { showcaseBrands, heroStats } from "@/lib/landing-data";

/**
 * Frame 2 — credibility, which is the objection that stops most readers right
 * after the pitch. The headline stats moved here from the hero so this frame
 * answers "does this actually work, and for people like me?" in one screen.
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
        <h2 className="text-[clamp(1.35rem,1rem+1.3vw,2rem)] leading-tight">
          Join other fast-growing local businesses
        </h2>
        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </Reveal>

      <Stagger
        gap={0.03}
        className="mt-12 grid grid-cols-3 gap-x-6 gap-y-10 sm:grid-cols-4 sm:gap-x-8 lg:grid-cols-7 lg:gap-x-6"
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
              className="h-auto w-full max-w-37.5 opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
            />
          </StaggerItem>
        ))}
      </Stagger>

      <Stagger className="mt-14 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:mt-16 sm:grid-cols-3">
        {heroStats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-subtle">{stat.label}</div>
          </StaggerItem>
        ))}
      </Stagger>
    </Frame>
  );
}
