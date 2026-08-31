"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { Frame } from "./frame";
import { showcaseBrands } from "@/lib/landing-data";

export function LogoGrid() {
  return (
    <Frame
      locked
      id="proof"
      className="border-y border-white/10 bg-white/2"
      innerClassName="text-center"
    >
      <Reveal>
        <h2 className="mx-auto max-w-xl text-[clamp(1.35rem,1rem+1.3vw,2rem)] leading-tight">
          Join the brands already growing with us
        </h2>
        <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-brand" />
        <p className="mx-auto mt-5 max-w-lg text-sm text-subtle sm:text-base">
          National FMCG names to fast-growing clinics, institutes and
          manufacturers — all running Meta ads on growthrush.ai.
        </p>
      </Reveal>

      <Stagger
        gap={0.03}
        className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center sm:mt-14"
      >
        {showcaseBrands.map((brand) => (
          <StaggerItem
            key={brand.src}
            className="flex min-w-0 basis-1/3 items-center justify-center px-2 py-4 sm:basis-1/4 sm:px-4 sm:py-5 lg:basis-1/6"
          >
            <Image
              src={brand.src}
              alt={brand.name}
              width={240}
              height={96}
              className="h-12 w-full max-w-full object-contain sm:h-16"
            />
          </StaggerItem>
        ))}
      </Stagger>

      {/* <Reveal delay={0.1}>
        <p className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-subtle sm:mt-16 sm:text-sm">
          <span className="text-brand-soft">{company.rating}</span>
          business owners rate us
        </p>
      </Reveal> */}
    </Frame>
  );
}
