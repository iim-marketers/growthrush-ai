"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { businesses, users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { cleanAnswers, isComplete } from "@/lib/onboarding";

export type SaveResult = { error: string } | undefined;

export async function saveOnboarding(
  input: unknown,
  complete: boolean,
): Promise<SaveResult> {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const answers = cleanAnswers(input);
  if (complete && !isComplete(answers)) {
    return { error: "A few answers are missing. Go back and fill them in." };
  }

  /* Empty means unanswered, which the table stores as null. */
  const row = {
    name: answers.business || null,
    category: answers.category || null,
    city: answers.city || null,
    listingId: answers.listing || null,
    goal: answers.goal || null,
    budgetBand: answers.budget || null,
    planId: answers.plan || null,
    updatedAt: new Date(),
  };

  try {
    const db = getDb();
    await db
      .insert(businesses)
      .values({ userId: user.id, ...row })
      .onConflictDoUpdate({ target: businesses.userId, set: row });

    if (complete) {
      await db
        .update(users)
        .set({ onboardedAt: new Date() })
        .where(and(eq(users.id, user.id), isNull(users.onboardedAt)));
    }
  } catch (error) {
    console.error("Could not save onboarding", user.id, error);
    return { error: "We couldn't save your answers. Please try again." };
  }

  if (complete) redirect("/dashboard");
}
