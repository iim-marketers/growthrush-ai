import { faqs } from "@/lib/landing-data";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const ORG_ID = `${SITE_URL}/#organization`;

export function landingJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE_NAME,
        legalName: "Estrellingent Technology Private Limited",
        url: SITE_URL,
        logo: `${SITE_URL}/icon-256.png`,
        email: "hello@growthrush.ai",
        address: {
          "@type": "PostalAddress",
          streetAddress: "A-60 Brahmapur South",
          addressLocality: "Kolkata",
          addressRegion: "West Bengal",
          postalCode: "700096",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "Service",
        name: "AI-run Facebook ads for local businesses",
        serviceType: "Lead generation",
        description,
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };
}
