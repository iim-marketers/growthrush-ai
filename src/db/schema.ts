import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/* Every table enables RLS with no policies: that keeps it invisible to
   Supabase's public Data API, while the server connects as the table owner
   and is unaffected. */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  consentedAt: timestamp("consented_at", { withTimezone: true }),
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
}).enableRLS();

export const otpChallenges = pgTable(
  "otp_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: text("phone").notNull(),
    codeHash: text("code_hash").notNull(),
    attempts: integer("attempts").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
  },
  (t) => [index("otp_challenges_phone_created_idx").on(t.phone, t.createdAt)],
).enableRLS();

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenHash: text("token_hash").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
).enableRLS();

export const businesses = pgTable("businesses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name"),
  category: text("category"),
  city: text("city"),
  listingId: text("listing_id"),
  goal: text("goal"),
  budgetBand: text("budget_band"),
  planId: text("plan_id"),
  billingName: text("billing_name"),
  billingEmail: text("billing_email"),
  billingGstin: text("billing_gstin"),
  billingLine1: text("billing_line1"),
  billingLine2: text("billing_line2"),
  billingCity: text("billing_city"),
  billingStateCode: text("billing_state_code"),
  billingPincode: text("billing_pincode"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "converted",
  "lost",
]);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    enquiry: text("enquiry").notNull().default(""),
    source: text("source").notNull().default("Facebook"),
    status: leadStatus("status").notNull().default("new"),
    receivedAt: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("leads_user_received_idx").on(t.userId, t.receivedAt)],
).enableRLS();

export const billingPeriod = pgEnum("billing_period", ["week", "month"]);

export const plans = pgTable("plans", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  badge: text("badge").notNull().default(""),
  description: text("description").notNull().default(""),
  /* GST excluded. ₹25,000 is 2500000. */
  pricePaise: integer("price_paise").notNull(),
  compareAtPaise: integer("compare_at_paise"),
  billingPeriod: billingPeriod("billing_period").notNull(),
  features: text("features").array().notNull().default([]),
  highlighted: boolean("highlighted").notNull().default(false),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
}).enableRLS();

export const orderStatus = pgEnum("order_status", ["created", "paid", "failed"]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    razorpayOrderId: text("razorpay_order_id").notNull().unique(),
    razorpayPaymentId: text("razorpay_payment_id").unique(),
    razorpayInvoiceId: text("razorpay_invoice_id").unique(),
    invoiceUrl: text("invoice_url"),
    planId: text("plan_id").notNull(),
    /* What was charged, GST included. */
    amountPaise: integer("amount_paise").notNull(),
    taxPaise: integer("tax_paise").notNull().default(0),
    placeOfSupply: text("place_of_supply"),
    currency: text("currency").notNull(),
    receipt: text("receipt").notNull().unique(),
    status: orderStatus("status").notNull().default("created"),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    invoiceEmailedAt: timestamp("invoice_emailed_at", { withTimezone: true }),
  },
  (t) => [index("orders_user_idx").on(t.userId)],
).enableRLS();

export const receiptCounters = pgTable("receipt_counters", {
  financialYear: text("financial_year").primaryKey(),
  lastNumber: integer("last_number").notNull(),
}).enableRLS();
