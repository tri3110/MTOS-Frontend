import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useAuthStore } from "./utils/store";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const isAdmin = request.cookies.get("is_admin")?.value === "True";
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin/") && !token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/admin/") && token && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname === "/admin" && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}