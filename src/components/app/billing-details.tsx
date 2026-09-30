"use client";

import { useActionState, useState } from "react";
import { Loader2, MapPin, Pencil } from "lucide-react";
import { saveBillingDetails } from "@/app/(app)/billing/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BillingDetailsValue } from "@/lib/billing";
import { indianStates, stateName } from "@/lib/gst";
import { cn } from "@/lib/utils";

export function BillingDetails({
  details,
}: {
  details: BillingDetailsValue | null;
}) {
  const [editing, setEditing] = useState(!details);
  const [state, action, pending] = useActionState(
    async (...args: Parameters<typeof saveBillingDetails>) => {
      const result = await saveBillingDetails(...args);
      if (result?.saved) setEditing(false);
      return result;
    },
    undefined,
  );

  return (
    <Card id="billing-details" className="mt-4 gap-0 rounded-2xl py-0">
      <CardHeader className="border-b border-hairline px-6 py-4!">
        <CardTitle className="font-display text-base font-bold text-ink">
          Billing details
        </CardTitle>
        <CardDescription>
          Printed on your GST invoices, which are emailed to you. Your state
          decides the GST split.
        </CardDescription>
        {details && !editing && (
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil aria-hidden />
              Edit
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="px-6 py-5">
        {details && !editing ? (
          <Summary details={details} />
        ) : (
          <form action={action} className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name to bill"
              name="name"
              defaultValue={details?.name}
              autoComplete="organization"
              maxLength={100}
              placeholder="Business or your full name"
              className="sm:col-span-2"
            />
            <Field
              label="Email for invoices"
              name="email"
              type="email"
              inputMode="email"
              defaultValue={details?.email}
              autoComplete="email"
              maxLength={64}
              className="sm:col-span-2"
            />
            <Field
              label="Address line 1"
              name="line1"
              defaultValue={details?.line1}
              autoComplete="address-line1"
              maxLength={100}
              className="sm:col-span-2"
            />
            <Field
              label="Address line 2"
              name="line2"
              defaultValue={details?.line2 ?? ""}
              autoComplete="address-line2"
              maxLength={100}
              optional
              className="sm:col-span-2"
            />
            <Field
              label="City"
              name="city"
              defaultValue={details?.city}
              autoComplete="address-level2"
              maxLength={50}
            />
            <div className="grid gap-2">
              <Label htmlFor="billing-state">State</Label>
              <select
                id="billing-state"
                name="state"
                required
                defaultValue={details?.stateCode ?? ""}
                autoComplete="address-level1"
                className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-base text-ink outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              >
                <option value="" disabled>
                  Choose a state
                </option>
                {indianStates.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <Field
              label="PIN code"
              name="pincode"
              defaultValue={details?.pincode}
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength={6}
              pattern="[1-9][0-9]{5}"
            />
            <Field
              label="GSTIN"
              name="gstin"
              defaultValue={details?.gstin ?? ""}
              maxLength={15}
              optional
              placeholder="Only if you want to claim input credit"
              inputClassName="uppercase placeholder:normal-case"
            />

            {state?.error && (
              <p
                role="alert"
                className="text-sm font-semibold text-danger sm:col-span-2"
              >
                {state.error}
              </p>
            )}

            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" size="lg" disabled={pending}>
                {pending && <Loader2 aria-hidden className="animate-spin" />}
                {pending ? "Saving…" : "Save billing details"}
              </Button>
              {details && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function Summary({ details }: { details: BillingDetailsValue }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
        <MapPin aria-hidden className="size-4" />
      </span>
      <div className="min-w-0 leading-relaxed">
        <p className="font-semibold text-ink">{details.name}</p>
        <p className="text-subtle">
          {[details.line1, details.line2].filter(Boolean).join(", ")}
        </p>
        <p className="text-subtle">
          {details.city}, {stateName(details.stateCode)} {details.pincode}
        </p>
        <p className="text-subtle">{details.email}</p>
        {details.gstin && (
          <p className="mt-1 font-mono text-xs text-faint">
            GSTIN {details.gstin}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  optional,
  className,
  inputClassName,
  ...props
}: {
  label: string;
  name: string;
  optional?: boolean;
  inputClassName?: string;
} & React.ComponentProps<"input">) {
  const id = `billing-${name}`;
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-faint">(optional)</span>}
      </Label>
      <Input
        id={id}
        name={name}
        required={!optional}
        className={cn("h-10", inputClassName)}
        {...props}
      />
    </div>
  );
}
