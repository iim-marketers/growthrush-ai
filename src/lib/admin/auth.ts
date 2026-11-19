import "server-only";
import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { safeEqual, sha256 } from "@/lib/auth/tokens";

export const ADMIN_COOKIE = "gr_admin";

const TTL_MS = 12 * 60 * 60 * 1000;

function credentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  return email && password ? { email, password } : null;
}

export function adminConfigured() {
  return credentials() !== null;
}

function signingKey() {
  const creds = credentials();
  return creds ? sha256(`gr-admin:${creds.email}:${creds.password}`) : null;
}

function sign(key: string, payload: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function verifyAdminToken(token: string | undefined) {
  const key = signingKey();
  if (!key || !token) return false;

  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) <= Date.now()) return false;
  return safeEqual(signature, sign(key, expires));
}

export function checkAdminCredentials(email: string, password: string) {
  const creds = credentials();
  if (!creds) return false;

  const emailOk = safeEqual(sha256(email.trim().toLowerCase()), sha256(creds.email));
  const passwordOk = safeEqual(sha256(password), sha256(creds.password));
  return emailOk && passwordOk;
}

export async function createAdminSession() {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are not set.");

  const expiresAt = new Date(Date.now() + TTL_MS);
  const expires = String(expiresAt.getTime());

  (await cookies()).set(ADMIN_COOKIE, `${expires}.${sign(key, expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: expiresAt,
  });
}

export async function deleteAdminSession() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
}

export async function isAdmin() {
  return verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function adminEmail() {
  return credentials()?.email ?? "";
}
