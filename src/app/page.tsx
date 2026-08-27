import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { LogoGrid } from "@/components/landing/logo-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { CaseStudies } from "@/components/landing/case-studies";
import { Results } from "@/components/landing/results";
import { Faq } from "@/components/landing/faq";
import { Closing } from "@/components/landing/closing";

export const metadata: Metadata = {
  // No `title` here on purpose: `title.template` in the root layout only applies
  // to child segments, so the homepage inherits the layout's `title.default`.
  description:
    "growthrush.ai writes the copy, designs the creatives and runs your Instagram & Facebook ads — then delivers ready-to-buy leads straight to your WhatsApp. Live in under 10 minutes.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <main>
        <Hero />
        <LogoGrid />
        <HowItWorks />
        <Features />
        <CaseStudies />
        <Results />
        <Faq />
        <Closing />
      </main>
    </>
  );
}
