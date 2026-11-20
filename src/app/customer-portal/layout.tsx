import type { Metadata, Viewport } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `Customer portal · ${SITE_NAME}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: `Your ${SITE_NAME} leads, in one place.`,
  keywords: null,
  alternates: null,
  openGraph: { images: [] },
  twitter: { card: "summary", images: [] },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  themeColor: "#f3f5fa",
  colorScheme: "light",
};

export default function PortalRootLayout({ children }: LayoutProps<"/customer-portal">) {
  return children;
}
