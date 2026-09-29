import "server-only";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

/** 32 random bytes, URL-safe — the value that lives in the session cookie. */
export function newToken() {
  return randomBytes(32).toString("base64url");
}

export function newOtpCode(length: number) {
  return Array.from({ length }, () => randomInt(10)).join("");
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
