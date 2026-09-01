import type { Metadata } from "next";
import { ArrowUpRight, Check, CreditCard, Download, Info } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/primitives";
import { billing, campaign, invoices } from "@/lib/app-data";
import { plans } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "Your growthrush.ai plan, your daily ad budget and your past invoices.",
  alternates: { canonical: "/billing" },
  robots: { index: false, follow: false },
};

export default function BillingPage() {
  /* Plans live in landing-data so the app and the pricing section can never
     quote different numbers. */
  const current = plans.find((plan) => plan.id === billing.planId) ?? plans[0];
  const other = plans.find((plan) => plan.id !== current.id);

  return (
    <>
      <PageHeader
        title="Billing"
        subtitle="Your plan fee and your ad budget are two separate things — this page shows both."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Your plan">
          <div className="px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-extrabold text-ink">
                  {current.name}
                </p>
                <p className="mt-1 text-sm text-subtle">{current.desc}</p>
              </div>
              <span className="shrink-0 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success">
                Active
              </span>
            </div>

            <p className="mt-5 font-display text-3xl font-extrabold text-ink">
              {current.price}
              <span className="ml-1 text-sm font-normal text-subtle">
                /month
              </span>
            </p>
            <p className="mt-1 text-sm text-faint">
              Renews on {billing.renewsOn}
            </p>

            <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/8 pt-5">
              {current.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-subtle"
                >
                  <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                    <Check size={11} strokeWidth={3} aria-hidden />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Ad budget">
            <div className="px-5 py-5">
              <p className="font-display text-3xl font-extrabold text-ink">
                ₹{campaign.dailyBudget}
                <span className="ml-1 text-sm font-normal text-subtle">
                  /day
                </span>
              </p>
              <p className="mt-1 text-sm text-faint">
                ₹{campaign.spent.toLocaleString("en-IN")} spent this month
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
                <Info
                  size={18}
                  aria-hidden
                  className="mt-0.5 shrink-0 text-amber-400"
                />
                <p className="text-sm leading-relaxed text-subtle">
                  <strong className="text-ink">We never charge this.</strong>{" "}
                  Meta bills it directly to the card on your own ad account, so
                  you can change or pause it whenever you like.
                </p>
              </div>
            </div>
          </Panel>

          <Panel title="Payment method">
            <div className="flex items-center gap-3 px-5 py-5">
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/6 text-subtle"
              >
                <CreditCard size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">
                  {billing.paymentMethod.brand} ···· {billing.paymentMethod.last4}
                </span>
                <span className="block text-xs text-faint">
                  Expires {billing.paymentMethod.expiry}
                </span>
              </span>
              <button
                type="button"
                className="shrink-0 rounded-lg border border-white/12 px-3 py-2 text-sm font-semibold text-subtle transition-colors hover:border-white/25 hover:text-ink"
              >
                Change
              </button>
            </div>
          </Panel>
        </div>
      </div>

      {other && (
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-brand/30 bg-brand/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-display text-base font-bold text-ink">
              Want a human on it too? Move to {other.name}.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-subtle">
              {other.desc} {other.price}/month — hand-built creatives,
              retargeting funnels and weekly strategy calls.
            </p>
          </div>
          <button
            type="button"
            className={cn(
              "btn-glow inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3",
              "font-display text-sm font-bold text-white transition-transform hover:-translate-y-0.5",
            )}
          >
            Upgrade
            <ArrowUpRight size={16} aria-hidden />
          </button>
        </div>
      )}

      <Panel title="Invoices" className="mt-4">
        <ul className="divide-y divide-white/8">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">
                  {invoice.period}
                </span>
                <span className="block text-xs text-faint">{invoice.id}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                {invoice.amount}
              </span>
              <span className="hidden shrink-0 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success sm:inline">
                {invoice.status}
              </span>
              <button
                type="button"
                aria-label={`Download the ${invoice.period} invoice`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-white/6 hover:text-ink"
              >
                <Download size={16} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
