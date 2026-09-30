import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { emailInvoice } from "@/lib/invoice-email";
import { isValidWebhookSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature." }, { status: 400 });
  }

  let valid;
  try {
    valid = isValidWebhookSignature(body, signature);
  } catch (error) {
    console.error("Could not verify webhook signature", error);
    return Response.json({ error: "Webhook not configured." }, { status: 500 });
  }
  if (!valid) {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(body);
  const payment = event?.payload?.payment?.entity;
  const orderId: unknown = payment?.order_id;
  const paymentId: unknown = payment?.id;
  if (typeof orderId !== "string" || typeof paymentId !== "string") {
    return Response.json({ received: true });
  }

  try {
    const db = getDb();
    switch (event.event) {
      case "order.paid":
      case "payment.captured":
        await db
          .update(orders)
          .set({ status: "paid", razorpayPaymentId: paymentId, paidAt: new Date() })
          .where(
            and(eq(orders.razorpayOrderId, orderId), ne(orders.status, "paid")),
          );
        await emailInvoice(orderId);
        break;
      case "payment.failed":
        await db
          .update(orders)
          .set({ status: "failed" })
          .where(
            and(eq(orders.razorpayOrderId, orderId), eq(orders.status, "created")),
          );
        break;
    }
  } catch (error) {
    console.error("Could not record webhook", event.event, orderId, paymentId, error);
    return Response.json({ error: "Could not record the event." }, { status: 500 });
  }

  return Response.json({ received: true });
}
