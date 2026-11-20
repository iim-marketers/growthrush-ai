import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PortalLoginShell } from "@/components/portal/login-shell";
import { ForgotPasswordForm } from "@/components/portal/reset-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
};

export default async function ForgotPasswordPage({
  searchParams,
}: PageProps<"/customer-portal/login/forgot-password">) {
  const { email } = await searchParams;

  return (
    <PortalLoginShell>
      <Link
        href="/customer-portal/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-subtle hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to sign in
      </Link>
      <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2rem)] leading-tight text-ink">
        Forgot your password?
      </h1>
      <p className="mt-2 mb-8 text-[0.95rem] text-subtle">
        Enter the email on your account and we&apos;ll send you a code to reset it.
      </p>
      <ForgotPasswordForm defaultEmail={typeof email === "string" ? email : ""} />
    </PortalLoginShell>
  );
}
