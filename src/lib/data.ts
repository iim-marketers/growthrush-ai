/**
 * Static content for the screens that exist today (splash + login).
 * No backend yet.
 */

export const brand = {
  name: "growthrush",
  suffix: ".ai",
  rating: "★ 4.9 • 4,200+",
} as const;

/** Shown alongside the login form on wide screens. */
export const pitch = {
  headline: "Leads that land in your",
  headlineAccent: "WhatsApp",
  body: "AI writes the copy, designs the creatives and runs your Facebook ads — so ready-to-buy customers near you reach out first.",
  points: [
    "Ads live in minutes, not weeks",
    "Auto-targets your local audience",
    "Optimised daily for the lowest cost per lead",
  ],
} as const;

export const account = {
  countryCode: "IN",
  dialCode: "+91",
} as const;
