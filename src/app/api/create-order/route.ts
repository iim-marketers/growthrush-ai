import { and, desc, eq, gt, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { getBusiness } from "@/lib/auth/dal";
import { getSessionUser } from "@/lib/auth/session";
import { billingDetailsOf } from "@/lib/billing";
import { gstFor, stateName } from "@/lib/gst";
import { planFeeLabel } from "@/lib/plans";
import { getOfferedPlans } from "@/lib/queries";
import {
  MIN_ORDER_AMOUNT,
  getRazorpay,
  razorpayStatusCode,
} from "@/lib/razorpay";
import { nextReceiptNumber } from "@/lib/receipt";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Please sign in again." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  // The client only names the plan; the price always comes from the server.
  const plan = (await getOfferedPlans()).find((p) => p.id === body?.planId);
  if (!plan) {
    return Response.json({ error: "Unknown plan." }, { status: 400 });
  }
  if (
    !Number.isInteger(plan.pricePaise) ||
    plan.pricePaise < MIN_ORDER_AMOUNT
  ) {
    return Response.json(
      { error: `Amount must be at least ${MIN_ORDER_AMOUNT} paise.` },
      { status: 400 },
    );
  }

  const business = await getBusiness(user.id);
  const billing = billingDetailsOf(business);
  if (!business || !billing) {
    return Response.json(
      { error: "Add your billing details before paying." },
      { status: 400 },
    );
  }

  const gst = gstFor(plan.pricePaise, billing.stateCode);
  const placeOfSupply = `${stateName(billing.stateCode)} (${billing.stateCode})`;

  const checkout = (orderId: string) =>
    Response.json({
      order_id: orderId,
      amount: gst.total,
      currency: "INR",
      contact: user.phone,
      email: billing.email,
    });

  // Every new order uses up a GST receipt number, so reopening checkout
  // resumes the unpaid order instead of issuing another invoice.
  const openOrderId = await findOpenOrder({
    userId: user.id,
    planId: plan.id,
    amountPaise: gst.total,
    placeOfSupply,
    billingUpdatedAt: business.updatedAt,
  });
  if (openOrderId) return checkout(openOrderId);

  const taxFitsAsLines = gst.lines.every(
    (line) => line.paise >= MIN_ORDER_AMOUNT,
  );
  const lineItems = taxFitsAsLines
    ? [
        { name: plan.name, amount: plan.pricePaise },
        ...gst.lines.map((line) => ({ name: line.label, amount: line.paise })),
      ]
    : [{ name: `${plan.name} (incl. GST)`, amount: gst.total }];

  let receipt;
  let invoice;
  try {
    ({ receipt, invoice } = await getDb().transaction(async (tx) => {
      const receipt = await nextReceiptNumber(tx);
      const invoice = await getRazorpay().invoices.create({
        type: "invoice",
        description: [
          `Billed to ${billing.name}`,
          billing.gstin && `GSTIN ${billing.gstin}`,
          `Place of supply: ${placeOfSupply}`,
        ]
          .filter(Boolean)
          .join(" · "),
        customer: {
          name: customerName(billing.name),
          email: billing.email,
          contact: user.phone,
          billing_address: {
            line1: billing.line1,
            line2: billing.line2 ?? undefined,
            city: billing.city,
            state: stateName(billing.stateCode) ?? undefined,
            zipcode: billing.pincode,
            country: "in",
          },
        },
        line_items: lineItems.map((item, i) => ({
          ...item,
          description: i === 0 ? planFeeLabel(plan) : undefined,
          currency: "INR",
          quantity: 1,
        })),
        currency: "INR",
        receipt,
        notes: { plan_id: plan.id, user_id: user.id },
        sms_notify: 0,
        email_notify: 0,
      });
      return { receipt, invoice };
    }));
  } catch (error) {
    console.error("Razorpay invoice creation failed", error);
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

  if (!invoice.order_id) {
    console.error("Razorpay invoice has no order", invoice.id);
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }

  try {
    await getDb().insert(orders).values({
      razorpayOrderId: invoice.order_id,
      razorpayInvoiceId: invoice.id,
      invoiceUrl: invoice.short_url,
      planId: plan.id,
      amountPaise: gst.total,
      taxPaise: gst.tax,
      placeOfSupply,
      currency: "INR",
      receipt,
      userId: user.id,
      userPhone: user.phone,
      businessName: business.name,
    });
  } catch (error) {
    console.error("Could not save order", invoice.order_id, error);
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }

  return checkout(invoice.order_id);
}

/* An unpaid order can be paid again as long as its invoice is still open
   and nothing on it has changed since it was issued. */
async function findOpenOrder(match: {
  userId: string;
  planId: string;
  amountPaise: number;
  placeOfSupply: string;
  billingUpdatedAt: Date;
}) {
  try {
    const [order] = await getDb()
      .select({
        orderId: orders.razorpayOrderId,
        invoiceId: orders.razorpayInvoiceId,
      })
      .from(orders)
      .where(
        and(
          eq(orders.userId, match.userId),
          eq(orders.planId, match.planId),
          eq(orders.amountPaise, match.amountPaise),
          eq(orders.placeOfSupply, match.placeOfSupply),
          ne(orders.status, "paid"),
          gt(orders.createdAt, match.billingUpdatedAt),
        ),
      )
      .orderBy(desc(orders.createdAt))
      .limit(1);
    if (!order?.invoiceId) return null;

    const invoice = await getRazorpay().invoices.fetch(order.invoiceId);
    return invoice.status === "issued" ? order.orderId : null;
  } catch (error) {
    console.error("Could not look up an open order", match.userId, error);
    return null;
  }
}

/* Razorpay only takes letters, digits, spaces, . ' ( ) in a customer name,
   and rejects the whole invoice otherwise. The exact name still goes in the
   invoice description. */
function customerName(name: string) {
  const cleaned = name
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N} .'()]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50)
    .trim();
  return cleaned.length >= 3 ? cleaned : undefined;
}
