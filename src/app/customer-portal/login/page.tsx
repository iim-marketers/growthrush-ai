import { PortalLoginForm } from "@/components/portal/login-form";
import { PortalLoginShell } from "@/components/portal/login-shell";

export default function PortalLoginPage() {
  return (
    <PortalLoginShell>
      <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
        Customer portal
      </p>
      <h1 className="text-[clamp(1.6rem,1.3rem+1vw,2rem)] leading-tight text-ink">
        Sign in to your account
      </h1>
      <p className="mt-2 mb-8 text-[0.95rem] text-subtle">
        Use your registered mobile number or email.
      </p>
      <PortalLoginForm />
    </PortalLoginShell>
  );
}
