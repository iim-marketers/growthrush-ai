import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { leadAccounts } from "@/db/schema";
import { hashPassword } from "@/lib/admin/password";
import type { AccountRow } from "@/lib/portal/session";

export async function verifyPortalPassword(password: string, stored: string) {
  const [scheme, salt, key] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !key) return false;

  const expected = Buffer.from(key, "base64url");
  const actual = await new Promise<Buffer>((resolve, reject) =>
    scrypt(password, Buffer.from(salt, "base64url"), expected.length, (error, derived) =>
      error ? reject(error) : resolve(derived),
    ),
  );
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const MIN_PORTAL_PASSWORD = 8;

export async function setPortalPassword(account: AccountRow, password: string) {
  const passwordHash = await hashPassword(password);
  const [updated] = await getDb()
    .update(leadAccounts)
    .set({ passwordHash })
    .where(and(eq(leadAccounts.id, account.id), eq(leadAccounts.passwordHash, account.passwordHash)))
    .returning({ id: leadAccounts.id });
  return updated ? { ...account, passwordHash } : null;
}
