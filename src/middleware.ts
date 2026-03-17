import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAppPage = req.nextUrl.pathname.startsWith("/app/");
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Redirect to login if accessing /app/* without auth, preserving the original URL
  if (isAppPage && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(loginUrl);
  }

  // Redirect to callbackUrl or home if already logged in and visiting /login
  if (isLoginPage && isLoggedIn) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl") || "/";
    return Response.redirect(new URL(callbackUrl, req.nextUrl));
  }
});

export const config = {
  matcher: ["/app/:path*", "/login"],
};
