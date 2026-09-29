"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Clock,
  Copy,
  Megaphone,
  Phone,
  SearchIcon,
  SearchX,
} from "lucide-react";
import { NoLeadsYet } from "@/components/app/dashboard-widgets";
import { type Lead } from "@/components/app/lead-row";
import {
  LeadAvatar,
  PageHeader,
  StatusBadge,
  statusTones,
} from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { leadStatuses } from "@/lib/app-data";
import { cn } from "@/lib/utils";

type Filter = "all" | (typeof leadStatuses)[number]["id"];

const filters: { id: Filter; label: string; dot: string }[] = [
  { id: "all", label: "All leads", dot: "bg-ink" },
  ...leadStatuses.map((s) => ({
    id: s.id as Filter,
    label: s.label,
    dot: statusTones[s.tone].dot,
  })),
];

export function LeadsBoard({ leads }: { leads: Lead[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, [contenteditable=true]")) return;
      event.preventDefault();
      search.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: leads.length };
    for (const lead of leads)
      tally[lead.status] = (tally[lead.status] ?? 0) + 1;
    return tally;
  }, [leads]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (filter !== "all" && lead.status !== filter) return false;
      if (!needle) return true;
      return (
        lead.name.toLowerCase().includes(needle) ||
        lead.enquiry.toLowerCase().includes(needle) ||
        lead.phone.includes(needle)
      );
    });
  }, [leads, filter, query]);

  const selected = leads.find((lead) => lead.id === openId) ?? null;

  return (
    <>
      <PageHeader
        eyebrow="Inbox"
        title="Leads"
        subtitle="Every enquiry your ads produced. Open one to see the details and call them back."
      />

      <ToggleGroup
        type="single"
        value={filter}
        /* A single toggle group can be emptied; keep one filter always on. */
        onValueChange={(value) => value && setFilter(value as Filter)}
        aria-label="Filter by status"
        spacing={3}
        className="mb-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-5"
      >
        {filters.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={option.id}
            className={cn(
              "h-auto flex-col items-start gap-1 rounded-xl border border-hairline bg-card px-4 py-3 text-left shadow-none transition-all",
              "hover:border-line-strong hover:bg-card",
              "data-[state=on]:border-brand data-[state=on]:bg-brand/5 data-[state=on]:shadow-[0_0_0_3px_rgba(64,89,232,0.12)]",
              option.id === "all" && "col-span-2 sm:col-span-1",
            )}
          >
            <span className="flex items-center gap-2 text-xs font-medium text-subtle">
              <span aria-hidden className={cn("size-2 rounded-full", option.dot)} />
              {option.label}
            </span>
            <span className="font-display text-2xl font-extrabold text-ink tabular-nums">
              {counts[option.id] ?? 0}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Card className="gap-0 rounded-2xl py-0">
        <div className="flex flex-col gap-3 border-b border-hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <InputGroup className="h-9 sm:max-w-80">
            <InputGroupInput
              ref={search}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, phone or enquiry"
              aria-label="Search leads"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="hidden sm:flex">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <p className="text-xs text-faint" aria-live="polite">
            Showing{" "}
            <span className="font-semibold text-ink">{visible.length}</span> of{" "}
            {leads.length}
          </p>
        </div>

        {visible.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">Lead</TableHead>
                <TableHead className="hidden lg:table-cell">Enquiry</TableHead>
                <TableHead className="hidden md:table-cell">Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Received</TableHead>
                <TableHead className="w-10 pr-4">
                  <span className="sr-only">Open</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((lead) => (
                <TableRow
                  key={lead.id}
                  onClick={() => setOpenId(lead.id)}
                  className="group cursor-pointer"
                >
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <LeadAvatar name={lead.name} />
                      <span className="min-w-0">
                        {/* The row click is a mouse shortcut; this is the keyboard control. */}
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setOpenId(lead.id);
                          }}
                          className="block max-w-48 truncate text-left font-semibold text-ink outline-none focus-visible:underline sm:max-w-none"
                        >
                          {lead.name}
                        </button>
                        <span className="block truncate text-xs text-faint tabular-nums">
                          {lead.phone}
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-80 lg:table-cell">
                    <span className="block truncate text-subtle">
                      {lead.enquiry}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-subtle md:table-cell">
                    {lead.source}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="hidden text-xs text-faint sm:table-cell">
                    {lead.receivedAt}
                  </TableCell>
                  <TableCell className="pr-4">
                    <ChevronRight
                      aria-hidden
                      className="size-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : leads.length === 0 ? (
          <NoLeadsYet className="py-16" />
        ) : (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-11 rounded-xl">
                <SearchX className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="font-display text-base font-bold text-ink">
                No matches
              </EmptyTitle>
              <EmptyDescription>
                No leads match that search or filter yet.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear filters
            </Button>
          </Empty>
        )}
      </Card>

      <LeadSheet lead={selected} onClose={() => setOpenId(null)} />
    </>
  );
}

function LeadSheet({
  lead,
  onClose,
}: {
  lead: Lead | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Clipboard blocked — the number is on screen to copy by hand. */
    }
  };

  return (
    <Sheet open={lead !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full gap-0 bg-background p-0 sm:max-w-md">
        {lead && (
          <>
            <SheetHeader className="relative overflow-hidden border-b border-hairline bg-surface-subtle px-6 pt-8 pb-6">
              <div
                aria-hidden
                className="absolute -top-16 -right-10 size-44 rounded-full bg-brand/10 blur-2xl"
              />
              <LeadAvatar name={lead.name} className="relative size-14 text-xl" />
              <SheetTitle className="relative mt-3 font-display text-xl font-extrabold text-ink">
                {lead.name}
              </SheetTitle>
              <SheetDescription className="relative flex items-center gap-2">
                <StatusBadge status={lead.status} />
                <span className="text-xs text-faint">{lead.receivedAt}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
              <section>
                <h3 className="text-xs font-semibold tracking-wider text-faint uppercase">
                  Enquiry
                </h3>
                <p className="mt-2 rounded-xl bg-surface-hover p-4 text-sm leading-relaxed text-ink">
                  {lead.enquiry}
                </p>
              </section>

              <dl className="grid gap-4">
                <Detail icon={Phone} label="Phone">
                  <span className="tabular-nums">{lead.phone}</span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => copy(lead.phone)}
                    aria-label={copied ? "Copied" : "Copy phone number"}
                    className="ml-auto text-faint"
                  >
                    {copied ? <Check className="text-success" /> : <Copy />}
                  </Button>
                </Detail>
                <Detail icon={Megaphone} label="Source">
                  {lead.source}
                </Detail>
                <Detail icon={Clock} label="Received">
                  {lead.receivedAt}
                </Detail>
              </dl>
            </div>

            <SheetFooter className="border-t border-hairline px-6 py-4">
              <Button asChild size="lg" className="h-11 w-full rounded-xl font-semibold">
                <a href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}>
                  <Phone data-icon="inline-start" />
                  Call {lead.name.split(" ")[0]}
                </a>
              </Button>
              {/* Hidden until leads can be answered on WhatsApp.
              <Button asChild variant="outline" size="lg">
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle data-icon="inline-start" />
                  WhatsApp
                </a>
              </Button>
              */}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-subtle">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-faint">{label}</dt>
        <dd className="flex items-center gap-2 text-sm font-semibold text-ink">
          {children}
        </dd>
      </div>
    </div>
  );
}
