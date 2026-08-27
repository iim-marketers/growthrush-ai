"use client";

import Link from "next/link";
import { Check, Info } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "./motion-primitives";
import { SectionLabel } from "./how-it-works";
import { plans } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>Pricing</SectionLabel>
          <h2 className="mt-4 text-[clamp(1.75rem,1.2rem+2.2vw,2.75rem)] leading-tight">
            Plans that pay for themselves
          </h2>
          <p className="mt-4 text-base text-subtle sm:text-lg">
            Both run your Instagram &amp; Facebook ads. Cancel anytime.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <StaggerItem key={plan.id}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7 backdrop-blur-sm sm:p-8",
                  plan.highlighted
                    ? "border-brand bg-brand/[0.07] shadow-[0_0_60px_-20px_rgba(91,127,255,0.5)]"
                    : "border-white/10 bg-card/60",
                )}
              >
                <span
                  className={cn(
                    "absolute -top-3 right-7 rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wide text-white uppercase",
                    plan.highlighted ? "bg-success" : "bg-orange",
                  )}
                >
                  {plan.badge}
                </span>

                <h3 className="font-display text-xl font-extrabold text-ink">
                  {plan.name}
                </h3>
                <p className="mt-1.5 text-sm text-subtle">{plan.desc}</p>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-sm text-faint line-through">
                    {plan.oldPrice}
                  </span>
                  <span className="font-display text-4xl font-extrabold text-ink">
                    {plan.price}
                  </span>
                  <span className="text-sm text-subtle">/mo</span>
                </div>

                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-subtle"
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          plan.highlighted
                            ? "bg-brand/20 text-brand"
                            : "bg-white/10 text-subtle",
                        )}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={cn(
                    "mt-8 inline-flex w-full items-center justify-center rounded-xl px-6 py-3.5 font-display font-bold transition-transform hover:-translate-y-0.5",
                    plan.highlighted
                      ? "btn-glow bg-brand text-white"
                      : "border border-white/15 bg-white/5 text-ink hover:bg-white/10",
                  )}
                >
                  Get Started
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4 sm:p-5">
            <Info size={18} className="mt-0.5 shrink-0 text-amber-400" />
            <p className="text-sm leading-relaxed text-subtle">
              <strong className="text-ink">Your ad budget is separate</strong>{" "}
              and stays in your own account — set it from ₹300/day and change it
              anytime. The plan fee covers creatives, targeting and management.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
