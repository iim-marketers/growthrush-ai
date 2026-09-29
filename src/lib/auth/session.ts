import "server-only";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { cache } from "react";
import { getDb } from "@/db";
import { sessions, users } from "@/db/schema";
import { SESSION_COOKIE } from "./cookie";
import { newToken, sha256 } from "./tokens";

const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Signs `userId` in on this browser. */
export async function createSession(userId: string) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + TTL_MS);

  await getDb()
    .insert(sessions)
    .values({ tokenHash: sha256(token), userId, expiresAt });

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

/** Signs this browser out: the row goes, so the cookie is dead everywhere. */
export async function deleteSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await getDb()
      .delete(sessions)
      .where(eq(sessions.tokenHash, sha256(token)));
  }
  jar.delete(SESSION_COOKIE);
}

/**
 * The signed-in user, checked against the database — not just the cookie.
 * Memoised per request, so a layout and its page share one query.
 */
export const getSessionUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? findSessionUser(token) : null;
});

/** The user a session token belongs to, if it is live. proxy.ts uses this
    directly, since it reads the cookie off the request, not next/headers. */
export async function findSessionUser(token: string) {
  const [row] = await getDb()
    .select({
      id: users.id,
      phone: users.phone,
      onboardedAt: users.onboardedAt,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, sha256(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return row ?? null;
}

export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof getSessionUser>>
>;
