/**
 * Indian mobile numbers, shared by the browser and the server so both sides
 * agree on what counts as valid. Stored as E.164 (+91XXXXXXXXXX).
 */

/* Ten digits, and Indian mobiles start with 6–9. */
const NATIONAL = /^[6-9]\d{9}$/;

/** `9845021188` → `+919845021188`, or null if it isn't an Indian mobile. */
export function toE164(national: string) {
  const digits = national.replace(/\D/g, "");
  return NATIONAL.test(digits) ? `+91${digits}` : null;
}

/** Masks all but the last two digits: +919845021188 → +91 98••• ••88. */
export function maskNumber(e164: string) {
  const national = e164.replace(/^\+91/, "");
  if (national.length !== 10) return "your mobile number";
  return `+91 ${national.slice(0, 2)}••• ••${national.slice(-2)}`;
}
