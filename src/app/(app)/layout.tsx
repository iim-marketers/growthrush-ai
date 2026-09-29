import type { Viewport } from "next";
import {
  AppSidebar,
  AppTabBar,
  AppTopBar,
  type Profile,
} from "@/components/app/app-nav";
import { getBusiness, requireOnboardedUser } from "@/lib/auth/dal";

/* The light screens want white browser chrome, not the landing page's navy. */
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/**
 * Chrome shared by every signed-in screen. A route group, so the nav wraps
 * /dashboard, /leads and /billing without adding a segment to their URLs.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOnboardedUser();
  const business = await getBusiness(user.id);

  const name = business?.name ?? "Your business";
  const profile: Profile = {
    business: name,
    city: business?.city ?? "",
    initial: name.charAt(0).toUpperCase(),
  };

  return (
    <div className="theme-light min-h-dvh bg-background">
      <AppSidebar profile={profile} />
      <AppTopBar profile={profile} />
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
