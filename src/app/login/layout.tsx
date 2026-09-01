import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to growthrush.ai to see your free lead report and put your Instagram & Facebook ads live.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

/* The light screens want white browser chrome, not the landing page's navy. */
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}
