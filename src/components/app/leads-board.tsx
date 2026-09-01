"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LeadRow, type Lead } from "@/components/app/lead-row";
import { PageHeader, Panel } from "@/components/app/primitives";
import { leadStatuses, leads } from "@/lib/app-data";
import { cn } from "@/lib/utils";

type Filter = "all" | (typeof leadStatuses)[number]["id"];

/** Filters sit in one row above the list, and the counts come from the data. */
const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...leadStatuses.map((s) => ({ id: s.id as Filter, label: s.label })),
];

export function LeadsBoard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: leads.length };
    for (const lead of leads) tally[lead.status] = (tally[lead.status] ?? 0) + 1;
    return tally;
  }, []);

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
  }, [filter, query]);

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Every enquiry your ads produced. Tap the WhatsApp icon to reply."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-subtle px-3 py-2.5 transition-all focus-within:border-brand focus-within:bg-surface-hover sm:w-64">
          <Search size={16} aria-hidden className="shrink-0 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search leads"
            aria-label="Search leads"
            className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-faint"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter by status"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((option) => (
            <button
              key={option.id}
              role="tab"
              aria-selected={filter === option.id}
              onClick={() => setFilter(option.id)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors",
                filter === option.id
                  ? "border-brand bg-brand/15 text-ink"
                  : "border-hairline bg-surface-subtle text-subtle hover:border-line-strong hover:text-ink",
              )}
            >
              {option.label}
              <span className="ml-1.5 text-xs text-faint">
                {counts[option.id] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Panel title={`${visible.length} of ${leads.length} leads`}>
        {visible.length > 0 ? (
          <ul className="divide-y divide-hairline">
            {visible.map((lead) => (
              <LeadRow key={lead.id} lead={lead as Lead} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-faint">
            No leads match that filter yet.
          </p>
        )}
      </Panel>
    </>
  );
}
