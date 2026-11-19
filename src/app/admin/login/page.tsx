import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/logo";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Admin login",
};

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="theme-light relative flex min-h-dvh w-full items-center justify-center bg-background px-4 py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="glow glow-brand top-[-15%] right-[-10%]" />
        <div className="glow glow-warm bottom-[-15%] left-[-10%]" />
      </div>
      <div className="glass-panel glass-panel-roomy animate-slide-up relative z-1 w-full max-w-104">
        <Logo size="md" tone="dark" className="rhythm-lg justify-center" eager />
        <p className="mb-2 text-center text-xs font-semibold tracking-[0.14em] text-brand uppercase">
          Admin panel
        </p>
        <h1 className="mb-2 text-center text-[clamp(1.5rem,1.2rem+1.4vw,2rem)]">
          Sign in
        </h1>
        <p className="rhythm-lg text-center text-[0.95rem] text-subtle">
          Use the admin email and password to continue
        </p>
        <AdminLoginForm configured={adminConfigured()} />
      </div>
    </div>
  );
}
