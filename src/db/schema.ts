import {
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

/* ------------------------------------------------------------------ *
 * Accounts
 * ------------------------------------------------------------------ */

/* One row per mobile number. `phone` is E.164 (+91XXXXXXXXXX), so the same
   person can't end up with two accounts by typing it differently. */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  /* When the policies under /legal were last agreed to at sign-in — the
     DPDP Act wants consent that can be shown, not assumed. */
  consentedAt: timestamp("consented_at", { withTimezone: true }),
  /* Set when the onboarding wizard is finished; until then the app sends the
     user back to it. */
  onboardedAt: timestamp("onboarded_at", { withTimezone: true }),
}).enableRLS();

/* A sign-in attempt. Only a hash of the code is kept, and each challenge
   takes a handful of guesses before it is dead. */
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

/* The browser holds a random token; the table holds its SHA-256, so a leaked
   row can't be replayed as a cookie. */
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

/* ------------------------------------------------------------------ *
 * Onboarding answers
 * ------------------------------------------------------------------ */

/* One business per user. Columns are nullable because the wizard saves as
   the customer goes, so a half-finished setup is still on record. */
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
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

/* ------------------------------------------------------------------ *
 * Leads
 * ------------------------------------------------------------------ */

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "converted",
  "lost",
]);

/* Filled by the ad integration once it exists; the app only reads it today. */
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

/* ------------------------------------------------------------------ *
 * Payments
 * ------------------------------------------------------------------ */

/* `failed` is left for a webhook to set: a failure in the browser isn't final,
   since Checkout lets the customer retry against the same order. */
export const orderStatus = pgEnum("order_status", ["created", "paid", "failed"]);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    razorpayOrderId: text("razorpay_order_id").notNull().unique(),
    razorpayPaymentId: text("razorpay_payment_id").unique(),
    planId: text("plan_id").notNull(),
    amountPaise: integer("amount_paise").notNull(),
    currency: text("currency").notNull(),
    receipt: text("receipt").notNull(),
    status: orderStatus("status").notNull().default("created"),
    /* Nullable: orders placed before sign-in existed have no owner. */
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [index("orders_user_idx").on(t.userId)],
).enableRLS();
