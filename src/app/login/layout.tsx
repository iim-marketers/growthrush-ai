import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to growthrush.ai to see your free lead report and put your Instagram & Facebook ads live.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}
