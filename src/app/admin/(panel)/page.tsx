import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CircleCheck,
  Clock,
  Inbox,
  Users,
  XCircle,
} from "lucide-react";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { LeadAvatar, PageHeader } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/admin/auth";
import { formatAdminDate, formatAdminTime } from "@/lib/admin/leads";
import { getAdminOverview } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const overview = await getAdminOverview();

  const stats = [
    {
      label: "Lead accounts",
      value: overview.accounts,
      icon: Users,
      tint: "bg-brand/10 text-brand",
    },
    {
      label: "Total leads",
      value: overview.total,
      icon: Inbox,
      tint: "bg-grape/10 text-grape",
    },
    {
      label: "Added today",
      value: overview.today,
      icon: CalendarCheck,
      tint: "bg-brand/10 text-brand",
    },
    {
      label: "Valid",
      value: overview.valid,
      icon: CircleCheck,
      tint: "bg-success/12 text-success",
    },
    {
      label: "Follow-up",
      value: overview.followUp,
      icon: Clock,
      tint: "bg-warn/12 text-warn",
    },
    {
      label: "Invalid",
      value: overview.invalid,
      icon: XCircle,
      tint: "bg-danger/10 text-danger",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Admin dashboard"
        subtitle="Lead accounts and the leads added to them, at a glance."
        action={
          <Button asChild className="rounded-lg font-semibold">
            <Link href="/admin/leads">
              Manage leads
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="gap-3 rounded-xl px-4 py-4">
            <span
              className={`flex size-9 items-center justify-center rounded-lg ${stat.tint}`}
            >
              <stat.icon className="size-4.5" />
            </span>
            <div>
              <p className="text-xs font-medium text-subtle">{stat.label}</p>
              <p className="font-display text-2xl font-extrabold text-ink tabular-nums">
                {stat.value.toLocaleString("en-IN")}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="gap-0 rounded-2xl py-0">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
          <h2 className="font-display text-base font-bold text-ink">
            Recently added leads
          </h2>
          <Link
            href="/admin/leads"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View accounts
          </Link>
        </div>
        {overview.recent.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-faint">
            No leads yet. Create a lead account and add leads to it.
          </p>
        ) : (
          <ul className="divide-y divide-hairline">
            {overview.recent.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/admin/leads/${lead.accountId}`}
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-surface-hover"
                >
                  <LeadAvatar name={lead.name} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">
                      {lead.name}
                    </span>
                    <span className="block truncate text-xs text-faint">
                      {lead.accountName || lead.accountEmail}
                      {lead.city ? ` · ${lead.city}` : ""}
                    </span>
                  </span>
                  <LeadStatusBadge status={lead.status} />
                  <span className="hidden w-28 text-right text-xs text-faint sm:block">
                    {formatAdminDate(lead.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
