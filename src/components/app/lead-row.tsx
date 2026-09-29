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
