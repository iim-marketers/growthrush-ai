import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db";
import { businesses } from "@/db/schema";
import { getSessionUser } from "./session";

/**
 * The gatekeepers every signed-in screen and action goes through. proxy.ts
 * only bounces browsers with no cookie at all; these check the session
 * against the database, so they are the check that counts.
 */

/** Where a signed-in user belongs right now. */
export function homeFor(user: { onboardedAt: Date | null }) {
  return user.onboardedAt ? "/dashboard" : "/onboarding";
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

/** For the app screens: signed in and finished with setup. */
export async function requireOnboardedUser() {
  const user = await requireUser();
  if (!user.onboardedAt) redirect("/onboarding");
  return user;
}

export const getBusiness = cache(async (userId: string) => {
  const [business] = await getDb()
    .select()
    .from(businesses)
    .where(eq(businesses.userId, userId))
    .limit(1);
  return business ?? null;
});
