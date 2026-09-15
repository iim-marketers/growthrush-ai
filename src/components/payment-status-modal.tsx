"use client";

import { Loader2, RotateCw, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** What the order asks for, in paise. */
export type Charge = { amount: number; currency: string };

const tones = {
  brand: {
    wash: "from-brand/12",
    medallion: "bg-brand ring-brand/15",
    stamp: "border-brand text-brand",
  },
  neutral: {
    wash: "from-subtle/10",
    medallion: "bg-subtle ring-subtle/15",
    stamp: "border-subtle text-subtle",
  },
  danger: {
    wash: "from-danger/10",
    medallion: "bg-danger ring-danger/15",
    stamp: "border-danger text-danger",
  },
  warn: {
    wash: "from-warn/12",
    medallion: "bg-warn ring-warn/15",
    stamp: "border-warn text-warn",
  },
  success: {
    wash: "from-success/12",
    medallion: "bg-success ring-success/15",
    stamp: "border-success text-success",
  },
};

export type PaymentNotice = {
  tone: keyof typeof tones;
  icon: LucideIcon;
  title: string;
  body: string;
  stamp?: string;
  charge?: Charge;
  paymentId?: string;
  /* "retry" only where paying again can't charge twice; "none" while the
     outcome is still unknown, so the modal can't be closed. */
  action: "retry" | "done" | "none";
};

function formatCharge({ amount, currency }: Charge) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

const primaryButton =
  "btn-glow inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 font-display text-sm font-bold text-white outline-none transition-colors hover:bg-brand-soft focus-visible:ring-3 focus-visible:ring-brand/35";
const secondaryButton =
  "inline-flex h-11 items-center justify-center rounded-xl border border-hairline bg-background px-5 text-sm font-semibold text-ink outline-none transition-colors hover:border-line-strong hover:bg-surface-subtle focus-visible:ring-3 focus-visible:ring-brand/35";

export function PaymentStatusModal({
  notice,
  planName,
  open,
  onRetry,
  onClose,
}: {
  notice: PaymentNotice | null;
  planName: string;
  open: boolean;
  onRetry: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open && notice !== null}
      onOpenChange={(next) => {
        if (!next && notice?.action !== "none") onClose();
      }}
    >
      {notice && (
        <ModalContent
          notice={notice}
          planName={planName}
          onRetry={onRetry}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

function ModalContent({
  notice,
  planName,
  onRetry,
  onClose,
}: {
  notice: PaymentNotice;
  planName: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  const tone = tones[notice.tone];
  const Icon = notice.icon;
  const rows = [
    { label: "Plan", value: planName },
    notice.charge && { label: "Amount", value: formatCharge(notice.charge) },
    notice.paymentId && {
      label: "Payment ID",
      value: notice.paymentId,
      mono: true,
    },
  ].filter((row) => !!row);

  return (
    <DialogContent
      showCloseButton={false}
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        (event.currentTarget as HTMLElement).focus();
      }}
      className={cn(
        // The dialog portals out of the app's light theme, so it restates it.
        "theme-light gap-0 overflow-hidden bg-background p-0 ring-1 ring-black/5",
        "shadow-[0_24px_80px_-16px_rgba(11,18,32,0.45)]",
        "top-auto bottom-0 left-0 max-w-full translate-x-0 translate-y-0 rounded-t-[28px] rounded-b-none",
        "sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-w-100 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[28px]",
      )}
    >
      <div className={cn("bg-linear-to-b to-transparent px-6 pt-5", tone.wash)}>
        <div className="flex h-8 items-center justify-between">
          <Logo size="sm" tone="dark" />
          {notice.action !== "none" && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-faint outline-none transition-colors hover:bg-black/5 hover:text-ink focus-visible:ring-3 focus-visible:ring-brand/35"
            >
              <X size={18} aria-hidden />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center pt-8 text-center">
          <span
            aria-hidden
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full text-white ring-10",
              tone.medallion,
            )}
          >
            <Icon
              size={26}
              strokeWidth={2.5}
              className={cn(Icon === Loader2 && "animate-spin")}
            />
          </span>

          <DialogTitle className="mt-6 font-display text-[1.375rem] leading-tight font-extrabold text-balance text-ink">
            {notice.title}
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[34ch] text-sm leading-relaxed text-balance text-subtle">
            {notice.body}
          </DialogDescription>
        </div>
      </div>

      <div className="px-6 pt-7 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        <div
          className={cn(
            "relative rounded-2xl border border-dashed border-line-strong bg-surface-subtle px-4 pb-3.5",
            notice.stamp ? "pt-6" : "pt-3.5",
          )}
        >
          {notice.stamp && (
            <span
              aria-hidden
              className={cn(
                "absolute -top-3 right-4 -rotate-6 rounded-md border-2 bg-background px-2 py-0.5",
                "font-display text-[0.6875rem] font-extrabold tracking-[0.18em] uppercase",
                tone.stamp,
              )}
            >
              {notice.stamp}
            </span>
          )}
          <dl className="flex flex-col gap-2 text-sm">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4"
              >
                <dt className="shrink-0 text-faint">{row.label}</dt>
                <dd
                  className={cn(
                    "min-w-0 text-right font-semibold text-ink",
                    "mono" in row &&
                      "font-mono text-[0.8125rem] break-all select-all",
                  )}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {notice.action === "retry" && (
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button type="button" onClick={onClose} className={secondaryButton}>
              Close
            </button>
            <button type="button" onClick={onRetry} className={primaryButton}>
              <RotateCw size={15} aria-hidden />
              Try again
            </button>
          </div>
        )}
        {notice.action === "done" && (
          <button
            type="button"
            onClick={onClose}
            className={cn(primaryButton, "mt-5 w-full")}
          >
            Done
          </button>
        )}
      </div>
    </DialogContent>
  );
}
