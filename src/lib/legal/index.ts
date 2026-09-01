import type { LegalDoc } from "./types";
import { privacyPolicy } from "./privacy";
import { termsAndConditions } from "./terms";
import { refundPolicy } from "./refunds";

export type { LegalDoc, Section, Block } from "./types";

export const POLICY_VERSION = "2026-08-11";

export const legalDocs = {
  privacy: privacyPolicy,
  terms: termsAndConditions,
  refunds: refundPolicy,
} satisfies Record<string, LegalDoc>;

export type LegalSlug = keyof typeof legalDocs;

export const legalNav: { slug: LegalSlug; label: string; blurb: string }[] = [
  {
    slug: "terms",
    label: "Terms and Conditions",
    blurb: "The agreement governing your use of growthrush.ai.",
  },
  {
    slug: "privacy",
    label: "Privacy Policy",
    blurb: "What we collect, why, how long we keep it and your rights over it.",
  },
  {
    slug: "refunds",
    label: "Return and Refund Policy",
    blurb: "When a refund is available, and how to ask for one.",
  },
];
