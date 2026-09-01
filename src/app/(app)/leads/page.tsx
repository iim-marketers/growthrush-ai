import type { Metadata } from "next";
import { LeadsBoard } from "@/components/app/leads-board";

export const metadata: Metadata = {
  title: "Leads",
  description:
    "Every enquiry your growthrush.ai ads produced, ready to answer on WhatsApp.",
  alternates: { canonical: "/leads" },
  robots: { index: false, follow: false },
};

export default function LeadsPage() {
  return <LeadsBoard />;
}
