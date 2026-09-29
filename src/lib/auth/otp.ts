import "server-only";
import { and, count, eq, gt, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { otpChallenges } from "@/db/schema";
import { verify } from "@/lib/app-data";
import { sendOtp } from "./sms";
import { safeEqual, sha256 } from "./tokens";

/* The challenge id rides in its own short-lived cookie, so the verify screen
   knows which number it is for without putting the number in the URL. */
const CHALLENGE_COOKIE = "gr_otp";

const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
/* Caps how many texts one number can trigger — SMS costs money. */
const MAX_PER_HOUR = 5;

export type Challenge = typeof otpChallenges.$inferSelect;

/* The id salts the hash, so equal codes on two challenges hash differently. */
const hashCode = (challengeId: string, code: string) =>
  sha256(`${challengeId}:${code}`);

export type StartResult =
  | { ok: true }
  | { ok: false; reason: "too-many" | "too-soon"; retryInSeconds?: number };

/** Sends a fresh code to `phone` and points the challenge cookie at it. */
export async function startChallenge(phone: string): Promise<StartResult> {
  const db = getDb();

  const [latest] = await db
    .select({ createdAt: otpChallenges.createdAt })
    .from(otpChallenges)
    .where(eq(otpChallenges.phone, phone))
    .orderBy(sql`${otpChallenges.createdAt} desc`)
    .limit(1);

  if (latest) {
    const waited = (Date.now() - latest.createdAt.getTime()) / 1000;
    if (waited < verify.resendSeconds) {
      return {
        ok: false,
        reason: "too-soon",
        retryInSeconds: Math.ceil(verify.resendSeconds - waited),
      };
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

  await db.insert(otpChallenges).values({
    id,
    phone,
    codeHash: hashCode(id, code),
    expiresAt,
  });

  (await cookies()).set(CHALLENGE_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/login",
    expires: expiresAt,
  });

  return { ok: true };
}

/** The challenge the cookie points at, if it can still be answered. */
export async function currentChallenge() {
  const id = (await cookies()).get(CHALLENGE_COOKIE)?.value;
  if (!id || !isUuid(id)) return null;

  const [challenge] = await getDb()
    .select()
    .from(otpChallenges)
    .where(eq(otpChallenges.id, id))
    .limit(1);

  if (!challenge || !isOpen(challenge)) return null;
  return challenge;
}

export type CheckResult =
  | { ok: true; phone: string }
  | { ok: false; reason: "expired" | "wrong" | "locked" };

/** Spends one attempt on `code`. A correct code closes the challenge. */
export async function checkCode(code: string): Promise<CheckResult> {
  const challenge = await currentChallenge();
  if (!challenge) return { ok: false, reason: "expired" };

  const db = getDb();

  /* Count the attempt before comparing, atomically, so parallel guesses
     can't slip past the cap. */
  const [spent] = await db
    .update(otpChallenges)
    .set({ attempts: sql`${otpChallenges.attempts} + 1` })
    .where(
      and(
        eq(otpChallenges.id, challenge.id),
        sql`${otpChallenges.attempts} < ${MAX_ATTEMPTS}`,
      ),
    )
    .returning({ attempts: otpChallenges.attempts });

  if (!spent) return { ok: false, reason: "locked" };

  if (!safeEqual(hashCode(challenge.id, code), challenge.codeHash)) {
    return {
      ok: false,
      reason: spent.attempts >= MAX_ATTEMPTS ? "locked" : "wrong",
    };
  }

  /* Only one request may consume the code. */
  const [consumed] = await db
    .update(otpChallenges)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(otpChallenges.id, challenge.id),
        sql`${otpChallenges.consumedAt} is null`,
      ),
    )
    .returning({ phone: otpChallenges.phone });

  if (!consumed) return { ok: false, reason: "expired" };

  (await cookies()).delete({ name: CHALLENGE_COOKIE, path: "/login" });
  return { ok: true, phone: consumed.phone };
}

/** Seconds until another code may be requested for this challenge's number. */
export function resendWait(challenge: Challenge) {
  const waited = (Date.now() - challenge.createdAt.getTime()) / 1000;
  return Math.max(0, Math.ceil(verify.resendSeconds - waited));
}

function isOpen(challenge: Challenge) {
  return (
    !challenge.consumedAt &&
    challenge.attempts < MAX_ATTEMPTS &&
    challenge.expiresAt.getTime() > Date.now()
  );
}

function isUuid(value: string) {
  return /^[0-9a-f-]{36}$/i.test(value);
}
