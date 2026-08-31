"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Logo } from "@/components/logo";
import { CtaButton } from "@/components/cta-button";
import { ConsentCheckbox } from "@/components/consent-checkbox";
import { account, brand, pitch } from "@/lib/data";

export default function LoginPage() {
  /* Consent is required before the account is created, so it gates Continue. */
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="relative min-h-dvh w-full bg-background">
      {/* Decorative only — clipped to the viewport so it never drives scroll. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="glow -top-[15%] -right-[10%]"
          style={{
            background:
              "radial-gradient(circle, rgba(91,127,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="glow -bottom-[15%] -left-[10%]"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/*
        Phones/tablets get a single centred column; from lg the pitch moves
        alongside the form so wide screens are not mostly empty.
      */}
      <div className="relative z-[1] mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center screen-pad-y gap-10 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-10 xl:gap-24">
        <PitchPanel />

        <div className="glass-panel glass-panel-roomy animate-slide-up w-full max-w-[26rem] shrink-0 sm:max-w-[27rem] lg:mx-0">
          {/* On lg the pitch panel carries the logo, so hide this one. */}
          <Logo
            size="md"
            glow
            className="hide-on-short rhythm-lg justify-center lg:hidden"
          />

          <h1 className="mb-2 text-center text-[clamp(1.5rem,1.2rem+1.4vw,2rem)] lg:text-left">
            Welcome back
          </h1>
          <p className="rhythm-lg text-center text-[0.95rem] text-subtle lg:text-left">
            Enter your mobile number to continue
          </p>

          <div className="rhythm-md flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 transition-all focus-within:border-brand focus-within:bg-white/[0.06] focus-within:ring-[3px] focus-within:ring-brand/15 sm:px-4">
            <div className="mr-3 shrink-0 border-r border-white/10 pr-3 font-semibold text-subtle sm:mr-4 sm:pr-4">
              {account.countryCode} {account.dialCode}
            </div>
            <input
              type="tel"
              placeholder="Mobile number"
              className="w-full min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-faint sm:text-[1.1rem]"
            />
          </div>

          <ConsentCheckbox
            checked={agreed}
            onChange={setAgreed}
            className="rhythm-md"
          />

          <CtaButton className="rhythm-lg" disabled={!agreed}>
            Continue
          </CtaButton>

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
        </div>
      </div>
    </div>
  );
}

/** The value proposition. Only rendered from lg up, where there is room for it. */
function PitchPanel() {
  return (
    <section className="hidden max-w-xl flex-col lg:flex">
      <Logo size="lg" glow />

      <h2 className="mt-8 text-[clamp(2rem,1.4rem+1.8vw,3rem)] leading-[1.1]">
        {pitch.headline}{" "}
        <span className="text-brand">{pitch.headlineAccent}</span>.
      </h2>

      <p className="mt-5 max-w-lg text-lg leading-relaxed text-subtle">
        {pitch.body}
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {pitch.points.map((point) => (
          <li key={point} className="flex items-center gap-3 text-subtle">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
              <Check size={14} strokeWidth={3} />
            </span>
            {point}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex items-center gap-3">
        <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-sm font-bold text-amber-400">
          {brand.rating}
        </span>
        <span className="text-sm text-faint">businesses growing with us</span>
      </div>
    </section>
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
      className={`flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 text-base font-semibold text-ink transition-all hover:border-white/20 hover:bg-white/[0.08] ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      disabled={disabled}
    >
      {children}
      {label}
    </button>
  );
}
