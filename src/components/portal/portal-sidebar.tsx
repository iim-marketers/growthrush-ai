"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronsUpDown, Headset, Inbox, LayoutGrid, LogOut } from "lucide-react";
import { portalSignOut } from "@/app/customer-portal/actions";
import { Logo, LogoMark } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { portalLeadStatuses, type PortalLeadStatus } from "@/lib/portal/leads";
import { cn } from "@/lib/utils";

export type PortalSidebarProfile = {
  name: string;
  contact: string;
  total: number;
  today: number;
  byStatus: Record<PortalLeadStatus, number>;
};

const compact = new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 });
const fmt = (n: number) => compact.format(n);

const itemClass = cn(
  "h-10 gap-2.5 rounded-lg px-3 font-medium text-subtle",
  "hover:bg-white/70 hover:text-ink",
  "data-active:bg-white data-active:font-semibold data-active:text-ink",
  "data-active:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_0_0_1px_var(--sidebar-border)]",
  "[&>svg]:size-[1.125rem]! [&>svg]:text-faint data-active:[&>svg]:text-brand",
);

const badgeClass =
  "top-2.5! right-2 h-5 rounded-full px-1.5 text-[0.7rem] font-semibold tabular-nums";

function useActive() {
  const pathname = usePathname();
  const status = useSearchParams().get("status");
  return (href: string, forStatus?: string) => {
    if (href === "/customer-portal") return pathname === "/customer-portal";
    if (!pathname.startsWith("/customer-portal/leads")) return false;
    return forStatus ? status === forStatus : !status;
  };
}

export function PortalSidebar({
  profile,
  ...props
}: { profile: PortalSidebarProfile } & React.ComponentProps<typeof Sidebar>) {
  const isActive = useActive();
  const { isMobile, setOpenMobile } = useSidebar();
  const close = () => isMobile && setOpenMobile(false);

  const menu = [
    { href: "/customer-portal", label: "Overview", icon: LayoutGrid, badge: null },
    { href: "/customer-portal/leads", label: "All leads", icon: Inbox, badge: profile.total },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-0 pt-3 pb-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-12 hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/customer-portal" aria-label="Portal home" onClick={close}>
                <span className="grid gap-0.5 px-1 group-data-[collapsible=icon]:hidden">
                  <Logo size="sm" tone="dark" className="[&_img]:h-6!" eager />
                  <span className="text-[0.65rem] font-semibold tracking-[0.16em] text-faint uppercase">
                    Customer portal
                  </span>
                </span>
                <LogoMark className="hidden group-data-[collapsible=icon]:block" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.7rem] font-semibold tracking-[0.12em] text-faint uppercase">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menu.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    {active && (
                      <span aria-hidden className="absolute top-2 bottom-2 -left-2 w-0.75 rounded-r-full bg-brand" />
                    )}
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label} className={itemClass}>
                      <Link href={item.href} aria-current={active ? "page" : undefined} onClick={close}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge !== null && item.badge > 0 && (
                      <SidebarMenuBadge className={cn(badgeClass, "bg-surface-mute text-subtle")}>
                        {fmt(item.badge)}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.7rem] font-semibold tracking-[0.12em] text-faint uppercase">
            Lead status
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {portalLeadStatuses.map((status) => {
                const active = isActive("/customer-portal/leads", status.id);
                const count = profile.byStatus[status.id];
                return (
                  <SidebarMenuItem key={status.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={`${status.label} · ${count}`}
                      className={itemClass}
                    >
                      <Link
                        href={`/customer-portal/leads?status=${status.id}`}
                        aria-current={active ? "page" : undefined}
                        onClick={close}
                      >
                        <span className="flex size-[1.125rem] shrink-0 items-center justify-center">
                          <span aria-hidden className={cn("size-2.5 rounded-full", status.dot)} />
                        </span>
                        <span>{status.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    {count > 0 && (
                      <SidebarMenuBadge className={cn(badgeClass, status.badge)}>{fmt(count)}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 pb-3">
        <div className="rounded-xl border border-sidebar-border bg-white p-3.5 group-data-[collapsible=icon]:hidden">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Headset className="size-4" />
          </span>
          <p className="mt-2.5 text-sm font-semibold text-ink">Need help?</p>
          <p className="mt-0.5 text-xs leading-relaxed text-faint">
            Questions about a lead? Reach out to your growthrush.ai account manager.
          </p>
        </div>
        <AccountMenu profile={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function AccountMenu({ profile }: { profile: PortalSidebarProfile }) {
  const { isMobile } = useSidebar();
  const initial = profile.name.trim().charAt(0).toUpperCase() || "G";

  const avatar = (
    <Avatar className="size-8 rounded-lg after:rounded-lg">
      <AvatarFallback className="rounded-lg bg-linear-to-br from-brand to-grape font-display font-bold text-white">
        {initial}
      </AvatarFallback>
    </Avatar>
  );

  const identity = (
    <span className="grid min-w-0 flex-1 text-left leading-tight">
      <span className="truncate text-sm font-semibold text-ink">{profile.name}</span>
      <span className="truncate text-xs text-faint">{profile.contact}</span>
    </span>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="rounded-lg hover:bg-white/70 data-open:bg-white">
              {avatar}
              {identity}
              <ChevronsUpDown className="ml-auto size-4 text-faint" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-60 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-1.5 py-1.5">
                {avatar}
                {identity}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={portalSignOut}>
              <DropdownMenuItem asChild>
                <button type="submit" className="w-full">
                  <LogOut />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function PortalTopbar({ today }: { today: number }) {
  const pathname = usePathname();
  const status = useSearchParams().get("status");
  const statusLabel = portalLeadStatuses.find((s) => s.id === status)?.label;
  const title =
    pathname === "/customer-portal" ? "Overview" : statusLabel ? `${statusLabel} leads` : "All leads";

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-background/85 px-4 backdrop-blur-md md:rounded-t-xl lg:px-6">
      <SidebarTrigger className="-ml-1 text-subtle" />
      <Separator orientation="vertical" className="mr-1 h-4!" />
      <span className="text-sm font-semibold text-ink">{title}</span>
      {today > 0 && (
        <Link
          href="/customer-portal/leads"
          className="ml-auto inline-flex h-7 items-center gap-2 rounded-full border border-success/25 bg-success/8 px-3 text-xs font-semibold text-success transition-colors hover:bg-success/12"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          {today.toLocaleString("en-IN")} new today
        </Link>
      )}
    </header>
  );
}
