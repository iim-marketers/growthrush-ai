"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, SearchIcon, SearchX, Users } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAdminDate, type LeadAccountSummary } from "@/lib/admin/leads";

export function LeadAccountsTable({ accounts }: { accounts: LeadAccountSummary[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return accounts;
    return accounts.filter(
      (a) =>
        a.name.toLowerCase().includes(needle) ||
        a.email?.includes(needle) ||
        a.phone.includes(needle),
    );
  }, [accounts, query]);

  return (
    <Card className="gap-0 rounded-2xl py-0">
      <div className="flex flex-col gap-3 border-b border-hairline px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <InputGroup className="h-9 sm:max-w-80">
          <InputGroupInput
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or phone"
            aria-label="Search accounts"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <p className="text-xs text-faint" aria-live="polite">
          <span className="font-semibold text-ink">{visible.length}</span> of{" "}
          {accounts.length} accounts
        </p>
      </div>

      {visible.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Account</TableHead>
              <TableHead className="hidden xl:table-cell">Phone number</TableHead>
              <TableHead className="text-right">Leads</TableHead>
              <TableHead className="hidden text-right md:table-cell">Valid</TableHead>
              <TableHead className="hidden text-right md:table-cell">Follow-up</TableHead>
              <TableHead className="hidden text-right md:table-cell">Invalid</TableHead>
              <TableHead className="hidden lg:table-cell">Last lead</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="w-10 pr-4">
                <span className="sr-only">Open</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((account) => {
              const href = `/admin/leads/${account.id}`;
              return (
                <TableRow
                  key={account.id}
                  onClick={() => router.push(href)}
                  className="group cursor-pointer"
                >
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">
                        {(account.name || account.phone).charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <Link
                          href={href}
                          onClick={(event) => event.stopPropagation()}
                          className="block max-w-56 truncate font-semibold text-ink outline-none hover:underline focus-visible:underline sm:max-w-none"
                        >
                          {account.name || account.phone}
                        </Link>
                        <span className="block max-w-56 truncate text-xs text-faint sm:max-w-none">
                          {account.email}
                          <span className="xl:hidden">
                            {account.email && account.phone ? " · " : ""}
                            {account.phone}
                          </span>
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-subtle tabular-nums xl:table-cell">
                    {account.phone ? (
                      <a
                        href={`tel:${account.phone}`}
                        onClick={(event) => event.stopPropagation()}
                        className="hover:text-brand"
                      >
                        {account.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-ink tabular-nums">
                    {account.total}
                  </TableCell>
                  <TableCell className="hidden text-right text-success tabular-nums md:table-cell">
                    {account.valid}
                  </TableCell>
                  <TableCell className="hidden text-right text-warn tabular-nums md:table-cell">
                    {account.followUp}
                  </TableCell>
                  <TableCell className="hidden text-right text-danger tabular-nums md:table-cell">
                    {account.invalid}
                  </TableCell>
                  <TableCell className="hidden text-xs text-faint lg:table-cell">
                    {account.lastLeadAt ? formatAdminDate(account.lastLeadAt) : "—"}
                  </TableCell>
                  <TableCell className="hidden text-xs text-faint sm:table-cell">
                    {formatAdminDate(account.createdAt)}
                  </TableCell>
                  <TableCell className="pr-4">
                    <ChevronRight
                      aria-hidden
                      className="size-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-11 rounded-xl">
              {accounts.length === 0 ? <Users className="size-5" /> : <SearchX className="size-5" />}
            </EmptyMedia>
            <EmptyTitle className="font-display text-base font-bold text-ink">
              {accounts.length === 0 ? "No lead accounts yet" : "No matches"}
            </EmptyTitle>
            <EmptyDescription>
              {accounts.length === 0
                ? "Create an account to start adding leads."
                : "No account email matches that search."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </Card>
  );
}
