"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { MessageSquare, Pencil } from "lucide-react";
import { CtaButton } from "@/components/cta-button";
import { resendOtp, verifyOtp } from "@/app/login/actions";
import { verify } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export function VerifyForm({
  masked,
  initialWait,
  demoCode,
}: {
  /** The number the code went to, already masked by the server. */
  masked: string;
  /** Seconds left before another code may be sent. */
  initialWait: number;
  /** Set only while no SMS gateway is wired up — see lib/auth/sms.ts. */
  demoCode: string | null;
}) {
  const [state, action, pending] = useActionState(verifyOtp, undefined);
  const [digits, setDigits] = useState(() =>
    Array.from({ length: verify.length }, () => ""),
  );
  const [secondsLeft, setSecondsLeft] = useState(initialWait);
  /* Editing the code hides the last error; a new submit brings a new one. */
  const [dismissed, setDismissed] = useState<typeof state>(undefined);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resending, startResend] = useTransition();
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const error = state !== dismissed ? state?.error : undefined;
  const wrong = Boolean(error);

  /* Put the caret back in the first box after a failed attempt. */
  useEffect(() => {
    if (state?.error) boxes.current[0]?.focus();
  }, [state]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const code = digits.join("");
  const complete = code.length === verify.length;

  const write = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) return;

    setDismissed(state);
    setDigits((current) => {
      const next = [...current];
      for (let i = 0; i < clean.length && index + i < next.length; i++) {
        next[index + i] = clean[i];
      }
      return next;
    });

    const landed = Math.min(index + clean.length, verify.length - 1);
    boxes.current[landed]?.focus();
  };

  const paste = (code: string) => {
    setDismissed(state);
    setDigits(code.split(""));
    boxes.current[verify.length - 1]?.focus();
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
    if (event.key === "ArrowLeft" && index > 0)
      boxes.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < verify.length - 1) {
      boxes.current[index + 1]?.focus();
    }
  };

  const resend = () =>
    startResend(async () => {
      const result = await resendOtp();
      setResendError(result.ok ? null : result.error);
      if (result.waitSeconds) setSecondsLeft(result.waitSeconds);
    });

  return (
    <>
      <h1 className="mb-2 text-center text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] lg:text-left">
        {verify.title}
      </h1>
      <p className="mb-3 text-center text-[0.95rem] text-subtle lg:text-left">
        {verify.subtitle.replace("%s", masked)}
      </p>
      <Link
        href="/login"
        className="rhythm-lg mx-auto flex w-fit items-center gap-1.5 text-[0.85rem] font-semibold text-brand transition-colors hover:text-brand-soft lg:mx-0"
      >
        <Pencil size={13} aria-hidden />
        Change number
      </Link>

      <form action={action}>
        <input type="hidden" name="code" value={code} />
        <div className="rhythm-md flex justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                boxes.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={verify.length}
              aria-label={`Digit ${index + 1} of ${verify.length}`}
              value={digit}
              onChange={(event) => write(index, event.target.value)}
              onKeyDown={(event) => onKeyDown(index, event)}
              onFocus={(event) => event.target.select()}
              aria-invalid={wrong}
              className={cn(
                "h-14 w-full min-w-0 rounded-xl border bg-surface-subtle text-center font-display text-xl font-bold text-ink transition-all outline-none focus:bg-surface-hover focus:ring-[3px]",
                wrong
                  ? "border-danger focus:border-danger focus:ring-danger/20"
                  : "border-hairline focus:border-brand focus:ring-brand/15",
              )}
            />
          ))}
        </div>

        {wrong && (
          <p
            role="alert"
            className="mt-2 text-[0.8rem] font-semibold text-danger"
          >
            {error}
          </p>
        )}

        {demoCode && <DemoSms code={demoCode} onPaste={() => paste(demoCode)} />}

        <CtaButton
          type="submit"
          className={demoCode ? "rhythm-md" : "rhythm-md mt-6"}
          disabled={!complete || pending}
        >
          {pending ? "Verifying…" : verify.cta}
        </CtaButton>
      </form>

      <p className="text-center text-[0.85rem] text-faint">
        {secondsLeft > 0 ? (
          <>Resend code in {secondsLeft}s</>
        ) : (
          <button
            type="button"
            onClick={resend}
            disabled={resending}
            className="font-semibold text-brand transition-colors hover:text-brand-soft disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend code"}
          </button>
        )}
      </p>
      {resendError && (
        <p
          role="alert"
          className="mt-2 text-center text-[0.8rem] font-semibold text-danger"
        >
          {resendError}
        </p>
      )}
    </>
  );
}

/* Stands in for the real SMS while there is no gateway, so the flow is not a
   locked door in development. */
function DemoSms({ code, onPaste }: { code: string; onPaste: () => void }) {
  return (
    <div className="rhythm-md mt-4 flex items-center gap-3 rounded-xl border border-hairline bg-surface-subtle p-3">
      <span
        aria-hidden
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand"
      >
        <MessageSquare size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.7rem] font-bold tracking-wide text-faint">
          {verify.sender} · now
        </span>
        <span className="block truncate text-[0.85rem] text-ink">
          {verify.smsBody.replace("%s", code)}
        </span>
      </span>
      <button
        type="button"
        onClick={onPaste}
        className="shrink-0 rounded-lg border border-hairline px-3 py-1.5 text-[0.8rem] font-semibold text-brand transition-colors hover:border-brand/40 hover:bg-brand/10"
      >
        Paste
      </button>
    </div>
  );
}
