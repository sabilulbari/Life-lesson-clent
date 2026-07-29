import { NextResponse } from "next/server";
import { getUserSession } from "./lib/core/session";
import auth from "./lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const pathname = request.nextUrl.pathname;

  if (!session && !["/auth/login", "/auth/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (session && ["/auth/login", "/auth/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/public-lessons/:path*", "/dashboard/add-lesson/:path*", "/dashboard/my-lessons/:path*", "/pricing", "/auth/login", "/auth/register"],
};
