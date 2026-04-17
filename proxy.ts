import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const COOKIE_NAME = "__hcsession";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /dashboard routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;

  // No valid session → redirect to login
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only routes
  if (pathname.startsWith("/dashboard/admin") && payload.role !== "admin") {
    return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url));
  }

  // Leader-only routes (admin can also access)
  if (
    pathname.startsWith("/dashboard/leader") &&
    payload.role !== "leader" &&
    payload.role !== "admin"
  ) {
    return NextResponse.redirect(new URL(`/dashboard/${payload.role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
