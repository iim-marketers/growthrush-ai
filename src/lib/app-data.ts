/**
 * Static content for the signed-in app — OTP verify, onboarding, dashboard,
 * leads and billing. There is no backend yet, so every screen reads from here
 * the same way the marketing page reads from `landing-data.ts`.
 *
 * The figures below are one illustrative demo account, not real campaign
 * performance. They are internally consistent (128 leads × ₹142 = ₹18,176 of
 * spend) so the screens hold together — replace the whole block with API data
 * rather than editing numbers piecemeal.
 */

/* ------------------------------------------------------------------ *
 * Auth — the step between /login and onboarding
 * ------------------------------------------------------------------ */

export const verify = {
  length: 6,
  /** Seconds before "Resend code" becomes clickable again. */
  resendSeconds: 30,
  title: "Enter the code",
  /** `%s` is replaced with the masked number the code went to. */
  subtitle: "We sent a 6-digit code to %s",
  cta: "Verify & continue",
} as const;

/* ------------------------------------------------------------------ *
 * Onboarding — the three questions the AI needs before it can build ads
 * ------------------------------------------------------------------ */

export const categories = [
  "Coaching / Tuition",
  "Salon & Spa",
  "Restaurant / Café",
  "Gym & Fitness",
  "Clinic / Dental",
  "Real Estate",
  "Retail Store",
  "Interior & Home",
  "Something else",
] as const;

/** Radius the ads are served within, in kilometres. */
export const radiusOptions = [
  { km: 3, label: "3 km", note: "Tight — dense neighbourhoods" },
  { km: 5, label: "5 km", note: "Recommended for most shops" },
  { km: 10, label: "10 km", note: "Wider — clinics, showrooms" },
  { km: 25, label: "25 km", note: "City-wide" },
] as const;

/** Daily ad spend. Stays in the customer's own Meta account. */
export const budgetPresets = [
  { amount: 300, label: "₹300", note: "Starter" },
  { amount: 500, label: "₹500", note: "Popular" },
  { amount: 800, label: "₹800", note: "Recommended" },
  { amount: 1500, label: "₹1,500", note: "Aggressive" },
] as const;

/**
 * The wizard steps. `field` names the slice of form state each one owns, so the
 * "can I continue?" check stays in one place instead of a switch per step.
 */
export const onboardingSteps = [
  {
    id: "business",
    eyebrow: "Step 1 of 4",
    title: "What do you do?",
    body: "We pull your live Google listing and size the real audience near you.",
  },
  {
    id: "area",
    eyebrow: "Step 2 of 4",
    title: "Where should the ads run?",
    body: "Your customers are the people who can actually reach your door.",
  },
  {
    id: "budget",
    eyebrow: "Step 3 of 4",
    title: "Set your daily budget",
    body: "This is ad spend, not a fee — it stays in your own account and you can change it any day.",
  },
  {
    id: "whatsapp",
    eyebrow: "Step 4 of 4",
    title: "Where should leads land?",
    body: "Every enquiry arrives here the moment someone fills your ad form.",
  },
] as const;

/* ------------------------------------------------------------------ *
 * The signed-in shell
 * ------------------------------------------------------------------ */

export const appNav = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/leads", label: "Leads", icon: "inbox" },
  { href: "/billing", label: "Billing", icon: "card" },
] as const;

export const profile = {
  business: "Adyant Ayurveda",
  city: "Bengaluru",
  category: "Clinic / Dental",
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
  /** Month-to-date spend against a 30-day cap, for the budget meter. */
  spent: 18176,
  monthlyCap: 24000,
} as const;

/**
 * KPI row. `up` is the direction of the delta; `upIsGood` says how to colour it
 * — a rising cost per lead is bad news, a rising lead count is not.
 */
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

/**
 * Leads per day, oldest first. One series over time — plotted as columns in a
 * single hue, with only the peak directly labelled.
 */
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

/**
 * Lead states. `tone` maps to a status colour; every badge also carries its
 * label, so state is never communicated by colour alone.
 */
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
  /** Matches an `id` in `plans` from `landing-data.ts` — the source of truth
   *  for what each plan costs and includes. */
  planId: "ai",
  renewsOn: "28 September 2026",
  paymentMethod: { brand: "HDFC Visa", last4: "4417", expiry: "08/29" },
} as const;

export const invoices = [
  { id: "GR-2026-0812", period: "August 2026", amount: "₹2,399", status: "Paid" },
  { id: "GR-2026-0711", period: "July 2026", amount: "₹2,399", status: "Paid" },
  { id: "GR-2026-0610", period: "June 2026", amount: "₹2,399", status: "Paid" },
] as const;
