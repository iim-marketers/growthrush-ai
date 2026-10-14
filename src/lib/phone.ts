const NATIONAL = /^[6-9]\d{9}$/;

export function toE164(national: string) {
  const digits = national.replace(/\D/g, "");
  return NATIONAL.test(digits) ? `+91${digits}` : null;
}

export function maskNumber(e164: string) {
  const national = e164.replace(/^\+91/, "");
  if (national.length !== 10) return "your mobile number";
  return `+91 ${national.slice(0, 2)}••• ••${national.slice(-2)}`;
}
