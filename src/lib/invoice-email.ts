import "server-only";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { businesses, orders } from "@/db/schema";
import { plans } from "@/lib/landing-data";
import { formatDate, formatRupees } from "@/lib/queries";

/* Razorpay won't email an invoice once it is paid, so the receipt, with a
   link to the paid invoice, goes out through Resend instead. */

/* Until a domain is verified in Resend, its test sender only delivers to the
   Resend account's own address. */
const DEFAULT_FROM = "growthrush.ai <onboarding@resend.dev>";

/* The browser's confirmation and both webhook events (order.paid,
   payment.captured) all call this for one payment, so the send is claimed
   first. A failed send is released for the next caller to try, and never
   throws: the payment is already recorded by then. */
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
      .select({ name: businesses.billingName, email: businesses.billingEmail })
      .from(businesses)
      .where(eq(businesses.userId, order.userId))
      .limit(1);
    if (!business?.email) throw new Error("No billing email");

    await send({
      to: business.email,
      subject: `Your growthrush.ai invoice for ${formatRupees(order.amountPaise)}`,
      html: receiptHtml(order, business.name),
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

function receiptHtml(
  order: typeof orders.$inferSelect,
  billedTo: string | null,
) {
  const plan = plans.find((p) => p.id === order.planId);
  const base = order.amountPaise - order.taxPaise;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.growthrush.ai";

  const row = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:8px 0;color:#64748b;font-size:14px">${label}</td>
      <td style="padding:8px 0;text-align:right;font-size:14px;${strong ? "font-weight:700;color:#0b1220" : "color:#0b1220"}">${value}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px">
          <tr><td>
            <p style="margin:0;font-size:20px;font-weight:800;color:#4059e8">growthrush.ai</p>
            <h1 style="margin:24px 0 8px;font-size:22px;color:#0b1220">Payment received</h1>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#475569">
              Thank you${billedTo ? `, ${escapeHtml(billedTo)}` : ""}. Your ${escapeHtml(plan?.name ?? order.planId)} plan is active. Your GST invoice is ready below.
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0">
              ${row("Invoice no.", escapeHtml(order.receipt))}
              ${row("Plan", escapeHtml(plan?.name ?? order.planId))}
              ${row("Plan fee", formatRupees(base))}
              ${row("GST", formatRupees(order.taxPaise))}
              ${row("Total paid", formatRupees(order.amountPaise), true)}
              ${order.paidAt ? row("Paid on", formatDate(order.paidAt)) : ""}
              ${order.razorpayPaymentId ? row("Payment ID", escapeHtml(order.razorpayPaymentId)) : ""}
            </table>
            ${
              order.invoiceUrl
                ? `<p style="margin:28px 0 0;text-align:center">
              <a href="${escapeHtml(order.invoiceUrl)}" style="display:inline-block;background:#4059e8;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:12px">View &amp; download invoice</a>
            </p>`
                : ""
            }
            <p style="margin:28px 0 0;font-size:13px;line-height:1.6;color:#94a3b8;text-align:center">
              All your invoices are also on your <a href="${site}/billing" style="color:#4059e8">Billing page</a>.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
