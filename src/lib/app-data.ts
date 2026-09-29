import { heroStats } from "@/lib/landing-data";

/* ------------------------------------------------------------------ *
 * Auth — the step between /login and onboarding
 * ------------------------------------------------------------------ */

export const verify = {
  length: 6,
  resendSeconds: 30,
  title: "Enter the code",
  subtitle: "We sent a 6-digit code to %s",
  cta: "Verify & continue",
  /* The mock SMS shown while lib/auth/sms.ts is stubbed. */
  sender: "GRWTHR",
  smsBody: "%s is your growthrush.ai code",
  wrongCode: "That code is not right. Check the message and try again.",
} as const;

/* ------------------------------------------------------------------ *
 * Onboarding — the guided walk from "who are you?" to a live campaign
 * ------------------------------------------------------------------ */

/* Most of the walkthrough is still a scripted demo — there is no Google or
   Meta lookup yet — so the listings and the numbers need a business that
   stays put. Copy that should name the customer's own business or city uses
   {business} and {city}, which the wizard fills from their answers. */
const demo = {
  city: "Kolkata",
  business: "Sharma Coaching Classes",
  headline: "6 to 120 leads a month in one quarter",
} as const;

export type StepId =
  | "business"
  | "location"
  | "confirm"
  | "goal"
  | "audience"
  | "readiness"
  | "ad"
  | "plan";

type OnboardingStep = {
  id: StepId;
  eyebrow: string;
  title: string;
  accent?: string;
  tail?: string;
  body?: string;
  cta: string;
};

export const onboardingSteps: readonly OnboardingStep[] = [
  {
    id: "business",
    eyebrow: "About your business",
    title: "What's your business called?",
    cta: "Next",
  },
  {
    id: "location",
    eyebrow: "Your location",
    title: "Where do you get customers?",
    body: "We'll size your real audience on Facebook here.",
    cta: "Next",
  },
  /* Hidden until the Google Places lookup exists: the listings below are
     placeholders, so every customer would be shown the same ones.
  {
    id: "confirm",
    eyebrow: "Confirm your business",
    title: "Which one is you?",
    body: `We found these on Google near ${demo.city}.`,
    cta: "Confirm & continue",
  },
  */
  {
    id: "goal",
    eyebrow: "Your goal",
    title: "What do you want more of?",
    cta: "See my results",
  },
  {
    id: "audience",
    eyebrow: "Live audience · {city}",
    title: "Your customers are scrolling",
    accent: "right now",
    cta: "Can I reach them?",
  },
  {
    id: "readiness",
    eyebrow: "Your lead readiness",
    title: "Right now, you're",
    accent: "invisible",
    tail: "to them",
    cta: "Build my lead campaign",
  },
  {
    id: "ad",
    eyebrow: "Your ad is ready",
    title: "Here's your first Meta ad 🎉",
    body: "Made for {business} — ready to go live.",
    cta: "Choose my plan & go live",
  },
  {
    id: "plan",
    eyebrow: "Pick your plan",
    title: "Go live and start getting leads",
    body: "Both plans run your Facebook ads. Cancel anytime.",
    cta: "Go live",
  },
];

export const businessStep = {
  placeholder: "Business name",
  categoryLabel: "What do you offer?",
} as const;

export const categories = [
  "Coaching / Classes",
  "Real estate",
  "Salon / Spa",
  "Clinic / Health",
  "Restaurant",
  "Retail store",
  "Gym / Fitness",
  "Services",
] as const;

export const locationStep = {
  placeholder: "Location",
  noteTitle: "Why we ask",
  noteBody:
    "We use your area to work out how many people near you are ready to buy — before you spend a rupee.",
} as const;

export const googleListings = [
  {
    id: "sharma-coaching",
    name: demo.business,
    address: "14B Rashbehari Ave, Gariahat, Kolkata 700019",
    rating: 4.3,
    reviews: 58,
  },
  {
    id: "sharma-tutorials",
    name: "Sharma Tutorials & Academy",
    address: "7 Southern Ave, Lake Market, Kolkata 700029",
    rating: 4.1,
    reviews: 37,
  },
  {
    id: "sharma-home",
    name: "Sharma Home Tuition",
    address: "22 Hindustan Rd, Gariahat, Kolkata 700019",
    rating: 3.6,
    reviews: 12,
  },
] as const;

export const notListed = {
  id: "not-listed",
  name: "My business isn't listed",
  note: "We'll create your profile during setup",
} as const;

type Goal = {
  id: string;
  icon: "message" | "phone" | "form" | "store";
  title: string;
  desc: string;
  /** Shown but not pickable until the integration behind it exists. */
  comingSoon?: boolean;
};

export const goals: readonly Goal[] = [
  {
    id: "whatsapp",
    icon: "message",
    title: "WhatsApp leads",
    desc: "Chats to your phone",
    /* No WhatsApp Business API yet. */
    comingSoon: true,
  },
  {
    id: "phone",
    icon: "phone",
    title: "Phone calls",
    desc: "Ready-to-buy callers",
  },
  {
    id: "form",
    icon: "form",
    title: "Form leads",
    desc: "Name, number & need",
  },
  {
    id: "store",
    icon: "store",
    title: "Store visits",
    desc: "Footfall near you",
  },
];

export const monthlyBudgets = [
  { id: "under-10k", label: "Under ₹10k" },
  { id: "10k-30k", label: "₹10k – ₹30k" },
  { id: "30k-plus", label: "₹30k +" },
  { id: "not-sure", label: "Not sure" },
] as const;

export const audience = {
  reach: heroStats[0].value,
  caption: "People near you who match your ideal customer",
  interest: "coaching & classes",
  networks: ["Facebook"],
  breakdown: [
    { label: "Age 25–34", pct: 41 },
    { label: "Age 35–44", pct: 32 },
    { label: "Age 18–24", pct: 19 },
    { label: "Within 5 km", pct: 28 },
  ],
} as const;

export const readiness = {
  score: 14,
  grade: "Poor",
  benchmark: "Businesses scoring 75+ get 40–300 leads every month",
  today: { label: "Today", value: "~6" },
  withAi: { label: "With AI", value: "120+" },
  unit: "leads / month",
  source: demo.headline,
} as const;

export const adPreview = {
  badge: "Generated for you",
  author: "{business}",
  meta: "Sponsored · {city}",
  eyebrow: "Now enrolling · {city}",
  headline: "Looking for the best coaching in {city}?",
  cta: "Book a free demo",
  leadCta: "Send WhatsApp",
  footer: "AI writes fresh copy & creatives every week",
} as const;

export const planStep = {
  budgetNote: {
    strong: "Your ad budget is separate",
    body: `and fully yours — set it from ${heroStats[2].value}/day, change anytime. The plan fee covers creatives & management.`,
  },
  guarantee: "30-day results guarantee",
  guaranteeNote: "cancel anytime",
} as const;

/* ------------------------------------------------------------------ *
 * The signed-in shell
 * ------------------------------------------------------------------ */

export const appNav = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/leads", label: "Leads", icon: "inbox" },
  { href: "/billing", label: "Billing", icon: "card" },
] as const;

export const appSupport = [
  { href: "mailto:Hello@growthrush.ai", label: "Help & support", icon: "help" },
  { href: "/legal", label: "Terms & policies", icon: "legal" },
] as const;

/* ------------------------------------------------------------------ *
 * Leads
 * ------------------------------------------------------------------ */

export const leadStatuses = [
  { id: "new", label: "New", tone: "brand" },
  { id: "contacted", label: "Contacted", tone: "amber" },
  { id: "converted", label: "Converted", tone: "success" },
  { id: "lost", label: "Lost", tone: "muted" },
] as const;

export type LeadStatus = (typeof leadStatuses)[number]["id"];
