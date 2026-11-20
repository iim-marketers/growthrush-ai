import "server-only";
import { and, count, desc, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { otpChallenges } from "@/db/schema";
import { sendOtp } from "@/lib/auth/sms";
import { safeEqual, sha256 } from "@/lib/auth/tokens";

export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 30;
export const OTP_TTL_MINUTES = 10;

const TTL_MS = OTP_TTL_MINUTES * 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_PER_HOUR = 5;

type Challenge = typeof otpChallenges.$inferSelect;

const hashCode = (challengeId: string, code: string) => sha256(`${challengeId}:${code}`);

export type StartResult =
  | { ok: true }
  | { ok: false; reason: "too-many" | "too-soon"; retryInSeconds?: number };

export type CheckResult =
  | { ok: true; key: string }
  | { ok: false; reason: "expired" | "wrong" | "locked" };

export function challengeStore({ cookie, path }: { cookie: string; path: string }) {
  async function start(
    key: string,
    deliver: (challengeId: string) => Promise<string>,
  ): Promise<StartResult> {
    const db = getDb();

    const [latest] = await db
      .select({ createdAt: otpChallenges.createdAt })
      .from(otpChallenges)
      .where(eq(otpChallenges.phone, key))
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
          eq(otpChallenges.phone, key),
          gt(otpChallenges.createdAt, new Date(Date.now() - 60 * 60 * 1000)),
        ),
      );
    if (recent >= MAX_PER_HOUR) return { ok: false, reason: "too-many" };

    const id = crypto.randomUUID();
    const code = await deliver(id);
    const expiresAt = new Date(Date.now() + TTL_MS);

    await db.insert(otpChallenges).values({ id, phone: key, codeHash: hashCode(id, code), expiresAt });

    (await cookies()).set(cookie, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path,
      expires: expiresAt,
    });

    return { ok: true };
  }

  async function current() {
    const id = (await cookies()).get(cookie)?.value;
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

  async function check(code: string): Promise<CheckResult> {
    const challenge = await current();
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
      .returning({ key: otpChallenges.phone });

    if (!consumed) return { ok: false, reason: "expired" };

    (await cookies()).delete({ name: cookie, path });
    return { ok: true, key: consumed.key };
  }

  return { start, current, check };
}

const phoneChallenges = challengeStore({ cookie: "gr_portal_otp", path: "/customer-portal/login" });

export const startPortalChallenge = (phone: string) =>
  phoneChallenges.start(phone, () => sendOtp(phone));
export const currentPortalChallenge = phoneChallenges.current;
export const checkPortalCode = phoneChallenges.check;

export function portalResendWait(challenge: Challenge) {
  const waited = (Date.now() - challenge.createdAt.getTime()) / 1000;
  return Math.max(0, Math.ceil(RESEND_SECONDS - waited));
}
