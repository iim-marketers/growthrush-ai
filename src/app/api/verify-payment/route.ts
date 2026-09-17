import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { isValidPaymentSignature } from "@/lib/razorpay";

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;

  if (!isFilled(orderId) || !isFilled(paymentId) || !isFilled(signature)) {
    return Response.json(
      { error: "Missing payment details." },
      { status: 400 },
    );
  }

  let valid;
  try {
    valid = isValidPaymentSignature({ orderId, paymentId, signature });
  } catch (error) {
    console.error("Could not verify payment signature", error);
    return Response.json(
      { error: "Could not verify the payment." },
      { status: 500 },
    );
  }
  if (!valid) {
    return Response.json(
      { error: "Payment could not be verified." },
      { status: 400 },
    );
  }

  try {
    const db = getDb();
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.razorpayOrderId, orderId))
      .limit(1);

    if (!order) {
      console.error("Verified payment for an unknown order", orderId, paymentId);
      return Response.json({ error: "Unknown order." }, { status: 400 });
    }

    if (order.status === "paid") {
      // A repeated request for the same payment is fine.
      if (order.razorpayPaymentId !== paymentId) {
        return Response.json(
          { error: "This order has already been paid." },
          { status: 400 },
        );
      }
    } else {
      await db
        .update(orders)
        .set({ status: "paid", razorpayPaymentId: paymentId, paidAt: new Date() })
        .where(eq(orders.id, order.id));
    }
  } catch (error) {
    console.error("Could not record payment", orderId, paymentId, error);
    return Response.json(
      { error: "Could not verify the payment." },
      { status: 500 },
    );
  }

  return Response.json({
    success: true,
    order_id: orderId,
    payment_id: paymentId,
  });
}
