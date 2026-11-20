import "server-only";
import { and, count, desc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { otpChallenges } from "@/db/schema";
import { sendOtp } from "@/lib/auth/sms";
import { safeEqual, sha256 } from "@/lib/auth/tokens";

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 30;

const COOKIE = "gr_portal_otp";
const COOKIE_PATH = "/customer-portal/login";
const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_PER_HOUR = 5;

type Challenge = typeof otpChallenges.$inferSelect;

const hashCode = (challengeId: string, code: string) => sha256(`${challengeId}:${code}`);

export type StartResult =
  | { ok: true }
  | { ok: false; reason: "too-many" | "too-soon"; retryInSeconds?: number };

export async function startPortalChallenge(phone: string): Promise<StartResult> {
  const db = getDb();

  const [latest] = await db
    .select({ createdAt: otpChallenges.createdAt })
    .from(otpChallenges)
    .where(eq(otpChallenges.phone, phone))
    .orderBy(desc(otpChallenges.createdAt))
    .limit(1);

  if (latest) {
    const waited = (Date.now() - latest.createdAt.getTime()) / 1000;
    if (waited < RESEND_SECONDS) {
      return { ok: false, reason: "too-soon", retryInSeconds: Math.ceil(RESEND_SECONDS - waited) };
    }
  }

  const [{ recent }] = await db
    .select({ recent: count() })
    .from(otpChallenges)
    .where(
      and(
        eq(otpChallenges.phone, phone),
        gt(otpChallenges.createdAt, new Date(Date.now() - 60 * 60 * 1000)),
      ),
    );
  if (recent >= MAX_PER_HOUR) return { ok: false, reason: "too-many" };

  const id = crypto.randomUUID();
  const code = await sendOtp(phone);
  const expiresAt = new Date(Date.now() + TTL_MS);

  await db.insert(otpChallenges).values({ id, phone, codeHash: hashCode(id, code), expiresAt });

  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    expires: expiresAt,
  });

  return { ok: true };
}

export async function currentPortalChallenge() {
  const id = (await cookies()).get(COOKIE)?.value;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return null;

  const [challenge] = await getDb()
    .select()
    .from(otpChallenges)
    .where(eq(otpChallenges.id, id))
    .limit(1);

  if (
    !challenge ||
    challenge.consumedAt ||
    challenge.attempts >= MAX_ATTEMPTS ||
    challenge.expiresAt.getTime() <= Date.now()
  ) {
    return null;
  }
  return challenge;
}

export type CheckResult =
  | { ok: true; phone: string }
  | { ok: false; reason: "expired" | "wrong" | "locked" };

export async function checkPortalCode(code: string): Promise<CheckResult> {
  const challenge = await currentPortalChallenge();
  if (!challenge) return { ok: false, reason: "expired" };

  const db = getDb();

  const [spent] = await db
    .update(otpChallenges)
    .set({ attempts: sql`${otpChallenges.attempts} + 1` })
    .where(and(eq(otpChallenges.id, challenge.id), lt(otpChallenges.attempts, MAX_ATTEMPTS)))
    .returning({ attempts: otpChallenges.attempts });

  if (!spent) return { ok: false, reason: "locked" };

  if (!safeEqual(hashCode(challenge.id, code), challenge.codeHash)) {
    return { ok: false, reason: spent.attempts >= MAX_ATTEMPTS ? "locked" : "wrong" };
  }

  const [consumed] = await db
    .update(otpChallenges)
    .set({ consumedAt: new Date() })
    .where(and(eq(otpChallenges.id, challenge.id), isNull(otpChallenges.consumedAt)))
    .returning({ phone: otpChallenges.phone });

  if (!consumed) return { ok: false, reason: "expired" };

  (await cookies()).delete({ name: COOKIE, path: COOKIE_PATH });
  return { ok: true, phone: consumed.phone };
}

export function portalResendWait(challenge: Challenge) {
  const waited = (Date.now() - challenge.createdAt.getTime()) / 1000;
  return Math.max(0, Math.ceil(RESEND_SECONDS - waited));
}
