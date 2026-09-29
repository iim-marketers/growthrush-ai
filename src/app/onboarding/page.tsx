import type { Metadata, Viewport } from "next";
import { OnboardingWizard } from "@/components/onboarding/wizard";
import { getBusiness, requireUser } from "@/lib/auth/dal";
import { cleanAnswers, emptyAnswers, type Answers } from "@/lib/onboarding";

export const metadata: Metadata = {
  title: "Set up your campaign",
  description:
    "Tell growthrush.ai about your business, your area and your daily budget — then the AI builds your first campaign.",
  alternates: { canonical: "/onboarding" },
  robots: { index: false, follow: false },
};

/* The light screens want white browser chrome, not the landing page's navy. */
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function OnboardingPage() {
  const user = await requireUser();
  const business = await getBusiness(user.id);

  const saved: Answers = cleanAnswers({
    business: business?.name ?? emptyAnswers.business,
    category: business?.category ?? emptyAnswers.category,
    city: business?.city ?? emptyAnswers.city,
    listing: business?.listingId ?? emptyAnswers.listing,
    goal: business?.goal ?? emptyAnswers.goal,
    budget: business?.budgetBand ?? emptyAnswers.budget,
    plan: business?.planId ?? emptyAnswers.plan,
  } satisfies Answers);

  return (
    <OnboardingWizard saved={saved} onboarded={Boolean(user.onboardedAt)} />
  );
}
