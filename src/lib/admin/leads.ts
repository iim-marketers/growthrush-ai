export const accountLeadStatuses = [
  {
    id: "valid",
    label: "Valid",
    badge: "bg-success/12 text-success",
    dot: "bg-success",
  },
  {
    id: "follow_up",
    label: "Follow-up",
    badge: "bg-warn/12 text-warn",
    dot: "bg-warn",
  },
  {
    id: "invalid",
    label: "Invalid",
    badge: "bg-danger/10 text-danger",
    dot: "bg-danger",
  },
] as const;

export type AccountLeadStatus = (typeof accountLeadStatuses)[number]["id"];

export function isAccountLeadStatus(value: unknown): value is AccountLeadStatus {
  return accountLeadStatuses.some((status) => status.id === value);
}

export function accountLeadStatusMeta(status: AccountLeadStatus) {
  return accountLeadStatuses.find((s) => s.id === status) ?? accountLeadStatuses[0];
}

export type AccountLead = {
  id: string;
  name: string;
  phone: string;
  city: string;
  comment: string;
  status: AccountLeadStatus;
  createdAt: string;
};

export type LeadAccountSummary = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  createdAt: string;
  total: number;
  valid: number;
  followUp: number;
  invalid: number;
  lastLeadAt: string | null;
};

export const ADMIN_TZ = "Asia/Kolkata";

const dateFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: ADMIN_TZ,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-IN", {
  timeZone: ADMIN_TZ,
  hour: "numeric",
  minute: "2-digit",
});

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: ADMIN_TZ });

export const formatAdminDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatAdminTime = (iso: string) => timeFormat.format(new Date(iso));
export const dayKey = (date: Date) => dayKeyFormat.format(date);
