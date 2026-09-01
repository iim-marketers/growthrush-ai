"use client";

import {
  Check,
  ClipboardList,
  Home,
  Info,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Shield,
  Sparkles,
  Store,
  Star,
} from "lucide-react";
import {
  adPreview,
  audience,
  businessStep,
  categories,
  googleListings,
  goals,
  locationStep,
  monthlyBudgets,
  notListed,
  planStep,
  readiness,
} from "@/lib/app-data";
import { plans } from "@/lib/landing-data";
import { cn } from "@/lib/utils";
import { Chip, Field, TextInput } from "./controls";
import type { Answers } from "./wizard";

type StepProps = {
  answers: Answers;
  set: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
};

/* ---------------------------------------------------------------- *
 * 1 · About your business
 * ---------------------------------------------------------------- */

export function BusinessStep({ answers, set }: StepProps) {
  return (
    <>
      <TextInput
        icon={<Home size={18} aria-hidden />}
        value={answers.business}
        onChange={(v) => set("business", v)}
        placeholder={businessStep.placeholder}
      />

      <Field label={businessStep.categoryLabel} className="mt-7">
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
  );
}

/* ---------------------------------------------------------------- *
 * 2 · Your location
 * ---------------------------------------------------------------- */

export function LocationStep({ answers, set }: StepProps) {
  return (
    <>
      <TextInput
        icon={<MapPin size={18} aria-hidden />}
        value={answers.city}
        onChange={(v) => set("city", v)}
        placeholder={locationStep.placeholder}
      />

      <div className="mt-6 rounded-xl border border-white/10 bg-white/3 p-4 sm:p-5">
        <p className="text-sm font-bold text-ink">{locationStep.noteTitle}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-subtle">
          {locationStep.noteBody}
        </p>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- *
 * 3 · Confirm your business
 * ---------------------------------------------------------------- */

export function ConfirmStep({ answers, set }: StepProps) {
  return (
    <div className="flex flex-col gap-3">
      {googleListings.map((listing) => (
        <ListingCard
          key={listing.id}
          selected={answers.listing === listing.id}
          onClick={() => set("listing", listing.id)}
        >
          <span className="block text-sm font-bold text-ink">
            {listing.name}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-faint">
            {listing.address}
          </span>
          <Rating rating={listing.rating} reviews={listing.reviews} />
        </ListingCard>
      ))}

      <ListingCard
        selected={answers.listing === notListed.id}
        onClick={() => set("listing", notListed.id)}
      >
        <span className="block text-sm font-bold text-ink">
          {notListed.name}
        </span>
        <span className="mt-1 block text-xs text-faint">{notListed.note}</span>
      </ListingCard>
    </div>
  );
}

function ListingCard({
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
        "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
        selected
          ? "border-brand bg-brand/[0.09]"
          : "border-white/10 bg-white/3 hover:border-white/20",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected ? "border-brand bg-brand text-white" : "border-white/20",
        )}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

function Rating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="mt-2 flex items-center gap-1.5">
      <span aria-hidden className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            size={11}
            className={
              i < Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "text-white/20"
            }
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-ink">{rating}</span>
      <span className="text-xs text-faint">({reviews})</span>
    </span>
  );
}

/* ---------------------------------------------------------------- *
 * 4 · Your goal
 * ---------------------------------------------------------------- */

const goalIcons = {
  message: MessageCircle,
  phone: Phone,
  form: ClipboardList,
  store: Store,
} as const;

export function GoalStep({ answers, set }: StepProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        {goals.map((goal) => {
          const Icon = goalIcons[goal.icon];
          const selected = answers.goal === goal.id;
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => set("goal", goal.id)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col items-start rounded-xl border p-4 text-left transition-colors",
                selected
                  ? "border-brand bg-brand/[0.09]"
                  : "border-white/10 bg-white/3 hover:border-white/20",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                  selected ? "bg-brand/20 text-brand" : "bg-white/6 text-subtle",
                )}
              >
                <Icon size={18} />
              </span>
              <span className="mt-3 block text-sm font-bold text-ink">
                {goal.title}
              </span>
              <span className="mt-0.5 block text-xs text-faint">
                {goal.desc}
              </span>
            </button>
          );
        })}
      </div>

      <Field label="Monthly ad budget" className="mt-7">
        <div className="flex flex-wrap gap-2">
          {monthlyBudgets.map((band) => (
            <Chip
              key={band.id}
              selected={answers.budget === band.id}
              onClick={() => set("budget", band.id)}
            >
              {band.label}
            </Chip>
          ))}
        </div>
      </Field>
    </>
  );
}

/* ---------------------------------------------------------------- *
 * 5 · Live audience
 * ---------------------------------------------------------------- */

export function AudienceStep() {
  /* Bars are scaled against the largest share, so length encodes the number
     rather than being picked to look tidy. */
  const widest = Math.max(...audience.breakdown.map((row) => row.pct));

  return (
    <>
      <div className="rounded-2xl border border-brand/30 bg-brand/[0.08] p-6 text-center">
        <p className="text-sm text-subtle">{audience.caption}</p>
        <p className="mt-3 font-display text-[clamp(2.5rem,2rem+3vw,3.5rem)] leading-none font-extrabold text-ink">
          {audience.reach}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-subtle">
          interested in <strong className="text-ink">{audience.interest}</strong>{" "}
          on Instagram &amp; Facebook
        </p>
        <div className="mt-5 flex justify-center gap-2">
          {audience.networks.map((network) => (
            <span
              key={network}
              className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-subtle"
            >
              {network}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6">
        <p className="text-sm font-bold text-ink">Who&rsquo;s searching near you</p>
        <dl className="mt-4 flex flex-col gap-3.5">
          {audience.breakdown.map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <dt className="w-24 shrink-0 text-xs text-subtle">{row.label}</dt>
              <dd className="flex flex-1 items-center gap-3">
                <span
                  aria-hidden
                  className="h-2 flex-1 overflow-hidden rounded-full bg-brand/15"
                >
                  <span
                    className="block h-full rounded-full bg-brand"
                    style={{ width: `${(row.pct / widest) * 100}%` }}
                  />
                </span>
                <span className="w-9 shrink-0 text-right text-xs font-bold tabular-nums text-ink">
                  {row.pct}%
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- *
 * 6 · Lead readiness
 * ---------------------------------------------------------------- */

export function ReadinessStep() {
  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 text-center">
        <p className="text-sm leading-relaxed text-subtle">
          {readiness.benchmark}
        </p>

        <Gauge score={readiness.score} grade={readiness.grade} />

        <p className="mt-4 text-sm text-subtle">
          Your Lead Score is{" "}
          <strong className="text-danger">{readiness.grade}</strong>
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-3 text-sm font-semibold text-ink">
          Your growth potential
        </p>
        <div className="flex items-stretch gap-3">
          <GrowthCard
            label={readiness.today.label}
            value={readiness.today.value}
            unit={readiness.unit}
          />
          <span className="flex shrink-0 items-center text-xs font-bold text-faint">
            vs
          </span>
          <GrowthCard
            label={readiness.withAi.label}
            value={readiness.withAi.value}
            unit={readiness.unit}
            good
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-faint">
          Based on {readiness.source}.
        </p>
      </div>
    </>
  );
}

/**
 * A meter, not a chart: one ratio against a limit, so it gets a gauge rather
 * than a one-bar chart. The arc is a full circle masked into a ring and
 * clipped to its top half; the value is written in the opening so the reading
 * never depends on judging an angle.
 */
function Gauge({ score, grade }: { score: number; grade: string }) {
  const ring = "radial-gradient(circle at center, transparent 58%, black 59%)";
  /* The visible half-ring spans 180°, starting at 9 o'clock. */
  const sweep = (score / 100) * 180;

  return (
    <div
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Lead readiness score"
      className="mx-auto mt-6 w-64"
    >
      <div className="relative mx-auto h-32 w-64 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-64 w-64"
          style={{ maskImage: ring, WebkitMaskImage: ring }}
        >
          {/* Track, then the filled portion on top of it. */}
          <div className="absolute inset-0 rounded-full bg-white/8" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 270deg, var(--danger) 0deg, var(--danger) ${sweep}deg, transparent ${sweep}deg)`,
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="font-display text-4xl font-extrabold text-ink">
            {score}%
          </p>
          <p className="mt-0.5 text-xs font-bold text-danger">{grade}</p>
        </div>
      </div>

      {/* The scale, below the arc rather than on top of it. */}
      <div className="mt-1 flex justify-between px-2 text-xs font-bold">
        <span className="text-danger">0</span>
        <span className="text-success">100</span>
      </div>
    </div>
  );
}

function GrowthCard({
  label,
  value,
  unit,
  good = false,
}: {
  label: string;
  value: string;
  unit: string;
  good?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl border p-4 text-center",
        good ? "border-success/35 bg-success/[0.08]" : "border-white/10 bg-white/3",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold",
          good ? "bg-success/15 text-success" : "bg-white/8 text-faint",
        )}
      >
        {good ? "✓" : "✕"} {label}
      </span>
      <p
        className={cn(
          "mt-3 font-display text-3xl font-extrabold",
          good ? "text-success" : "text-subtle",
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-faint">{unit}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * 7 · The generated ad
 * ---------------------------------------------------------------- */

export function AdStep() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60">
      <div className="flex items-center gap-3 px-4 py-3">
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 font-display font-extrabold text-brand"
        >
          {adPreview.author.charAt(0)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-bold text-ink">
            {adPreview.author}
          </span>
          <span className="block text-xs text-faint">{adPreview.meta}</span>
        </span>
        <MoreHorizontal size={18} aria-hidden className="shrink-0 text-faint" />
      </div>

      {/* The creative itself. */}
      <div className="relative overflow-hidden bg-linear-to-br from-brand to-grape px-6 py-12 text-center">
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[0.65rem] font-bold text-white backdrop-blur-sm">
          <Sparkles size={11} aria-hidden />
          AI-generated
        </span>
        <div
          aria-hidden
          className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/8"
        />
        <p className="relative font-display text-[0.65rem] font-bold tracking-[0.16em] text-white/80 uppercase">
          {adPreview.eyebrow}
        </p>
        <p className="relative mt-3 font-display text-xl leading-snug font-extrabold text-white">
          {adPreview.headline}
        </p>
        <span className="relative mt-5 inline-block rounded-lg bg-white px-4 py-2 text-sm font-bold text-[#111827]">
          {adPreview.cta} ›
        </span>
      </div>

      <div className="px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-success/12 py-3 text-sm font-bold text-success transition-colors hover:bg-success/20"
        >
          <MessageCircle size={16} aria-hidden />
          {adPreview.leadCta}
        </button>
        <p className="mt-3 text-center text-xs text-faint">
          {adPreview.footer}
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * 8 · Pick your plan
 * ---------------------------------------------------------------- */

export function PlanStep({ answers, set }: StepProps) {
  return (
    <>
      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            selected={answers.plan === plan.id}
            onSelect={() => set("plan", plan.id)}
          />
        ))}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
        <Info size={18} aria-hidden className="mt-0.5 shrink-0 text-amber-400" />
        <p className="text-sm leading-relaxed text-subtle">
          <strong className="text-ink">{planStep.budgetNote.strong}</strong>{" "}
          {planStep.budgetNote.body}
        </p>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/4 px-4 py-3.5 text-sm text-subtle">
        <Shield size={15} aria-hidden className="shrink-0 text-brand" />
        <strong className="text-success">{planStep.guarantee}</strong>·{" "}
        {planStep.guaranteeNote}
      </p>
    </>
  );
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: (typeof plans)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  /* Both plans are discounted by the same share; read it off the two prices
     rather than storing a third number that could fall out of step. */
  const toNumber = (price: string) => Number(price.replace(/[^\d]/g, ""));
  const off = Math.round(
    (1 - toNumber(plan.price) / toNumber(plan.oldPrice)) * 100,
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col rounded-2xl border p-5 text-left transition-colors sm:p-6",
        selected
          ? "border-brand bg-brand/[0.09]"
          : "border-white/10 bg-white/3 hover:border-white/20",
      )}
    >
      <span
        className={cn(
          "absolute -top-2.5 left-5 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold tracking-wide text-white uppercase",
          plan.highlighted ? "bg-success" : "bg-orange",
        )}
      >
        {plan.highlighted ? "Recommended for you" : plan.badge}
      </span>

      <span className="flex items-start justify-between gap-4">
        <span className="min-w-0">
          <span className="block font-display text-lg font-extrabold text-ink">
            {plan.name}
          </span>
          <span className="mt-0.5 block text-sm text-subtle">{plan.desc}</span>
        </span>
        <span
          aria-hidden
          className={cn(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected ? "border-brand bg-brand text-white" : "border-white/20",
          )}
        >
          {selected && <Check size={12} strokeWidth={3} />}
        </span>
      </span>

      <span className="mt-4 flex items-baseline gap-2">
        <span className="text-sm text-faint line-through">{plan.oldPrice}</span>
        <span className="font-display text-3xl font-extrabold text-ink">
          {plan.price}
        </span>
        <span className="text-sm text-subtle">/mo</span>
        <span className="ml-auto rounded-full bg-success/15 px-2 py-0.5 text-xs font-bold text-success">
          −{off}%
        </span>
      </span>

      <span className="mt-5 flex flex-col gap-2.5 border-t border-white/8 pt-5">
        {plan.features.map((feature) => (
          <span key={feature} className="flex items-start gap-2.5 text-sm text-subtle">
            <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
              <Check size={11} strokeWidth={3} aria-hidden />
            </span>
            {feature}
          </span>
        ))}
      </span>
    </button>
  );
}
