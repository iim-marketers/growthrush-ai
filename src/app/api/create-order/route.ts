import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { getBusiness } from "@/lib/auth/dal";
import { getSessionUser } from "@/lib/auth/session";
import { billingDetailsOf } from "@/lib/billing";
import { gstFor, stateName } from "@/lib/gst";
import { plans } from "@/lib/landing-data";
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

  const billing = billingDetailsOf(await getBusiness(user.id));
  if (!billing) {
    return Response.json(
      { error: "Add your billing details before paying." },
      { status: 400 },
    );
  }

  let receipt;
  try {
    receipt = await nextReceiptNumber();
  } catch (error) {
    console.error("Could not assign a receipt number", error);
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }

  const gst = gstFor(plan.amount, billing.stateCode);
  const placeOfSupply = `${stateName(billing.stateCode)} (${billing.stateCode})`;

  let invoice;
  try {
    invoice = await getRazorpay().invoices.create({
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
      // The Invoices API can't apply GST, so tax goes on as its own lines.
      line_items: [
        {
          name: plan.name,
          description: "Monthly plan fee",
          amount: plan.amount,
          currency: "INR",
          quantity: 1,
        },
        ...gst.lines.map((line) => ({
          name: line.label,
          amount: line.paise,
          currency: "INR",
          quantity: 1,
        })),
      ],
      currency: "INR",
      receipt,
      notes: { plan_id: plan.id, user_id: user.id },
      sms_notify: 0,
      email_notify: 0,
    });
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
    });
  } catch (error) {
    console.error("Could not save order", invoice.order_id, error);
    return Response.json(
      { error: "Could not start the payment. Please try again." },
      { status: 500 },
    );
  }

  return Response.json({
    order_id: invoice.order_id,
    amount: gst.total,
    currency: "INR",
    contact: user.phone,
    email: billing.email,
  });
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
