"use client";

import Script from "next/script";
import { useState } from "react";
import { Loader2, TrendingUp, TriangleAlert, Undo2, X } from "lucide-react";
import {
  PaymentStatusModal,
  type Charge,
  type PaymentNotice,
} from "@/components/payment-status-modal";
import { cn } from "@/lib/utils";

type PaymentSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type PaymentFailure = {
  error: { description?: string; metadata?: { payment_id?: string } };
};

type RazorpayOptions = {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  theme: { color: string };
  handler: (response: PaymentSuccess) => void;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (
        event: "payment.failed",
        handler: (response: PaymentFailure) => void,
      ) => void;
    };
  }
}

type Status =
  | { kind: "idle" }
  | { kind: "opening" }
  | { kind: "confirming"; charge: Charge; paymentId: string }
  | { kind: "paid"; charge: Charge; paymentId: string }
  | { kind: "cancelled"; charge: Charge }
  | { kind: "failed"; charge: Charge; reason?: string; paymentId?: string }
  // Razorpay reported success but our server couldn't record it.
  | { kind: "unconfirmed"; charge: Charge; paymentId: string }
  | { kind: "error"; message: string };

async function post(url: string, body: unknown) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { ok: res.ok, data: await res.json().catch(() => ({})) };
  } catch {
    return { ok: false, data: {} };
  }
}

/* Razorpay's description is often just "Payment failed", which would repeat
   the modal title, so that one is dropped. */
function failureReason(description?: string) {
  const text = description?.trim();
  if (!text || /^payment failed\.?$/i.test(text)) return undefined;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function noticeFor(status: Status, planName: string): PaymentNotice | null {
  switch (status.kind) {
    case "confirming":
      return {
        tone: "brand",
        icon: Loader2,
        title: "Confirming your payment",
        stamp: "Processing",
        body: "This takes a few seconds. Please keep this page open.",
        charge: status.charge,
        paymentId: status.paymentId,
        action: "none",
      };
    case "paid":
      return {
        tone: "success",
        icon: TrendingUp,
        title: "You're all set",
        stamp: "Paid",
        body: `Payment received. Welcome to ${planName}!`,
        charge: status.charge,
        paymentId: status.paymentId,
        action: "done",
      };
    case "failed":
      return {
        tone: "danger",
        icon: X,
        title: "Payment didn't go through",
        stamp: "Failed",
        body: [
          status.reason,
          "If any amount was debited, your bank will refund it automatically.",
        ]
          .filter(Boolean)
          .join(" "),
        charge: status.charge,
        paymentId: status.paymentId,
        action: "retry",
      };
    case "cancelled":
      return {
        tone: "neutral",
        icon: Undo2,
        title: "Payment cancelled",
        stamp: "Cancelled",
        body: "You closed checkout before paying, so nothing was charged.",
        charge: status.charge,
        action: "retry",
      };
    case "unconfirmed":
      return {
        tone: "warn",
        icon: TriangleAlert,
        title: "We couldn't confirm your payment",
        stamp: "Pending",
        body: "If money left your account, please don't pay again — contact us and quote the payment ID below.",
        charge: status.charge,
        paymentId: status.paymentId,
        action: "done",
      };
    case "error":
      return {
        tone: "danger",
        icon: TriangleAlert,
        title: "Couldn't open checkout",
        body: status.message,
        action: "retry",
      };
    default:
      return null;
  }
}

export function CheckoutButton({
  planId,
  planName,
  children,
  className,
}: {
  planId: string;
  planName: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Every status is a fresh object, so a new outcome reopens the modal.
  const [closedStatus, setClosedStatus] = useState<Status | null>(null);

  const confirm = async (charge: Charge, response: PaymentSuccess) => {
    const paymentId = response.razorpay_payment_id;
    setStatus({ kind: "confirming", charge, paymentId });
    const { ok } = await post("/api/verify-payment", response);
    setStatus({ kind: ok ? "paid" : "unconfirmed", charge, paymentId });
  };

  const pay = async () => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!window.Razorpay || !key) {
      setStatus({
        kind: "error",
        message: "Checkout didn't load. Check your connection and try again.",
      });
      return;
    }

    setStatus({ kind: "opening" });
    const { ok, data } = await post("/api/create-order", { planId });
    if (!ok) {
      setStatus({
        kind: "error",
        message: data.error ?? "Could not start the payment. Please try again.",
      });
      return;
    }

    const charge: Charge = { amount: data.amount, currency: data.currency };
    // Checkout lets the customer retry inside its modal, so a failed attempt
    // is only reported once they close it without paying.
    let lastFailure: { reason?: string; paymentId?: string } | undefined;

    const checkout = new window.Razorpay({
      key,
      order_id: data.order_id,
      amount: data.amount,
      currency: data.currency,
      name: "growthrush.ai",
      description: planName,
      theme: { color: "#4059e8" },
      handler: (response) => void confirm(charge, response),
      modal: {
        // Closing after a success must not overwrite "confirming" or "paid".
        ondismiss: () =>
          setStatus((s) =>
            s.kind !== "opening"
              ? s
              : lastFailure
                ? { kind: "failed", charge, ...lastFailure }
                : { kind: "cancelled", charge },
          ),
      },
    });
    checkout.on("payment.failed", ({ error }) => {
      lastFailure = {
        reason: failureReason(error.description),
        paymentId: error.metadata?.payment_id,
      };
    });
    checkout.open();
  };

  const busy = status.kind === "opening" || status.kind === "confirming";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <button
        type="button"
        onClick={pay}
        // Paying again while a payment is unconfirmed could charge twice.
        disabled={busy || status.kind === "paid" || status.kind === "unconfirmed"}
        className={cn(
          "btn-glow inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3",
          "font-display text-sm font-bold text-white transition-transform hover:-translate-y-0.5",
          "disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none",
          className,
        )}
      >
        {busy && <Loader2 size={16} aria-hidden className="animate-spin" />}
        {status.kind === "opening"
          ? "Opening checkout…"
          : status.kind === "confirming"
            ? "Confirming payment…"
            : status.kind === "paid"
              ? "Paid"
              : status.kind === "unconfirmed"
                ? "Awaiting confirmation"
                : children}
      </button>

      <PaymentStatusModal
        notice={noticeFor(status, planName)}
        planName={planName}
        open={closedStatus !== status}
        onRetry={pay}
        onClose={() => setClosedStatus(status)}
      />
    </>
  );
}
