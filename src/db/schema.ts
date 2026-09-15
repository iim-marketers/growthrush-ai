import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* `failed` is left for a webhook to set: a failure in the browser isn't final,
   since Checkout lets the customer retry against the same order. */
export const orderStatus = pgEnum("order_status", ["created", "paid", "failed"]);

/* RLS with no policies keeps the table invisible to Supabase's public Data
   API; the server connects as the table owner and is unaffected. */
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  razorpayOrderId: text("razorpay_order_id").notNull().unique(),
  razorpayPaymentId: text("razorpay_payment_id").unique(),
  planId: text("plan_id").notNull(),
  amountPaise: integer("amount_paise").notNull(),
  currency: text("currency").notNull(),
  receipt: text("receipt").notNull(),
  status: orderStatus("status").notNull().default("created"),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
}).enableRLS();
