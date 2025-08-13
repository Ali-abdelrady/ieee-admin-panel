// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(process.env.NEXT_PUBLIC_API_ENDPOINT);
  const authCheckResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/check?type=admin`,
    {
      method: "GET",
      credentials: "include", // Necessary for HTTP-only cookies
      headers: {
        "Content-Type": "application/json",
        // Forward necessary headers from original request
        Cookie: request.headers.get("Cookie") || "",
      },
    }
  );
  const isAuthenticated = authCheckResponse.ok;
  console.log("isAuthenticated:", isAuthenticated);
  const { pathname } = request.nextUrl;
  console.log("pathname:", pathname);
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") // Files with extensions (e.g., .ico, .jpg)
  ) {
    return NextResponse.next();
  }
  if (!isAuthenticated && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
