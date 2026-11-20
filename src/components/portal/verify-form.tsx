"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, KeyRound } from "lucide-react";
import { resendPortalOtp, verifyPortalOtp } from "@/app/customer-portal/actions";
import { PortalFormError } from "@/components/portal/login-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PortalVerifyForm({
  masked,
  length,
  initialWait,
  demoCode,
}: {
  masked: string;
  length: number;
  initialWait: number;
  demoCode: string | null;
}) {
  const [state, action, pending] = useActionState(verifyPortalOtp, undefined);
  const [digits, setDigits] = useState(() => Array.from({ length }, () => ""));
  const [secondsLeft, setSecondsLeft] = useState(initialWait);
  const [dismissed, setDismissed] = useState<typeof state>(undefined);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resending, startResend] = useTransition();
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const error = state !== dismissed ? state?.error : undefined;
  const code = digits.join("");

  useEffect(() => {
    if (state?.error) boxes.current[0]?.focus();
  }, [state]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const fill = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return;
    setDismissed(state);
    setDigits((current) => {
      const next = [...current];
      for (let i = 0; i < clean.length && index + i < length; i++) next[index + i] = clean[i];
      return next;
    });
    boxes.current[Math.min(index + clean.length, length - 1)]?.focus();
  };

  const onKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      setDismissed(state);
      setDigits((current) => {
        const next = [...current];
        if (next[index]) next[index] = "";
        else if (index > 0) next[index - 1] = "";
        return next;
      });
      if (!digits[index] && index > 0) boxes.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) boxes.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < length - 1) boxes.current[index + 1]?.focus();
  };

  const resend = () =>
    startResend(async () => {
      const result = await resendPortalOtp();
      setResendError(result.ok ? null : result.error);
      if (result.waitSeconds) setSecondsLeft(result.waitSeconds);
    });

  return (
    <>
      <Link
        href="/customer-portal/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-subtle hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Use a different number
      </Link>

      <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2rem)] leading-tight text-ink">Enter your code</h1>
      <p className="mt-2 mb-8 text-[0.95rem] text-subtle">
        Sent to <span className="font-semibold text-ink tabular-nums">{masked}</span>
      </p>

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="code" value={code} />
        <div className="flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                boxes.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={length}
              aria-label={`Digit ${index + 1} of ${length}`}
              value={digit}
              onChange={(event) => fill(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(index, event)}
              onFocus={(event) => event.target.select()}
              aria-invalid={Boolean(error)}
              className={cn(
                "h-13 w-full min-w-0 rounded-xl border bg-white text-center font-display text-xl font-bold text-ink outline-none transition-all focus:ring-[3px]",
                error
                  ? "border-danger focus:border-danger focus:ring-danger/20"
                  : "border-hairline focus:border-brand focus:ring-brand/15",
              )}
            />
          ))}
        </div>

        <PortalFormError message={error} />

        {demoCode && (
          <button
            type="button"
            onClick={() => fill(0, demoCode)}
            className="flex items-center gap-3 rounded-xl border border-dashed border-brand/30 bg-brand/5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-brand/10"
          >
            <KeyRound className="size-4 shrink-0 text-brand" />
            <span className="flex-1 text-subtle">
              Test mode: use code <span className="font-semibold text-ink tabular-nums">{demoCode}</span>
            </span>
            <span className="font-semibold text-brand">Fill</span>
          </button>
        )}

        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-base font-semibold"
          disabled={code.length !== length || pending}
        >
          {pending ? "Verifying…" : "Verify & sign in"}
          {!pending && <ArrowRight data-icon="inline-end" />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-faint">
        {secondsLeft > 0 ? (
          <>Didn&apos;t get it? Resend in {secondsLeft}s</>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="font-semibold text-brand hover:underline disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        )}
      </p>
      {resendError && (
        <p role="alert" className="mt-2 text-center text-[0.8rem] font-semibold text-danger">
          {resendError}
        </p>
      )}
    </>
  );
}
