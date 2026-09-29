import { Badge } from "@/components/ui/badge";
import { leadStatuses, type LeadStatus } from "@/lib/app-data";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.14em] text-brand uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[clamp(1.6rem,1.35rem+1vw,2.1rem)] leading-tight text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-subtle sm:text-[0.95rem]">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export const statusTones = {
  brand: { badge: "bg-brand/10 text-brand", dot: "bg-brand" },
  amber: { badge: "bg-warn/12 text-warn", dot: "bg-warn" },
  success: { badge: "bg-success/12 text-success", dot: "bg-success" },
  muted: { badge: "bg-surface-mute text-faint", dot: "bg-line-strong" },
} as const;

export function statusMeta(status: LeadStatus) {
  return leadStatuses.find((s) => s.id === status) ?? leadStatuses[0];
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = statusMeta(status);

  return (
    <Badge
      className={cn(
        "h-6 gap-1.5 px-2.5 font-semibold",
        statusTones[meta.tone].badge,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  );
}

const avatarTints = [
  "bg-brand/12 text-brand",
  "bg-grape/12 text-grape",
  "bg-orange/12 text-orange",
  "bg-success/12 text-success",
  "bg-cyan-glow/20 text-[#0e7490]",
] as const;

export function LeadAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;

  return (
    <span
      aria-hidden
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
        avatarTints[hash % avatarTints.length],
        className,
      )}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
