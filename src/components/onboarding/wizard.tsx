"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { CtaButton } from "@/components/cta-button";
import { Progress } from "@/components/ui/progress";
import {
  businessStep,
  locationStep,
  onboardingSteps,
  type StepId,
} from "@/lib/app-data";
import { plans } from "@/lib/landing-data";
import {
  AdStep,
  AudienceStep,
  BusinessStep,
  ConfirmStep,
  GoalStep,
  LocationStep,
  PlanStep,
  ReadinessStep,
} from "./steps";

export type Answers = {
  business: string;
  category: string;
  city: string;
  listing: string;
  goal: string;
  budget: string;
  plan: string;
};

/**
 * The two text fields arrive filled in, the way the reference flow does it:
 * the lookup has already "found" the business, so the customer is confirming
 * rather than typing. Everything else starts unanswered.
 */
const initial: Answers = {
  business: businessStep.prefill,
  category: "",
  city: locationStep.prefill,
  listing: "",
  goal: "",
  budget: "",
  plan: plans[0].id,
};

/**
 * Whether a step has enough to move on, keyed by step id so the rule sits
 * beside the step it guards. The four playback steps have nothing to answer,
 * so they are absent and default to ready.
 */
const ready: Partial<Record<StepId, (a: Answers) => boolean>> = {
  business: (a) => a.business.trim().length > 1 && a.category !== "",
  location: (a) => a.city.trim().length > 1,
  confirm: (a) => a.listing !== "",
  goal: (a) => a.goal !== "" && a.budget !== "",
  plan: (a) => a.plan !== "",
};

export function OnboardingWizard() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initial);

  const step = onboardingSteps[index];
  const isLast = index === onboardingSteps.length - 1;
  const canContinue = ready[step.id]?.(answers) ?? true;

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((current) => ({ ...current, [key]: value }));

  const back = () => setIndex((i) => Math.max(0, i - 1));

  const next = () => {
    if (!canContinue) return;
    /* Nothing is persisted — the last step just drops you into the app. */
    if (isLast) router.push("/dashboard");
    else setIndex((i) => i + 1);
  };

  const props = { answers, set };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="glow top-[-20%] left-1/2 -translate-x-1/2"
          style={{
            background:
              "radial-gradient(circle, rgba(91,127,255,0.14) 0%, transparent 70%)",
          }}
        />
      </div>

      <header className="relative z-1 border-b border-white/10">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {index === 0 ? (
            <Link
              href="/login"
              aria-label="Back to sign in"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-white/6 hover:text-ink"
            >
              <ArrowLeft size={18} aria-hidden />
            </Link>
          ) : (
            <button
              type="button"
              onClick={back}
              aria-label="Previous step"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-white/6 hover:text-ink"
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
          )}
          <Logo size="sm" />
          <span className="w-9 text-right text-xs font-semibold text-faint">
            {index + 1}/{onboardingSteps.length}
          </span>
        </div>
        <Progress
          value={((index + 1) / onboardingSteps.length) * 100}
          aria-label="Setup progress"
          className="rounded-none bg-white/6"
        />
      </header>

      <main className="relative z-1 mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Re-keying on the step id restarts the entry animation each time. */}
        <div key={step.id} className="animate-slide-up">
          <p className="font-display text-xs font-bold tracking-[0.14em] text-brand uppercase">
            {step.eyebrow}
          </p>

          <h1 className="mt-3 text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] leading-tight">
            {step.title}
            {step.accent && (
              <>
                {" "}
                <span className="text-brand">{step.accent}</span>
              </>
            )}
            {step.tail && ` ${step.tail}`}
          </h1>

          {step.body && (
            <p className="mt-3 text-[0.95rem] leading-relaxed text-subtle">
              {step.body}
            </p>
          )}

          <div className="mt-8">
            {step.id === "business" && <BusinessStep {...props} />}
            {step.id === "location" && <LocationStep {...props} />}
            {step.id === "confirm" && <ConfirmStep {...props} />}
            {step.id === "goal" && <GoalStep {...props} />}
            {step.id === "audience" && <AudienceStep />}
            {step.id === "readiness" && <ReadinessStep />}
            {step.id === "ad" && <AdStep />}
            {step.id === "plan" && <PlanStep {...props} />}
          </div>
        </div>
      </main>

      {/* Sticky so the action stays reachable on a phone without scrolling. */}
      <footer className="sticky bottom-0 z-1 border-t border-white/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-xl px-4 py-4 sm:px-6">
          <CtaButton onClick={next} disabled={!canContinue}>
            {isLast ? `${step.cta} with ${planName(answers.plan)}` : step.cta}
          </CtaButton>
        </div>
      </footer>
    </div>
  );
}

function planName(id: string) {
  return plans.find((plan) => plan.id === id)?.name ?? plans[0].name;
}
