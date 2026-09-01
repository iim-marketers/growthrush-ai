import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify your number",
  description:
    "Enter the code we sent to your mobile to finish signing in to growthrush.ai.",
  alternates: { canonical: "/login/verify" },
  robots: { index: false, follow: false },
};

export default function VerifyLayout({
  children,
}: LayoutProps<"/login/verify">) {
  return children;
}
