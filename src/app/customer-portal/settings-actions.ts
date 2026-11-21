"use server";

import {
  MIN_PORTAL_PASSWORD,
  setPortalPassword,
  verifyPortalPassword,
} from "@/lib/portal/password";
import { createPortalSession, findAccountById, getPortalAccount } from "@/lib/portal/session";

export type ChangePasswordState = { error?: string; ok?: boolean; at?: number } | undefined;

export async function changePortalPassword(
  _: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!current) return { error: "Enter your current password." };
  if (password.length < MIN_PORTAL_PASSWORD) {
    return { error: `New password must be at least ${MIN_PORTAL_PASSWORD} characters.` };
  }
  if (password !== confirm) return { error: "New passwords don't match." };
  if (password === current) return { error: "Choose a password different from your current one." };

  try {
    const session = await getPortalAccount();
    const account = session && (await findAccountById(session.id));
    if (!account) return { error: "Your session has expired. Sign in again." };

    if (!(await verifyPortalPassword(current, account.passwordHash))) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return { error: "Your current password is incorrect." };
    }

    const updated = await setPortalPassword(account, password);
    if (!updated) return { error: "Your password was just changed elsewhere. Reload and try again." };
    await createPortalSession(updated);
  } catch (error) {
    console.error("Portal password change failed", error);
    return { error: "Something went wrong. Please try again." };
  }

  return { ok: true, at: Date.now() };
}
