import "server-only";
import { verify } from "@/lib/app-data";
import { newOtpCode } from "./tokens";

/* To go live, call an SMS gateway in `deliver` and leave AUTH_OTP_STUB unset in production. */

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
