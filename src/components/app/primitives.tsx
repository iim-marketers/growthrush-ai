import { TrendingDown, TrendingUp } from "lucide-react";
import { leadStatuses, type LeadStatus } from "@/lib/app-data";
import { cn } from "@/lib/utils";

/** Title block at the top of every signed-in screen. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
      <div>
        <h1 className="text-[clamp(1.5rem,1.3rem+1vw,2rem)] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-subtle sm:text-[0.95rem]">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/**
 * A headline number, not a one-bar chart. `up` is the direction of the delta
 * and `upIsGood` says how to read it — a falling cost per lead is good news,
 * so direction alone cannot pick the colour. The arrow carries the direction
 * too, so it never rests on colour alone.
 */
export function StatTile({
  label,
  value,
  delta,
  up,
  upIsGood,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  upIsGood: boolean;
}) {
  const good = up === upIsGood;
  const Arrow = up ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-sm">
      <p className="text-sm text-faint">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-ink">
        {value}
      </p>
      <p
        className={cn(
          "mt-2 flex items-center gap-1.5 text-sm font-semibold",
          good ? "text-success" : "text-danger",
        )}
      >
        <Arrow size={15} aria-hidden />
        {delta}
        <span className="font-normal text-faint">vs last month</span>
      </p>
    </div>
  );
}

/* Status is reserved colour — never reused for a series — and always paired
   with its label, so it is legible without colour vision. */
const tones = {
  brand: "bg-brand/15 text-brand",
  amber: "bg-amber-400/15 text-amber-400",
  success: "bg-success/15 text-success",
  muted: "bg-white/8 text-faint",
} as const;

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = leadStatuses.find((s) => s.id === status) ?? leadStatuses[0];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        tones[meta.tone],
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

/** A titled panel — the unit the dashboard and billing screens are built from. */
export function Panel({
  title,
  action,
  className,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4">
        <h2 className="font-display text-base font-bold text-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
