import type { Metadata } from "next";
import { PortalLeadsBoard } from "@/components/portal/leads-board";
import { PortalPageTitle } from "@/components/portal/primitives";
import { portalLeadStatuses, type PortalLeadStatus } from "@/lib/portal/leads";
import { getPortalLeads } from "@/lib/portal/queries";
import { requirePortalAccount } from "@/lib/portal/session";

export const metadata: Metadata = { title: "Leads" };

export default async function PortalLeadsPage({ searchParams }: PageProps<"/customer-portal/leads">) {
  const account = await requirePortalAccount();
  const [leads, params] = await Promise.all([getPortalLeads(account.id), searchParams]);
  const status = portalLeadStatuses.find((s) => s.id === params.status)?.id;

  return (
    <>
      <PortalPageTitle
        title="Your leads"
        subtitle="Search, filter by status or date, and tap a number to call."
      />
      <PortalLeadsBoard
        key={status ?? "all"}
        leads={leads}
        initialStatus={(status ?? "all") as PortalLeadStatus | "all"}
      />
    </>
  );
}
