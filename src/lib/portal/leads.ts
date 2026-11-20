export const portalLeadStatuses = [
  { id: "valid", label: "Valid", badge: "bg-success/12 text-success", dot: "bg-success" },
  { id: "follow_up", label: "Follow-up", badge: "bg-warn/12 text-warn", dot: "bg-warn" },
  { id: "invalid", label: "Invalid", badge: "bg-danger/10 text-danger", dot: "bg-danger" },
] as const;

export type PortalLeadStatus = (typeof portalLeadStatuses)[number]["id"];

export function portalStatusMeta(status: PortalLeadStatus) {
  return portalLeadStatuses.find((s) => s.id === status) ?? portalLeadStatuses[0];
}

export type PortalLead = {
  id: string;
  name: string;
  phone: string;
  city: string;
  comment: string;
  status: PortalLeadStatus;
  createdAt: string;
};

export const PORTAL_TZ = "Asia/Kolkata";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: PORTAL_TZ,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: PORTAL_TZ,
  hour: "numeric",
  minute: "2-digit",
});

const shortDayFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: PORTAL_TZ,
  day: "numeric",
  month: "short",
});

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: PORTAL_TZ });

export const formatLeadDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatLeadTime = (iso: string) => timeFormat.format(new Date(iso));
export const formatShortDay = (date: Date) => shortDayFormat.format(date);
export const portalDayKey = (date: Date) => dayKeyFormat.format(date);
