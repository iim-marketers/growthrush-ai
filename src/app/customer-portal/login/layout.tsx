import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { getPortalAccount } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Log in",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function PortalLoginLayout({ children }: LayoutProps<"/customer-portal/login">) {
  if (await getPortalAccount()) redirect("/customer-portal");
  return children;
}
