import { cookies } from "next/headers";
import { PortalSidebar, PortalTopbar } from "@/components/portal/portal-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getPortalLeads, summarizeLeads } from "@/lib/portal/queries";
import { requirePortalAccount } from "@/lib/portal/session";

export default async function PortalPanelLayout({ children }: { children: React.ReactNode }) {
  const account = await requirePortalAccount();
  const [leads, jar] = await Promise.all([getPortalLeads(account.id), cookies()]);
  const summary = summarizeLeads(leads);

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider
        defaultOpen={jar.get("sidebar_state")?.value !== "false"}
        data-light-portals
        className="theme-light"
      >
        <PortalSidebar
          variant="inset"
          profile={{
            name: account.name || "Your business",
            contact: account.email ?? account.phone,
            total: summary.total,
            today: summary.today,
            byStatus: {
              valid: summary.valid,
              follow_up: summary.followUp,
              invalid: summary.invalid,
            },
          }}
        />
        <SidebarInset className="min-w-0">
          <PortalTopbar today={summary.today} />
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  );
}
