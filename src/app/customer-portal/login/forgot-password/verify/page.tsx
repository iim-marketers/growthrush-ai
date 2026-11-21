import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  resendPasswordResetCode,
  verifyPasswordResetCode,
} from "@/app/customer-portal/forgot-password-actions";
import { PortalLoginShell } from "@/components/portal/login-shell";
import { PortalVerifyForm } from "@/components/portal/verify-form";
import { OTP_LENGTH, portalResendWait } from "@/lib/portal/otp";
import { currentPasswordReset, maskEmail } from "@/lib/portal/reset";

export const metadata: Metadata = {
  title: "Check your email",
};

export default async function ResetVerifyPage() {
  const pending = await currentPasswordReset();
  if (!pending) redirect("/customer-portal/login/forgot-password");

  return (
    <PortalLoginShell>
      <PortalVerifyForm
        masked={maskEmail(pending.account.email)}
        length={OTP_LENGTH}
        initialWait={portalResendWait(pending.challenge)}
        demoCode={null}
        verifyAction={verifyPasswordResetCode}
        resendAction={resendPasswordResetCode}
        back={{ href: "/customer-portal/login/forgot-password", label: "Use a different email" }}
        submitLabel="Verify code"
      />
    </PortalLoginShell>
  );
}
