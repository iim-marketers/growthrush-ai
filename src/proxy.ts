import { NextResponse, type NextRequest } from "next/server";
import { homeFor } from "@/lib/auth/dal";
import { SESSION_COOKIE } from "@/lib/auth/cookie";
import { findSessionUser } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (request.nextUrl.pathname.startsWith("/login")) {
    if (!token) return NextResponse.next();

    const user = await findSessionUser(token).catch(() => null);
    if (user) {
      return NextResponse.redirect(new URL(homeFor(user), request.url));
    }

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
