import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Pencil, Radio, Rocket } from "lucide-react";
import { LeadsChart } from "@/components/app/leads-chart";
import { LeadRow } from "@/components/app/lead-row";
import { PageHeader, Panel, StatTile } from "@/components/app/primitives";
import { goals, monthlyBudgets } from "@/lib/app-data";
import { getBusiness, requireOnboardedUser } from "@/lib/auth/dal";
import { plans } from "@/lib/landing-data";
import { getActivePlan, getLeadStats, getLeads } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Leads, cost per lead and ad spend for your growthrush.ai campaign.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

/* Spend, cost per lead and reach come from Meta, which isn't connected yet. */
const AWAITING_ADS = "Shows once your ads are live";

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  const [business, stats, leads, active] = await Promise.all([
    getBusiness(user.id),
    getLeadStats(user.id),
    getLeads(user.id),
    getActivePlan(user.id),
  ]);

  const recent = leads.slice(0, 3);
  const chosenPlan =
    plans.find((plan) => plan.id === business?.planId) ?? plans[0];

  return (
    <>
      <PageHeader
        title={`Hello, ${business?.name ?? "there"}`}
        subtitle="Here is what your ads did this month."
        action={
          active && (
            <span className="inline-flex items-center gap-2 rounded-full bg-success/12 px-3 py-1.5 text-xs font-bold text-success">
              <Radio size={13} aria-hidden />
              {active.plan.name} · active
            </span>
          )
        }
      />

      {!active && (
        <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-brand/30 bg-brand/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <Rocket size={20} aria-hidden className="mt-0.5 shrink-0 text-brand" />
            <div>
              <p className="font-display text-base font-bold text-ink">
                Your ads aren&rsquo;t live yet
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-subtle">
                Start {chosenPlan.name} ({chosenPlan.price}/month) and we&rsquo;ll
                put your first campaign live.
              </p>
            </div>
          </div>
          <Link
            href="/billing"
            className="btn-glow inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 font-display text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Go live
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Leads this month"
          value={stats.thisMonth.toLocaleString("en-IN")}
          {...leadDelta(stats.thisMonth, stats.lastMonth)}
        />
        <StatTile label="Cost per lead" value="—" note={AWAITING_ADS} />
        <StatTile label="Ad spend" value="—" note={AWAITING_ADS} />
        <StatTile label="People reached" value="—" note={AWAITING_ADS} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <LeadsChart leadsByDay={stats.byDay} />

        <Panel
          title="Your setup"
          action={
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-soft"
            >
              <Pencil size={14} aria-hidden />
              Edit
            </Link>
          }
        >
          <dl className="flex flex-col gap-4 px-5 py-5">
            <SetupRow label="Business" value={business?.name} />
            <SetupRow label="Category" value={business?.category} />
            <SetupRow label="Location" value={business?.city} />
            <SetupRow
              label="Goal"
              value={goals.find((g) => g.id === business?.goal)?.title}
            />
            <SetupRow
              label="Monthly ad budget"
              value={
                monthlyBudgets.find((b) => b.id === business?.budgetBand)
                  ?.label
              }
            />
          </dl>
        </Panel>
      </div>

      <Panel
        title="Latest leads"
        className="mt-4"
        action={
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-soft"
          >
            See all
            <ArrowRight size={15} aria-hidden />
          </Link>
        }
      >
        {recent.length > 0 ? (
          <ul className="divide-y divide-hairline">
            {recent.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-faint">
            No leads yet. They&rsquo;ll appear here as soon as your ads bring
            them in.
          </p>
        )}
      </Panel>
    </>
  );
}

function SetupRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-sm text-faint">{label}</dt>
      <dd className="min-w-0 truncate text-right text-sm font-semibold text-ink">
        {value || "—"}
      </dd>
    </div>
  );
}

/** Month-on-month change, or a note when there is nothing to compare with. */
function leadDelta(now: number, before: number) {
  if (before === 0) {
    return { note: now > 0 ? "Your first month of leads" : "No leads yet" };
  }
  const change = Math.round(((now - before) / before) * 100);
  return {
    delta: `${change >= 0 ? "+" : "−"}${Math.abs(change)}%`,
    up: change >= 0,
    upIsGood: true,
  };
}
