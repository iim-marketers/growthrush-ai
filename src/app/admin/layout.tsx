import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin · growthrush.ai" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f3f5fa",
  colorScheme: "light",
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
