/* Razorpay caps customer emails at 64 characters. */
const MAX_LENGTH = 64;
const SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(input: string) {
  const email = input.trim().toLowerCase();
  return email.length <= MAX_LENGTH && SHAPE.test(email) ? email : null;
}
