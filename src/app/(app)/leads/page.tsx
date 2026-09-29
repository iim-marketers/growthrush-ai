import type { Metadata } from "next";
import { LeadsBoard } from "@/components/app/leads-board";
import { requireOnboardedUser } from "@/lib/auth/dal";
import { getLeads } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Leads",
  description:
    "Every enquiry your growthrush.ai ads produced, ready to answer.",
  alternates: { canonical: "/leads" },
  robots: { index: false, follow: false },
};

export default async function LeadsPage() {
  const user = await requireOnboardedUser();
  return <LeadsBoard leads={await getLeads(user.id)} />;
}
