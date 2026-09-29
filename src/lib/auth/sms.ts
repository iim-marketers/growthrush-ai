import "server-only";
import { verify } from "@/lib/app-data";
import { newOtpCode } from "./tokens";

/**
 * Where the one-time code goes. There is no SMS gateway yet, so outside
 * production (or with AUTH_OTP_STUB=true) every code is STUB_CODE and nothing
 * is sent — the verify screen shows it in a mock message instead.
 *
 * To go live, replace the body of `deliver` with a call to the gateway
 * (MSG91, Twilio, …) and leave AUTH_OTP_STUB unset in production.
 */

export const STUB_CODE = "000000";

export function otpStubEnabled() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.AUTH_OTP_STUB === "true"
  );
}

export class SmsNotConfiguredError extends Error {
  constructor() {
    super("No SMS gateway is configured and the OTP stub is off.");
  }
}

/** Picks a code for `phone`, sends it, and returns it so it can be hashed. */
export async function sendOtp(phone: string) {
  if (otpStubEnabled()) return STUB_CODE;

  const code = newOtpCode(verify.length);
  await deliver(phone, code);
  return code;
}

async function deliver(phone: string, code: string): Promise<void> {
  void phone;
  void code;
  throw new SmsNotConfiguredError();
}
