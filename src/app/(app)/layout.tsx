import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { AppHeader, AppSidebar, type Profile } from "@/components/app/app-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getBusiness, requireOnboardedUser } from "@/lib/auth/dal";
import {
  billingCycle,
  formatDate,
  getLatestPlan,
  getLeads,
} from "@/lib/queries";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f3f5fa",
  colorScheme: "light",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOnboardedUser();
  const [business, leads, latest, jar] = await Promise.all([
    getBusiness(user.id),
    getLeads(user.id),
    getLatestPlan(user.id),
    cookies(),
  ]);

  const name = business?.name ?? "Your business";
  const profile: Profile = {
    business: name,
    city: business?.city ?? "",
    initial: name.charAt(0).toUpperCase(),
    plan:
      latest && !latest.expired
        ? {
            name: latest.plan.name,
            renews: formatDate(latest.renewsOn),
            used: billingCycle(latest).percent,
          }
        : null,
    expiredOn: latest?.expired ? formatDate(latest.renewsOn) : null,
    newLeads: leads.filter((lead) => lead.status === "new").length,
  };

  const sidebarOpen = jar.get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider
        defaultOpen={sidebarOpen}
        data-light-portals
        className="theme-light"
      >
        <AppSidebar profile={profile} variant="inset" />
        <SidebarInset className="min-w-0">
          <AppHeader
            activePlan={profile.plan?.name ?? null}
            expired={Boolean(profile.expiredOn)}
          />
          <div className="mx-auto w-full max-w-full px-4 py-6 sm:px-8 ">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
