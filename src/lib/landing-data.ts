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
  { name: "Haldiram's", src: "/logos/haldiram.webp" },
  { name: "EY", src: "/logos/ey.webp" },
  { name: "Emami", src: "/logos/emami.webp" },
  { name: "ITC", src: "/logos/itc.webp" },
  { name: "Joy", src: "/logos/joy.webp" },
  { name: "Nephrocare", src: "/logos/nephrocare.webp" },
  { name: "Adyant Ayurveda", src: "/logos/adyant-ayurveda.webp" },
  { name: "Emporium Solutions", src: "/logos/emporium-solutions.webp" },
  { name: "Pepsi", src: "/logos/pepsi.webp" },
  { name: "Magik LED", src: "/logos/magik-led.webp" },
  { name: "Century Ply", src: "/logos/centuryply.webp" },
] as const;

export const caseStudies = [
  {
    business: "Haldiram's",
    market: "Exports to 80+ countries",
    category: "FMCG",
    headline: "An eight-decade legacy, rebuilt for online orders",
    summary:
      "A unified D2C storefront with live store inventory, turning a fragmented digital presence into a growth channel.",
    metric: "4000+",
    metricLabel: "Distributor leads generated",
    logo: "/logos/haldiram-color.webp",
    overview:
      "Haldiram's is a premier Indian sweets, snacks and restaurant company headquartered in Nagpur. Over eight decades it has become synonymous with traditional Indian taste, running a vast retail network and exporting to more than 80 countries.",
    challenge:
      "Despite a dominant physical presence, the digital transition was full of friction: an online identity fragmented across regional entities, an outdated storefront that undersold the brand's premium positioning, and supply-chain silos that blocked real-time inventory tracking for international orders.",
    solution: [
      {
        title: "Unified digital architecture",
        body: "A centralised D2C platform that brings every regional product catalogue into one seamless shopping experience.",
      },
      {
        title: "Omnichannel integration",
        body: "Physical retail inventory synced with the online storefront to enable hyper-local delivery.",
      },
      {
        title: "Brand rejuvenation",
        body: "A modern visual language for digital touchpoints that balances traditional heritage with contemporary aesthetics.",
      },
    ],
    results: [
      { value: "+45%", label: "Online revenue" },
      { value: "+22%", label: "Average order value" },
      { value: "4000+", label: "Distributor leads generated" },
    ],
    outcome:
      "The overhaul drove a significant uptick in international sales and a far more streamlined fulfilment process.",
  },
  {
    business: "Mercstone",
    market: "Kolkata & West Bengal",
    category: "Electric Scooters",
    headline: "Test rides booked on WhatsApp, not walk-ins left to chance",
    summary:
      "Hyper-local Meta campaigns around every dealership that turned EV curiosity into booked test rides.",
    metric: "+150%",
    metricLabel: "monthly test-ride bookings",
    logo: "/logos/mercstone.webp",
    logoOnDark: true,
    overview:
      "Mercstone EV is a Kolkata-based maker of smart, connected electric scooters, built with LFP batteries, IoT anti-theft and app integration, and manufactured near Barrackpore through an Indo-Thai partnership with Assara Electric.",
    challenge:
      "Buyers were curious about EVs but hesitant: range anxiety, charging doubts and unfamiliar brand names kept them from visiting a showroom. Dealers relied on footfall and had no way to reach nearby buyers who were actively comparing petrol and electric options.",
    solution: [
      {
        title: "Dealer-level local targeting",
        body: "Separate campaigns for each dealership, reaching commuters and delivery riders within a few kilometres of the showroom.",
      },
      {
        title: "Myth-busting creatives",
        body: "Ads built around running cost per km, real-world range and home charging, answering objections before the first call.",
      },
      {
        title: "Test rides to WhatsApp",
        body: "Every enquiry routed straight to the nearest dealer on WhatsApp, with a one-tap test-ride booking.",
      },
    ],
    results: [
      { value: "+150%", label: "Monthly test-ride bookings" },
      { value: "40%", label: "Lower cost per lead" },
      { value: "3x", label: "Dealer enquiries per week" },
    ],
    outcome:
      "Dealers now start each week with a queue of qualified test rides, and ad budget moves automatically to the showrooms converting best.",
  },
  {
    business: "Mudit Ridh",
    market: "Tier-2 & Tier-3 India",
    category: "Electric Vehicles",
    headline: "Electric scooters that sell themselves on running cost",
    summary:
      "Always-on lead generation for electric two-wheelers that reached first-time EV buyers in smaller cities.",
    metric: "500+",
    metricLabel: "Distributor leads generated",
    logo: "/logos/mudit-ridh.webp",
    overview:
      "Mudit Ridh Electric Vehicles makes electric scooters and utility two-wheelers for daily commuters, students and small traders, with a focus on smaller cities where fuel costs hit hardest.",
    challenge:
      "In tier-2 and tier-3 markets, buyers trust brands they can see and touch. Mudit Ridh competed against well-funded national EV players for attention, with limited marketing budget and no in-house digital team.",
    solution: [
      {
        title: "Savings-first messaging",
        body: "Creatives that compared monthly petrol spend against charging cost, in local languages, for the buyer's own commute.",
      },
      {
        title: "Festive & subsidy campaigns",
        body: "Time-bound offers around festivals and EV subsidies that gave fence-sitters a reason to act now.",
      },
      {
        title: "Daily budget optimisation",
        body: "Spend shifted every day toward the cities and audiences producing the cheapest qualified leads.",
      },
    ],
    results: [
      { value: "60%", label: "Leads converted to showroom visits" },
      { value: "+200%", label: "Monthly enquiries" },
      { value: "500+", label: "Distributor leads generated" },
    ],
    outcome:
      "Mudit Ridh now competes with national EV brands in its home markets on a fraction of their budget, with a steady pipeline of ready-to-buy riders.",
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
    image: "/images/feature-creatives.webp",
  },
  {
    title: "Local audience targeting",
    body: "We find the people within a few kilometres of you who actually buy what you sell.",
    icon: "map",
    image: "/images/feature-targeting.webp",
  },
  {
    title: "Leads to WhatsApp",
    body: "Every enquiry lands in the app you already check a hundred times a day. No dashboard to learn.",
    icon: "message",
    image: "/images/feature-whatsapp.webp",
  },
  {
    title: "Daily optimisation",
    body: "The AI shifts budget toward whatever is producing the cheapest leads, every single day.",
    icon: "trend",
    image: "/images/feature-optimisation.webp",
  },
  {
    title: "Your budget, your control",
    body: "Ad spend stays in your own account. Start at ₹300/day, change or pause it whenever you like.",
    icon: "wallet",
    image: "/images/feature-budget.webp",
  },
  {
    title: "Real reporting",
    body: "Leads, cost per lead, and what it turned into. One number that matters, not forty vanity metrics.",
    icon: "chart",
    image: "/images/feature-reporting.webp",
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
