import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    default: `Admin · ${SITE_NAME}`,
    template: `%s · Admin · ${SITE_NAME}`,
  },
  description: `${SITE_NAME} admin panel.`,
  applicationName: `${SITE_NAME} Admin`,
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

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
