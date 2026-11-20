"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Smartphone } from "lucide-react";
import {
  requestPortalOtp,
  signInWithPassword,
} from "@/app/customer-portal/actions";
import { PortalFormError } from "@/components/portal/login-shell";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toE164 } from "@/lib/phone";

type Method = "phone" | "email";

const fieldClass = "h-12 rounded-xl bg-white";
const submitClass = "h-12 w-full rounded-xl text-base font-semibold";

export function PortalLoginForm() {
  const [method, setMethod] = useState<Method>("phone");

  return (
    <Tabs
      value={method}
      onValueChange={(value) => setMethod(value as Method)}
      className="gap-6"
    >
      <TabsList className="h-11! w-full rounded-xl p-1">
        <TabsTrigger value="phone" className="rounded-lg font-semibold">
          <Smartphone />
          Mobile
        </TabsTrigger>
        <TabsTrigger value="email" className="rounded-lg font-semibold">
          <Mail />
          Email
        </TabsTrigger>
      </TabsList>

      <TabsContent value="phone">
        <PhoneForm />
      </TabsContent>
      <TabsContent value="email">
        <EmailForm onUsePhone={() => setMethod("phone")} />
      </TabsContent>
    </Tabs>
  );
}

function PhoneForm() {
  const [state, action, pending] = useActionState(requestPortalOtp, undefined);
  const [number, setNumber] = useState("");

  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="portal-phone">Registered mobile number</Label>
        <InputGroup className={fieldClass}>
          <InputGroupInput
            id="portal-phone"
            type="tel"
            name="phone"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            value={number}
            onChange={(event) =>
              setNumber(event.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="98765 43210"
            className="text-base tabular-nums"
          />
          <InputGroupAddon>
            <InputGroupText className="font-semibold text-ink">
              +91
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <p className="text-xs text-faint">
          We&apos;ll send a 6-digit code to this number.
        </p>
      </div>

      <PortalFormError message={state?.error} />

      <Button
        type="submit"
        className={submitClass}
        disabled={toE164(number) === null || pending}
      >
        {pending ? "Sending code…" : "Get OTP"}
        {!pending && <ArrowRight data-icon="inline-end" />}
      </Button>
    </form>
  );
}

function EmailForm({ onUsePhone }: { onUsePhone: () => void }) {
  const [state, action, pending] = useActionState(
    signInWithPassword,
    undefined,
  );
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!state?.error) return;
    const target = emailRef.current?.value
      ? passwordRef.current
      : emailRef.current;
    target?.focus();
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="portal-email">Email</Label>
        <InputGroup className={fieldClass}>
          <InputGroupInput
            ref={emailRef}
            id="portal-email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            autoComplete="username"
            required
            placeholder="you@business.com"
            className="text-base"
          />
          <InputGroupAddon>
            <Mail />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="portal-password">Password</Label>
          <Link
            href={
              email.trim()
                ? `/customer-portal/login/forgot-password?email=${encodeURIComponent(email.trim())}`
                : "/customer-portal/login/forgot-password"
            }
            className="text-sm font-semibold text-brand hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <InputGroup className={fieldClass}>
          <InputGroupInput
            ref={passwordRef}
            id="portal-password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Your password"
            className="text-base"
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

      <PortalFormError message={state?.error} />

      <Button type="submit" className={submitClass} disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
        {!pending && <ArrowRight data-icon="inline-end" />}
      </Button>

      <p className="text-center text-sm text-faint">
        No email on your account?{" "}
        <button
          type="button"
          onClick={onUsePhone}
          className="font-semibold text-brand hover:underline"
        >
          Sign in with mobile OTP
        </button>
      </p>
    </form>
  );
}
