"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Clickwrap consent for the policies under /legal.
 *
 * Deliberately unticked by default and never pre-checked: under the DPDP Act
 * consent must be a free, specific and unambiguous affirmative action, which a
 * pre-ticked box or a passive "by continuing…" line does not give you. The
 * caller is responsible for keeping its submit control disabled until this is
 * ticked.
 */
export function ConsentCheckbox({
  id = "policy-consent",
  checked,
  onChange,
  className,
}: {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-[0.3rem] border border-line-strong bg-surface-hover transition-colors checked:border-brand checked:bg-brand focus-visible:ring-[3px] focus-visible:ring-brand/30 focus-visible:outline-none"
        />
        <Check
          size={13}
          strokeWidth={3}
          aria-hidden
          className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
        />
      </span>

      <label
        htmlFor={id}
        className="cursor-pointer text-[0.85rem] leading-relaxed text-subtle"
      >
        I have read and agree to the{" "}
        <PolicyLink href="/legal/terms">Terms and Conditions</PolicyLink>,{" "}
        <PolicyLink href="/legal/privacy">Privacy Policy</PolicyLink> and{" "}
        <PolicyLink href="/legal/refunds">Return and Refund Policy</PolicyLink>.
      </label>
    </div>
  );
}

/** Opens in a new tab so a half-filled login form is not lost to a policy read. */
function PolicyLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener"
      className="font-semibold text-brand underline-offset-2 hover:underline"
    >
      {children}
    </Link>
  );
}
