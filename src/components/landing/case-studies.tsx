"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { Frame, cardRail, cardRailItem } from "./frame";
import { SectionLabel } from "./how-it-works";
import { caseStudies } from "@/lib/landing-data";

/** Frame 5 — proof in numbers: three businesses, three results. */
export function CaseStudies() {
  return (
    <Frame locked id="results">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>Results</SectionLabel>
        <h2 className="mt-3 text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-tight sm:mt-4">
          Real businesses, real enquiries
        </h2>
        <p className="mt-3 text-base text-subtle sm:mt-4 sm:text-lg">
          Not impressions. Not reach. Leads you can actually call back.
        </p>
      </Reveal>

      <Stagger className={`mt-8 gap-5 sm:mt-10 md:grid-cols-3 ${cardRail}`}>
        {caseStudies.map((study) => (
          <StaggerItem key={study.business} className={cardRailItem}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand/30">
              <div className="relative aspect-video overflow-hidden sm:aspect-16/10">
                <Image
                  src={study.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-linear-to-t from-card via-card/75 to-brand/10" />
                <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-bold text-ink backdrop-blur-sm">
                  {study.category}
                </span>
                <div className="absolute right-4 bottom-4 left-4">
                  <div className="font-display text-3xl font-extrabold text-brand-soft drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {study.metric}
                  </div>
                  <div className="text-xs text-subtle">{study.metricLabel}</div>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h3 className="text-lg leading-snug font-bold text-ink">
                  {study.headline}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-subtle sm:mt-2.5">
                  {study.body}
                </p>
                <div className="mt-3 border-t border-white/10 pt-3 sm:mt-4 sm:pt-4">
                  <p className="text-sm font-bold text-ink">{study.business}</p>
                  <p className="text-xs text-faint">{study.city}</p>
                </div>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Frame>
  );
}
