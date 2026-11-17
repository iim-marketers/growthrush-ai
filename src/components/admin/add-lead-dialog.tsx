"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  startTransition,
} from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { keepOpenOnToast } from "@/components/ui/sonner";
import { addAccountLead } from "@/app/admin/actions";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { accountLeadStatuses } from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

export function AddLeadDialog({ accountId }: { accountId: string }) {
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
          Add lead
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={keepOpenOnToast}
      >
        <AddLeadForm
          key={formKey}
          accountId={accountId}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddLeadForm({
  accountId,
  onDone,
}: {
  accountId: string;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(addAccountLead, {});
  const form = useRef<HTMLFormElement>(null);
  const name = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      return;
    }
    if (!state.ok) return;
    toast.success("Lead added");
    form.current?.reset();
    name.current?.focus();
  }, [state]);

  return (
    <form
      ref={form}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        startTransition(() => action(data));
      }}
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="accountId" value={accountId} />
      <DialogHeader>
        <DialogTitle className="font-display text-lg font-bold text-ink">
          Add lead
        </DialogTitle>
        <DialogDescription>
          The form stays open after saving so you can add the next lead.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-name">Name</Label>
          <Input
            ref={name}
            id="lead-name"
            name="name"
            required
            maxLength={120}
            autoComplete="off"
            autoFocus
            placeholder="Full name"
            className="h-10"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="lead-phone">Phone number</Label>
          <Input
            id="lead-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="off"
            placeholder="9876543210"
            className="h-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-city">City</Label>
        <Input
          id="lead-city"
          name="city"
          maxLength={80}
          autoComplete="off"
          placeholder="e.g. Kolkata"
          className="h-10"
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-ink">Status</legend>
        <div className="grid grid-cols-3 gap-2">
          {accountLeadStatuses.map((status) => (
            <label
              key={status.id}
              className={cn(
                "flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-hairline px-3 py-2 text-sm font-medium text-subtle transition-colors",
                "hover:border-line-strong has-checked:border-brand has-checked:bg-brand/5 has-checked:text-ink",
                "has-focus-visible:ring-3 has-focus-visible:ring-brand/20",
              )}
            >
              <input
                type="radio"
                name="status"
                value={status.id}
                defaultChecked={status.id === "follow_up"}
                className="sr-only"
              />
              <span
                aria-hidden
                className={cn("size-2 rounded-full", status.dot)}
              />
              {status.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lead-comment">Comment</Label>
        <Textarea
          id="lead-comment"
          name="comment"
          rows={3}
          maxLength={1000}
          placeholder="Notes about the enquiry, call outcome…"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          {state.ok ? "Done" : "Cancel"}
        </Button>
        <Button type="submit" disabled={pending} className="font-semibold">
          {pending ? "Saving…" : "Save lead"}
        </Button>
      </DialogFooter>
    </form>
  );
}
