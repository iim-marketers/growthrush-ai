import { AppSidebar, AppTabBar, AppTopBar } from "@/components/app/app-nav";

/**
 * Chrome shared by every signed-in screen. A route group, so the nav wraps
 * /dashboard, /leads and /billing without adding a segment to their URLs.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <AppSidebar />
      <AppTopBar />
      {/* Left gutter clears the sidebar; bottom gutter clears the tab bar. */}
      <main className="pb-24 lg:pb-0 lg:pl-60">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
      <AppTabBar />
    </div>
  );
}
