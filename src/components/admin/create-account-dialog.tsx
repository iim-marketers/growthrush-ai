"use client";

import { useActionState, useEffect, useState, startTransition } from "react";
import { Check, Copy, Eye, EyeOff, Info, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { keepOpenOnToast } from "@/components/ui/sonner";
import { createLeadAccount } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

export function CreateAccountDialog() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setFormKey((key) => key + 1);
      }}
    >
      <DialogTrigger asChild>
        <Button className="rounded-lg font-semibold">
          <Plus data-icon="inline-start" />
          New lead account
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={keepOpenOnToast}
      >
        <CreateAccountForm key={formKey} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateAccountForm({ onDone }: { onDone: () => void }) {
  const [state, action, pending] = useActionState(createLeadAccount, {});
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  if (state.ok) {
    return (
      <CreatedAccount
        name={state.name ?? ""}
        email={state.email ?? ""}
        password={state.password ?? ""}
        onDone={onDone}
      />
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      className="flex flex-col gap-5"
    >
      <DialogHeader>
        <DialogTitle className="font-display text-lg font-bold text-ink">
          New lead account
        </DialogTitle>
        <DialogDescription>
          Create login details for a customer. You can add leads to the account
          once it&apos;s created.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="account-name">Name</Label>
          <Input
            id="account-name"
            name="name"
            required
            maxLength={120}
            autoComplete="off"
            autoFocus
            placeholder="e.g. John Doe"
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="account-phone">Phone number</Label>
          <Input
            id="account-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="off"
            placeholder="e.g. 9876543210"
            className="h-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="account-email">Email</Label>
        <Input
          id="account-email"
          name="email"
          type="email"
          autoComplete="off"
          required
          placeholder="e.g. john.doe@company.com"
          aria-describedby="account-email-note"
          className="h-10"
        />
        <p
          id="account-email-note"
          className="flex gap-1.5 text-xs leading-relaxed text-faint"
        >
          <Info className="mt-0.5 size-3.5 shrink-0" />
          Use the customer&apos;s real, working email. Changing the password
          later needs a one-time code (OTP) sent to this address.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="account-password">Password</Label>
        <InputGroup className="h-10">
          <InputGroupInput
            id="account-password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
          />
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

      <DialogFooter>
        <Button type="submit" disabled={pending} className="font-semibold">
          {pending ? "Creating…" : "Create account"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function CreatedAccount({
  name,
  email,
  password,
  onDone,
}: {
  name: string;
  email: string;
  password: string;
  onDone: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Email: ${email}\nPassword: ${password}`,
      );
      setCopied(true);
    } catch {}
  };

  return (
    <div className="flex flex-col gap-5">
      <DialogHeader>
        <span className="flex size-10 items-center justify-center rounded-full bg-success/12 text-success">
          <Check className="size-5" />
        </span>
        <DialogTitle className="font-display text-lg font-bold text-ink">
          Account created
        </DialogTitle>
        <DialogDescription>
          Share these login details with {name}. The password can&apos;t be
          shown again after you close this.
        </DialogDescription>
      </DialogHeader>

      <dl className="grid gap-3 rounded-xl bg-surface-hover p-4 text-sm">
        <div>
          <dt className="text-xs text-faint">Email</dt>
          <dd className="font-semibold break-all text-ink">{email}</dd>
        </div>
        <div>
          <dt className="text-xs text-faint">Password</dt>
          <dd className="font-mono font-semibold break-all text-ink">
            {password}
          </dd>
        </div>
      </dl>

      <DialogFooter>
        <Button variant="outline" onClick={copy}>
          {copied ? <Check className="text-success" /> : <Copy />}
          {copied ? "Copied" : "Copy details"}
        </Button>
        <Button onClick={onDone} className="font-semibold">
          Done
        </Button>
      </DialogFooter>
    </div>
  );
}
