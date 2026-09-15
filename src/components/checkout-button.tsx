"use client";

import Script from "next/script";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PaymentSuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type PaymentFailure = { error: { description?: string } };

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
  | { kind: "confirming" }
  | { kind: "cancelled" }
  | { kind: "failed"; message: string }
  | { kind: "paid" };

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

  const confirm = async (response: PaymentSuccess) => {
    setStatus({ kind: "confirming" });
    const { ok } = await post("/api/verify-payment", response);
    setStatus(
      ok
        ? { kind: "paid" }
        : {
            kind: "failed",
            message: `We couldn't confirm this payment. If money left your account, contact us with payment ID ${response.razorpay_payment_id}.`,
          },
    );
  };

  const pay = async () => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!window.Razorpay || !key) {
      setStatus({
        kind: "failed",
        message: "Checkout didn't load. Check your connection and try again.",
      });
      return;
    }

    setStatus({ kind: "opening" });
    const { ok, data } = await post("/api/create-order", { planId });
    if (!ok) {
      setStatus({
        kind: "failed",
        message: data.error ?? "Could not start the payment. Please try again.",
      });
      return;
    }

    const checkout = new window.Razorpay({
      key,
      order_id: data.order_id,
      amount: data.amount,
      currency: data.currency,
      name: "growthrush.ai",
      description: planName,
      theme: { color: "#4059e8" },
      handler: (response) => void confirm(response),
      modal: {
        // Only a fresh modal counts as cancelled; closing after a failed
        // attempt or a success must not overwrite that status.
        ondismiss: () =>
          setStatus((s) => (s.kind === "opening" ? { kind: "cancelled" } : s)),
      },
    });
    checkout.on("payment.failed", (response) =>
      setStatus({
        kind: "failed",
        message:
          response.error.description ?? "The payment failed. Please try again.",
      }),
    );
    checkout.open();
  };

  const busy = status.kind === "opening" || status.kind === "confirming";

  return (
    <div className="flex shrink-0 flex-col sm:items-end">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <button
        type="button"
        onClick={pay}
        disabled={busy || status.kind === "paid"}
        className={cn(
          "btn-glow inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3",
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
              : children}
      </button>

      <p
        role="status"
        className={cn(
          "mt-2 text-sm empty:mt-0 sm:max-w-xs sm:text-right",
          status.kind === "failed" && "text-danger",
          status.kind === "paid" && "text-success",
          status.kind === "cancelled" && "text-subtle",
        )}
      >
        {status.kind === "failed" && status.message}
        {status.kind === "cancelled" &&
          "Payment cancelled — you haven't been charged."}
        {status.kind === "paid" && `Payment confirmed. Welcome to ${planName}!`}
      </p>
    </div>
  );
}
