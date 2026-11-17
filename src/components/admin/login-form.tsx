"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { adminSignIn } from "@/app/admin/actions";
import { CtaButton } from "@/components/cta-button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const [state, action, pending] = useActionState(adminSignIn, {});
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  if (!configured) {
    return (
      <p role="alert" className="rounded-xl bg-danger/8 p-4 text-sm text-danger">
        Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in
        the server environment.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-email">Email</Label>
        <InputGroup className="h-11 rounded-xl">
          <InputGroupInput
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            autoFocus
            placeholder="admin@growthrush.ai"
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="admin-password">Password</Label>
        <InputGroup className="h-11 rounded-xl">
          <InputGroupInput
            id="admin-password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
          <InputGroupAddon>
            <Lock />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              onClick={() => setShow((value) => !value)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <CtaButton type="submit" disabled={pending} className="mt-2">
        {pending ? "Signing in…" : "Sign in"}
      </CtaButton>
    </form>
  );
}
