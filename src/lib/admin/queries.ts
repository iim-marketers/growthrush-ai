import "server-only";
import { desc, eq, max, sql } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db";
import { accountLeads, leadAccounts } from "@/db/schema";
import { dayKey, type AccountLead, type LeadAccountSummary } from "./leads";

const countWhere = (status: "valid" | "invalid" | "follow_up") =>
  sql`count(*) filter (where ${accountLeads.status} = ${status})`.mapWith(Number);

const counts = {
  total: sql`count(${accountLeads.id})`.mapWith(Number),
  valid: countWhere("valid"),
  followUp: countWhere("follow_up"),
  invalid: countWhere("invalid"),
};

const iso = (value: Date | string) => new Date(value).toISOString();

export async function getLeadAccounts(): Promise<LeadAccountSummary[]> {
  const rows = await getDb()
    .select({
      id: leadAccounts.id,
      name: leadAccounts.name,
      phone: leadAccounts.phone,
      email: leadAccounts.email,
      createdAt: leadAccounts.createdAt,
      ...counts,
      lastLeadAt: max(accountLeads.createdAt),
    })
    .from(leadAccounts)
    .leftJoin(accountLeads, eq(accountLeads.accountId, leadAccounts.id))
    .groupBy(leadAccounts.id)
    .orderBy(desc(leadAccounts.createdAt));

  return rows.map((row) => ({
    ...row,
    createdAt: iso(row.createdAt),
    lastLeadAt: row.lastLeadAt ? iso(row.lastLeadAt) : null,
  }));
}

export const getLeadAccount = cache(async (id: string) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [account] = await getDb()
    .select({
      id: leadAccounts.id,
      name: leadAccounts.name,
      phone: leadAccounts.phone,
      email: leadAccounts.email,
      createdAt: leadAccounts.createdAt,
    })
    .from(leadAccounts)
    .where(eq(leadAccounts.id, id))
    .limit(1);
  return account ?? null;
});

export async function getAccountLeads(accountId: string): Promise<AccountLead[]> {
  const rows = await getDb()
    .select({
      id: accountLeads.id,
      name: accountLeads.name,
      phone: accountLeads.phone,
      city: accountLeads.city,
      comment: accountLeads.comment,
      status: accountLeads.status,
      createdAt: accountLeads.createdAt,
    })
    .from(accountLeads)
    .where(eq(accountLeads.accountId, accountId))
    .orderBy(desc(accountLeads.createdAt));

  return rows.map((row) => ({ ...row, createdAt: iso(row.createdAt) }));
}

export async function getAdminOverview() {
  const db = getDb();
  const todayStart = new Date(`${dayKey(new Date())}T00:00:00+05:30`);

  const [[accounts], [leads], recent] = await Promise.all([
    db.select({ count: sql`count(*)`.mapWith(Number) }).from(leadAccounts),
    db
      .select({
        ...counts,
        today: sql`count(*) filter (where ${accountLeads.createdAt} >= ${todayStart.toISOString()})`.mapWith(
          Number,
        ),
      })
      .from(accountLeads),
    db
      .select({
        id: accountLeads.id,
        accountId: accountLeads.accountId,
        accountName: accountLeads.accountName,
        accountEmail: accountLeads.accountEmail,
        name: accountLeads.name,
        city: accountLeads.city,
        status: accountLeads.status,
        createdAt: accountLeads.createdAt,
      })
      .from(accountLeads)
      .orderBy(desc(accountLeads.createdAt))
      .limit(8),
  ]);

  return {
    accounts: accounts.count,
    ...leads,
    recent: recent.map((row) => ({ ...row, createdAt: iso(row.createdAt) })),
  };
}
