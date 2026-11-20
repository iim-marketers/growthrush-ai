"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowUpDown,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Inbox,
  MapPin,
  Phone,
  SearchIcon,
  SearchX,
} from "lucide-react";
import { toast } from "sonner";
import {
  PortalLeadAvatar,
  PortalStatusBadge,
} from "@/components/portal/primitives";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  formatLeadDate,
  formatLeadTime,
  portalDayKey,
  portalLeadStatuses,
  type PortalLead,
  type PortalLeadStatus,
} from "@/lib/portal/leads";
import { cn } from "@/lib/utils";

const DAY_MS = 24 * 60 * 60 * 1000;
const PAGE_SIZES = [25, 50, 100] as const;

const datePresets = [
  { id: "all", label: "All time" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "custom", label: "Custom range" },
] as const;
type DatePreset = (typeof datePresets)[number]["id"];

const sortOptions = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "name", label: "Name A–Z" },
  { id: "city", label: "City A–Z" },
] as const;
type SortId = (typeof sortOptions)[number]["id"];

type StatusFilter = "all" | PortalLeadStatus;

function pageList(current: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const near =
    current <= 4
      ? [2, 3, 4, 5]
      : current >= count - 3
        ? [count - 4, count - 3, count - 2, count - 1]
        : [current - 1, current, current + 1];
  const pages = [1, ...near, count];
  return pages.flatMap((page, i) =>
    i > 0 && page - pages[i - 1] > 1 ? ["gap" as const, page] : [page],
  );
}

function range(preset: DatePreset, from: string, to: string): [string, string] {
  const now = Date.now();
  const ago = (days: number) => portalDayKey(new Date(now - days * DAY_MS));
  if (preset === "today") return [ago(0), ago(0)];
  if (preset === "yesterday") return [ago(1), ago(1)];
  if (preset === "7d") return [ago(6), ago(0)];
  if (preset === "30d") return [ago(29), ago(0)];
  if (preset === "custom") return [from, to];
  return ["", ""];
}

function sortLeads(list: PortalLead[], sort: SortId) {
  const byText = (key: "name" | "city") => (a: PortalLead, b: PortalLead) =>
    a[key].localeCompare(b[key], "en", { sensitivity: "base" }) ||
    b.createdAt.localeCompare(a.createdAt);
  if (sort === "oldest")
    return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  if (sort === "name") return list.sort(byText("name"));
  if (sort === "city") return list.sort(byText("city"));
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

const copyPhone = (phone: string) =>
  navigator.clipboard
    .writeText(phone)
    .then(() => toast.success("Phone number copied"))
    .catch(() => toast.error("Couldn't copy the number"));

export function PortalLeadsBoard({
  leads,
  initialStatus = "all",
}: {
  leads: PortalLead[];
  initialStatus?: StatusFilter;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatusState] = useState<StatusFilter>(initialStatus);
  const [preset, setPreset] = useState<DatePreset>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortId>("newest");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [pager, setPager] = useState({ key: "", page: 1 });
  const top = useRef<HTMLElement>(null);

  const dated = useMemo(() => {
    const [start, end] = range(preset, from, to);
    const needle = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const day = portalDayKey(new Date(lead.createdAt));
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
  }, [leads, preset, from, to, query]);

  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: dated.length };
    for (const lead of dated)
      tally[lead.status] = (tally[lead.status] ?? 0) + 1;
    return tally;
  }, [dated]);

  const visible = useMemo(
    () =>
      sortLeads(
        status === "all"
          ? [...dated]
          : dated.filter((l) => l.status === status),
        sort,
      ),
    [dated, status, sort],
  );

  const key = [query, status, preset, from, to, sort, pageSize].join("|");
  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const page = Math.min(pager.key === key ? pager.page : 1, pageCount);
  const start = (page - 1) * pageSize;
  const rows = visible.slice(start, start + pageSize);

  const goTo = (next: number) => {
    setPager({ key, page: Math.min(Math.max(1, next), pageCount) });
    if ((top.current?.getBoundingClientRect().top ?? 0) < 0) {
      top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const filtered = query !== "" || status !== "all" || preset !== "all";

  const setStatus = (next: StatusFilter) => {
    setStatusState(next);
    window.history.replaceState(
      null,
      "",
      next === "all"
        ? "/customer-portal/leads"
        : `/customer-portal/leads?status=${next}`,
    );
  };

  const clear = () => {
    setQuery("");
    setStatus("all");
    setPreset("all");
    setFrom("");
    setTo("");
  };

  const tabs = [
    { id: "all" as const, label: "All", dot: "bg-ink" },
    ...portalLeadStatuses.map((s) => ({
      id: s.id,
      label: s.label,
      dot: s.dot,
    })),
  ];

  return (
    <section
      ref={top}
      className="scroll-mt-20 rounded-2xl border border-hairline bg-white"
    >
      <div className="border-b border-hairline">
        <div
          role="tablist"
          aria-label="Filter by status"
          className="-mb-px flex gap-1 overflow-x-auto overflow-y-hidden px-3 pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={status === tab.id}
              onClick={() => setStatus(tab.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-3 pb-3 text-sm font-medium transition-colors",
                status === tab.id
                  ? "border-brand text-ink"
                  : "border-transparent text-subtle hover:text-ink",
              )}
            >
              <span
                aria-hidden
                className={cn("size-2 rounded-full", tab.dot)}
              />
              {tab.label}
              <span className="rounded-full bg-surface-subtle px-2 text-xs leading-5 font-semibold text-subtle tabular-nums">
                {(counts[tab.id] ?? 0).toLocaleString("en-IN")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-hairline p-3 sm:flex-row sm:flex-wrap sm:items-center">
        <InputGroup className="h-10 rounded-lg sm:w-72">
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, phone, city or note"
            aria-label="Search leads"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 rounded-lg">
                <CalendarDays className="text-faint" />
                {datePresets.find((p) => p.id === preset)?.label}
                <ChevronDown className="text-faint" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44">
              <DropdownMenuLabel>Received</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={preset}
                onValueChange={(v) => setPreset(v as DatePreset)}
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
                className="h-10 w-38"
              />
              <span className="text-xs text-faint">to</span>
              <Input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(event) => setTo(event.target.value)}
                aria-label="To date"
                className="h-10 w-38"
              />
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 rounded-lg">
                <ArrowUpDown className="text-faint" />
                {sortOptions.find((o) => o.id === sort)?.label}
                <ChevronDown className="text-faint" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-44">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={sort}
                onValueChange={(v) => setSort(v as SortId)}
              >
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.id} value={option.id}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between gap-3 sm:ml-auto">
          <p className="text-xs text-faint" aria-live="polite">
            <span className="font-semibold text-ink tabular-nums">
              {visible.length.toLocaleString("en-IN")}
            </span>{" "}
            {visible.length === 1 ? "lead" : "leads"}
          </p>
          {filtered && (
            <Button
              variant="ghost"
              size="sm"
              className="text-subtle"
              onClick={clear}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-11 rounded-xl">
              {leads.length === 0 ? (
                <Inbox className="size-5" />
              ) : (
                <SearchX className="size-5" />
              )}
            </EmptyMedia>
            <EmptyTitle className="font-display text-base font-bold text-ink">
              {leads.length === 0 ? "No leads yet" : "No matches"}
            </EmptyTitle>
            <EmptyDescription>
              {leads.length === 0
                ? "New leads will show up here as soon as they're added to your account."
                : "No leads match these filters."}
            </EmptyDescription>
          </EmptyHeader>
          {leads.length > 0 && (
            <Button variant="outline" size="sm" onClick={clear}>
              Clear filters
            </Button>
          )}
        </Empty>
      ) : (
        <>
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="border-b border-hairline text-left text-xs font-semibold text-faint">
                <th className="py-3 pr-3 pl-5 font-semibold">Lead</th>
                <th className="px-3 py-3 font-semibold">Phone</th>
                <th className="px-3 py-3 font-semibold">City</th>
                <th className="hidden px-3 py-3 font-semibold lg:table-cell">
                  Note
                </th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="py-3 pr-5 pl-3 text-right font-semibold">
                  Received
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {rows.map((lead) => (
                <tr
                  key={lead.id}
                  className="transition-colors hover:bg-surface-hover/60"
                >
                  <td className="py-3 pr-3 pl-5">
                    <span className="flex items-center gap-3">
                      <PortalLeadAvatar name={lead.name} />
                      <span className="max-w-52 truncate font-semibold text-ink">
                        {lead.name}
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="flex items-center">
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-subtle tabular-nums hover:text-brand"
                      >
                        {lead.phone}
                      </a>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => copyPhone(lead.phone)}
                        aria-label={`Copy ${lead.name}'s number`}
                        className="text-faint"
                      >
                        <Copy />
                      </Button>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-subtle">{lead.city || "—"}</td>
                  <td className="hidden max-w-64 px-3 py-3 lg:table-cell">
                    <span
                      title={lead.comment || undefined}
                      className="line-clamp-2 text-subtle"
                    >
                      {lead.comment || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <PortalStatusBadge status={lead.status} />
                  </td>
                  <td className="py-3 pr-5 pl-3 text-right text-xs whitespace-nowrap text-faint">
                    <span className="block text-ink">
                      {formatLeadDate(lead.createdAt)}
                    </span>
                    {formatLeadTime(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-hairline md:hidden">
            {rows.map((lead) => (
              <li key={lead.id} className="flex flex-col gap-3 p-4">
                <div className="flex items-start gap-3">
                  <PortalLeadAvatar name={lead.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">
                      {lead.name}
                    </p>
                    <p className="text-xs text-faint">
                      {formatLeadDate(lead.createdAt)},{" "}
                      {formatLeadTime(lead.createdAt)}
                    </p>
                  </div>
                  <PortalStatusBadge status={lead.status} />
                </div>
                {(lead.city || lead.comment) && (
                  <div className="flex flex-col gap-1 text-sm text-subtle">
                    {lead.city && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-faint" />
                        {lead.city}
                      </span>
                    )}
                    {lead.comment && (
                      <p className="line-clamp-3">{lead.comment}</p>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    asChild
                    className="h-10 flex-1 rounded-lg font-semibold"
                  >
                    <a href={`tel:${lead.phone}`}>
                      <Phone data-icon="inline-start" />
                      <span className="tabular-nums">{lead.phone}</span>
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    className="size-10 rounded-lg"
                    onClick={() => copyPhone(lead.phone)}
                    aria-label={`Copy ${lead.name}'s number`}
                  >
                    <Copy />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center justify-between gap-3 sm:justify-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-lg"
                  >
                    <span className="text-faint">Rows</span>
                    <span className="tabular-nums">{pageSize}</span>
                    <ChevronDown className="text-faint" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-36">
                  <DropdownMenuLabel>Rows per page</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={String(pageSize)}
                    onValueChange={(v) => setPageSize(Number(v))}
                  >
                    {PAGE_SIZES.map((size) => (
                      <DropdownMenuRadioItem key={size} value={String(size)}>
                        {size}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="text-xs text-faint tabular-nums">
                <span className="font-semibold text-ink">
                  {(start + 1).toLocaleString("en-IN")}–
                  {(start + rows.length).toLocaleString("en-IN")}
                </span>{" "}
                of {visible.length.toLocaleString("en-IN")}
              </p>
            </div>

            {pageCount > 1 && (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-between gap-1 sm:justify-end"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={page === 1}
                  onClick={() => goTo(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft data-icon="inline-start" />
                  <span className="hidden lg:inline">Previous</span>
                </Button>

                <span className="px-2 text-xs text-subtle tabular-nums sm:hidden">
                  Page <span className="font-semibold text-ink">{page}</span> of{" "}
                  {pageCount}
                </span>

                <div className="hidden items-center gap-1 sm:flex">
                  {pageList(page, pageCount).map((item, index) =>
                    item === "gap" ? (
                      <span
                        key={`gap-${index}`}
                        aria-hidden
                        className="w-8 text-center text-xs text-faint"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => goTo(item)}
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? "page" : undefined}
                        className={cn(
                          "h-8 min-w-8 rounded-lg px-2 text-xs font-semibold tabular-nums transition-colors outline-none focus-visible:ring-3 focus-visible:ring-brand/20",
                          item === page
                            ? "bg-brand text-white shadow-sm"
                            : "text-subtle hover:bg-surface-hover hover:text-ink",
                        )}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  disabled={page === pageCount}
                  onClick={() => goTo(page + 1)}
                  aria-label="Next page"
                >
                  <span className="hidden lg:inline">Next</span>
                  <ChevronRight data-icon="inline-end" />
                </Button>
              </nav>
            )}
          </div>
        </>
      )}
    </section>
  );
}
