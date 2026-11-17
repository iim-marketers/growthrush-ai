"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  ChevronDown,
  Copy,
  Inbox,
  MoreHorizontal,
  SearchIcon,
  SearchX,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { deleteAccountLead, updateAccountLeadStatus } from "@/app/admin/actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { LeadAvatar } from "@/components/app/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  accountLeadStatuses,
  dayKey,
  formatAdminDate,
  formatAdminTime,
  type AccountLead,
  type AccountLeadStatus,
} from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | AccountLeadStatus;

const datePresets = [
  { id: "all", label: "All time" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "month", label: "This month" },
  { id: "custom", label: "Custom range" },
] as const;

type DatePreset = (typeof datePresets)[number]["id"];

type SortKey = "date" | "name" | "city" | "status";
type Sort = { key: SortKey; dir: "asc" | "desc" };

const sortOptions = [
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
  { id: "name-asc", label: "Name A–Z" },
  { id: "name-desc", label: "Name Z–A" },
  { id: "city-asc", label: "City A–Z" },
  { id: "city-desc", label: "City Z–A" },
  { id: "status-asc", label: "Status" },
] as const;

const DAY_MS = 24 * 60 * 60 * 1000;
const statusRank = Object.fromEntries(accountLeadStatuses.map((s, i) => [s.id, i]));

function presetRange(preset: DatePreset, from: string, to: string): [string, string] {
  const now = Date.now();
  const today = dayKey(new Date(now));
  const daysAgo = (days: number) => dayKey(new Date(now - days * DAY_MS));

  switch (preset) {
    case "today":
      return [today, today];
    case "yesterday":
      return [daysAgo(1), daysAgo(1)];
    case "7d":
      return [daysAgo(6), today];
    case "30d":
      return [daysAgo(29), today];
    case "month":
      return [`${today.slice(0, 8)}01`, today];
    case "custom":
      return [from, to];
    default:
      return ["", ""];
  }
}

function compare(a: AccountLead, b: AccountLead, key: SortKey) {
  if (key === "date") return a.createdAt.localeCompare(b.createdAt);
  if (key === "status") return statusRank[a.status] - statusRank[b.status];
  return a[key].localeCompare(b[key], "en", { sensitivity: "base" });
}

type Change = { id: string; status?: AccountLeadStatus; deleted?: boolean };

export function AccountLeadsBoard({
  accountId,
  leads,
}: {
  accountId: string;
  leads: AccountLead[];
}) {
  const [rows, applyChange] = useOptimistic(leads, (current, change: Change) =>
    change.deleted
      ? current.filter((lead) => lead.id !== change.id)
      : current.map((lead) =>
          lead.id === change.id && change.status ? { ...lead, status: change.status } : lead,
        ),
  );
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [preset, setPreset] = useState<DatePreset>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<Sort>({ key: "date", dir: "desc" });
  const [leadToDelete, setLeadToDelete] = useState<AccountLead | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const dated = useMemo(() => {
    const [start, end] = presetRange(preset, from, to);
    const needle = query.trim().toLowerCase();
    return rows.filter((lead) => {
      const day = dayKey(new Date(lead.createdAt));
      if (start && day < start) return false;
      if (end && day > end) return false;
      if (!needle) return true;
      return (
        lead.name.toLowerCase().includes(needle) ||
        lead.city.toLowerCase().includes(needle) ||
        lead.comment.toLowerCase().includes(needle) ||
        lead.phone.includes(needle)
      );
    });
  }, [rows, preset, from, to, query]);

  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: dated.length };
    for (const lead of dated) tally[lead.status] = (tally[lead.status] ?? 0) + 1;
    return tally;
  }, [dated]);

  const visible = useMemo(() => {
    const list = status === "all" ? [...dated] : dated.filter((l) => l.status === status);
    const sign = sort.dir === "asc" ? 1 : -1;
    return list.sort((a, b) => sign * compare(a, b, sort.key) || b.createdAt.localeCompare(a.createdAt));
  }, [dated, status, sort]);

  const filtered = query !== "" || status !== "all" || preset !== "all";

  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setPreset("all");
    setFrom("");
    setTo("");
  };

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "date" ? "desc" : "asc" },
    );

  const changeStatus = (lead: AccountLead, next: AccountLeadStatus) => {
    if (lead.status === next) return;
    startTransition(async () => {
      applyChange({ id: lead.id, status: next });
      try {
        await updateAccountLeadStatus(accountId, lead.id, next);
      } catch {
        toast.error(`Couldn't update the status for ${lead.name}. Try again.`);
      }
    });
  };

  const remove = (lead: AccountLead) => {
    startTransition(async () => {
      applyChange({ id: lead.id, deleted: true });
      try {
        await deleteAccountLead(accountId, lead.id);
      } catch {
        toast.error(`Couldn't delete ${lead.name}. Try again.`);
      }
    });
  };

  const presetLabel = datePresets.find((p) => p.id === preset)?.label ?? "All time";
  const sortId = `${sort.key}-${sort.dir}`;
  const sortLabel = sortOptions.find((o) => o.id === sortId)?.label ?? "Status";

  const statusFilters = [
    { id: "all" as const, label: "All leads", dot: "bg-ink" },
    ...accountLeadStatuses.map((s) => ({ id: s.id, label: s.label, dot: s.dot })),
  ];

  return (
    <>
      <ToggleGroup
        type="single"
        value={status}
        onValueChange={(value) => value && setStatus(value as StatusFilter)}
        aria-label="Filter by status"
        spacing={3}
        className="mb-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {statusFilters.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={option.id}
            className={cn(
              "h-auto flex-col items-start gap-1 rounded-xl border border-hairline bg-card px-4 py-3 text-left shadow-none transition-all",
              "hover:border-line-strong hover:bg-card",
              "data-[state=on]:border-brand data-[state=on]:bg-brand/5 data-[state=on]:shadow-[0_0_0_3px_rgba(64,89,232,0.12)]",
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
        <div className="flex flex-col gap-3 border-b border-hairline px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <InputGroup className="h-9 sm:w-72">
              <InputGroupInput
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, phone, city, comment"
                aria-label="Search leads"
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>

            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2 rounded-lg">
                    <CalendarDays className="text-faint" />
                    {presetLabel}
                    <ChevronDown className="text-faint" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-44">
                  <DropdownMenuLabel>Date added</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={preset}
                    onValueChange={(value) => setPreset(value as DatePreset)}
                  >
                    {datePresets.map((option) => (
                      <DropdownMenuRadioItem key={option.id} value={option.id}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {preset === "custom" && (
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={from}
                    max={to || undefined}
                    onChange={(event) => setFrom(event.target.value)}
                    aria-label="From date"
                    className="h-9 w-38"
                  />
                  <span className="text-xs text-faint">to</span>
                  <Input
                    type="date"
                    value={to}
                    min={from || undefined}
                    onChange={(event) => setTo(event.target.value)}
                    aria-label="To date"
                    className="h-9 w-38"
                  />
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 gap-2 rounded-lg">
                    <ArrowUpDown className="text-faint" />
                    {sortLabel}
                    <ChevronDown className="text-faint" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-44">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={sortId}
                    onValueChange={(value) => {
                      const [key, dir] = value.split("-") as [SortKey, Sort["dir"]];
                      setSort({ key, dir });
                    }}
                  >
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.id} value={option.id}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {filtered && (
                <Button variant="ghost" className="h-9 text-subtle" onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </div>
          </div>

          <p className="shrink-0 text-xs text-faint" aria-live="polite">
            Showing <span className="font-semibold text-ink">{visible.length}</span> of{" "}
            {rows.length}
          </p>
        </div>

        {visible.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <SortHead label="Name" sortKey="name" sort={sort} onSort={toggleSort} className="pl-5" />
                <TableHead className="hidden md:table-cell">Phone number</TableHead>
                <SortHead label="City" sortKey="city" sort={sort} onSort={toggleSort} className="hidden sm:table-cell" />
                <TableHead className="hidden lg:table-cell">Comment</TableHead>
                <SortHead label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                <SortHead label="Date added" sortKey="date" sort={sort} onSort={toggleSort} className="hidden sm:table-cell" />
                <TableHead className="w-12 pr-4">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <LeadAvatar name={lead.name} />
                      <span className="min-w-0">
                        <span className="block max-w-44 truncate font-semibold text-ink sm:max-w-60">
                          {lead.name}
                        </span>
                        <a
                          href={`tel:${lead.phone}`}
                          className="block text-xs text-faint tabular-nums hover:text-brand md:hidden"
                        >
                          {lead.phone}
                        </a>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <a href={`tel:${lead.phone}`} className="text-subtle tabular-nums hover:text-brand">
                      {lead.phone}
                    </a>
                  </TableCell>
                  <TableCell className="hidden text-subtle sm:table-cell">{lead.city || "—"}</TableCell>
                  <TableCell className="hidden max-w-72 lg:table-cell">
                    <span
                      title={lead.comment || undefined}
                      className="line-clamp-2 text-sm whitespace-normal text-subtle"
                    >
                      {lead.comment || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="flex items-center gap-1 rounded-full outline-none focus-visible:ring-3 focus-visible:ring-brand/20"
                        aria-label={`Change status for ${lead.name}`}
                      >
                        <LeadStatusBadge status={lead.status} />
                        <ChevronDown className="size-3.5 text-faint" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-40">
                        <DropdownMenuLabel>Set status</DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                          value={lead.status}
                          onValueChange={(value) => changeStatus(lead, value as AccountLeadStatus)}
                        >
                          {accountLeadStatuses.map((option) => (
                            <DropdownMenuRadioItem key={option.id} value={option.id}>
                              <span aria-hidden className={cn("size-2 rounded-full", option.dot)} />
                              {option.label}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="hidden text-xs whitespace-nowrap text-faint sm:table-cell">
                    <span className="block text-ink">{formatAdminDate(lead.createdAt)}</span>
                    {formatAdminTime(lead.createdAt)}
                  </TableCell>
                  <TableCell className="pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${lead.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-40">
                        <DropdownMenuItem
                          onSelect={() => navigator.clipboard.writeText(lead.phone).catch(() => {})}
                        >
                          <Copy />
                          Copy phone
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => {
                            setLeadToDelete(lead);
                            setConfirmDeleteOpen(true);
                          }}
                        >
                          <Trash2 />
                          Delete lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-11 rounded-xl">
                {rows.length === 0 ? <Inbox className="size-5" /> : <SearchX className="size-5" />}
              </EmptyMedia>
              <EmptyTitle className="font-display text-base font-bold text-ink">
                {rows.length === 0 ? "No leads yet" : "No matches"}
              </EmptyTitle>
              <EmptyDescription>
                {rows.length === 0
                  ? "Use “Add lead” to add this account's first lead."
                  : "No leads match these filters."}
              </EmptyDescription>
            </EmptyHeader>
            {rows.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </Empty>
        )}
      </Card>

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        icon={Trash2}
        destructive
        title="Delete this lead?"
        description={
          <>
            <span className="font-semibold text-ink">{leadToDelete?.name}</span>
            {leadToDelete?.phone && ` (${leadToDelete.phone})`} will be permanently removed
            from this account. This can&apos;t be undone.
          </>
        }
        confirmLabel="Delete lead"
        onConfirm={() => {
          if (leadToDelete) remove(leadToDelete);
        }}
      />
    </>
  );
}

function SortHead({
  label,
  sortKey,
  sort,
  onSort,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: Sort;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sort.key === sortKey;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;

  return (
    <TableHead
      className={className}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "-ml-1 inline-flex items-center gap-1 rounded px-1 outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/30",
          active && "text-ink",
        )}
      >
        {label}
        <Icon className={cn("size-3.5", active ? "text-brand" : "text-faint")} />
      </button>
    </TableHead>
  );
}
