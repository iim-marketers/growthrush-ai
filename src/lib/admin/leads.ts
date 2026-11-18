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

export const LEAD_PHONE = /^\+?\d{10,15}$/;
export const cleanPhone = (value: string) => value.replace(/[\s()\-.']/g, "");

export function phoneKey(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function parseLeadStatus(value: string): AccountLeadStatus | null {
  const key = value.toLowerCase().replace(/[^a-z]/g, "");
  if (key === "valid") return "valid";
  if (key === "invalid") return "invalid";
  if (key === "followup") return "follow_up";
  return null;
}

export type ImportLeadRow = {
  name: string;
  phone: string;
  city: string;
  comment: string;
  status: AccountLeadStatus | null;
};

export const IMPORT_BATCH_SIZE = 500;
