import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Building2,
  CircleCheckBig,
  Eye,
  IndianRupee,
  MapPin,
  Tag,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import {
  AdMetricsCard,
  DashboardHero,
  KpiCard,
  LaunchSteps,
  LeadPipeline,
  RecentLeads,
  SetupCard,
} from "@/components/app/dashboard-widgets";
import { LeadsChart } from "@/components/app/leads-chart";
import { Button } from "@/components/ui/button";
import { goals, monthlyBudgets } from "@/lib/app-data";
import { getBusiness, requireOnboardedUser } from "@/lib/auth/dal";
import { plans } from "@/lib/landing-data";
import {
  billingCycle,
  formatDate,
  getLatestPlan,
  getLeadStats,
  getLeads,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Leads, cost per lead and ad spend for your growthrush.ai campaign.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  const [business, stats, leads, latest] = await Promise.all([
    getBusiness(user.id),
    getLeadStats(user.id),
    getLeads(user.id),
    getLatestPlan(user.id),
  ]);

  const active = latest && !latest.expired ? latest : null;
  const chosenPlan =
    latest?.plan ??
    plans.find((plan) => plan.id === business?.planId) ??
    plans[0];
  const now = new Date();
  const cycle = active && billingCycle(active);

  const newLeads = leads.filter((lead) => lead.status === "new").length;
  const converted = leads.filter((lead) => lead.status === "converted").length;
  const conversion =
    leads.length > 0 ? Math.round((converted / leads.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-5 [&>*]:motion-safe:animate-slide-up">
      <DashboardHero
        greeting={greetingFor(now)}
        date={new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(now)}
        business={business?.name ?? "there"}
        expiredOn={latest?.expired ? formatDate(latest.renewsOn) : null}
        plan={
          active &&
          cycle && {
            name: active.plan.name,
            renews: formatDate(active.renewsOn),
            daysLeft: cycle.daysLeft,
            used: cycle.percent,
          }
        }
      >
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <Button
            asChild
            size="lg"
            className="h-11 rounded-xl bg-white px-5 font-display font-bold text-[#0b1220] shadow-[0_8px_30px_rgba(64,89,232,0.45)] hover:bg-white/90"
          >
            <Link href="/billing">
              {latest?.expired ? "Renew plan" : "Go live"}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <p className="text-xs text-white/60">
            {chosenPlan.name} · {chosenPlan.price}/month + GST
          </p>
        </div>
      </DashboardHero>

      {/* {!active && (
        <LaunchSteps
          steps={[
            {
              title: "Business profile",
              detail: "Who you are and where you work",
              done: Boolean(business?.name && business.city),
            },
            {
              title: "Campaign setup",
              detail: "Your goal and monthly ad budget",
              done: Boolean(business?.goal && business.budgetBand),
            },
            {
              title: "Choose a plan",
              detail: `${chosenPlan.name} · ${chosenPlan.price}/month + GST`,
              done: false,
            },
            {
              title: "Ads go live",
              detail: "Leads start arriving on this page",
              done: false,
            },
          ]}
        />
      )} */}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label="Leads this month"
          value={stats.thisMonth.toLocaleString("en-IN")}
          icon={Users}
          // trend={stats.byDay.slice(-14).map((d) => d.leads)}
          {...leadDelta(stats.thisMonth, stats.lastMonth)}
        />
        <KpiCard
          label="Needs follow-up"
          value={newLeads.toLocaleString("en-IN")}
          icon={BellRing}
          tone={newLeads > 0 ? "warn" : "brand"}
          note={newLeads > 0 ? "Not contacted yet" : "You’re all caught up"}
          href="/leads"
        />
        <KpiCard
          label="Conversion rate"
          value={String(conversion)}
          suffix="%"
          icon={CircleCheckBig}
          tone="success"
          note={`${converted.toLocaleString("en-IN")} of ${leads.length.toLocaleString("en-IN")} leads converted`}
        />
        <AdMetricsCard
          metrics={[
            { label: "Cost per lead", icon: IndianRupee },
            { label: "Ad spend", icon: Wallet },
            { label: "People reached", icon: Eye },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <LeadsChart leadsByDay={stats.byDay} />
        </div>
        <LeadPipeline leads={leads} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RecentLeads leads={leads.slice(0, 5)} />
        </div>
        <SetupCard
          rows={[
            { label: "Business", value: business?.name, icon: Building2 },
            { label: "Category", value: business?.category, icon: Tag },
            { label: "Location", value: business?.city, icon: MapPin },
            {
              label: "Goal",
              value: goals.find((g) => g.id === business?.goal)?.title,
              icon: Target,
            },
            {
              label: "Monthly ad budget",
              value: monthlyBudgets.find((b) => b.id === business?.budgetBand)
                ?.label,
              icon: Wallet,
            },
          ]}
        />
      </div>
    </div>
  );
}

function greetingFor(now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hourCycle: "h23",
    }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

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
