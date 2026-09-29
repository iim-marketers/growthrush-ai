import { NextResponse, type NextRequest } from "next/server";
import { homeFor } from "@/lib/auth/dal";
import { SESSION_COOKIE } from "@/lib/auth/cookie";
import { findSessionUser } from "@/lib/auth/session";

/**
 * Runs before every request to the routes below, client-side navigations
 * included — which layouts do not, since they persist between pages.
 *
 * - The login screens: someone already signed in is sent to their home. The
 *   session is checked against the database, not just the cookie, so an
 *   expired one cannot bounce between /login and /dashboard forever.
 * - The app screens: a cheap first pass — no session cookie, no entry. The
 *   real check is in lib/auth/dal.ts, which every page and action still calls.
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (request.nextUrl.pathname.startsWith("/login")) {
    if (!token) return NextResponse.next();

    const user = await findSessionUser(token).catch(() => null);
    if (user) {
      return NextResponse.redirect(new URL(homeFor(user), request.url));
    }

    /* A dead cookie: drop it so the next visit skips this lookup. */
    const response = NextResponse.next();
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (token) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/login/:path*",
    "/dashboard/:path*",
    "/leads/:path*",
    "/billing/:path*",
    "/onboarding/:path*",
  ],
};
