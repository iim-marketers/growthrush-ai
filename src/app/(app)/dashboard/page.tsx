import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  IndianRupee,
  MapPin,
  Tag,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import {
  DashboardHero,
  KpiCard,
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
  formatDate,
  getActivePlan,
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

const AWAITING_ADS = "Shows once your ads are live";

export default async function DashboardPage() {
  const user = await requireOnboardedUser();
  const [business, stats, leads, active] = await Promise.all([
    getBusiness(user.id),
    getLeadStats(user.id),
    getLeads(user.id),
    getActivePlan(user.id),
  ]);

  const chosenPlan =
    plans.find((plan) => plan.id === business?.planId) ?? plans[0];
  const now = new Date();

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <DashboardHero
        greeting={greetingFor(now)}
        date={new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(now)}
        business={business?.name ?? "there"}
        plan={
          active && {
            name: active.plan.name,
            renews: formatDate(active.renewsOn),
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
              Go live
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <p className="text-xs text-white/60">
            {chosenPlan.name} · {chosenPlan.price}/month
          </p>
        </div>
      </DashboardHero>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiCard
          label="Leads this month"
          value={stats.thisMonth.toLocaleString("en-IN")}
          icon={Users}
          {...leadDelta(stats.thisMonth, stats.lastMonth)}
        />
        <KpiCard
          label="Cost per lead"
          value="—"
          icon={IndianRupee}
          note={AWAITING_ADS}
          pending
        />
        <KpiCard
          label="Ad spend"
          value="—"
          icon={Wallet}
          note={AWAITING_ADS}
          pending
        />
        <KpiCard
          label="People reached"
          value="—"
          icon={Eye}
          note={AWAITING_ADS}
          pending
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
