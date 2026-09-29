import { redirect } from "next/navigation";
import { AuthShell, AuthCard } from "@/components/auth/auth-shell";
import { VerifyForm } from "@/components/auth/verify-form";
import { currentChallenge, resendWait } from "@/lib/auth/otp";
import { STUB_CODE, otpStubEnabled } from "@/lib/auth/sms";
import { maskNumber } from "@/lib/phone";

export default async function VerifyPage() {
  /* No live code for this browser — nothing to verify, so start over. */
  const challenge = await currentChallenge();
  if (!challenge) redirect("/login");

  return (
    <AuthShell>
      <AuthCard>
        <VerifyForm
          masked={maskNumber(challenge.phone)}
          initialWait={resendWait(challenge)}
          demoCode={otpStubEnabled() ? STUB_CODE : null}
        />
      </AuthCard>
    </AuthShell>
  );
}
