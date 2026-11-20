import type { Metadata } from "next";
import { KeyRound, Lock, Mail, MessageSquareText, ShieldCheck, Smartphone, Store } from "lucide-react";
import { ChangePasswordForm } from "@/components/portal/change-password-form";
import { PortalPageTitle } from "@/components/portal/primitives";
import { requirePortalAccount } from "@/lib/portal/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Settings" };

export default async function PortalSettingsPage() {
  const account = await requirePortalAccount();
  const name = account.name || "Your business";

  const details = [
    { label: "Business name", value: account.name || "—", icon: Store, tint: "bg-grape/10 text-grape" },
    { label: "Mobile number", value: account.phone, icon: Smartphone, tint: "bg-success/12 text-success" },
    {
      label: "Email",
      value: account.email ?? "Not added",
      icon: Mail,
      tint: "bg-orange/12 text-orange",
      muted: !account.email,
    },
  ];

  const methods = [
    { label: "Mobile OTP", hint: account.phone, icon: MessageSquareText, active: true },
    {
      label: "Email & password",
      hint: account.email ?? "Needs an email on your account",
      icon: KeyRound,
      active: Boolean(account.email),
    },
  ];

  return (
    <>
      <PortalPageTitle title="Settings" subtitle="Your account details and sign-in password." />

      <section className="mb-4 flex flex-wrap items-center gap-4 rounded-2xl border border-hairline bg-white p-5 sm:p-6">
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand/10 font-display text-xl font-extrabold text-brand"
        >
          {name.trim().charAt(0).toUpperCase() || "?"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold text-ink">{name}</p>
          <p className="truncate text-sm text-subtle tabular-nums">{account.email ?? account.phone}</p>
        </div>
        <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-success/12 px-3 text-xs font-semibold text-success">
          <ShieldCheck className="size-3.5" />
          Active account
        </span>
      </section>

      <div className="grid items-start gap-4 lg:grid-cols-5">
        <section className="rounded-2xl border border-hairline bg-white lg:col-span-3">
          <div className="flex items-start gap-3 border-b border-hairline px-5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <KeyRound className="size-4.5" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink">Change password</h2>
              <p className="mt-0.5 text-sm text-faint">
                {account.email
                  ? "Used to sign in with your email. Changing it signs you out on other devices."
                  : "Passwords are used with email sign-in."}
              </p>
            </div>
          </div>
          <div className="px-5 py-5 sm:max-w-md">
            {account.email ? (
              <ChangePasswordForm email={account.email} />
            ) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-hairline bg-surface-subtle px-6 py-10 text-center">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white text-faint">
                  <Lock className="size-5" />
                </span>
                <p className="mt-3 font-semibold text-ink">No password on this account</p>
                <p className="mt-1 max-w-xs text-sm text-subtle">
                  You sign in with a mobile OTP. Ask your growthrush.ai account manager to add an email if you
                  want to use a password too.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-4 lg:col-span-2">
          <section className="rounded-2xl border border-hairline bg-white">
            <div className="border-b border-hairline px-5 py-4">
              <h2 className="font-display text-base font-bold text-ink">Account</h2>
              <p className="mt-0.5 text-sm text-faint">Managed by your growthrush.ai account manager.</p>
            </div>
            <dl className="flex flex-col gap-1 p-2">
              {details.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", item.tint)}>
                    <item.icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-faint">{item.label}</dt>
                    <dd
                      className={cn(
                        "truncate text-sm font-semibold tabular-nums",
                        item.muted ? "text-faint" : "text-ink",
                      )}
                    >
                      {item.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-hairline bg-white">
            <div className="border-b border-hairline px-5 py-4">
              <h2 className="font-display text-base font-bold text-ink">Sign-in methods</h2>
              <p className="mt-0.5 text-sm text-faint">Ways you can log in to this portal.</p>
            </div>
            <ul className="divide-y divide-hairline">
              {methods.map((method) => (
                <li key={method.label} className="flex items-center gap-3 px-5 py-3.5">
                  <method.icon className="size-4 shrink-0 text-faint" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{method.label}</p>
                    <p className="truncate text-xs text-faint tabular-nums">{method.hint}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
                      method.active ? "bg-success/12 text-success" : "bg-surface-subtle text-faint",
                    )}
                  >
                    <span aria-hidden className="size-1.5 rounded-full bg-current" />
                    {method.active ? "On" : "Off"}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
