"use client";

import Image from "next/image";
import {
  BarChart3,
  MapPin,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { Frame } from "./frame";
import { SectionLabel } from "./how-it-works";
import { features } from "@/lib/landing-data";

const icons = {
  sparkles: Sparkles,
  map: MapPin,
  message: MessageSquare,
  trend: TrendingUp,
  wallet: Wallet,
  chart: BarChart3,
} as const;

/**
 * Frame 4 — what you get. Left at its natural height on purpose: six cards
 * with imagery cannot honestly be squeezed into one screen, and forcing it
 * would shrink the cards to the point of illegibility on a phone.
 */
export function Features() {
  return (
    <Frame id="features">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionLabel>What you get</SectionLabel>
        <h2 className="mt-4 text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-tight">
          An ads team, without the ads team
        </h2>
        <p className="mt-4 text-base text-subtle sm:text-lg">
          Everything an agency would charge a retainer for, running on its own.
        </p>
      </Reveal>

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = icons[feature.icon as keyof typeof icons];
          return (
            <StaggerItem key={feature.title}>
              <div className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-brand/30">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={feature.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-45 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                  <span className="absolute bottom-4 left-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-background/80 text-brand backdrop-blur-sm">
                    <Icon size={20} />
                  </span>
                </div>

                <div className="p-6 pt-5 sm:px-7">
                  <h3 className="text-lg font-bold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-subtle">
                    {feature.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Frame>
  );
}
