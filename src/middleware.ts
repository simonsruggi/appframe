import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl;

  // ?format=md — rewrite to /api/md for AI agents
  if (searchParams.get("format") === "md") {
    const mdUrl = new URL("/api/md", req.url);
    mdUrl.searchParams.set("url", pathname);
    return NextResponse.rewrite(mdUrl);
  }

  const isLoggedIn = !!req.auth;
  const isAppPage = pathname.startsWith("/app/");
  const isLoginPage = pathname === "/login";

  // Redirect to login if accessing /app/* without auth, preserving the original URL
  if (isAppPage && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect to callbackUrl or home if already logged in and visiting /login
  if (isLoginPage && isLoggedIn) {
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    return Response.redirect(new URL(callbackUrl, req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
