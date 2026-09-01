import { caseStudies, heroStats } from "@/lib/landing-data";

/* ------------------------------------------------------------------ *
 * Auth — the step between /login and onboarding
 * ------------------------------------------------------------------ */

export const verify = {
  length: 6,
  resendSeconds: 30,
  title: "Enter the code",
  subtitle: "We sent a 6-digit code to %s",
  cta: "Verify & continue",
  /* No SMS gateway yet, so the prototype has one fixed code and shows it in a
     mock notification — otherwise the flow is a locked door. Delete this and
     the mock message together once real OTPs are sent. */
  demoCode: "000000",
  sender: "GRWTHR",
  smsBody: "%s is your growthrush.ai code",
  wrongCode: "That code is not right — use the one in the message above.",
} as const;

/* ------------------------------------------------------------------ *
 * Onboarding — the guided walk from "who are you?" to a live campaign
 * ------------------------------------------------------------------ */

const demo = caseStudies[0];

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
    body: "We'll size your real audience on Instagram & Facebook here.",
    cta: "Next",
  },
  {
    id: "confirm",
    eyebrow: "Confirm your business",
    title: "Which one is you?",
    body: `We found these on Google near ${demo.city}.`,
    cta: "Confirm & continue",
  },
  {
    id: "goal",
    eyebrow: "Your goal",
    title: "What do you want more of?",
    cta: "See my results",
  },
  {
    id: "audience",
    eyebrow: `Live audience · ${demo.city}`,
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
    body: `Made for ${demo.business} — ready to go live.`,
    cta: "Choose my plan & go live",
  },
  {
    id: "plan",
    eyebrow: "Pick your plan",
    title: "Go live and start getting leads",
    body: "Both plans run your Instagram & Facebook ads. Cancel anytime.",
    cta: "Go live",
  },
];

export const businessStep = {
  placeholder: "Business name",
  prefill: demo.business,
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
  prefill: demo.city,
  noteTitle: "Why we ask",
  noteBody:
    "We pull your live Google listing and calculate how many people near you are ready to buy — before you spend a rupee.",
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

export const goals = [
  {
    id: "whatsapp",
    icon: "message",
    title: "WhatsApp leads",
    desc: "Chats to your phone",
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
] as const;

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
  networks: ["Facebook", "Instagram"],
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
  author: demo.business,
  meta: `Sponsored · ${demo.city}`,
  eyebrow: `Now enrolling · ${demo.city}`,
  headline: `Looking for the best coaching in ${demo.city}?`,
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

export const profile = {
  business: "Sharma Teaching Classes",
  city: "Bengaluru",
  category: "Coaching / Classes",
  initial: "A",
  phone: "+91 98••• ••210",
} as const;

/* ------------------------------------------------------------------ *
 * Dashboard
 * ------------------------------------------------------------------ */

export const campaign = {
  name: "Consultations — Bengaluru 5 km",
  status: "live",
  liveSince: "24 days",
  dailyBudget: 800,
  spent: 18176,
  monthlyCap: 24000,
} as const;

export const dashboardStats = [
  {
    id: "leads",
    label: "Leads this month",
    value: "128",
    delta: "+22%",
    up: true,
    upIsGood: true,
  },
  {
    id: "cpl",
    label: "Cost per lead",
    value: "₹142",
    delta: "−18%",
    up: false,
    upIsGood: false,
  },
  {
    id: "spend",
    label: "Ad spend",
    value: "₹18,176",
    delta: "+9%",
    up: true,
    upIsGood: true,
  },
  {
    id: "reach",
    label: "People reached",
    value: "41,280",
    delta: "+14%",
    up: true,
    upIsGood: true,
  },
] as const;

export const leadsByDay = [
  { day: "18 Aug", leads: 3 },
  { day: "19 Aug", leads: 5 },
  { day: "20 Aug", leads: 2 },
  { day: "21 Aug", leads: 6 },
  { day: "22 Aug", leads: 4 },
  { day: "23 Aug", leads: 6 },
  { day: "24 Aug", leads: 5 },
  { day: "25 Aug", leads: 3 },
  { day: "26 Aug", leads: 7 },
  { day: "27 Aug", leads: 5 },
  { day: "28 Aug", leads: 4 },
  { day: "29 Aug", leads: 8 },
  { day: "30 Aug", leads: 6 },
  { day: "31 Aug", leads: 4 },
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

export const leads = [
  {
    id: "l-1042",
    name: "Priya Ranganathan",
    phone: "+91 98450 21188",
    enquiry: "Panchakarma package — asked about weekend slots",
    source: "Instagram",
    receivedAt: "12 min ago",
    status: "new",
  },
  {
    id: "l-1041",
    name: "Karthik Rao",
    phone: "+91 99001 74530",
    enquiry: "First consultation, wants pricing",
    source: "Facebook",
    receivedAt: "1 hour ago",
    status: "new",
  },
  {
    id: "l-1040",
    name: "Sneha Iyer",
    phone: "+91 97417 33902",
    enquiry: "Knee pain — asked if you take insurance",
    source: "Instagram",
    receivedAt: "3 hours ago",
    status: "contacted",
  },
  {
    id: "l-1039",
    name: "Mohammed Arif",
    phone: "+91 88849 60215",
    enquiry: "Booked for Saturday 11am",
    source: "Instagram",
    receivedAt: "Yesterday",
    status: "converted",
  },
  {
    id: "l-1038",
    name: "Deepa Nair",
    phone: "+91 90352 47761",
    enquiry: "Skin treatment — comparing clinics",
    source: "Facebook",
    receivedAt: "Yesterday",
    status: "contacted",
  },
  {
    id: "l-1037",
    name: "Rahul Bhat",
    phone: "+91 95388 10047",
    enquiry: "Asked for a branch closer to Whitefield",
    source: "Instagram",
    receivedAt: "2 days ago",
    status: "lost",
  },
  {
    id: "l-1036",
    name: "Anitha Kumari",
    phone: "+91 91082 55613",
    enquiry: "Therapy for migraine, wants a call back",
    source: "Facebook",
    receivedAt: "2 days ago",
    status: "converted",
  },
  {
    id: "l-1035",
    name: "Vivek Shetty",
    phone: "+91 99721 40836",
    enquiry: "Corporate wellness enquiry for 40 staff",
    source: "Instagram",
    receivedAt: "3 days ago",
    status: "contacted",
  },
] as const;

/* ------------------------------------------------------------------ *
 * Billing
 * ------------------------------------------------------------------ */

export const billing = {
  planId: "ai",
  renewsOn: "28 September 2026",
  paymentMethod: { brand: "HDFC Visa", last4: "4417", expiry: "08/29" },
} as const;

export const invoices = [
  {
    id: "GR-2026-0812",
    period: "August 2026",
    amount: "₹2,399",
    status: "Paid",
  },
  { id: "GR-2026-0711", period: "July 2026", amount: "₹2,399", status: "Paid" },
  { id: "GR-2026-0610", period: "June 2026", amount: "₹2,399", status: "Paid" },
] as const;
