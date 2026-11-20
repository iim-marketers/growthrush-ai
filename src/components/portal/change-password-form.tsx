"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Circle, CircleCheck } from "lucide-react";
import { toast } from "sonner";
import { changePortalPassword } from "@/app/customer-portal/settings-actions";
import { PortalFormError } from "@/components/portal/login-shell";
import { PasswordField } from "@/components/portal/password-field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MIN_PORTAL_PASSWORD = 8;

export function ChangePasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(changePortalPassword, undefined);
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [handled, setHandled] = useState(state);
  const currentRef = useRef<HTMLInputElement>(null);

  if (state !== handled) {
    setHandled(state);
    if (state?.ok) {
      setCurrent("");
      setPassword("");
      setConfirm("");
    }
  }

  useEffect(() => {
    if (state?.ok) toast.success("Password updated. Other devices have been signed out.");
    else if (state?.error === "Your current password is incorrect.") currentRef.current?.focus();
  }, [state]);

  const checks = [
    { label: `At least ${MIN_PORTAL_PASSWORD} characters`, ok: password.length >= MIN_PORTAL_PASSWORD },
    { label: "Different from your current password", ok: Boolean(password) && password !== current },
    { label: "Both new passwords match", ok: Boolean(confirm) && password === confirm },
  ];

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <PasswordField
        ref={currentRef}
        id="current-password"
        name="current"
        label="Current password"
        placeholder="Your current password"
        value={current}
        onChange={setCurrent}
        autoComplete="current-password"
        minLength={1}
      />
      <PasswordField
        id="settings-new-password"
        name="password"
        label="New password"
        placeholder="At least 8 characters"
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        id="settings-confirm-password"
        name="confirm"
        label="Confirm new password"
        placeholder="Type it again"
        value={confirm}
        onChange={setConfirm}
      />

      <ul className="flex flex-col gap-1.5 rounded-xl bg-surface-subtle px-4 py-3">
        {checks.map((check) => (
          <li
            key={check.label}
            className={cn("flex items-center gap-2 text-sm", check.ok ? "text-success" : "text-faint")}
          >
            {check.ok ? <CircleCheck className="size-4 shrink-0" /> : <Circle className="size-4 shrink-0" />}
            {check.label}
          </li>
        ))}
      </ul>

      <PortalFormError message={state?.error} />

      <Button
        type="submit"
        className="h-11 rounded-xl font-semibold sm:self-start sm:px-6"
        disabled={pending || !current || !password || !confirm}
      >
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
