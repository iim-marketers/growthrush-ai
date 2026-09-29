"use server";

import { redirect, RedirectType } from "next/navigation";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { verify } from "@/lib/app-data";
import { homeFor } from "@/lib/auth/dal";
import {
  checkCode,
  currentChallenge,
  startChallenge,
  type StartResult,
} from "@/lib/auth/otp";
import { createSession, deleteSession } from "@/lib/auth/session";
import { SmsNotConfiguredError } from "@/lib/auth/sms";
import { toE164 } from "@/lib/phone";

export type FormState = { error?: string } | undefined;

const SEND_FAILED = "We couldn't send the code. Please try again in a minute.";

/* ------------------------------------------------------------------ *
 * /login — ask for a code
 * ------------------------------------------------------------------ */

export async function requestOtp(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  if (formData.get("consent") !== "on") {
    return { error: "Please agree to the policies to continue." };
  }

  const phone = toE164(String(formData.get("phone") ?? ""));
  if (!phone) return { error: "Enter a valid 10-digit mobile number." };

  const result = await start(phone);
  if (result === "failed") return { error: SEND_FAILED };
  if (!result.ok) {
    /* A double tap, or back-and-forward: the code sent moments ago to this
       number is still good, so carry on to it rather than complain. */
    const pending =
      result.reason === "too-soon" ? await currentChallenge() : null;
    if (pending?.phone !== phone) return startError(result);
  }

  /* Outside any try: redirect() works by throwing. Replace, not push, so the
     login screens leave history as the customer moves through them — Back
     from the app then goes to where they came from, not to a stale form. */
  redirect("/login/verify", RedirectType.replace);
}

/* ------------------------------------------------------------------ *
 * /login/verify — answer it
 * ------------------------------------------------------------------ */

export async function verifyOtp(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const code = String(formData.get("code") ?? "");
  if (!new RegExp(`^\\d{${verify.length}}$`).test(code)) {
    return { error: `Enter the ${verify.length}-digit code.` };
  }

  let destination: string;
  try {
    const result = await checkCode(code);
    if (!result.ok) {
      return {
        error:
          result.reason === "wrong"
            ? verify.wrongCode
            : "This code has expired. Request a new one.",
      };
    }

    const now = new Date();
    const [user] = await getDb()
      .insert(users)
      .values({ phone: result.phone, lastLoginAt: now, consentedAt: now })
      .onConflictDoUpdate({
        target: users.phone,
        set: { lastLoginAt: now, consentedAt: now },
      })
      .returning({ id: users.id, onboardedAt: users.onboardedAt });

    await createSession(user.id);
    destination = homeFor(user);
  } catch (error) {
    console.error("Sign-in failed", error);
    return { error: "Something went wrong. Please try again." };
  }

  redirect(destination, RedirectType.replace);
}

export type ResendState =
  | { ok: true; waitSeconds: number }
  | { ok: false; error: string; waitSeconds?: number };

export async function resendOtp(): Promise<ResendState> {
  const challenge = await currentChallenge();
  if (!challenge) {
    return { ok: false, error: "This code has expired. Start again." };
  }

  const result = await start(challenge.phone);
  if (result === "failed") return { ok: false, error: SEND_FAILED };
  if (!result.ok) {
    return {
      ok: false,
      error: startError(result).error,
      waitSeconds: result.retryInSeconds,
    };
  }
  return { ok: true, waitSeconds: verify.resendSeconds };
}

/* ------------------------------------------------------------------ *
 * Everywhere — sign out
 * ------------------------------------------------------------------ */

export async function signOut() {
  await deleteSession();
  redirect("/login");
}

/* ------------------------------------------------------------------ */

async function start(phone: string): Promise<StartResult | "failed"> {
  try {
    return await startChallenge(phone);
  } catch (error) {
    if (error instanceof SmsNotConfiguredError) {
      console.error(error.message);
    } else {
      console.error("Could not start OTP challenge", error);
    }
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
