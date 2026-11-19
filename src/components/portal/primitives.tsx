import { portalStatusMeta, type PortalLeadStatus } from "@/lib/portal/leads";
import { cn } from "@/lib/utils";

export function PortalStatusBadge({ status }: { status: PortalLeadStatus }) {
  const meta = portalStatusMeta(status);
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold",
        meta.badge,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

const tints = [
  "bg-brand/12 text-brand",
  "bg-grape/12 text-grape",
  "bg-orange/12 text-orange",
  "bg-success/12 text-success",
] as const;

export function PortalLeadAvatar({ name }: { name: string }) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold",
        tints[hash % tints.length],
      )}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

export function PortalPageTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[clamp(1.5rem,1.25rem+1vw,2rem)] leading-tight [overflow-wrap:anywhere] text-ink">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-subtle sm:text-[0.95rem]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
