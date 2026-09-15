import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { plans } from "@/lib/landing-data";
import {
  MIN_ORDER_AMOUNT,
  getRazorpay,
  razorpayStatusCode,
} from "@/lib/razorpay";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  // The client only names the plan; the price always comes from the server.
  const plan = plans.find((p) => p.id === body?.planId);
  if (!plan) {
    return Response.json({ error: "Unknown plan." }, { status: 400 });
  }
  if (!Number.isInteger(plan.amount) || plan.amount < MIN_ORDER_AMOUNT) {
    return Response.json(
      { error: `Amount must be at least ${MIN_ORDER_AMOUNT} paise.` },
      { status: 400 },
    );
  }

  const receipt = `${plan.id}_${Date.now()}`;

  let order;
  try {
    order = await getRazorpay().orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt,
      notes: { plan_id: plan.id },
    });
  } catch (error) {
    console.error("Razorpay order creation failed", error);
    if (razorpayStatusCode(error) === 401) {
      return Response.json(
        { error: "The payment gateway rejected our credentials." },
        { status: 401 },
      );
    }
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }

  try {
    await getDb().insert(orders).values({
      razorpayOrderId: order.id,
      planId: plan.id,
      amount: plan.amount,
      currency: order.currency,
      receipt,
    });
  } catch (error) {
    console.error("Could not save order", order.id, error);
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }

  return Response.json({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
