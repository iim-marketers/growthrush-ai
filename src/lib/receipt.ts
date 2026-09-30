import "server-only";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { receiptCounters } from "@/db/schema";

const PREFIX = "GRWR";

// GST: unique per financial year (Apr–Mar, IST), at most 16 characters.
export async function nextReceiptNumber(now = new Date()) {
  const { short, full } = financialYear(now);
  const [counter] = await getDb()
    .insert(receiptCounters)
    .values({ financialYear: full, lastNumber: 1 })
    .onConflictDoUpdate({
      target: receiptCounters.financialYear,
      set: { lastNumber: sql`${receiptCounters.lastNumber} + 1` },
    })
    .returning({ lastNumber: receiptCounters.lastNumber });
  return `${PREFIX}/${short}/${String(counter.lastNumber).padStart(5, "0")}`;
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
