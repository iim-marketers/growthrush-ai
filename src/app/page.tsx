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
  "Scale your business or franchise lead generation with AI-powered Facebook ads. GrowthRush.ai handles copy, creative design, and budget optimization for maximum ROI.";

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
