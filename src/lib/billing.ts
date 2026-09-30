import type { businesses } from "@/db/schema";

export type BillingDetailsValue = {
  name: string;
  email: string;
  gstin: string | null;
  line1: string;
  line2: string | null;
  city: string;
  stateCode: string;
  pincode: string;
};

export function billingDetailsOf(
  business: typeof businesses.$inferSelect | null,
): BillingDetailsValue | null {
  if (
    !business?.billingName ||
    !business.billingEmail ||
    !business.billingLine1 ||
    !business.billingCity ||
    !business.billingStateCode ||
    !business.billingPincode
  ) {
    return null;
  }
  return {
    name: business.billingName,
    email: business.billingEmail,
    gstin: business.billingGstin,
    line1: business.billingLine1,
    line2: business.billingLine2,
    city: business.billingCity,
    stateCode: business.billingStateCode,
    pincode: business.billingPincode,
  };
}
