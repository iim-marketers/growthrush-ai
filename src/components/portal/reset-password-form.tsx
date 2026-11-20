"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import {
  requestPasswordReset,
  setNewPassword,
} from "@/app/customer-portal/forgot-password-actions";
import { PortalFormError } from "@/components/portal/login-shell";
import { PasswordField } from "@/components/portal/password-field";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

const fieldClass = "h-12 rounded-xl bg-white";
const submitClass = "h-12 w-full rounded-xl text-base font-semibold";

export function ForgotPasswordForm({ defaultEmail }: { defaultEmail: string }) {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);
  const [email, setEmail] = useState(defaultEmail);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.error) emailRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="reset-email">Email</Label>
        <InputGroup className={fieldClass}>
          <InputGroupInput
            ref={emailRef}
            id="reset-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@business.com"
            className="text-base"
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
        <p className="text-xs text-faint">
          We&apos;ll email a 6-digit code to this address.
        </p>
      </div>

      <PortalFormError message={state?.error} />

      <Button type="submit" className={submitClass} disabled={pending}>
        {pending ? "Sending code…" : "Send code"}
        {!pending && <ArrowRight data-icon="inline-end" />}
      </Button>
    </form>
  );
}

export function NewPasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(setNewPassword, undefined);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.error) passwordRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input
        type="email"
        name="username"
        autoComplete="username"
        value={email}
        readOnly
        hidden
      />
      <PasswordField
        ref={passwordRef}
        id="new-password"
        name="password"
        label="New password"
        placeholder="At least 8 characters"
        value={password}
        onChange={setPassword}
      />
      <PasswordField
        id="confirm-password"
        name="confirm"
        label="Confirm new password"
        placeholder="Type it again"
        value={confirm}
        onChange={setConfirm}
      />

      <PortalFormError message={state?.error} />

      <Button type="submit" className={submitClass} disabled={pending}>
        {pending ? "Saving…" : "Save & sign in"}
        {!pending && <ArrowRight data-icon="inline-end" />}
      </Button>
    </form>
  );
}
