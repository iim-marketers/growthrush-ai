export const hero = {
  eyebrow: "Created by AI Scientists from IIT-Bombay",
  title: "More customers.",
  titleAccent: "With the Power of AI.",
  subtitle:
    "growthrush.ai writes the copy, designs the creatives and runs your Facebook ads — then delivers ready-to-buy leads straight to your WhatsApp.",
  primaryCta: "Get Started",
  secondaryCta: "See how it works",
  note: "No card needed · Live in under 10 minutes",
} as const;

/** The headline numbers, shown in the pill inside the hero card. */
export const heroStats = [
  { value: "400+", label: "Happy Clients" },
  { value: "1000+", label: "Guaranteed Leads of Quality" },
  { value: "₹300", label: "Minimum daily ad budget" },
] as const;

export const showcaseBrands = [
  { name: "Haldiram's", src: "/logos/haldiram.png" },
  { name: "EY", src: "/logos/ey.png" },
  { name: "Emami", src: "/logos/emami.png" },
  { name: "ITC", src: "/logos/itc.png" },
  { name: "Joy", src: "/logos/joy.png" },
  { name: "Nephrocare", src: "/logos/nephrocare.png" },
  { name: "Adyant Ayurveda", src: "/logos/adyant-ayurveda.png" },
  { name: "Emporium Solutions", src: "/logos/emporium-solutions.png" },
  { name: "Pepsi", src: "/logos/pepsi.png" },
  { name: "Magik LED", src: "/logos/magik-led.png" },
  { name: "Century Ply", src: "/logos/centuryply.png" },
] as const;

/**
 * Case studies — real clients, illustrative figures.
 *
 * The names, categories and logos are real; the headline/body/metric on each
 * card are stand-in numbers so the section reads properly. Swap them for the
 * confirmed figures before launch.
 *
 * `logo` is a full-colour mark sitting on a white plate in the card, so it
 * works in both themes. Note this is haldiram-color.jpeg, not the white
 * knockout haldiram.png the logo strip uses.
 */
export const caseStudies = [
  {
    business: "Haldiram's",
    city: "Kolkata",
    category: "FMCG",
    headline: "Diwali budget moved to what was selling",
    body: "Sweet-box promotions targeted neighbourhood by neighbourhood through Diwali, with budget pushed daily towards the stores actually converting.",
    metric: "4.2x",
    metricLabel: "return on ad spend",
    logo: "/logos/haldiram-color.jpeg",
  },
  {
    business: "Mudit Ridh",
    city: "Kolkata",
    category: "Electric Vehicles",
    headline: "1,800 test-ride enquiries in 90 days",
    body: "Scooty buyers within delivery distance of the showroom, filtered before they reached the sales team and delivered straight to WhatsApp.",
    metric: "\u20b994",
    metricLabel: "per test-ride enquiry",
    logo: "/logos/mudit-ridh.png",
  },
  {
    business: "Manaksia Steels",
    city: "Kolkata",
    category: "Manufacturing",
    headline: "Reached contractors, not interest lists",
    body: "Coated sheet and coil enquiries from contractors and distributors, targeted by industrial belt rather than broad B2B interest lists.",
    metric: "3x",
    metricLabel: "more dealer enquiries",
    logo: "/logos/manaksia-steel.png",
  },
] as const;

/** Scarcity band, mirroring the reference layout. */
export const scarcity = {
  label: "Onboarding limited",
  text: "We cap new accounts each month so every campaign gets proper attention.",
  highlight: "Only 8 spots left this month",
} as const;

export const steps = [
  {
    n: "01",
    title: "Tell us about your business",
    body: "Name, category and the area you serve. We pull your live Google listing and size the real audience near you.",
  },
  {
    n: "02",
    title: "AI builds your campaign",
    body: "Copy, creatives and targeting generated for your category and city — reviewed by you before a rupee is spent.",
  },
  {
    n: "03",
    title: "Leads land in WhatsApp",
    body: "Ads go live on Facebook. Every enquiry arrives on your phone, and the AI optimises daily for the lowest cost per lead.",
  },
] as const;

export const features = [
  {
    title: "Creatives on autopilot",
    body: "Fresh ad copy and designs every week, written for your category — no designer, no agency retainer.",
    icon: "sparkles",
    image: "/images/feature-creatives.jpg",
  },
  {
    title: "Local audience targeting",
    body: "We find the people within a few kilometres of you who actually buy what you sell.",
    icon: "map",
    image: "/images/feature-targeting.jpg",
  },
  {
    title: "Leads to WhatsApp",
    body: "Every enquiry lands in the app you already check a hundred times a day. No dashboard to learn.",
    icon: "message",
    image: "/images/feature-whatsapp.jpg",
  },
  {
    title: "Daily optimisation",
    body: "The AI shifts budget toward whatever is producing the cheapest leads, every single day.",
    icon: "trend",
    image: "/images/feature-optimisation.jpg",
  },
  {
    title: "Your budget, your control",
    body: "Ad spend stays in your own account. Start at ₹300/day, change or pause it whenever you like.",
    icon: "wallet",
    image: "/images/feature-budget.jpg",
  },
  {
    title: "Real reporting",
    body: "Leads, cost per lead, and what it turned into. One number that matters, not forty vanity metrics.",
    icon: "chart",
    image: "/images/feature-reporting.jpg",
  },
] as const;

export const testimonials = [
  {
    quote:
      "I used to pay an agency ₹25,000 a month and never understood the reports. Now I just see enquiries on WhatsApp and I know exactly what I'm paying per lead.",
    name: "Anjali Sharma",
    role: "Owner, Sharma Coaching Classes",
    initial: "A",
  },
  {
    quote:
      "The part I like is that the ad money stays in my account. I set ₹500 a day and I can see where every rupee went.",
    name: "Vikram Nair",
    role: "Owner, Apex Fitness",
    initial: "V",
  },
] as const;

export const plans = [
  {
    id: "ai",
    badge: "Recommended",
    name: "AI Lead Generation",
    desc: "AI runs your Meta ads — hands-free.",
    oldPrice: "₹2,999",
    price: "₹2,399",
    /* What Razorpay charges, in paise. Keep in step with `price`. */
    amount: 239900,
    features: [
      "AI writes copy & designs creatives",
      "Auto-targets your local audience",
      "Optimises daily for lowest cost per lead",
      "Leads to your WhatsApp instantly",
    ],
    highlighted: true,
  },
  {
    id: "custom",
    badge: "Most leads",
    name: "Custom Lead Generation",
    desc: "A dedicated expert plus the AI.",
    oldPrice: "₹9,999",
    price: "₹7,999",
    amount: 799900,
    features: [
      "Everything in AI, plus a human ads expert",
      "Hand-designed creatives & offers",
      "Custom audiences + retargeting funnels",
      "A landing page built to convert",
      "Weekly optimisation + strategy calls",
    ],
    highlighted: false,
  },
] as const;

export const faqs = [
  {
    q: "Do I need a Facebook page already?",
    a: "It helps, but it is not required. If you do not have one, we will create and set it up during onboarding — it takes a few minutes.",
  },
  {
    q: "Is the ad budget included in the plan price?",
    a: "No, and that is deliberate. Your ad spend stays in your own account and is fully yours — start from ₹300 a day and change it anytime. The plan fee covers the creatives, targeting and daily management.",
  },
  {
    q: "How quickly will I see leads?",
    a: "Most campaigns go live the same day. Meta's delivery typically stabilises within 48–72 hours, and that is when cost per lead starts settling.",
  },
  {
    q: "Do I have to approve the ads before they run?",
    a: "Yes. You see every creative and headline before anything goes live, and you can request changes at any point.",
  },
] as const;

export const footer = {
  tagline: "AI-run Facebook ads that send leads straight to your WhatsApp.",
  /* Flat, because the footer renders these inline rather than as a column. */
  legal: [
    { label: "Terms", href: "/legal/terms" },
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Refunds", href: "/legal/refunds" },
  ],
} as const;
