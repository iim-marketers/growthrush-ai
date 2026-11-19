import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/admin/auth";
import { homeFor } from "@/lib/auth/dal";
import { SESSION_COOKIE } from "@/lib/auth/cookie";
import { findSessionUser } from "@/lib/auth/session";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) return adminProxy(request);

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

function adminProxy(request: NextRequest) {
  const signedIn = verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
  const onLogin = request.nextUrl.pathname.startsWith("/admin/login");

  if (onLogin && signedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (!onLogin && !signedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/login/:path*",
    "/dashboard/:path*",
    "/leads/:path*",
    "/billing/:path*",
    "/onboarding/:path*",
  ],
};
