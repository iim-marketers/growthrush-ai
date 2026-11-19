import "server-only";
import { randomBytes, scrypt, type BinaryLike } from "node:crypto";

const KEY_LENGTH = 64;

function derive(password: string, salt: BinaryLike) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, KEY_LENGTH, (error, key) =>
      error ? reject(error) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `scrypt$${salt.toString("base64url")}$${key.toString("base64url")}`;
}
