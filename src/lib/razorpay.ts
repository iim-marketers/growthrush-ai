import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";

export const MIN_ORDER_AMOUNT = 100;

function readKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set.");
  }
  return { keyId, keySecret };
}

let client: Razorpay | undefined;

export function getRazorpay() {
  if (client) return client;
  const { keyId, keySecret } = readKeys();
  client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return client;
}

export function isValidWebhookSignature(body: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET must be set.");
  }
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  return sameHex(expected, signature);
}

function sameHex(expected: string, signature: string) {
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

// The SDK rejects with `{ statusCode, error }`, not an Error instance.
export function razorpayStatusCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode;
  }
}
