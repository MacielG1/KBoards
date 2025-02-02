import { NextResponse } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

export const { auth } = NextAuth(authConfig);

export const publicRoutes = ["/"];

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isNextAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isWebhookRoute = nextUrl.pathname.startsWith("/api/webhook") || nextUrl.pathname.startsWith("/api/cron");

  if (isNextAuthRoute || isWebhookRoute) return;

  if (isLoggedIn && isPublicRoute) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
