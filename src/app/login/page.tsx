"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell, AuthCard } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/cta-button";
import { ConsentCheckbox } from "@/components/consent-checkbox";
import { account } from "@/lib/data";
import { PENDING_NUMBER_KEY } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [number, setNumber] = useState("");

  /* Indian mobile numbers are ten digits; anything shorter is a typo. */
  const complete = number.length === 10;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!complete || !agreed) return;
    /* No backend yet — hand the number to the verify screen for its masked
       heading. sessionStorage rather than a query param: a phone number in a
       URL ends up in history and server logs. */
    sessionStorage.setItem(PENDING_NUMBER_KEY, number);
    router.push("/login/verify");
  };

  return (
    <AuthShell>
      <AuthCard>
        <h1 className="mb-2 text-center text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] lg:text-left">
          Welcome back
        </h1>
        <p className="rhythm-lg text-center text-[0.95rem] text-subtle lg:text-left">
          Enter your mobile number to continue
        </p>

        <form onSubmit={submit} noValidate>
          <div className="rhythm-md flex items-center rounded-xl border border-white/10 bg-white/3 px-3 py-2 transition-all focus-within:border-brand focus-within:bg-white/6 focus-within:ring-[3px] focus-within:ring-brand/15 sm:px-4">
            <div className="mr-3 shrink-0 border-r border-white/10 pr-3 font-semibold text-subtle sm:mr-4 sm:pr-4">
              {account.countryCode} {account.dialCode}
            </div>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              aria-label="Mobile number"
              value={number}
              onChange={(event) =>
                setNumber(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Mobile number"
              className="w-full min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint sm:text-[1.1rem]"
            />
          </div>

          <ConsentCheckbox
            checked={agreed}
            onChange={setAgreed}
            className="rhythm-md"
          />

          <CtaButton type="submit" className="rhythm-lg" disabled={!agreed || !complete}>
            Continue
          </CtaButton>
        </form>

        <div className="rhythm-md flex items-center text-[0.85rem] text-faint before:flex-1 before:border-b before:border-white/10 after:flex-1 after:border-b after:border-white/10">
          <span className="px-4">or continue with</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:gap-3">
          <SocialButton label="Google" disabled>
            <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </SocialButton>
        </div>
      </AuthCard>
    </AuthShell>
  );
}

function SocialButton({
  disabled,
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 text-base font-semibold text-ink transition-all hover:border-white/20 hover:bg-white/8 ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={disabled}
    >
      {children}
      {label}
    </button>
  );
}
