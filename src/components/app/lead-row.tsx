import { MessageCircle } from "lucide-react";
import { StatusBadge } from "@/components/app/primitives";
import { type LeadStatus } from "@/lib/app-data";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  enquiry: string;
  source: string;
  receivedAt: string;
  status: LeadStatus;
};

/** One enquiry. Shared by the dashboard's recent list and the leads screen. */
export function LeadRow({ lead }: { lead: Lead }) {
  /* wa.me wants digits only — no plus, no spaces. */
  const wa = lead.phone.replace(/\D/g, "");

  return (
    <li className="flex items-start gap-3 px-5 py-4">
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/6 font-display font-extrabold text-subtle"
      >
        {lead.name.charAt(0)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="truncate text-sm font-bold text-ink">
            {lead.name}
          </span>
          <StatusBadge status={lead.status} />
        </div>
        <p className="mt-1 text-sm leading-relaxed text-subtle">
          {lead.enquiry}
        </p>
        <p className="mt-1.5 text-xs text-faint">
          {lead.source} · {lead.receivedAt}
        </p>
      </div>

      <a
        href={`https://wa.me/${wa}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Message ${lead.name} on WhatsApp`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-success/12 text-success transition-colors hover:bg-success/20"
      >
        <MessageCircle size={17} aria-hidden />
      </a>
    </li>
  );
}
