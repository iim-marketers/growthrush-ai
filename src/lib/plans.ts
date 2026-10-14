import type { plans } from "@/db/schema";

export type Plan = typeof plans.$inferSelect;

export function planFeeLabel(plan: Pick<Plan, "billingPeriod">) {
  return plan.billingPeriod === "week" ? "Weekly plan fee" : "Monthly plan fee";
}
