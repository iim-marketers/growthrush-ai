import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, CalendarDays, CalendarRange, Inbox, MapPin, Phone } from "lucide-react";
import { PortalLeadsChart } from "@/components/portal/leads-chart";
import { PortalLeadAvatar, PortalPageTitle, PortalStatusBadge } from "@/components/portal/primitives";
import { Button } from "@/components/ui/button";
import { formatLeadDate, formatLeadTime, portalLeadStatuses } from "@/lib/portal/leads";
import { getPortalLeads, summarizeLeads } from "@/lib/portal/queries";
import { requirePortalAccount } from "@/lib/portal/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Overview" };

const fmt = (n: number) => n.toLocaleString("en-IN");
const pct = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0);

export default async function PortalOverviewPage() {
  const account = await requirePortalAccount();
  const leads = await getPortalLeads(account.id);
  const summary = summarizeLeads(leads);

  const kpis = [
    { label: "Total leads", value: summary.total, icon: Inbox, tint: "bg-grape/10 text-grape" },
    { label: "Today", value: summary.today, icon: CalendarCheck, tint: "bg-success/12 text-success" },
    { label: "Last 7 days", value: summary.week, icon: CalendarRange, tint: "bg-brand/10 text-brand" },
    { label: "This month", value: summary.month, icon: CalendarDays, tint: "bg-orange/12 text-orange" },
  ];

  const counts = { valid: summary.valid, follow_up: summary.followUp, invalid: summary.invalid };
  const quality = portalLeadStatuses.map((status) => ({ ...status, value: counts[status.id] }));

  return (
    <>
      <PortalPageTitle
        title={account.name ? `Welcome back, ${account.name}` : "Welcome back"}
        subtitle="Here's how your leads are coming in."
        action={
          <Button asChild className="h-10 rounded-lg font-semibold">
            <Link href="/customer-portal/leads">
              View all leads
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-hairline bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-subtle">{kpi.label}</p>
              <span className={cn("flex size-9 items-center justify-center rounded-xl", kpi.tint)}>
                <kpi.icon className="size-4.5" />
              </span>
            </div>
            <p className="mt-3 font-display text-[clamp(1.6rem,1.3rem+1vw,2.1rem)] leading-none font-extrabold text-ink tabular-nums">
              {fmt(kpi.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <PortalLeadsChart byDay={summary.byDay} />
        </div>

        <section className="flex flex-col rounded-2xl border border-hairline bg-white p-5">
          <h2 className="font-display text-base font-bold text-ink">Lead quality</h2>
          <p className="mt-0.5 text-sm text-faint">Status of all {fmt(summary.total)} leads</p>

          <div className="mt-5 flex h-3 gap-0.5 overflow-hidden rounded-full bg-surface-subtle">
            {summary.total > 0 &&
              quality.map((item) =>
                item.value > 0 ? (
                  <span key={item.id} className={item.dot} style={{ width: `${pct(item.value, summary.total)}%` }} />
                ) : null,
              )}
          </div>

          <ul className="mt-5 flex flex-1 flex-col gap-2">
            {quality.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/customer-portal/leads?status=${item.id}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-hover"
                >
                  <span aria-hidden className={cn("size-2.5 rounded-full", item.dot)} />
                  <span className="flex-1 text-sm font-medium text-subtle">{item.label}</span>
                  <span className="font-display font-bold text-ink tabular-nums">{fmt(item.value)}</span>
                  <span className={cn("w-12 rounded-full py-0.5 text-center text-xs font-semibold tabular-nums", item.badge)}>
                    {pct(item.value, summary.total)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-hairline bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-4">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Latest leads</h2>
            <p className="mt-0.5 text-sm text-faint">The most recent leads added to your account</p>
          </div>
          <Link href="/customer-portal/leads" className="shrink-0 text-sm font-semibold text-brand hover:underline">
            See all
          </Link>
        </div>
        {leads.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-faint">
            No leads yet. They&apos;ll appear here as soon as they&apos;re added.
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {leads.slice(0, 6).map((lead) => (
              <li key={lead.id} className="flex items-center gap-3 px-5 py-3 sm:gap-4">
                <PortalLeadAvatar name={lead.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">{lead.name}</span>
                  <span className="block truncate text-xs text-faint sm:hidden">
                    {formatLeadDate(lead.createdAt)}
                    {lead.city ? ` · ${lead.city}` : ""}
                  </span>
                  <a
                    href={`tel:${lead.phone}`}
                    className="hidden text-xs text-faint tabular-nums hover:text-brand sm:block"
                  >
                    {lead.phone}
                  </a>
                </span>
                <span className="hidden w-36 items-center gap-1.5 truncate text-sm text-subtle md:flex">
                  {lead.city && <MapPin className="size-3.5 shrink-0 text-faint" />}
                  <span className="truncate">{lead.city || "—"}</span>
                </span>
                <span className="hidden w-36 text-right text-xs text-faint sm:block">
                  <span className="block text-ink">{formatLeadDate(lead.createdAt)}</span>
                  {formatLeadTime(lead.createdAt)}
                </span>
                <span className="flex w-24 justify-end">
                  <PortalStatusBadge status={lead.status} />
                </span>
                <Button asChild variant="outline" size="icon-sm" className="rounded-lg">
                  <a href={`tel:${lead.phone}`} aria-label={`Call ${lead.name}`}>
                    <Phone />
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
