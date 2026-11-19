import { cookies } from "next/headers";
import { AdminHeader, AdminSidebar } from "@/components/admin/admin-nav";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { adminEmail, requireAdmin } from "@/lib/admin/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <TooltipProvider delayDuration={200}>
      <SidebarProvider defaultOpen={sidebarOpen} data-light-portals className="theme-light">
        <AdminSidebar email={adminEmail()} variant="inset" />
        <SidebarInset className="min-w-0">
          <AdminHeader />
          <div className="mx-auto w-full max-w-full px-4 py-6 sm:px-8">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
