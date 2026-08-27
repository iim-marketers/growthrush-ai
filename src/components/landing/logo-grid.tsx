"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { showcaseBrands } from "@/lib/landing-data";

/**
 * Static logo wall — 7 columns on desktop, 4 on tablet, 3 on mobile, matching
 * the reference layout. Logos sit muted and lift to full opacity on hover.
 */
export function LogoGrid() {
  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
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
      </div>
    </section>
  );
}
