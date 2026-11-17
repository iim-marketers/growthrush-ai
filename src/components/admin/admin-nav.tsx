"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsUpDown, LayoutDashboard, LogOut, ShieldCheck, Users } from "lucide-react";
import { adminSignOut } from "@/app/admin/actions";
import { Logo, LogoMark } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
] as const;

function useActiveItem() {
  const pathname = usePathname();
  return [...adminNav]
    .reverse()
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}

const itemClass = cn(
  "h-10 gap-1.5 rounded-lg px-3 font-medium text-subtle",
  "hover:bg-sidebar-accent/70 hover:text-ink",
  "data-active:bg-sidebar-accent data-active:font-semibold data-active:text-ink",
  "data-active:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_0_0_1px_var(--sidebar-border)]",
  "[&>svg]:size-[1.125rem]! [&>svg]:text-faint hover:[&>svg]:text-subtle data-active:[&>svg]:text-brand",
);

export function AdminSidebar({
  email,
  ...props
}: { email: string } & React.ComponentProps<typeof Sidebar>) {
  const active = useActiveItem();
  const { isMobile, setOpenMobile, open } = useSidebar();
  const closeOnPhone = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className={`pb-2 ${open ? "pt-2" : "pt-4"}`}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="h-10 hover:bg-transparent active:bg-transparent group-data-[collapsible=icon]:justify-center"
            >
              <Link href="/admin" aria-label="Admin home" onClick={closeOnPhone}>
                <Logo
                  size="sm"
                  tone="dark"
                  className="px-1 group-data-[collapsible=icon]:hidden [&_img]:h-6!"
                />
                <LogoMark className="hidden group-data-[collapsible=icon]:block" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.7rem] font-semibold tracking-[0.12em] text-faint uppercase">
            Admin
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {adminNav.map((item) => {
                const isActive = active?.href === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute top-2 bottom-2 -left-2 w-0.75 rounded-r-full bg-brand"
                      />
                    )}
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={itemClass}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={closeOnPhone}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 pb-3">
        <SidebarSeparator className="mx-0" />
        <AdminUser email={email} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function AdminUser({ email }: { email: string }) {
  const { isMobile } = useSidebar();

  const avatar = (
    <Avatar className="size-8 rounded-lg after:rounded-lg">
      <AvatarFallback className="rounded-lg bg-linear-to-br from-brand to-grape text-white">
        <ShieldCheck className="size-4" />
      </AvatarFallback>
    </Avatar>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-lg hover:bg-sidebar-accent/70 data-open:bg-sidebar-accent"
            >
              {avatar}
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold text-ink">Admin</span>
                <span className="truncate text-xs text-faint">{email}</span>
              </span>
              <ChevronsUpDown className="ml-auto size-4 text-faint" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2.5 px-1.5 py-1.5 text-left">
                {avatar}
                <span className="grid flex-1 leading-tight">
                  <span className="truncate text-sm font-semibold text-ink">Admin</span>
                  <span className="truncate text-xs text-faint">{email}</span>
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <form action={adminSignOut}>
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

export function AdminHeader() {
  const active = useActiveItem();
  const pathname = usePathname();
  const onAccount = pathname.startsWith("/admin/leads/");

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-hairline bg-background/80 px-4 backdrop-blur-md md:rounded-t-xl lg:px-6">
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarTrigger className="-ml-1 text-subtle" />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="hidden md:inline-flex">
          Toggle sidebar
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>B</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="mr-1 h-4!" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden sm:inline-flex">Admin</BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:inline-flex" />
          {onAccount ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/leads">Leads</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Account</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold">
                {active?.label ?? "Dashboard"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Badge
        variant="outline"
        className="ml-auto h-7 gap-1.5 rounded-full border-brand/25 bg-brand/8 px-3 font-semibold text-brand"
      >
        <ShieldCheck className="size-3.5" />
        Admin
      </Badge>
    </header>
  );
}
