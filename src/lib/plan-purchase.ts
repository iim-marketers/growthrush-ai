import "server-only";
import { and, eq, isNull, lte, or } from "drizzle-orm";
import { getDb } from "@/db";
import { businesses, orders } from "@/db/schema";
import { getPlans } from "@/lib/queries";

export async function recordPlanPurchase(razorpayOrderId: string) {
  const db = getDb();
  const [order] = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.razorpayOrderId, razorpayOrderId),
        eq(orders.status, "paid"),
      ),
    )
    .limit(1);
  if (!order?.userId || !order.paidAt) return;

  const plan = (await getPlans()).find((p) => p.id === order.planId);

  /* A late webhook for an older order must not overwrite a newer purchase. */
  await db
    .update(businesses)
    .set({
      purchasedPlanId: order.planId,
      purchasedPlanName: plan?.name ?? order.planId,
      purchasedAmountPaise: order.amountPaise,
      planPurchasedAt: order.paidAt,
    })
    .where(
      and(
        eq(businesses.userId, order.userId),
        or(
          isNull(businesses.planPurchasedAt),
          lte(businesses.planPurchasedAt, order.paidAt),
        ),
      ),
    );
}
