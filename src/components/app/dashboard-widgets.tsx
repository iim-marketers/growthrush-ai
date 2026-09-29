import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  type LucideIcon,
  Lock,
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
  plan: { name: string; renews: string } | null;
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
          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/15 bg-white/8 px-4 py-3 backdrop-blur-sm">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">{plan.name}</span>
              <span className="block text-xs text-white/60">
                Renews {plan.renews}
              </span>
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

/** `upIsGood` picks the colour: a falling cost per lead is good news. */
export function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  up = true,
  upIsGood = true,
  note,
  pending = false,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: string;
  up?: boolean;
  upIsGood?: boolean;
  note?: string;
  pending?: boolean;
}) {
  const good = up === upIsGood;
  const Arrow = up ? TrendingUp : TrendingDown;

  return (
    <Card
      className={cn(
        "gap-3 rounded-2xl py-4 transition-shadow hover:shadow-md sm:py-5",
        pending && "bg-surface-subtle shadow-none hover:shadow-none",
      )}
    >
      <CardHeader className="px-4 sm:px-5">
        <CardDescription className="font-medium">{label}</CardDescription>
        <CardAction>
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              pending ? "bg-surface-mute text-faint" : "bg-brand/10 text-brand",
            )}
          >
            <Icon aria-hidden className="size-4" />
          </span>
        </CardAction>
        <CardTitle
          className={cn(
            "font-display text-2xl font-extrabold tabular-nums sm:text-3xl",
            pending ? "text-faint" : "text-ink",
          )}
        >
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-5">
        {delta === undefined ? (
          <p className="flex items-center gap-1.5 text-xs text-faint">
            {pending && <Clock aria-hidden className="size-3.5" />}
            {note}
          </p>
        ) : (
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-faint">
            <Badge
              className={cn(
                "gap-1 font-semibold",
                good ? "bg-success/12 text-success" : "bg-danger/12 text-danger",
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
}

export function LeadPipeline({ leads }: { leads: Lead[] }) {
  const total = leads.length;
  const counts = leadStatuses.map((status) => ({
    ...status,
    count: leads.filter((lead) => lead.status === status.id).length,
  }));
  const converted = counts.find((s) => s.id === "converted")?.count ?? 0;
  const rate = total > 0 ? Math.round((converted / total) * 100) : 0;

  return (
    <Card className="gap-4 rounded-2xl py-5">
      <CardHeader className="px-5">
        <CardTitle className="font-display text-base font-bold text-ink">
          Lead pipeline
        </CardTitle>
        <CardDescription>Where every enquiry stands</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5 px-5">
        <div>
          <p className="font-display text-4xl font-extrabold text-ink tabular-nums">
            {rate}
            <span className="text-2xl text-faint">%</span>
          </p>
          <p className="mt-1 text-xs text-faint">
            of {total.toLocaleString("en-IN")} leads converted
          </p>
        </div>

        <div
          aria-hidden
          className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-surface-mute"
        >
          {total > 0 &&
            counts.map(
              (status) =>
                status.count > 0 && (
                  <span
                    key={status.id}
                    className={cn("h-full", statusTones[status.tone].dot)}
                    style={{ width: `${(status.count / total) * 100}%` }}
                  />
                ),
            )}
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
          {counts.map((status) => (
            <li key={status.id} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden
                className={cn("size-2 rounded-full", statusTones[status.tone].dot)}
              />
              <span className="text-subtle">{status.label}</span>
              <span className="ml-auto font-semibold text-ink tabular-nums">
                {status.count}
              </span>
            </li>
          ))}
        </ul>
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
    <Card className="gap-0 rounded-2xl py-0">
      <CardHeader className="border-b border-hairline px-5 py-4!">
        <CardTitle className="font-display text-base font-bold text-ink">
          Latest leads
        </CardTitle>
        <CardDescription>The newest enquiries from your ads</CardDescription>
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
              <TableHead className="hidden pr-5 text-right sm:table-cell">
                Received
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
                        {lead.source}
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
                <TableCell className="hidden pr-5 text-right text-xs text-faint sm:table-cell">
                  {lead.receivedAt}
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
    <Card className="gap-2 rounded-2xl py-5">
      <CardHeader className="px-5">
        <CardTitle className="font-display text-base font-bold text-ink">
          Your setup
        </CardTitle>
        <CardDescription>What your campaign is built on</CardDescription>
        <CardAction>
          <Badge
            variant="outline"
            className="h-6 gap-1 px-2 font-medium text-faint"
            title="Your setup can't be changed once your campaign is built"
          >
            <Lock aria-hidden />
            Locked
          </Badge>
        </CardAction>
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
