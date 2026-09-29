import type { Metadata } from "next";
import { ArrowUpRight, Check, Info } from "lucide-react";
import { PageHeader, Panel } from "@/components/app/primitives";
import { CheckoutButton } from "@/components/checkout-button";
import { monthlyBudgets } from "@/lib/app-data";
import { getBusiness, requireOnboardedUser } from "@/lib/auth/dal";
import { plans } from "@/lib/landing-data";
import {
  formatDate,
  formatMonth,
  formatRupees,
  getActivePlan,
  getPaidOrders,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "Your growthrush.ai plan, your daily ad budget and your past invoices.",
  alternates: { canonical: "/billing" },
  robots: { index: false, follow: false },
};

export default async function BillingPage() {
  const user = await requireOnboardedUser();
  const [business, active, payments] = await Promise.all([
    getBusiness(user.id),
    getActivePlan(user.id),
    getPaidOrders(user.id),
  ]);

  /* Plans live in landing-data so the app and the pricing section can never
     quote different numbers. With nothing paid yet, show the plan they picked
     during setup, ready to buy. */
  const current =
    active?.plan ??
    plans.find((plan) => plan.id === business?.planId) ??
    plans[0];
  const other = plans.find((plan) => plan.id !== current.id);
  const budget = monthlyBudgets.find((b) => b.id === business?.budgetBand);

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
              {active ? (
                <span className="shrink-0 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success">
                  Active
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-surface-mute px-2.5 py-1 text-xs font-bold text-faint">
                  Not started
                </span>
              )}
            </div>

            <p className="mt-5 font-display text-3xl font-extrabold text-ink">
              {current.price}
              <span className="ml-1 text-sm font-normal text-subtle">
                /month
              </span>
            </p>
            {active ? (
              <p className="mt-1 text-sm text-faint">
                Paid until {formatDate(active.renewsOn)}
              </p>
            ) : (
              <CheckoutButton
                planId={current.id}
                planName={current.name}
                className="mt-4 w-full"
              >
                Pay &amp; go live
              </CheckoutButton>
            )}

            <ul className="mt-5 flex flex-col gap-2.5 border-t border-hairline pt-5">
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

        <Panel title="Ad budget">
          <div className="px-5 py-5">
            <p className="font-display text-3xl font-extrabold text-ink">
              {budget && budget.id !== "not-sure" ? budget.label : "—"}
              <span className="ml-1 text-sm font-normal text-subtle">
                /month
              </span>
            </p>
            <p className="mt-1 text-sm text-faint">
              {budget?.id === "not-sure"
                ? "We'll suggest a budget when your campaign is set up."
                : "The budget you chose during setup."}
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-warn/30 bg-warn/[0.07] p-4">
              <Info size={18} aria-hidden className="mt-0.5 shrink-0 text-warn" />
              <p className="text-sm leading-relaxed text-subtle">
                <strong className="text-ink">We never charge this.</strong>{" "}
                Meta bills it directly to the card on your own ad account, so
                you can change or pause it whenever you like.
              </p>
            </div>
          </div>
        </Panel>
      </div>

      {active && other && (
        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-brand/30 bg-brand/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="font-display text-base font-bold text-ink">
              {other.amount > current.amount
                ? `Want a human on it too? Move to ${other.name}.`
                : `Switch to ${other.name}.`}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-subtle">
              {other.desc} {other.price}/month.
            </p>
          </div>
          <CheckoutButton planId={other.id} planName={other.name}>
            {other.amount > current.amount ? "Upgrade" : "Switch"}
            <ArrowUpRight size={16} aria-hidden />
          </CheckoutButton>
        </div>
      )}

      <Panel title="Payments" className="mt-4">
        {payments.length > 0 ? (
          <ul className="divide-y divide-hairline">
            {payments.map((payment) => (
              <li
                key={payment.id}
                className="flex items-center gap-4 px-5 py-4"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-ink">
                    {plans.find((p) => p.id === payment.planId)?.name ??
                      payment.planId}
                    {payment.paidAt && ` · ${formatMonth(payment.paidAt)}`}
                  </span>
                  <span className="block truncate text-xs text-faint">
                    {payment.paymentId}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                  {formatRupees(payment.amountPaise)}
                </span>
                <span className="hidden shrink-0 rounded-full bg-success/12 px-2.5 py-1 text-xs font-bold text-success sm:inline">
                  Paid
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-faint">
            No payments yet.
          </p>
        )}
      </Panel>
    </>
  );
}
