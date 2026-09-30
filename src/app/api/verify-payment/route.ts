import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { emailInvoice } from "@/lib/invoice-email";
import { getRazorpay } from "@/lib/razorpay";

function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

/* Invoice payments don't come back from Checkout with the order signature,
   so the payment is looked up with our key instead of trusting the browser.
   A payment can sit in `authorized` for a moment before auto-capture. */
async function fetchCapturedPayment(paymentId: string) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const payment = await getRazorpay().payments.fetch(paymentId);
    if (payment.status !== "authorized") return payment;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  return getRazorpay().payments.fetch(paymentId);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const paymentId = body?.razorpay_payment_id;
  if (!isFilled(paymentId)) {
    return Response.json(
      { error: "Missing payment details." },
      { status: 400 },
    );
  }

  let payment;
  try {
    payment = await fetchCapturedPayment(paymentId);
  } catch (error) {
    console.error("Could not fetch payment", paymentId, error);
    return Response.json(
      { error: "Could not verify the payment." },
      { status: 500 },
    );
  }

  const orderId = payment.order_id;
  if (payment.status !== "captured" || !isFilled(orderId)) {
    console.error("Payment not captured", paymentId, payment.status);
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

    /* Someone else's order looks the same as a missing one. */
    if (!order || order.userId !== user.id) {
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

  await emailInvoice(orderId);

  return Response.json({
    success: true,
    order_id: orderId,
    payment_id: paymentId,
  });
}
