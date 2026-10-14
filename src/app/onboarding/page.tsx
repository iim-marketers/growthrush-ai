import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/wizard";
import { getBusiness, requireUser } from "@/lib/auth/dal";
import { cleanAnswers, emptyAnswers, type Answers } from "@/lib/onboarding";
import { getOfferedPlans } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Set up your campaign",
  description:
    "Tell growthrush.ai about your business, your area and your daily budget — then the AI builds your first campaign.",
  alternates: { canonical: "/onboarding" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.onboardedAt) redirect("/dashboard");
  const [business, plans] = await Promise.all([
    getBusiness(user.id),
    getOfferedPlans(),
  ]);
  const planIds = plans.map((plan) => plan.id);

  const saved: Answers = cleanAnswers(
    {
      business: business?.name ?? emptyAnswers.business,
      category: business?.category ?? emptyAnswers.category,
      city: business?.city ?? emptyAnswers.city,
      listing: business?.listingId ?? emptyAnswers.listing,
      goal: business?.goal ?? emptyAnswers.goal,
      budget: business?.budgetBand ?? emptyAnswers.budget,
      plan: business?.planId ?? emptyAnswers.plan,
    } satisfies Answers,
    planIds,
  );
  saved.plan ||= planIds[0] ?? "";

  return (
    <OnboardingWizard
      saved={saved}
      plans={plans}
      onboarded={Boolean(user.onboardedAt)}
    />
  );
}
