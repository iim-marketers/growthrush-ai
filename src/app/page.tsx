import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { LogoGrid } from "@/components/landing/logo-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { CaseStudies } from "@/components/landing/case-studies";
import { Results } from "@/components/landing/results";
import { Scarcity } from "@/components/landing/scarcity";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";

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
        {/* <Scarcity /> */}
        {/* <Pricing /> */}
        <Faq />
        {/* <FinalCta /> */}
      </main>
      {/* <SiteFooter /> */}
    </>
  );
}
