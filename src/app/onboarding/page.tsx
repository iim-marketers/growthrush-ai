import type { Metadata, Viewport } from "next";
import { OnboardingWizard } from "@/components/onboarding/wizard";

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

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
