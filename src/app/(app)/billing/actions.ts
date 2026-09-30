"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { businesses } from "@/db/schema";
import { getSessionUser } from "@/lib/auth/session";
import { normalizeEmail } from "@/lib/email";
import { isPincode, normalizeGstin, stateName } from "@/lib/gst";

export type BillingFormState =
  | { error?: string; saved?: boolean; at?: number }
  | undefined;

export async function saveBillingDetails(
  _: BillingFormState,
  formData: FormData,
): Promise<BillingFormState> {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const field = (name: string) => String(formData.get(name) ?? "").trim();
  const name = field("name");
  const email = normalizeEmail(field("email"));
  const line1 = field("line1");
  const line2 = field("line2");
  const city = field("city");
  const stateCode = field("state");
  const pincode = field("pincode");
  const gstinInput = field("gstin");

  if (name.length < 3 || name.length > 100) {
    return { error: "Enter the name to bill, as it should appear on invoices." };
  }
  if (!email) return { error: "Enter a valid email for your invoices." };
  if (!line1 || line1.length > 100 || line2.length > 100) {
    return { error: "Enter your address (up to 100 characters a line)." };
  }
  if (!city || city.length > 50) return { error: "Enter your city." };
  if (!stateName(stateCode)) return { error: "Choose your state." };
  if (!isPincode(pincode)) return { error: "Enter a valid 6-digit PIN code." };

  const gstin = gstinInput ? normalizeGstin(gstinInput) : null;
  if (gstinInput && !gstin) return { error: "That GSTIN doesn't look right." };
  if (gstin && gstin.slice(0, 2) !== stateCode) {
    return { error: "Your GSTIN is registered in a different state." };
  }

  const row = {
    billingName: name,
    billingEmail: email,
    billingGstin: gstin,
    billingLine1: line1,
    billingLine2: line2 || null,
    billingCity: city,
    billingStateCode: stateCode,
    billingPincode: pincode,
    updatedAt: new Date(),
  };

  try {
    await getDb()
      .insert(businesses)
      .values({ userId: user.id, ...row })
      .onConflictDoUpdate({ target: businesses.userId, set: row });
  } catch (error) {
    console.error("Could not save billing details", user.id, error);
    return { error: "We couldn't save your details. Please try again." };
  }

  refresh();
  return { saved: true, at: Date.now() };
}
