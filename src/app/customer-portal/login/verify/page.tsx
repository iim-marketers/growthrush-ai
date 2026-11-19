import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PortalLoginShell } from "@/components/portal/login-shell";
import { PortalVerifyForm } from "@/components/portal/verify-form";
import { STUB_CODE, otpStubEnabled } from "@/lib/auth/sms";
import { maskNumber } from "@/lib/phone";
import { currentPortalChallenge, OTP_LENGTH, portalResendWait } from "@/lib/portal/otp";

export const metadata: Metadata = {
  title: "Verify your number",
};

export default async function PortalVerifyPage() {
  const challenge = await currentPortalChallenge();
  if (!challenge) redirect("/customer-portal/login");

  return (
    <PortalLoginShell>
      <PortalVerifyForm
        masked={maskNumber(challenge.phone)}
        length={OTP_LENGTH}
        initialWait={portalResendWait(challenge)}
        demoCode={otpStubEnabled() ? STUB_CODE : null}
      />
    </PortalLoginShell>
  );
}
