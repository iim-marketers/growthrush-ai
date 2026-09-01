import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { LeadsChart } from "@/components/app/leads-chart";
import { LeadRow } from "@/components/app/lead-row";
import { PageHeader, Panel, StatTile } from "@/components/app/primitives";
import { campaign, dashboardStats, leads, profile } from "@/lib/app-data";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Leads, cost per lead and ad spend for your growthrush.ai campaign.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  const spentPct = Math.round((campaign.spent / campaign.monthlyCap) * 100);
  const recent = leads.slice(0, 3);

  return (
    <>
      <PageHeader
        title={`Hello, ${profile.business}`}
        subtitle="Here is what your ads did this month."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-success/12 px-3 py-1.5 text-xs font-bold text-success">
            <Radio size={13} aria-hidden />
            Campaign live · {campaign.liveSince}
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatTile key={stat.id} {...stat} />
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <LeadsChart />

        <Panel title="This month's budget" className="p-0">
          <div className="px-5 py-5">
            <p className="font-display text-3xl font-extrabold text-ink">
              ₹{campaign.spent.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-sm text-faint">
              of ₹{campaign.monthlyCap.toLocaleString("en-IN")} · ₹
              {campaign.dailyBudget}/day
            </p>

            {/* Meter: the fill and the track are two steps of one hue, so the
                proportion reads across the whole bar. */}
            <div
              role="meter"
              aria-valuenow={spentPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Monthly ad budget used"
              className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-brand/15"
            >
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${spentPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-faint">{spentPct}% used</p>

            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-sm font-bold text-ink">{campaign.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-faint">
                Budget goes to Meta from your own account. Change it any day
                from Billing.
              </p>
              <Link
                href="/billing"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-soft"
              >
                Manage budget
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </div>
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
        <ul className="divide-y divide-white/8">
          {recent.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </ul>
      </Panel>
    </>
  );
}
