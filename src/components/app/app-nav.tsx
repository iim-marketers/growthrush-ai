"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronsUpDown,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Rocket,
} from "lucide-react";
import { signOut } from "@/app/login/actions";
import { Logo, LogoMark } from "@/components/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Progress } from "@/components/ui/progress";
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
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { appNav, appSupport } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export type Profile = {
  business: string;
  city: string;
  initial: string;
  plan: {
    name: string;
    renews: string;
    used: number;
  } | null;
  newLeads: number;
};

const icons = {
  home: LayoutDashboard,
  inbox: Inbox,
  card: CreditCard,
  help: LifeBuoy,
  legal: FileText,
} as const;

function useActiveItem() {
  const pathname = usePathname();
  return appNav.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

const itemClass = cn(
  "h-10 gap-1.5 rounded-lg px-3 font-medium text-subtle",
  "hover:bg-sidebar-accent/70 hover:text-ink",
  "data-active:bg-sidebar-accent data-active:font-semibold data-active:text-ink",
  "data-active:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_0_0_1px_var(--sidebar-border)]",
  "[&>svg]:size-[1.125rem]! [&>svg]:text-faint hover:[&>svg]:text-subtle data-active:[&>svg]:text-brand",
);

export function AppSidebar({
  profile,
  ...props
}: { profile: Profile } & React.ComponentProps<typeof Sidebar>) {
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
              <Link href="/dashboard" aria-label="growthrush.ai home">
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
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {appNav.map((item) => {
                const Icon = icons[item.icon];
                const isActive = active?.href === item.href;
                const badge = item.href === "/leads" ? profile.newLeads : 0;
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
                      tooltip={
                        badge > 0 ? `${item.label} · ${badge} new` : item.label
                      }
                      className={itemClass}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={closeOnPhone}
                      >
                        <Icon />
                        <span>{item.label}</span>

                        {badge > 0 && (
                          <span
                            aria-hidden
                            className="absolute top-1.5 right-1.5 hidden size-2 rounded-full bg-brand ring-2 ring-sidebar group-data-[collapsible=icon]:block"
                          />
                        )}
                      </Link>
                    </SidebarMenuButton>
                    {badge > 0 && (
                      <SidebarMenuBadge className="top-2.5! right-2 h-5 rounded-full bg-brand px-1.5 text-[0.7rem] font-semibold text-white peer-hover/menu-button:text-white peer-data-active/menu-button:text-white">
                        {badge > 99 ? "99+" : badge}
                        <span className="sr-only"> new</span>
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[0.7rem] font-semibold tracking-[0.12em] text-faint uppercase">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {appSupport.map((item) => {
                const Icon = icons[item.icon];
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.label}
                      className={cn(itemClass, "h-9")}
                    >
                      <Link href={item.href} onClick={closeOnPhone}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarFooter className="gap-3 pb-3">
        {profile.plan ? (
          <PlanCard plan={profile.plan} />
        ) : (
          <GoLive onNavigate={closeOnPhone} />
        )}
        <SidebarSeparator className="mx-0" />
        <NavUser profile={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function PlanCard({ plan }: { plan: NonNullable<Profile["plan"]> }) {
  return (
    <Link
      href="/billing"
      className="block rounded-xl bg-sidebar-accent p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_0_0_1px_var(--sidebar-border)] transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.08),0_0_0_1px_var(--sidebar-border)] group-data-[collapsible=icon]:hidden"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-semibold text-ink">
          {plan.name}
        </span>
        <span className="flex shrink-0 items-center gap-1.5 text-[0.7rem] font-semibold text-success">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          Live
        </span>
      </span>
      <Progress
        value={plan.used}
        aria-label="Billing period used"
        className="mt-3 h-1.5"
      />
      <span className="mt-2 block text-[0.7rem] text-faint">
        Renews {plan.renews}
      </span>
    </Link>
  );
}

function GoLive({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className="relative isolate overflow-hidden rounded-xl bg-[#0b1220] p-4 text-white group-data-[collapsible=icon]:hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(64,89,232,0.7)_0%,rgba(126,34,206,0.35)_45%,transparent_75%)]"
        />
        <LogoMark
          decorative
          className="absolute -top-3 -right-5 -z-10 size-24 -rotate-8 opacity-20 mask-[linear-gradient(to_bottom_left,black_30%,transparent_90%)] brightness-0 invert"
        />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-white/80 uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-warn" />
          Not live
        </span>
        <p className="mt-3 font-display text-sm font-bold">
          Launch your first campaign
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/65">
          Your setup is done. Pick a plan and your ads go live.
        </p>
        <Button
          asChild
          size="sm"
          className="mt-3 w-full bg-white font-semibold text-[#0b1220] hover:bg-white/90"
        >
          <Link href="/billing" onClick={onNavigate}>
            Go live
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>

      <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Go live"
            className="bg-brand text-white hover:bg-brand/90 hover:text-white"
          >
            <Link href="/billing">
              <Rocket />
              <span>Go live</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

function NavUser({ profile }: { profile: Profile }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="rounded-lg hover:bg-sidebar-accent/70 data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
            >
              <BusinessAvatar initial={profile.initial} />
              <span className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-semibold text-ink">
                  {profile.business}
                </span>
                <span className="truncate text-xs text-faint">
                  {profile.city || "Your account"}
                </span>
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
                <BusinessAvatar initial={profile.initial} />
                <span className="grid flex-1 leading-tight">
                  <span className="truncate text-sm font-semibold text-ink">
                    {profile.business}
                  </span>
                  <span className="truncate text-xs text-faint">
                    {profile.plan?.name ?? "No active plan"}
                  </span>
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/billing">
                  <CreditCard />
                  Billing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <form action={signOut}>
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

function BusinessAvatar({ initial }: { initial: string }) {
  return (
    <Avatar className="size-8 rounded-lg after:rounded-lg">
      <AvatarFallback className="rounded-lg bg-linear-to-br from-brand to-grape font-display font-bold text-white">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}

export function AppHeader({ activePlan }: { activePlan: string | null }) {
  const active = useActiveItem();

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
          <BreadcrumbItem className="hidden sm:inline-flex">
            Workspace
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden sm:inline-flex" />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold">
              {active?.label ?? "Dashboard"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        {activePlan ? (
          <Badge
            variant="outline"
            className="h-7 gap-2 rounded-full border-success/25 bg-success/8 px-3 font-semibold text-success"
          >
            <span aria-hidden className="size-1.5 rounded-full bg-success" />
            Live
          </Badge>
        ) : (
          <Button asChild size="sm" className="rounded-full px-3 font-semibold">
            <Link href="/billing">
              <Rocket data-icon="inline-start" />
              Go live
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
