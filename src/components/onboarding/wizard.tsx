"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { CtaButton } from "@/components/cta-button";
import { Progress } from "@/components/ui/progress";
import { signOut } from "@/app/login/actions";
import { saveOnboarding } from "@/app/onboarding/actions";
import { onboardingSteps, type StepId } from "@/lib/app-data";
import { plans } from "@/lib/landing-data";
import { personalise, type Answers } from "@/lib/onboarding";
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

export function OnboardingWizard({
  saved,
  onboarded,
}: {
  /** Answers already on record — empty for a first visit. */
  saved: Answers;
  /** Back from the app to edit their setup, rather than setting up. */
  onboarded: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(saved);
  const [error, setError] = useState<string | null>(null);
  const [finishing, startFinish] = useTransition();

  const step = onboardingSteps[index];
  const isLast = index === onboardingSteps.length - 1;
  const canContinue = (ready[step.id]?.(answers) ?? true) && !finishing;

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((current) => ({ ...current, [key]: value }));

  const back = () => setIndex((i) => Math.max(0, i - 1));

  const next = () => {
    if (!canContinue) return;
    setError(null);

    if (isLast) {
      /* On success the action redirects into the app. */
      startFinish(async () => {
        const result = await saveOnboarding(answers, true);
        if (result?.error) setError(result.error);
      });
      return;
    }

    /* Save as they go, without holding up the next step: a customer who
       drops off halfway is still worth knowing about. */
    void saveOnboarding(answers, false).catch(() => {});
    setIndex((i) => i + 1);
  };

  const props = { answers, set };

  return (
    <div
      data-fixed-frame
      className="theme-light relative flex h-dvh flex-col bg-background"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow glow-brand top-[-20%] left-1/2 -translate-x-1/2" />
      </div>

      <header className="relative z-1 shrink-0 border-b border-hairline">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          {index === 0 && onboarded ? (
            <Link
              href="/dashboard"
              aria-label="Back to dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <ArrowLeft size={18} aria-hidden />
            </Link>
          ) : index === 0 ? (
            /* Nowhere to go back to yet, so the way out is signing out. */
            <form action={signOut}>
              <button
                type="submit"
                aria-label="Sign out"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-hover hover:text-ink"
              >
                <LogOut size={18} aria-hidden />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={back}
              aria-label="Previous step"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-hover hover:text-ink"
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
          )}
          <Logo size="sm" tone="dark" />
          <span className="w-9 text-right text-xs font-semibold text-faint">
            {index + 1}/{onboardingSteps.length}
          </span>
        </div>
        <Progress
          value={((index + 1) / onboardingSteps.length) * 100}
          aria-label="Setup progress"
          className="rounded-none bg-surface-hover"
        />
      </header>

      {/* Only this middle part scrolls; the header and the action stay put.
          Re-keying on the step id starts each step at the top and restarts
          its entry animation. */}
      <main
        key={step.id}
        className="relative z-1 min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="animate-slide-up mx-auto w-full max-w-xl px-4 py-8 sm:px-6 sm:py-10">
          <p className="font-display text-xs font-bold tracking-[0.14em] text-brand uppercase">
            {personalise(step.eyebrow, answers)}
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
              {personalise(step.body, answers)}
            </p>
          )}

          <div className="mt-8">
            {step.id === "business" && <BusinessStep {...props} />}
            {step.id === "location" && <LocationStep {...props} />}
            {step.id === "confirm" && <ConfirmStep {...props} />}
            {step.id === "goal" && <GoalStep {...props} />}
            {step.id === "audience" && <AudienceStep />}
            {step.id === "readiness" && <ReadinessStep />}
            {step.id === "ad" && <AdStep answers={answers} />}
            {step.id === "plan" && <PlanStep {...props} />}
          </div>
        </div>
      </main>

      <footer className="relative z-1 shrink-0 border-t border-hairline bg-background/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-xl px-4 py-4 sm:px-6">
          {error && (
            <p
              role="alert"
              className="mb-3 text-center text-[0.85rem] font-semibold text-danger"
            >
              {error}
            </p>
          )}
          <CtaButton onClick={next} disabled={!canContinue}>
            {finishing
              ? "Saving…"
              : isLast
                ? `${step.cta} with ${planName(answers.plan)}`
                : step.cta}
          </CtaButton>
        </div>
      </footer>
    </div>
  );
}

function planName(id: string) {
  return plans.find((plan) => plan.id === id)?.name ?? plans[0].name;
}
