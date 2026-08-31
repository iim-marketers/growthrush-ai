export const hero = {
  eyebrow: "AI-run Meta ads for local businesses",
  title: "More customers.",
  titleAccent: "Zero ad agencies.",
  subtitle:
    "growthrush.ai writes the copy, designs the creatives and runs your Facebook ads — then delivers ready-to-buy leads straight to your WhatsApp.",
  primaryCta: "Get Started",
  secondaryCta: "See how it works",
  note: "No card needed · Live in under 10 minutes",
} as const;

/** The headline numbers, shown in the pill inside the hero card. */
export const heroStats = [
  { value: "48,000+", label: "Local buyers reached per city" },
  { value: "12x", label: "Average lead lift in 90 days" },
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
 * Case studies. Images live in `public/images/` and are stock placeholders —
 * swap them, and the figures, for real ones.
 */
export const caseStudies = [
  {
    business: "Sharma Coaching Classes",
    city: "Kolkata",
    category: "Coaching",
    headline: "6 to 120 leads a month in one quarter",
    body: "Batch enquiries went from word-of-mouth only to a steady WhatsApp queue, at ₹128 per lead.",
    metric: "20x",
    metricLabel: "more enquiries",
    image: "/images/case-coaching.jpg",
  },
  {
    business: "Glow & Co.",
    city: "Pune",
    category: "Salon",
    headline: "Fully booked inside two weeks",
    body: "Local targeting filled the chair on weekdays, not just weekends — and paid for a second stylist.",
    metric: "₹142",
    metricLabel: "per booked appointment",
    image: "/images/case-salon.jpg",
  },
  {
    business: "Spice Route",
    city: "Bengaluru",
    category: "Restaurant",
    headline: "3.1x return on ad spend",
    body: "Weekend covers up 40% after AI shifted budget to the creatives that actually drove bookings.",
    metric: "3.1x",
    metricLabel: "return on ad spend",
    image: "/images/case-restaurant.jpg",
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
    body: "Ads go live on Instagram & Facebook. Every enquiry arrives on your phone, and the AI optimises daily for the lowest cost per lead.",
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
      "We were invisible on Instagram. Two weeks in, we had more bookings than we could take — I had to hire a second stylist.",
    name: "Rhea Mehta",
    role: "Founder, Glow & Co.",
    initial: "R",
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
    q: "Do I need a Facebook or Instagram page already?",
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
  tagline:
    "AI-run Instagram & Facebook ads that send leads straight to your WhatsApp.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "#how-it-works" },
        { label: "What you get", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ],
} as const;
