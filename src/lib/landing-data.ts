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
    market: "Exports to 80+ countries",
    category: "FMCG",
    headline: "An eight-decade legacy, rebuilt for online orders",
    summary:
      "A unified D2C storefront with live store inventory, turning a fragmented digital presence into a growth channel.",
    metric: "+45%",
    metricLabel: "online revenue",
    logo: "/logos/haldiram-color.jpeg",
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
      { value: "+30%", label: "Customer retention" },
    ],
    outcome:
      "The overhaul drove a significant uptick in international sales and a far more streamlined fulfilment process.",
  },
  {
    business: "Mercstone",
    market: "Middle East & Europe",
    category: "Natural Stone",
    headline: "A digital stone library that architects actually use",
    summary:
      "A 4K virtual showroom and B2B lead engine that took a trade-show sales cycle global.",
    metric: "+150%",
    metricLabel: "monthly architect enquiries",
    logo: "/logos/mercstone.svg",
    overview:
      "Mercstone is a global leader in natural stone, sourcing, processing and distributing high-quality marble, granite and engineered stone for large commercial developments and luxury residential projects.",
    challenge:
      "The sales cycle leaned heavily on physical inspections and trade shows. Without a high-fidelity digital showroom able to show the intricate textures and colour variations of each slab, Mercstone's reach among international architects and interior designers was limited.",
    solution: [
      {
        title: "High-resolution virtual showroom",
        body: "An immersive web experience with 4K texture mapping, letting designers view stone slabs under different lighting conditions.",
      },
      {
        title: "B2B lead management system",
        body: "A custom CRM that tracks every sample sent to architectural firms around the world.",
      },
      {
        title: "SEO & content strategy",
        body: "High-intent keywords across architecture and construction, driving organic B2B enquiries.",
      },
    ],
    results: [
      { value: "+150%", label: "Monthly enquiries from verified architects" },
      { value: "40%", label: "Faster sample-to-order cycle" },
      { value: "2", label: "New regions: Middle East & Europe" },
    ],
    outcome:
      "Digital pre-selection now does the work trade shows used to, and the project pipeline has expanded into new international markets.",
  },
  {
    business: "Mudit Ridh",
    market: "North America & UK",
    category: "Luxury Couture",
    headline: "The atelier experience, delivered over video",
    summary:
      "Virtual bridal consultations and craft-led storytelling that won a global NRI clientele without losing exclusivity.",
    metric: "60%",
    metricLabel: "consultations to orders",
    logo: "/logos/mudit-ridh.png",
    overview:
      "Mudit Ridh (Mudit & Ridhi) is a high-end couture label known for intricate craftsmanship and contemporary bridal silhouettes. It represents the pinnacle of artisanal Indian fashion for a discerning global clientele.",
    challenge:
      "Luxury bridal is fiercely competitive and built on personal connection. Mudit Ridh needed to translate the atelier experience into a digital format without diluting its exclusivity, while managing bespoke consultations for a fast-growing NRI customer base.",
    solution: [
      {
        title: "Virtual concierge service",
        body: "A seamless booking and video-consultation interface for remote bridal appointments.",
      },
      {
        title: "Social-first storytelling",
        body: "A high-production social campaign showing the behind-the-scenes craftsmanship of each collection.",
      },
      {
        title: "Curated e-commerce",
        body: "An invite-only, enquiry-based portal for high-value bridal pieces that protects brand prestige.",
      },
    ],
    results: [
      { value: "60%", label: "Virtual consultations to confirmed orders" },
      { value: "+200%", label: "Organic Instagram engagement" },
      { value: "2", label: "New markets: North America & UK" },
    ],
    outcome:
      "\u201cCouture Stories\u201d drove the social growth, and overseas markets now deliver a consistent revenue stream.",
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
