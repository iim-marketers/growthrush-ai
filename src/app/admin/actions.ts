"use server";

import { and, eq, sql } from "drizzle-orm";
import { refresh } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { getDb } from "@/db";
import { accountLeads, leadAccounts } from "@/db/schema";
import {
  adminConfigured,
  checkAdminCredentials,
  createAdminSession,
  deleteAdminSession,
  requireAdmin,
} from "@/lib/admin/auth";
import {
  cleanPhone,
  IMPORT_BATCH_SIZE,
  isAccountLeadStatus,
  LEAD_PHONE,
  parseLeadStatus,
  phoneKey,
  type AccountLeadStatus,
  type ImportLeadRow,
} from "@/lib/admin/leads";
import { hashPassword } from "@/lib/admin/password";
import { getLeadAccount } from "@/lib/admin/queries";

export type AdminFormState = {
  ok?: boolean;
  error?: string;
  at?: number;
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

const isUuid = (value: string) => /^[0-9a-f-]{36}$/i.test(value);

const field = (formData: FormData, name: string) =>
  String(formData.get(name) ?? "").trim();

export async function adminSignIn(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!adminConfigured()) {
    return { error: "Admin login is not configured on this server." };
  }

  const email = field(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  if (!checkAdminCredentials(email, password)) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "Incorrect email or password." };
  }

  await createAdminSession();
  redirect("/admin", RedirectType.replace);
}

export async function adminSignOut() {
  await deleteAdminSession();
  redirect("/admin/login", RedirectType.replace);
}

export async function createLeadAccount(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const name = field(formData, "name").slice(0, 120);
  const phone = cleanPhone(field(formData, "phone"));
  const email = field(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Enter the customer's name." };
  if (!LEAD_PHONE.test(phone)) {
    return { error: "Enter a valid phone number (10–15 digits)." };
  }
  if (email && !EMAIL.test(email)) return { error: "Enter a valid email address." };
  if (password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }

  const [created] = await getDb()
    .insert(leadAccounts)
    .values({
      name,
      phone,
      email: email || null,
      passwordHash: await hashPassword(password),
    })
    .onConflictDoNothing()
    .returning({ id: leadAccounts.id });

  if (!created) {
    return { error: "An account with this phone number or email already exists." };
  }

  refresh();
  return { ok: true, at: Date.now(), name, phone, email, password };
}

type LeadInput = {
  name: string;
  phone: string;
  city: string;
  comment: string;
  status: AccountLeadStatus;
};

function readLeadForm(formData: FormData): LeadInput | { error: string } {
  const name = field(formData, "name").slice(0, 120);
  const phone = cleanPhone(field(formData, "phone"));
  const status = field(formData, "status");

  if (!name) return { error: "Enter the lead's name." };
  if (!LEAD_PHONE.test(phone)) {
    return { error: "Enter a valid phone number (10–15 digits)." };
  }
  if (!isAccountLeadStatus(status)) return { error: "Pick a status." };

  return {
    name,
    phone,
    city: field(formData, "city").slice(0, 80),
    comment: field(formData, "comment").slice(0, 1000),
    status,
  };
}

export async function addAccountLead(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const account = await getLeadAccount(field(formData, "accountId"));
  if (!account) return { error: "This account no longer exists." };

  const lead = readLeadForm(formData);
  if ("error" in lead) return lead;

  await getDb().insert(accountLeads).values({
    accountId: account.id,
    accountName: account.name,
    accountEmail: account.email,
    ...lead,
  });

  refresh();
  return { ok: true, at: Date.now() };
}

export async function updateAccountLead(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const accountId = field(formData, "accountId");
  const leadId = field(formData, "leadId");
  if (!isUuid(accountId) || !isUuid(leadId)) return { error: "This lead no longer exists." };

  const lead = readLeadForm(formData);
  if ("error" in lead) return lead;

  const [updated] = await getDb()
    .update(accountLeads)
    .set(lead)
    .where(and(eq(accountLeads.id, leadId), eq(accountLeads.accountId, accountId)))
    .returning({ id: accountLeads.id });

  if (!updated) return { error: "This lead no longer exists." };

  refresh();
  return { ok: true, at: Date.now() };
}

export type ImportLeadsResult =
  | { ok: true; added: number; updated: number; skipped: number }
  | { ok: false; error: string };

export async function importAccountLeads(
  accountId: string,
  rows: ImportLeadRow[],
): Promise<ImportLeadsResult> {
  await requireAdmin();

  const account = await getLeadAccount(accountId);
  if (!account) return { ok: false, error: "This account no longer exists." };
  if (!Array.isArray(rows) || rows.length > IMPORT_BATCH_SIZE) {
    return { ok: false, error: "Invalid import batch." };
  }

  const byPhone = new Map<string, { lead: LeadInput; keepStatus: boolean }>();
  for (const row of rows) {
    const text = (value: unknown, max: number) =>
      typeof value === "string" ? value.trim().slice(0, max) : "";
    const name = text(row?.name, 120);
    const phone = cleanPhone(text(row?.phone, 40));
    const status = parseLeadStatus(text(row?.status, 20));
    if (!name || !LEAD_PHONE.test(phone)) continue;
    byPhone.set(phoneKey(phone), {
      lead: {
        name,
        phone,
        city: text(row.city, 80),
        comment: text(row.comment, 1000),
        status: status ?? "follow_up",
      },
      keepStatus: !status,
    });
  }
  const skipped = rows.length - byPhone.size;

  const db = getDb();
  const existing = await db
    .select({ id: accountLeads.id, phone: accountLeads.phone })
    .from(accountLeads)
    .where(eq(accountLeads.accountId, account.id));
  const existingIds = new Map(existing.map((lead) => [phoneKey(lead.phone), lead.id]));

  const inserts: (typeof accountLeads.$inferInsert)[] = [];
  const updates: (LeadInput & { id: string; keepStatus: boolean })[] = [];
  for (const [key, { lead, keepStatus }] of byPhone) {
    const id = existingIds.get(key);
    if (id) updates.push({ ...lead, id, keepStatus });
    else {
      inserts.push({
        ...lead,
        accountId: account.id,
        accountName: account.name,
        accountEmail: account.email,
      });
    }
  }

  await db.transaction(async (tx) => {
    if (inserts.length) await tx.insert(accountLeads).values(inserts);
    if (updates.length) {
      const values = sql.join(
        updates.map(
          (lead) =>
            sql`(${lead.id}::uuid, ${lead.name}::text, ${lead.phone}::text, ${lead.city}::text, ${lead.comment}::text, ${lead.keepStatus ? null : lead.status}::text)`,
        ),
        sql`, `,
      );
      await tx.execute(sql`
        update ${accountLeads} as a set
          name = v.name,
          phone = v.phone,
          city = coalesce(nullif(v.city, ''), a.city),
          comment = coalesce(nullif(v.comment, ''), a.comment),
          status = coalesce(v.status::account_lead_status, a.status)
        from (values ${values}) as v(id, name, phone, city, comment, status)
        where a.id = v.id and a.account_id = ${account.id}::uuid
      `);
    }
  });

  return { ok: true, added: inserts.length, updated: updates.length, skipped };
}

export async function updateAccountLeadStatus(
  accountId: string,
  leadId: string,
  status: string,
) {
  await requireAdmin();
  if (!isUuid(accountId) || !isUuid(leadId) || !isAccountLeadStatus(status)) return;

  await getDb()
    .update(accountLeads)
    .set({ status })
    .where(and(eq(accountLeads.id, leadId), eq(accountLeads.accountId, accountId)));

  refresh();
}

export async function deleteAccountLead(accountId: string, leadId: string) {
  await requireAdmin();
  if (!isUuid(accountId) || !isUuid(leadId)) return;

  await getDb()
    .delete(accountLeads)
    .where(and(eq(accountLeads.id, leadId), eq(accountLeads.accountId, accountId)));

  refresh();
}
