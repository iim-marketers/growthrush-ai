import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  type LucideIcon,
  Lock,
  Phone,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { type Lead } from "@/components/app/lead-row";
import { LogoMark } from "@/components/logo";
import {
  LeadAvatar,
  StatusBadge,
  statusTones,
} from "@/components/app/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { leadStatuses } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export function DashboardHero({
  greeting,
  date,
  business,
  plan,
  children,
}: {
  greeting: string;
  date: string;
  business: string;
  plan: {
    name: string;
    renews: string;
    daysLeft: number;
    used: number;
  } | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-2xl bg-[#0b1220] px-5 py-6 text-white sm:px-8 sm:py-8">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_100%_0%,rgba(64,89,232,0.85)_0%,rgba(126,34,206,0.45)_38%,transparent_70%)]"
      />
      <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
      <LogoMark
        decorative
        className="absolute top-3 right-3 -z-10 size-28 -rotate-8 opacity-20 mask-[linear-gradient(to_bottom_left,black_30%,transparent_90%)] brightness-0 invert sm:top-1/2 sm:right-4 sm:size-40 sm:-translate-y-1/2"
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">
            {date}
          </p>
          <h1 className="mt-2 text-[clamp(1.6rem,1.3rem+1.4vw,2.4rem)] leading-tight text-balance">
            {greeting}, {business}
          </h1>
          <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-white/70 sm:text-[0.95rem]">
            {plan
              ? "Your ads are running. Here’s what they brought in."
              : "Everything is set up. Go live and your first leads start arriving here."}
          </p>
        </div>

        {plan ? (
          <div className="flex w-full shrink-0 flex-col gap-3 rounded-xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm sm:w-64">
            <div className="flex items-center gap-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-sm leading-tight font-semibold">
                {plan.name} · Live
              </span>
            </div>
            <div>
              <div
                aria-hidden
                className="h-1.5 w-full overflow-hidden rounded-full bg-white/15"
              >
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${plan.used}%` }}
                />
              </div>
              <p className="mt-1.5 flex justify-between text-xs text-white/60">
                <span>
                  {plan.daysLeft} {plan.daysLeft === 1 ? "day" : "days"} left
                </span>
                <span>Renews {plan.renews}</span>
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

/** Tiny server-rendered trend line for a KPI card. */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(1, ...values);
  const w = 100;
  const h = 32;
  const points = values.map((v, i) => [
    (i / (values.length - 1)) * w,
    h - 2 - (v / max) * (h - 4),
  ]);
  const line = points
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="h-8 w-full overflow-visible text-brand"
    >
      <polygon
        points={`0,${h} ${line} ${w},${h}`}
        className="fill-current opacity-10"
      />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const kpiTones = {
  brand: "bg-brand/10 text-brand",
  warn: "bg-warn/12 text-warn",
  success: "bg-success/12 text-success",
} as const;

/** `upIsGood` picks the colour: a falling cost per lead is good news. */
export function KpiCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone = "brand",
  delta,
  up = true,
  upIsGood = true,
  note,
  trend,
  href,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: LucideIcon;
  tone?: keyof typeof kpiTones;
  delta?: string;
  up?: boolean;
  upIsGood?: boolean;
  note?: React.ReactNode;
  trend?: number[];
  href?: string;
}) {
  const good = up === upIsGood;
  const Arrow = up ? TrendingUp : TrendingDown;

  const card = (
    <Card
      className={cn(
        "h-full gap-3 rounded-2xl py-4 transition-all sm:py-5",
        href && "group-hover:-translate-y-0.5 group-hover:shadow-md",
      )}
    >
      <CardHeader className="px-4 sm:px-5">
        <CardDescription className="font-medium">{label}</CardDescription>
        <CardAction>
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              kpiTones[tone],
            )}
          >
            <Icon aria-hidden className="size-4" />
          </span>
        </CardAction>
        <CardTitle className="font-display text-2xl font-extrabold text-ink tabular-nums sm:text-3xl">
          {value}
          {suffix && (
            <span className="ml-0.5 text-lg text-faint">{suffix}</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-3 px-4 sm:px-5">
        {trend && <Sparkline values={trend} />}
        {delta === undefined ? (
          <p className="flex items-center gap-1 text-xs text-faint">
            {note}
            {href && (
              <ArrowRight
                aria-hidden
                className="ml-auto size-3.5 text-brand transition-transform group-hover:translate-x-0.5"
              />
            )}
          </p>
        ) : (
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-faint">
            <Badge
              className={cn(
                "gap-1 font-semibold",
                good
                  ? "bg-success/12 text-success"
                  : "bg-danger/12 text-danger",
              )}
            >
              <Arrow aria-hidden />
              {delta}
            </Badge>
            vs last month
          </p>
        )}
      </CardContent>
    </Card>
  );

  return href ? (
    <Link
      href={href}
      className="group rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {card}
    </Link>
  ) : (
    card
  );
}

/** Stands in for the ad metrics until Meta reporting is connected. */
export function AdMetricsCard({
  metrics,
}: {
  metrics: { label: string; icon: LucideIcon }[];
}) {
  return (
    <Card className="h-full gap-3 rounded-2xl border-dashed bg-surface-subtle py-4 shadow-none sm:py-5">
      <CardHeader className="px-4 sm:px-5">
        <CardDescription className="font-medium">
          Ad performance
        </CardDescription>
        <CardAction>
          <span className="flex size-8 items-center justify-center rounded-lg bg-surface-mute text-faint">
            <Clock aria-hidden className="size-4" />
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-4 sm:px-5">
        {metrics.map(({ label, icon: Icon }) => (
          <p
            key={label}
            className="flex items-center gap-2 text-sm text-subtle"
          >
            <Icon aria-hidden className="size-3.5 text-faint" />
            {label}
            <span className="ml-auto font-display font-bold text-faint">—</span>
          </p>
        ))}
        <p className="mt-1 text-xs text-faint">Shows once your ads are live</p>
      </CardContent>
    </Card>
  );
}

export function LaunchSteps({
  steps,
}: {
  steps: { title: string; detail: string; done: boolean }[];
}) {
  const current = steps.findIndex((step) => !step.done);
  const doneCount = steps.filter((step) => step.done).length;

  return (
    <Card className="gap-4 rounded-2xl py-5">
      <CardHeader className="px-5">
        <CardTitle className="font-display text-base font-bold text-ink">
          Getting you live
        </CardTitle>
        <CardDescription>
          {doneCount} of {steps.length} steps done
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, i) => {
            const isCurrent = i === current;
            return (
              <li
                key={step.title}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "relative flex gap-3 rounded-xl border p-3",
                  step.done && "border-hairline bg-surface-subtle",
                  isCurrent &&
                    "border-brand/40 bg-brand/5 ring-1 ring-brand/20",
                  !step.done && !isCurrent && "border-dashed border-hairline",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold",
                    step.done && "bg-success text-white",
                    isCurrent && "bg-brand text-white",
                    !step.done && !isCurrent && "bg-surface-mute text-faint",
                  )}
                >
                  {step.done ? (
                    <Check aria-hidden className="size-3.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      step.done || isCurrent ? "text-ink" : "text-subtle",
                    )}
                  >
                    {step.title}
                    {step.done && <span className="sr-only"> (done)</span>}
                  </span>
                  <span className="mt-0.5 block text-xs leading-snug text-faint">
                    {step.detail}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}

export function LeadPipeline({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const counts = leadStatuses.map((status) => ({
    ...status,
    count: leads.filter((lead) => lead.status === status.id).length,
  }));
  const max = Math.max(1, ...counts.map((s) => s.count));

  return (
    <Card className="gap-4 rounded-2xl py-5">
      <CardHeader className="px-5">
        <CardTitle className="font-display text-base font-bold text-ink">
          Lead pipeline
        </CardTitle>
        <CardDescription>
          Where your {total.toLocaleString("en-IN")}{" "}
          {total === 1 ? "enquiry" : "enquiries"} stand
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-center gap-4 px-5">
        {counts.map((status) => {
          const share =
            total > 0 ? Math.round((status.count / total) * 100) : 0;
          return (
            <div key={status.id}>
              <p className="mb-1.5 flex items-baseline gap-2 text-sm">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full",
                    statusTones[status.tone].dot,
                  )}
                />
                <span className="text-subtle">{status.label}</span>
                <span className="ml-auto font-semibold text-ink tabular-nums">
                  {status.count.toLocaleString("en-IN")}
                </span>
                <span className="w-9 text-right text-xs text-faint tabular-nums">
                  {share}%
                </span>
              </p>
              <div
                aria-hidden
                className="h-2 w-full overflow-hidden rounded-full bg-surface-mute"
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-700",
                    statusTones[status.tone].dot,
                  )}
                  style={{ width: `${(status.count / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="border-hairline bg-surface-subtle px-5 py-3!">
        <Link
          href="/leads"
          className="flex w-full items-center justify-between text-sm font-semibold text-brand hover:text-brand-soft"
        >
          Work through your leads
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export function RecentLeads({ leads }: { leads: Lead[] }) {
  return (
    <Card className="h-full gap-0 rounded-2xl py-0">
      <CardHeader className="border-b border-hairline px-5 py-4!">
        <CardTitle className="font-display text-base font-bold text-ink">
          Latest leads
        </CardTitle>
        {/* <CardDescription>The newest enquiries from your ads</CardDescription> */}
        <CardAction>
          <Button asChild variant="ghost" size="sm" className="text-brand">
            <Link href="/leads">
              See all
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      {leads.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Lead</TableHead>
              <TableHead className="hidden md:table-cell">Enquiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right">
                <span className="sr-only">Call</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="py-3 pl-5">
                  <div className="flex items-center gap-3">
                    <LeadAvatar name={lead.name} className="size-8 text-xs" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">
                        {lead.name}
                      </span>
                      <span className="block truncate text-xs text-faint">
                        {lead.receivedAt} · {lead.source}
                      </span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden max-w-72 md:table-cell">
                  <span className="block truncate text-subtle">
                    {lead.enquiry}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="pr-5 text-right">
                  <Button
                    asChild
                    variant="outline"
                    size="icon-sm"
                    className="rounded-lg text-subtle hover:text-brand"
                  >
                    <a
                      href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                      aria-label={`Call ${lead.name}`}
                    >
                      <Phone />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <NoLeadsYet />
      )}
    </Card>
  );
}

export function NoLeadsYet({ className }: { className?: string }) {
  return (
    <Empty className={cn("py-12", className)}>
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="size-11 rounded-xl bg-brand/10 text-brand"
        >
          <TrendingUp className="size-5" />
        </EmptyMedia>
        <EmptyTitle className="font-display text-base font-bold text-ink">
          No leads yet
        </EmptyTitle>
        <EmptyDescription>
          They&rsquo;ll appear here as soon as your ads bring them in.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function SetupCard({
  rows,
}: {
  rows: { label: string; value?: string | null; icon: LucideIcon }[];
}) {
  return (
    <Card className="gap-2 rounded-2xl py-4">
      <CardHeader className="px-5">
        <CardTitle className="font-display text-base font-bold text-ink">
          Your setup
        </CardTitle>
        <CardDescription>What your campaign is built on</CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <ItemGroup>
          {rows.map(({ label, value, icon: Icon }) => (
            <Item key={label} size="sm" className="px-2 py-2">
              <ItemMedia
                variant="icon"
                className="size-8 rounded-lg bg-surface-hover text-subtle"
              >
                <Icon />
              </ItemMedia>
              <ItemContent className="min-w-0 gap-0">
                <ItemDescription className="text-xs">{label}</ItemDescription>
                <ItemTitle className="w-full truncate font-semibold text-ink">
                  {value || "—"}
                </ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
