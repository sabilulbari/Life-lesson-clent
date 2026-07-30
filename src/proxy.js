
import { NextResponse } from "next/server";
import auth from "./lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });


  const pathname = request.nextUrl.pathname;

  // Redirect to login if not authenticated
  if (!session && !["/auth/login", "/auth/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to home if already authenticated
  if (session && ["/auth/login", "/auth/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin-only routes
  const adminRoutes = ["/dashboard/admin"];

  if (session && adminRoutes.some((route) => pathname.startsWith(route)) && session?.user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/public-lessons/:path", "/dashboard/:path*", "/pricing", "/auth/login", "/auth/register"],
};