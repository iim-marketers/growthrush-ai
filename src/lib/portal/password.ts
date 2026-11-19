import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";

export async function verifyPortalPassword(password: string, stored: string) {
  const [scheme, salt, key] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !key) return false;

  const expected = Buffer.from(key, "base64url");
  const actual = await new Promise<Buffer>((resolve, reject) =>
    scrypt(password, Buffer.from(salt, "base64url"), expected.length, (error, derived) =>
      error ? reject(error) : resolve(derived),
    ),
  );
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
