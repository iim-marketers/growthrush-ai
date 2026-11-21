import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalLoginShell } from "@/components/portal/login-shell";
import { NewPasswordForm } from "@/components/portal/reset-password-form";
import { getResetGrant } from "@/lib/portal/reset";

export const metadata: Metadata = {
  title: "Choose a new password",
};

export default async function NewPasswordPage() {
  const account = await getResetGrant();
  if (!account?.email) redirect("/customer-portal/login/forgot-password");

  return (
    <PortalLoginShell>
      <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2rem)] leading-tight text-ink">
        Choose a new password
      </h1>
      <p className="mt-2 mb-8 text-[0.95rem] text-subtle">
        For <span className="font-semibold text-ink">{account.email}</span>. You&apos;ll be signed
        out on your other devices.
      </p>
      <NewPasswordForm email={account.email} />
    </PortalLoginShell>
  );
}
