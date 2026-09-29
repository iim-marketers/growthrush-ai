import "server-only";
import { and, desc, eq, gte } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db";
import { leads, orders } from "@/db/schema";
import type { Lead } from "@/components/app/lead-row";
import { plans } from "@/lib/landing-data";

/**
 * Reads for the signed-in screens. Every function takes the user id from
 * lib/auth/dal.ts and filters on it — never an id from the browser.
 */

/* Customers are in India, so "today" and month boundaries are IST. */
const TZ = "Asia/Kolkata";

/* ------------------------------------------------------------------ *
 * Leads
 * ------------------------------------------------------------------ */

export const getLeads = cache(async (userId: string): Promise<Lead[]> => {
  const rows = await getDb()
    .select()
    .from(leads)
    .where(eq(leads.userId, userId))
    .orderBy(desc(leads.receivedAt))
    .limit(500);

  const now = new Date();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    enquiry: row.enquiry,
    source: row.source,
    status: row.status,
    receivedAt: timeAgo(row.receivedAt, now),
  }));
});

export type LeadStats = {
  thisMonth: number;
  lastMonth: number;
  byDay: { day: string; leads: number }[];
};

/** This month vs last, and a count per day for the last 30 days. */
export async function getLeadStats(userId: string): Promise<LeadStats> {
  const now = new Date();
  const monthStart = istMonthStart(now, 0);
  const lastMonthStart = istMonthStart(now, -1);
  const windowStart = new Date(now.getTime() - (CHART_DAYS - 1) * DAY_MS);

  const since = new Date(
    Math.min(lastMonthStart.getTime(), windowStart.getTime()),
  );
  const rows = await getDb()
    .select({ receivedAt: leads.receivedAt })
    .from(leads)
    .where(and(eq(leads.userId, userId), gte(leads.receivedAt, since)));

  const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });
  const dayLabel = new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
  });

  const byDay = new Map<string, { day: string; leads: number }>();
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * DAY_MS);
    byDay.set(dayKey.format(date), { day: dayLabel.format(date), leads: 0 });
  }

  let thisMonth = 0;
  let lastMonth = 0;
  for (const { receivedAt } of rows) {
    if (receivedAt >= monthStart) thisMonth++;
    else if (receivedAt >= lastMonthStart) lastMonth++;
    const bucket = byDay.get(dayKey.format(receivedAt));
    if (bucket) bucket.leads++;
  }

  return { thisMonth, lastMonth, byDay: [...byDay.values()] };
}

/* ------------------------------------------------------------------ *
 * Plan & payments
 * ------------------------------------------------------------------ */

export const getPaidOrders = cache(async (userId: string) => {
  return getDb()
    .select({
      id: orders.id,
      planId: orders.planId,
      amountPaise: orders.amountPaise,
      currency: orders.currency,
      paymentId: orders.razorpayPaymentId,
      paidAt: orders.paidAt,
    })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, "paid")))
    .orderBy(desc(orders.paidAt));
});

/**
 * The plan the latest payment covers, while it still does. Plans are billed
 * monthly and there is no subscription yet, so a payment buys one month.
 */
export async function getActivePlan(userId: string) {
  const [latest] = await getPaidOrders(userId);
  if (!latest?.paidAt) return null;

  const renewsOn = new Date(latest.paidAt);
  renewsOn.setMonth(renewsOn.getMonth() + 1);
  if (renewsOn.getTime() < Date.now()) return null;

  const plan = plans.find((p) => p.id === latest.planId);
  return plan ? { plan, renewsOn } : null;
}

export function billingCycle(renewsOn: Date) {
  const start = new Date(renewsOn);
  start.setMonth(start.getMonth() - 1);
  const now = Date.now();
  const length = renewsOn.getTime() - start.getTime();
  return {
    percent: Math.min(100, Math.max(0, ((now - start.getTime()) / length) * 100)),
    daysLeft: Math.max(0, Math.ceil((renewsOn.getTime() - now) / DAY_MS)),
  };
}

/* ------------------------------------------------------------------ *
 * Formatting
 * ------------------------------------------------------------------ */

const DAY_MS = 24 * 60 * 60 * 1000;
const CHART_DAYS = 30;

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatMonth(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TZ,
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function timeAgo(then: Date, now: Date) {
  const minutes = Math.floor((now.getTime() - then.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return formatDate(then);
}

/** Midnight IST on the 1st of this month (offset 0) or an earlier one. */
function istMonthStart(now: Date, offset: number) {
  const [year, month] = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
  })
    .format(now)
    .split("-")
    .map(Number);
  /* IST is UTC+5:30 all year, so its midnight is 18:30 UTC the day before. */
  return new Date(Date.UTC(year, month - 1 + offset, 1) - 330 * 60 * 1000);
}
