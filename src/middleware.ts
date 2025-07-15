// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get cookies from the request
  // const cookies = request.cookies;
  // const hasToken = cookies.has("jwt"); // HTTP-only cookies are accessible in middleware

  // const { pathname } = request.nextUrl;

  // if (!hasToken && pathname !== "/login") {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (hasToken && pathname === "/login") {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}
