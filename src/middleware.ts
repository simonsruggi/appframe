import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAppPage = req.nextUrl.pathname.startsWith("/app/");
  const isLoginPage = req.nextUrl.pathname === "/login";

  // Redirect to login if accessing /app/* without auth
  if (isAppPage && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to home if already logged in and visiting /login
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/app/:path*", "/login"],
};
