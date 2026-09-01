import { AuthShell, AuthCard } from "@/components/auth/auth-shell";
import { VerifyForm } from "@/components/auth/verify-form";

export default function VerifyPage() {
  return (
    <AuthShell>
      <AuthCard>
        <VerifyForm />
      </AuthCard>
    </AuthShell>
  );
}
