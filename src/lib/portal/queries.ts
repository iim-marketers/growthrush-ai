import "server-only";
import { desc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db";
import { accountLeads } from "@/db/schema";
import { formatShortDay, portalDayKey, type PortalLead } from "./leads";

const DAY_MS = 24 * 60 * 60 * 1000;
const CHART_DAYS = 30;

export const getPortalLeads = cache(async (accountId: string): Promise<PortalLead[]> => {
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

  return rows.map((row) => ({ ...row, createdAt: new Date(row.createdAt).toISOString() }));
});

export function summarizeLeads(leads: PortalLead[]) {
  const now = Date.now();
  const today = portalDayKey(new Date(now));
  const weekStart = portalDayKey(new Date(now - 6 * DAY_MS));
  const monthStart = `${today.slice(0, 8)}01`;

  const byDay = new Map<string, { day: string; leads: number }>();
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const date = new Date(now - i * DAY_MS);
    byDay.set(portalDayKey(date), { day: formatShortDay(date), leads: 0 });
  }

  const summary = {
    total: leads.length,
    today: 0,
    week: 0,
    month: 0,
    valid: 0,
    followUp: 0,
    invalid: 0,
  };
  for (const lead of leads) {
    const day = portalDayKey(new Date(lead.createdAt));
    if (day === today) summary.today++;
    if (day >= weekStart) summary.week++;
    if (day >= monthStart) summary.month++;
    if (lead.status === "valid") summary.valid++;
    else if (lead.status === "follow_up") summary.followUp++;
    else summary.invalid++;
    const bucket = byDay.get(day);
    if (bucket) bucket.leads++;
  }

  return { ...summary, byDay: [...byDay.values()] };
}
