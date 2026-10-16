import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { receiptCounters } from "@/db/schema";

type Db = ReturnType<typeof getDb>;
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

// GST: unique per financial year (Apr–Mar, IST), at most 16 characters.
// Test-mode payments get their own series so they never use up GST numbers.
// Run it inside the transaction that issues the invoice, so a failed invoice
// rolls the number back instead of leaving a gap.
export async function nextReceiptNumber(db: Db | Tx, now = new Date()) {
  const { short, full } = financialYear(now);
  const test = process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_");
  const prefix = test ? "TEST" : "GRWR";
  const [counter] = await db
    .insert(receiptCounters)
    .values({ financialYear: test ? `${full} test` : full, lastNumber: 1 })
    .onConflictDoUpdate({
      target: receiptCounters.financialYear,
      set: { lastNumber: sql`${receiptCounters.lastNumber} + 1` },
    })
    .returning({ lastNumber: receiptCounters.lastNumber });
  return `${prefix}/${short}/${String(counter.lastNumber).padStart(5, "0")}`;
}

function financialYear(now: Date) {
  const ist = new Date(now.getTime() + 330 * 60 * 1000);
  const start =
    ist.getUTCMonth() >= 3 ? ist.getUTCFullYear() : ist.getUTCFullYear() - 1;
  const yy = (year: number) => String(year % 100).padStart(2, "0");
  return {
    short: `${yy(start)}-${yy(start + 1)}`,
    full: `${start}-${yy(start + 1)}`,
  };
}
