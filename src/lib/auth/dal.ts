import "server-only";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/db";
import { businesses } from "@/db/schema";
import { getSessionUser } from "./session";

export function homeFor(user: { onboardedAt: Date | null }) {
  return user.onboardedAt ? "/dashboard" : "/onboarding";
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

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
