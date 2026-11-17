import { Badge } from "@/components/ui/badge";
import { accountLeadStatusMeta, type AccountLeadStatus } from "@/lib/admin/leads";
import { cn } from "@/lib/utils";

export function LeadStatusBadge({
  status,
  className,
}: {
  status: AccountLeadStatus;
  className?: string;
}) {
  const meta = accountLeadStatusMeta(status);
  return (
    <Badge className={cn("h-6 gap-1.5 px-2.5 font-semibold", meta.badge, className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  );
}
