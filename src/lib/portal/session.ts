import "server-only";
import { createHmac } from "node:crypto";
import { asc, eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db";
import { leadAccounts } from "@/db/schema";
import { safeEqual, sha256 } from "@/lib/auth/tokens";

const PORTAL_COOKIE = "gr_portal";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

const accountColumns = {
  id: leadAccounts.id,
  name: leadAccounts.name,
  phone: leadAccounts.phone,
  email: leadAccounts.email,
  passwordHash: leadAccounts.passwordHash,
};

type AccountRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  passwordHash: string;
};

const isUuid = (value: string) => /^[0-9a-f-]{36}$/i.test(value);

function sign(passwordHash: string, payload: string) {
  return createHmac("sha256", sha256(`gr-portal:${passwordHash}`))
    .update(payload)
    .digest("base64url");
}

export async function findAccountByEmail(email: string) {
  const [account] = await getDb()
    .select(accountColumns)
    .from(leadAccounts)
    .where(eq(leadAccounts.email, email.trim().toLowerCase()))
    .limit(1);
  return account ?? null;
}

export async function findAccountByPhone(e164: string) {
  const national = e164.replace(/^\+91/, "");
  const [account] = await getDb()
    .select(accountColumns)
    .from(leadAccounts)
    .where(
      inArray(leadAccounts.phone, [national, `0${national}`, `91${national}`, `+91${national}`]),
    )
    .orderBy(asc(leadAccounts.createdAt))
    .limit(1);
  return account ?? null;
}

export async function createPortalSession(account: AccountRow) {
  const expiresAt = new Date(Date.now() + TTL_MS);
  const payload = `${account.id}.${expiresAt.getTime()}`;

  (await cookies()).set(PORTAL_COOKIE, `${payload}.${sign(account.passwordHash, payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/customer-portal",
    expires: expiresAt,
  });
}

export async function deletePortalSession() {
  (await cookies()).delete({ name: PORTAL_COOKIE, path: "/customer-portal" });
}

export const getPortalAccount = cache(async () => {
  const token = (await cookies()).get(PORTAL_COOKIE)?.value;
  const [id, expires, signature] = token?.split(".") ?? [];
  if (!id || !expires || !signature || !isUuid(id)) return null;
  if (!(Number(expires) > Date.now())) return null;

  const [account] = await getDb()
    .select(accountColumns)
    .from(leadAccounts)
    .where(eq(leadAccounts.id, id))
    .limit(1);
  if (!account || !safeEqual(signature, sign(account.passwordHash, `${id}.${expires}`))) {
    return null;
  }

  return { id: account.id, name: account.name, phone: account.phone, email: account.email };
});

export type PortalAccount = NonNullable<Awaited<ReturnType<typeof getPortalAccount>>>;

export async function requirePortalAccount() {
  const account = await getPortalAccount();
  if (!account) redirect("/customer-portal/login");
  return account;
}
