import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = localFont({
  variable: "--font-inter",
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400" },
    { path: "./fonts/inter-500.woff2", weight: "500" },
    { path: "./fonts/inter-600.woff2", weight: "600" },
    { path: "./fonts/inter-700.woff2", weight: "700" },
    { path: "./fonts/inter-800.woff2", weight: "800" },
  ],
  display: "swap",
});

const outfit = localFont({
  variable: "--font-outfit",
  src: [
    { path: "./fonts/outfit-500.woff2", weight: "500" },
    { path: "./fonts/outfit-700.woff2", weight: "700" },
    { path: "./fonts/outfit-800.woff2", weight: "800" },
  ],
  display: "swap",
});

const DESCRIPTION =
  "AI-run Facebook ads for local businesses. growthrush.ai writes the copy, designs the creatives and sends ready-to-buy leads straight to your WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — AI Facebook Ads That Send Leads to Your WhatsApp`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Meta ads",
    "Facebook ads",
    "lead generation",
    "WhatsApp leads",
    "local business marketing",
    "AI ads",
    "performance marketing India",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — More customers, with the power of AI`,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — More customers, with the power of AI`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050814",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
