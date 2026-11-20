import type { Metadata } from "next";
import { KeyRound, Mail, Smartphone, Store } from "lucide-react";
import { ChangePasswordForm } from "@/components/portal/change-password-form";
import { PortalPageTitle } from "@/components/portal/primitives";
import { requirePortalAccount } from "@/lib/portal/session";

export const metadata: Metadata = { title: "Settings" };

export default async function PortalSettingsPage() {
  const account = await requirePortalAccount();

  const details = [
    { label: "Business name", value: account.name || "—", icon: Store },
    { label: "Mobile number", value: account.phone, icon: Smartphone },
    { label: "Email", value: account.email ?? "Not added", icon: Mail },
  ];

  return (
    <>
      <PortalPageTitle title="Settings" subtitle="Your account details and sign-in password." />

      <div className="grid max-w-3xl gap-4">
        <section className="rounded-2xl border border-hairline bg-white">
          <div className="border-b border-hairline px-5 py-4">
            <h2 className="font-display text-base font-bold text-ink">Account</h2>
            <p className="mt-0.5 text-sm text-faint">
              To change these, contact your growthrush.ai account manager.
            </p>
          </div>
          <dl className="divide-y divide-hairline">
            {details.map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-5 py-3.5">
                <item.icon className="size-4 shrink-0 text-faint" />
                <dt className="w-32 shrink-0 text-sm text-subtle">{item.label}</dt>
                <dd className="min-w-0 truncate text-sm font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-2xl border border-hairline bg-white">
          <div className="flex items-start gap-3 border-b border-hairline px-5 py-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <KeyRound className="size-4.5" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink">Change password</h2>
              <p className="mt-0.5 text-sm text-faint">
                {account.email
                  ? "Used to sign in with your email. Changing it signs you out on other devices."
                  : "Passwords are used with email sign-in. Your account has no email, so you sign in with mobile OTP."}
              </p>
            </div>
          </div>
          <div className="max-w-md px-5 py-5">
            {account.email ? (
              <ChangePasswordForm email={account.email} />
            ) : (
              <p className="text-sm text-subtle">
                Ask your growthrush.ai account manager to add an email to your account to use a password.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
