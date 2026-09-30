import "server-only";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { businesses, orders } from "@/db/schema";
import { billingDetailsOf } from "@/lib/billing";
import { stateName, taxLines } from "@/lib/gst";
import { invoiceEmailHtml } from "@/lib/invoice-email-template";
import { plans } from "@/lib/landing-data";
import { formatDate, formatRupees } from "@/lib/queries";

const DEFAULT_FROM = "growthrush.ai <onboarding@resend.dev>";

/* Called by verify-payment and both webhook events for the same payment, so
   the send is claimed first and released again if it fails. */
export async function emailInvoice(orderId: string) {
  const db = getDb();
  let claimed = false;
  try {
    const [order] = await db
      .update(orders)
      .set({ invoiceEmailedAt: new Date() })
      .where(
        and(
          eq(orders.razorpayOrderId, orderId),
          eq(orders.status, "paid"),
          isNotNull(orders.razorpayInvoiceId),
          isNull(orders.invoiceEmailedAt),
        ),
      )
      .returning();
    if (!order?.userId) return;
    claimed = true;

    const [business] = await db
      .select()
      .from(businesses)
      .where(eq(businesses.userId, order.userId))
      .limit(1);
    if (!business?.billingEmail) throw new Error("No billing email");

    await send({
      to: business.billingEmail,
      subject: `Invoice ${order.receipt} · ${formatRupees(order.amountPaise)} paid to growthrush.ai`,
      html: invoiceEmailHtml(emailContent(order, business)),
      idempotencyKey: `invoice-${order.id}`,
    });
  } catch (error) {
    console.error("Could not email invoice", orderId, error);
    if (claimed) {
      await db
        .update(orders)
        .set({ invoiceEmailedAt: null })
        .where(eq(orders.razorpayOrderId, orderId))
        .catch(() => {});
    }
  }
}

async function send(email: {
  to: string;
  subject: string;
  html: string;
  idempotencyKey: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY must be set.");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": email.idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || DEFAULT_FROM,
      to: [email.to],
      subject: email.subject,
      html: email.html,
    }),
  });
  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

function emailContent(
  order: typeof orders.$inferSelect,
  business: typeof businesses.$inferSelect,
) {
  const planName = plans.find((p) => p.id === order.planId)?.name ?? order.planId;
  const billing = billingDetailsOf(business);
  const stateCode =
    order.placeOfSupply?.match(/\((\d{2})\)$/)?.[1] ?? billing?.stateCode;
  const tax = order.taxPaise
    ? stateCode
      ? taxLines(order.taxPaise, stateCode)
      : [{ label: "GST", paise: order.taxPaise }]
    : [];

  return {
    invoiceNumber: order.receipt,
    paidOn: formatDate(order.paidAt ?? new Date()),
    planName,
    billedTo: billing && {
      name: billing.name,
      gstin: billing.gstin,
      address: [
        billing.line1,
        billing.line2,
        `${billing.city}, ${stateName(billing.stateCode) ?? billing.stateCode} ${billing.pincode}`,
      ].filter((line): line is string => Boolean(line)),
    },
    placeOfSupply: order.placeOfSupply,
    items: [
      {
        label: planName,
        detail: "Monthly plan fee",
        paise: order.amountPaise - order.taxPaise,
      },
      ...tax,
    ],
    totalPaise: order.amountPaise,
    invoiceUrl: order.invoiceUrl,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.growthrush.ai",
  };
}
