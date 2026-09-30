import type { Metadata } from "next";
import {
  ArrowUpRight,
  Check,
  CreditCard,
  Receipt,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { BillingDetails } from "@/components/app/billing-details";
import { PageHeader } from "@/components/app/primitives";
import { CheckoutButton } from "@/components/checkout-button";
import { LogoMark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { monthlyBudgets } from "@/lib/app-data";
import { getBusiness, requireOnboardedUser } from "@/lib/auth/dal";
import { billingDetailsOf } from "@/lib/billing";
import { gstFor } from "@/lib/gst";
import { plans } from "@/lib/landing-data";
import {
  billingCycle,
  formatDate,
  formatRupees,
  getLatestPlan,
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
  const [business, latest, payments] = await Promise.all([
    getBusiness(user.id),
    getLatestPlan(user.id),
    getPaidOrders(user.id),
  ]);

  const active = latest && !latest.expired ? latest : null;
  const expired = latest?.expired ? latest : null;
  const current =
    latest?.plan ??
    plans.find((plan) => plan.id === business?.planId) ??
    plans[0];
  const other = plans.find((plan) => plan.id !== current.id);
  const budget = monthlyBudgets.find((b) => b.id === business?.budgetBand);
  const cycle = active && billingCycle(active);
  const billing = billingDetailsOf(business);
  const gst = billing && gstFor(current.amount, billing.stateCode);

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Billing"
        subtitle="Your plan fee and your ad budget are two separate things — this page shows both."
      />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="gap-0 rounded-2xl py-0 lg:col-span-3">
          <div className="relative isolate overflow-hidden bg-[#0b1220] px-6 py-6 text-white">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[radial-gradient(90%_140%_at_100%_0%,rgba(64,89,232,0.8)_0%,rgba(126,34,206,0.4)_45%,transparent_75%)]"
            />
            <div aria-hidden className="dot-grid absolute inset-0 -z-10" />
            <LogoMark
              decorative
              className="absolute right-2 -bottom-3 -z-10 size-28 -rotate-8 opacity-20 mask-[linear-gradient(to_bottom_left,black_30%,transparent_90%)] brightness-0 invert sm:right-6 sm:size-36"
            />

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-white/60 uppercase">
                  Your plan
                </p>
                <p className="mt-2 font-display text-xl font-extrabold">
                  {current.name}
                </p>
                <p className="mt-1 text-sm text-white/70">{current.desc}</p>
              </div>
              <Badge
                className={
                  active
                    ? "h-6 gap-1.5 bg-emerald-400/15 px-2.5 font-semibold text-emerald-300"
                    : expired
                      ? "h-6 bg-amber-400/15 px-2.5 font-semibold text-amber-300"
                      : "h-6 bg-white/10 px-2.5 font-semibold text-white/70"
                }
              >
                {active && (
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-current"
                  />
                )}
                {active ? "Active" : expired ? "Expired" : "Not started"}
              </Badge>
            </div>

            <p className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold">
                {current.price}
              </span>
              <span className="text-sm text-white/60">/month + GST</span>
              {!latest && (
                <span className="text-sm text-white/40 line-through">
                  {current.oldPrice}
                </span>
              )}
            </p>
            {/* {gst && (
              <p className="mt-2 text-xs text-white/60 tabular-nums">
                {current.price} +{" "}
                {gst.lines
                  .map((line) => `${formatRupees(line.paise)} ${line.label}`)
                  .join(" + ")}{" "}
                ={" "}
                <span className="font-semibold text-white">
                  {formatRupees(gst.total)}
                </span>
              </p>
            )} */}
          </div>

          <CardContent className="flex flex-col gap-5 px-6 py-6">
            {cycle && active ? (
              <div>
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="font-semibold text-ink">
                    {cycle.daysLeft} {cycle.daysLeft === 1 ? "day" : "days"}{" "}
                    left
                  </span>
                  <span className="text-xs text-faint">
                    Paid until {formatDate(active.renewsOn)}
                  </span>
                </div>
                <Progress
                  value={cycle.percent}
                  aria-label="Billing period used"
                  className="mt-2.5 h-2"
                />
              </div>
            ) : (
              <div>
                {expired && (
                  <p className="mb-3 text-sm text-subtle">
                    Your plan ended on{" "}
                    <span className="font-semibold text-ink">
                      {formatDate(expired.renewsOn)}
                    </span>
                    . Renew to keep your ads running.
                  </p>
                )}
                <CheckoutButton
                  planId={current.id}
                  planName={current.name}
                  disabled={!billing}
                  className="w-full"
                >
                  {expired ? "Renew plan" : <>Pay &amp; go live</>}
                </CheckoutButton>
                {!billing && <BillingNeeded />}
              </div>
            )}

            <Separator />

            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {current.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-subtle"
                >
                  <span className="mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand">
                    <Check size={11} strokeWidth={3} aria-hidden />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="gap-5 rounded-2xl py-6 lg:col-span-2">
          <CardHeader className="px-6">
            <CardDescription className="font-medium">Ad budget</CardDescription>
            <CardAction>
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Wallet aria-hidden className="size-4" />
              </span>
            </CardAction>
            <CardTitle className="flex items-baseline gap-1.5 font-display text-3xl font-extrabold text-ink">
              {budget && budget.id !== "not-sure" ? budget.label : "—"}
              <span className="text-sm font-normal text-subtle">/month</span>
            </CardTitle>
            <p className="text-sm text-faint">
              {budget?.id === "not-sure"
                ? "We'll suggest a budget when your campaign is set up."
                : "The budget you chose during setup."}
            </p>
          </CardHeader>

          <CardContent className="mt-auto px-6">
            <div className="flex items-start gap-3 rounded-xl border border-warn/25 bg-warn/6 p-4">
              <ShieldCheck
                size={18}
                aria-hidden
                className="mt-0.5 shrink-0 text-warn"
              />
              <p className="text-sm leading-relaxed text-subtle">
                <strong className="text-ink">We never charge this.</strong> Meta
                bills it directly to the card on your own ad account, so you can
                change or pause it whenever you like.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {latest && other && (
        <Card className="mt-4 flex-col gap-4 rounded-2xl border-0 bg-linear-to-r from-brand/8 via-grape/6 to-transparent px-6 py-5 ring-brand/20 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/12 text-brand">
              <ArrowUpRight aria-hidden className="size-4.5" />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ink">
                {other.amount > current.amount
                  ? `Want a human on it too? Move to ${other.name}.`
                  : `Switch to ${other.name}.`}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-subtle">
                {other.desc} {other.price}/month + GST.
              </p>
            </div>
          </div>
          <CheckoutButton
            planId={other.id}
            planName={other.name}
            disabled={!billing}
          >
            {other.amount > current.amount ? "Upgrade" : "Switch"}
            <ArrowUpRight size={16} aria-hidden />
          </CheckoutButton>
        </Card>
      )}

      <BillingDetails details={billing} />

      <Card className="mt-4 gap-0 rounded-2xl py-0">
        <CardHeader className="border-b border-hairline px-6 py-4!">
          <CardTitle className="font-display text-base font-bold text-ink">
            Payment history
          </CardTitle>
          <CardDescription>
            Plan fees paid to growthrush.ai, GST included
          </CardDescription>
        </CardHeader>

        {payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6">Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="hidden md:table-cell">
                  Invoice no.
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
                <TableHead className="hidden pr-6 text-right sm:table-cell">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="py-3.5 pl-6 text-subtle">
                    {payment.paidAt ? formatDate(payment.paidAt) : "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-ink">
                    {plans.find((p) => p.id === payment.planId)?.name ??
                      payment.planId}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs text-faint md:table-cell">
                    {payment.receipt}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-ink tabular-nums">
                    {formatRupees(payment.amountPaise)}
                  </TableCell>
                  <TableCell className="text-right">
                    {payment.invoiceUrl ? (
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-brand underline-offset-2 hover:underline"
                      >
                        View
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden pr-6 text-right sm:table-cell">
                    <Badge className="h-6 gap-1 bg-success/12 px-2.5 font-semibold text-success">
                      <Check aria-hidden />
                      Paid
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty className="py-14">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="size-11 rounded-xl bg-surface-hover text-subtle"
              >
                <Receipt className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="font-display text-base font-bold text-ink">
                No payments yet
              </EmptyTitle>
              <EmptyDescription>
                Your receipts will show up here after your first payment.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </Card>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-faint">
        <CreditCard aria-hidden className="size-3.5" />
        Payments are processed securely by Razorpay.
      </p>
    </>
  );
}

function BillingNeeded() {
  return (
    <p className="mt-2 text-center text-xs text-faint">
      <a
        href="#billing-details"
        className="font-semibold text-brand underline-offset-2 hover:underline"
      >
        Add your billing details
      </a>{" "}
      below to pay. GST is added based on your state.
    </p>
  );
}
