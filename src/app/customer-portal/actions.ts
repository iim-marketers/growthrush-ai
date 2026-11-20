"use server";

import { redirect, RedirectType } from "next/navigation";
import { SmsNotConfiguredError } from "@/lib/auth/sms";
import { toE164 } from "@/lib/phone";
import {
  checkPortalCode,
  currentPortalChallenge,
  OTP_LENGTH,
  RESEND_SECONDS,
  startPortalChallenge,
  type StartResult,
} from "@/lib/portal/otp";
import { verifyPortalPassword } from "@/lib/portal/password";
import {
  createPortalSession,
  deletePortalSession,
  findAccountByEmail,
  findAccountByPhone,
} from "@/lib/portal/session";

export type PortalFormState = { error?: string } | undefined;

const SEND_FAILED = "We couldn't send the code. Please try again in a minute.";
const NO_ACCOUNT =
  "We couldn't find an account with this number. Check it, or contact your growthrush.ai manager.";
const WENT_WRONG = "Something went wrong. Please try again.";

const slowDown = () => new Promise((resolve) => setTimeout(resolve, 600));

export async function signInWithPassword(
  _: PortalFormState,
  formData: FormData,
): Promise<PortalFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  try {
    const account = await findAccountByEmail(email);
    if (!account || !(await verifyPortalPassword(password, account.passwordHash))) {
      await slowDown();
      return { error: "Incorrect email or password." };
    }
    await createPortalSession(account);
  } catch (error) {
    console.error("Portal sign-in failed", error);
    return { error: WENT_WRONG };
  }

  redirect("/customer-portal", RedirectType.replace);
}

export async function requestPortalOtp(
  _: PortalFormState,
  formData: FormData,
): Promise<PortalFormState> {
  const phone = toE164(String(formData.get("phone") ?? ""));
  if (!phone) return { error: "Enter a valid 10-digit mobile number." };

  try {
    if (!(await findAccountByPhone(phone))) {
      await slowDown();
      return { error: NO_ACCOUNT };
    }
  } catch (error) {
    console.error("Portal account lookup failed", error);
    return { error: WENT_WRONG };
  }

  const result = await start(phone);
  if (result === "failed") return { error: SEND_FAILED };
  if (!result.ok) {
    const pending = result.reason === "too-soon" ? await currentPortalChallenge() : null;
    if (pending?.phone !== phone) return startError(result);
  }

  redirect("/customer-portal/login/verify", RedirectType.replace);
}

export async function verifyPortalOtp(
  _: PortalFormState,
  formData: FormData,
): Promise<PortalFormState> {
  const code = String(formData.get("code") ?? "");
  if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
    return { error: `Enter the ${OTP_LENGTH}-digit code.` };
  }

  try {
    const result = await checkPortalCode(code);
    if (!result.ok) {
      return {
        error:
          result.reason === "wrong"
            ? "That code is not right. Check the message and try again."
            : "This code has expired. Request a new one.",
      };
    }

    const account = await findAccountByPhone(result.phone);
    if (!account) return { error: NO_ACCOUNT };
    await createPortalSession(account);
  } catch (error) {
    console.error("Portal OTP sign-in failed", error);
    return { error: WENT_WRONG };
  }

  redirect("/customer-portal", RedirectType.replace);
}

export type PortalResendState =
  | { ok: true; waitSeconds: number }
  | { ok: false; error: string; waitSeconds?: number };

export async function resendPortalOtp(): Promise<PortalResendState> {
  const challenge = await currentPortalChallenge();
  if (!challenge) return { ok: false, error: "This code has expired. Start again." };

  const result = await start(challenge.phone);
  if (result === "failed") return { ok: false, error: SEND_FAILED };
  if (!result.ok) {
    return { ok: false, error: startError(result).error, waitSeconds: result.retryInSeconds };
  }
  return { ok: true, waitSeconds: RESEND_SECONDS };
}

export async function portalSignOut() {
  await deletePortalSession();
  redirect("/customer-portal/login", RedirectType.replace);
}

async function start(phone: string): Promise<StartResult | "failed"> {
  try {
    return await startPortalChallenge(phone);
  } catch (error) {
    if (error instanceof SmsNotConfiguredError) console.error(error.message);
    else console.error("Could not start portal OTP challenge", error);
    return "failed";
  }
}

function startError(result: Extract<StartResult, { ok: false }>) {
  return {
    error:
      result.reason === "too-many"
        ? "Too many codes requested for this number. Try again in an hour."
        : `Please wait ${result.retryInSeconds}s before asking for another code.`,
  };
}
