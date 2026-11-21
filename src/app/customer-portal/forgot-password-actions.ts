"use server";

import { redirect, RedirectType } from "next/navigation";
import type { PortalFormState, PortalResendState } from "@/app/customer-portal/actions";
import { OTP_LENGTH, RESEND_SECONDS, type StartResult } from "@/lib/portal/otp";
import { MIN_PORTAL_PASSWORD } from "@/lib/portal/password";
import {
  checkResetCode,
  currentPasswordReset,
  getResetGrant,
  replacePassword,
  startPasswordReset,
} from "@/lib/portal/reset";
import { createPortalSession, findAccountByEmail } from "@/lib/portal/session";

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SEND_FAILED = "We couldn't send the email. Please try again in a minute.";
const WENT_WRONG = "Something went wrong. Please try again.";
const RESET_EXPIRED = "Your reset session has expired. Start again.";

export async function requestPasswordReset(
  _: PortalFormState,
  formData: FormData,
): Promise<PortalFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_SHAPE.test(email)) return { error: "Enter a valid email address." };

  let result: StartResult;
  try {
    const account = await findAccountByEmail(email);
    if (!account?.email) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        error:
          "We couldn't find an account with this email. Check it, or sign in with your mobile number.",
      };
    }
    result = await startPasswordReset({ ...account, email: account.email });
    if (!result.ok && result.reason === "too-soon") {
      const pending = await currentPasswordReset();
      if (pending?.account.id === account.id) result = { ok: true };
    }
  } catch (error) {
    console.error("Could not start portal password reset", error);
    return { error: SEND_FAILED };
  }

  if (!result.ok) return startError(result);
  redirect("/customer-portal/login/forgot-password/verify", RedirectType.replace);
}

export async function verifyPasswordResetCode(
  _: PortalFormState,
  formData: FormData,
): Promise<PortalFormState> {
  const code = String(formData.get("code") ?? "");
  if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
    return { error: `Enter the ${OTP_LENGTH}-digit code.` };
  }

  try {
    const result = await checkResetCode(code);
    if (!result.ok) {
      return {
        error:
          result.reason === "wrong"
            ? "That code is not right. Check the email and try again."
            : "This code has expired. Request a new one.",
      };
    }
  } catch (error) {
    console.error("Portal reset code check failed", error);
    return { error: WENT_WRONG };
  }

  redirect("/customer-portal/login/forgot-password/new", RedirectType.replace);
}

export async function resendPasswordResetCode(): Promise<PortalResendState> {
  try {
    const pending = await currentPasswordReset();
    if (!pending) return { ok: false, error: "This code has expired. Start again." };

    const result = await startPasswordReset(pending.account);
    if (!result.ok) {
      return { ok: false, error: startError(result).error, waitSeconds: result.retryInSeconds };
    }
    return { ok: true, waitSeconds: RESEND_SECONDS };
  } catch (error) {
    console.error("Could not resend portal reset code", error);
    return { ok: false, error: SEND_FAILED };
  }
}

export async function setNewPassword(
  _: PortalFormState,
  formData: FormData,
): Promise<PortalFormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < MIN_PORTAL_PASSWORD) {
    return { error: `Password must be at least ${MIN_PORTAL_PASSWORD} characters.` };
  }
  if (password !== confirm) return { error: "Passwords don't match." };

  try {
    const account = await getResetGrant();
    if (!account) return { error: RESET_EXPIRED };

    const updated = await replacePassword(account, password);
    if (!updated) return { error: RESET_EXPIRED };
    await createPortalSession(updated);
  } catch (error) {
    console.error("Portal password reset failed", error);
    return { error: WENT_WRONG };
  }

  redirect("/customer-portal", RedirectType.replace);
}

function startError(result: Extract<StartResult, { ok: false }>) {
  return {
    error:
      result.reason === "too-many"
        ? "Too many codes requested for this account. Try again in an hour."
        : `Please wait ${result.retryInSeconds}s before asking for another code.`,
  };
}
