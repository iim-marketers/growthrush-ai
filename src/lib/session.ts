/**
 * Keys for the scraps of state the prototype hands between screens.
 *
 * Everything here is browser-only and deliberately `sessionStorage`, not
 * `localStorage` or a query param: there is no backend, a half-finished
 * sign-in should not survive the tab, and a phone number in a URL ends up in
 * browser history and access logs. Replace with a real session once there is
 * an API to talk to.
 */

/** The mobile number typed on /login, read by /login/verify for its heading. */
export const PENDING_NUMBER_KEY = "gr:pending-number";

/** Masks all but the last two digits: 9845021188 → +91 98••• ••88. */
export function maskNumber(number: string) {
  if (number.length !== 10) return "your mobile number";
  return `+91 ${number.slice(0, 2)}••• ••${number.slice(-2)}`;
}
