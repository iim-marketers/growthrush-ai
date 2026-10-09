import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { LogoGrid } from "@/components/landing/logo-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { CaseStudies } from "@/components/landing/case-studies";
import { Results } from "@/components/landing/results";
import { Faq } from "@/components/landing/faq";
import { Closing } from "@/components/landing/closing";
import { SiteFooter } from "@/components/landing/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { landingJsonLd } from "@/lib/structured-data";

const DESCRIPTION =
  "growthrush.ai writes the copy, designs the creatives and runs your Facebook ads — then delivers ready-to-buy leads straight to your WhatsApp. Live in under 10 minutes.";

export const metadata: Metadata = {
  description: DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <JsonLd data={landingJsonLd(DESCRIPTION)} />
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
      <SiteFooter />
    </>
  );
}
