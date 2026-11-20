import "server-only";
import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { newOtpCode, safeEqual, sha256 } from "@/lib/auth/tokens";
import { challengeStore, OTP_LENGTH, OTP_TTL_MINUTES } from "@/lib/portal/otp";
import { setPortalPassword } from "@/lib/portal/password";
import { sendResetCodeEmail } from "@/lib/portal/reset-email";
import { findAccountById, type AccountRow } from "@/lib/portal/session";

const RESET_PATH = "/customer-portal/login/forgot-password";
const GRANT_COOKIE = "gr_portal_reset_grant";
const GRANT_TTL_MS = 15 * 60 * 1000;
const KEY_PREFIX = "reset:";

const resetChallenges = challengeStore({ cookie: "gr_portal_reset", path: RESET_PATH });

export function startPasswordReset(account: AccountRow & { email: string }) {
  return resetChallenges.start(`${KEY_PREFIX}${account.id}`, async (challengeId) => {
    const code = newOtpCode(OTP_LENGTH);
    await sendResetCodeEmail({
      to: account.email,
      code,
      minutes: OTP_TTL_MINUTES,
      idempotencyKey: `portal-reset-${challengeId}`,
    });
    return code;
  });
}

export async function currentPasswordReset() {
  const challenge = await resetChallenges.current();
  if (!challenge?.phone.startsWith(KEY_PREFIX)) return null;
  const account = await findAccountById(challenge.phone.slice(KEY_PREFIX.length));
  if (!account?.email) return null;
  return { challenge, account: { ...account, email: account.email } };
}

export type ResetCheckResult =
  | { ok: true }
  | { ok: false; reason: "expired" | "wrong" | "locked" };

export async function checkResetCode(code: string): Promise<ResetCheckResult> {
  const result = await resetChallenges.check(code);
  if (!result.ok) return result;

  const account = result.key.startsWith(KEY_PREFIX)
    ? await findAccountById(result.key.slice(KEY_PREFIX.length))
    : null;
  if (!account) return { ok: false, reason: "expired" };

  const expires = Date.now() + GRANT_TTL_MS;
  const payload = `${account.id}.${expires}`;
  (await cookies()).set(GRANT_COOKIE, `${payload}.${signGrant(account.passwordHash, payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: RESET_PATH,
    expires: new Date(expires),
  });
  return { ok: true };
}

export async function getResetGrant() {
  const token = (await cookies()).get(GRANT_COOKIE)?.value;
  const [id, expires, signature] = token?.split(".") ?? [];
  if (!id || !expires || !signature) return null;
  if (!(Number(expires) > Date.now())) return null;

  const account = await findAccountById(id);
  if (!account || !safeEqual(signature, signGrant(account.passwordHash, `${id}.${expires}`))) {
    return null;
  }
  return account;
}

export async function replacePassword(account: AccountRow, password: string) {
  const updated = await setPortalPassword(account, password);
  (await cookies()).delete({ name: GRANT_COOKIE, path: RESET_PATH });
  return updated;
}

function signGrant(passwordHash: string, payload: string) {
  return createHmac("sha256", sha256(`gr-portal-reset:${passwordHash}`))
    .update(payload)
    .digest("base64url");
}

export function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!user || !domain) return email;
  const visible = user.length <= 2 ? user[0] : `${user[0]}${"•".repeat(Math.min(user.length - 2, 5))}${user.at(-1)}`;
  return `${visible}@${domain}`;
}
