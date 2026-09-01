"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Info } from "lucide-react";
import { Logo } from "@/components/logo";
import { CtaButton } from "@/components/cta-button";
import { Progress } from "@/components/ui/progress";
import {
  budgetPresets,
  categories,
  onboardingSteps,
  radiusOptions,
} from "@/lib/app-data";
import { account } from "@/lib/data";
import { cn } from "@/lib/utils";

type Answers = {
  business: string;
  category: string;
  city: string;
  radius: number | null;
  budget: number | null;
  whatsapp: string;
};

const empty: Answers = {
  business: "",
  category: "",
  city: "",
  radius: null,
  budget: null,
  whatsapp: "",
};

const ready: Record<string, (a: Answers) => boolean> = {
  business: (a) => a.business.trim().length > 1 && a.category !== "",
  area: (a) => a.city.trim().length > 1 && a.radius !== null,
  budget: (a) => a.budget !== null,
  whatsapp: (a) => a.whatsapp.length === 10,
};

export function OnboardingWizard() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(empty);

  const step = onboardingSteps[index];
  const isLast = index === onboardingSteps.length - 1;
  const canContinue = ready[step.id](answers);

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
    setAnswers((current) => ({ ...current, [key]: value }));

  const back = () => setIndex((i) => Math.max(0, i - 1));

  const next = () => {
    if (!canContinue) return;
    /* Nothing is persisted — the last step just drops you into the app. */
    if (isLast) router.push("/dashboard");
    else setIndex((i) => i + 1);
  };

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

      <main className="relative z-1 mx-auto w-full max-w-xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {/* Re-keying on the step id restarts the entry animation each time. */}
        <div key={step.id} className="animate-slide-up">
          <p className="font-display text-xs font-bold tracking-[0.14em] text-brand uppercase">
            {step.eyebrow}
          </p>
          <h1 className="mt-3 text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] leading-tight">
            {step.title}
          </h1>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-subtle">
            {step.body}
          </p>

          <div className="mt-8">
            {step.id === "business" && (
              <>
                <Field label="Business name">
                  <TextInput
                    value={answers.business}
                    onChange={(v) => set("business", v)}
                    placeholder="e.g. Adyant Ayurveda"
                    autoComplete="organization"
                  />
                </Field>

                <Field label="Category" className="mt-7">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Chip
                        key={category}
                        selected={answers.category === category}
                        onClick={() => set("category", category)}
                      >
                        {category}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </>
            )}

            {step.id === "area" && (
              <>
                <Field label="City or locality">
                  <TextInput
                    value={answers.city}
                    onChange={(v) => set("city", v)}
                    placeholder="e.g. Indiranagar, Bengaluru"
                    autoComplete="address-level2"
                  />
                </Field>

                <Field label="Show ads within" className="mt-7">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {radiusOptions.map((option) => (
                      <OptionCard
                        key={option.km}
                        selected={answers.radius === option.km}
                        onClick={() => set("radius", option.km)}
                        title={option.label}
                        note={option.note}
                      />
                    ))}
                  </div>
                </Field>
              </>
            )}

            {step.id === "budget" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  {budgetPresets.map((preset) => (
                    <OptionCard
                      key={preset.amount}
                      selected={answers.budget === preset.amount}
                      onClick={() => set("budget", preset.amount)}
                      title={`${preset.label}/day`}
                      note={preset.note}
                    />
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
                  <Info
                    size={18}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-amber-400"
                  />
                  <p className="text-sm leading-relaxed text-subtle">
                    <strong className="text-ink">
                      This is not charged by us.
                    </strong>{" "}
                    Your ad spend goes straight to Meta from your own account,
                    and you can change or pause it any day.
                  </p>
                </div>
              </>
            )}

            {step.id === "whatsapp" && (
              <>
                <Field label="WhatsApp number for leads">
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/3 px-3 py-2 transition-all focus-within:border-brand focus-within:bg-white/6 focus-within:ring-[3px] focus-within:ring-brand/15 sm:px-4">
                    <span className="mr-3 shrink-0 border-r border-white/10 pr-3 font-semibold text-subtle sm:mr-4 sm:pr-4">
                      {account.countryCode} {account.dialCode}
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      aria-label="WhatsApp number"
                      value={answers.whatsapp}
                      onChange={(event) =>
                        set(
                          "whatsapp",
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="WhatsApp number"
                      className="w-full min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint"
                    />
                  </div>
                </Field>

                <Summary answers={answers} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Sticky so the action stays reachable on a phone without scrolling. */}
      <footer className="sticky bottom-0 z-1 border-t border-white/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-xl px-4 py-4 sm:px-6">
          <CtaButton onClick={next} disabled={!canContinue}>
            {isLast ? "Build my campaign" : "Continue"}
          </CtaButton>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-sm font-semibold text-ink">{label}</p>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      autoComplete={autoComplete}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-base text-ink transition-all outline-none placeholder:text-faint focus:border-brand focus:bg-white/6 focus:ring-[3px] focus:ring-brand/15"
    />
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        selected
          ? "border-brand bg-brand/15 text-ink"
          : "border-white/10 bg-white/3 text-subtle hover:border-white/20 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  note,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  note: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-brand bg-brand/[0.09]"
          : "border-white/10 bg-white/3 hover:border-white/20",
      )}
    >
      <span>
        <span className="block font-display text-base font-bold text-ink">
          {title}
        </span>
        <span className="mt-0.5 block text-xs text-faint">{note}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected ? "border-brand bg-brand text-white" : "border-white/20",
        )}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
    </button>
  );
}

/** What the AI is about to act on, so the last tap is not a leap of faith. */
function Summary({ answers }: { answers: Answers }) {
  const rows = [
    { label: "Business", value: answers.business },
    { label: "Category", value: answers.category },
    { label: "Area", value: `${answers.city} · ${answers.radius} km` },
    {
      label: "Daily budget",
      value: `₹${answers.budget?.toLocaleString("en-IN")}`,
    },
  ];

  return (
    <dl className="mt-8 divide-y divide-white/8 rounded-xl border border-white/10 bg-white/2 px-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-baseline justify-between gap-4 py-3"
        >
          <dt className="text-sm text-faint">{row.label}</dt>
          <dd className="text-right text-sm font-semibold text-ink">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
