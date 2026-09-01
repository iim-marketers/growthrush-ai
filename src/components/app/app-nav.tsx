"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { appNav, profile } from "@/lib/app-data";
import { cn } from "@/lib/utils";

const icons = {
  home: LayoutDashboard,
  inbox: Inbox,
  card: CreditCard,
} as const;

/**
 * One nav, two shapes: a sidebar from `lg` up and a bottom tab bar below it.
 * Both read the same `appNav`, so a new section appears in both by adding one
 * entry to the data.
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-hairline bg-surface-subtle px-4 py-6 lg:flex">
      <Link href="/" aria-label="growthrush.ai home" className="px-2">
        <Logo size="sm" tone="dark" />
      </Link>

      <nav aria-label="Main" className="mt-8 flex flex-1 flex-col gap-1">
        {appNav.map((item) => {
          const Icon = icons[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-brand/12 text-brand"
                  : "text-subtle hover:bg-surface-hover hover:text-ink",
              )}
            >
              <Icon size={18} aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline pt-4">
        <div className="flex items-center gap-3 px-2">
          <Avatar />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-ink">
              {profile.business}
            </span>
            <span className="block truncate text-xs text-faint">
              {profile.city}
            </span>
          </span>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-subtle transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <LogOut size={18} aria-hidden />
          Sign out
        </Link>
      </div>
    </aside>
  );
}

/** Phone chrome: the brand up top, the tabs within thumb reach at the bottom. */
export function AppTopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-hairline bg-background/85 px-4 py-3 backdrop-blur-md lg:hidden">
      <Link href="/" aria-label="growthrush.ai home">
        <Logo size="sm" tone="dark" />
      </Link>
      <Avatar />
    </header>
  );
}

export function AppTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-hairline bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      {appNav.map((item) => {
        const Icon = icons[item.icon];
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold transition-colors",
              active ? "text-brand" : "text-faint hover:text-subtle",
            )}
          >
            <Icon size={20} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Avatar() {
  return (
    <span
      aria-hidden
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/15 font-display font-extrabold text-brand"
    >
      {profile.initial}
    </span>
  );
}
