"use server";

import { and, eq } from "drizzle-orm";
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
import { isAccountLeadStatus } from "@/lib/admin/leads";
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

const PHONE = /^\+?\d{10,15}$/;
const cleanPhone = (value: string) => value.replace(/[\s()-]/g, "");

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
  if (!PHONE.test(phone)) {
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

export async function addAccountLead(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const account = await getLeadAccount(field(formData, "accountId"));
  if (!account) return { error: "This account no longer exists." };

  const name = field(formData, "name");
  const phone = cleanPhone(field(formData, "phone"));
  const city = field(formData, "city");
  const comment = field(formData, "comment");
  const status = field(formData, "status");

  if (!name) return { error: "Enter the lead's name." };
  if (!PHONE.test(phone)) {
    return { error: "Enter a valid phone number (10–15 digits)." };
  }
  if (!isAccountLeadStatus(status)) return { error: "Pick a status." };

  await getDb().insert(accountLeads).values({
    accountId: account.id,
    accountName: account.name,
    accountEmail: account.email,
    name: name.slice(0, 120),
    phone,
    city: city.slice(0, 80),
    comment: comment.slice(0, 1000),
    status,
  });

  refresh();
  return { ok: true, at: Date.now() };
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
