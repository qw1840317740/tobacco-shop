import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/lib/routing";
import { verifySession } from "@/lib/admin-auth";
import { verifyUserSession } from "@/lib/user-auth";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const localeMatch = pathname.match(/^\/(en|ja|zh)/);
  const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;

  // Skip for API routes, static files, _next
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/legal")
  ) {
    return NextResponse.next();
  }

  // Admin route protection
  const adminMatch = pathname.match(/^\/[a-z]{2}\/admin(\/.*)?$/);
  if (adminMatch) {
    // Allow login page through
    if (pathname.includes("/admin/login")) {
      return intlMiddleware(request);
    }
    // Check session
    const session = verifySession(request.headers.get("cookie"));
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }
    return intlMiddleware(request);
  }

  // User route protection — /profile/* and /orders require login
  const userProtectedMatch = pathname.match(/^\/[a-z]{2}\/(profile|orders)(\/.*)?$/);
  const isLoginPage = pathname.includes("/login");
  const isRegisterPage = pathname.includes("/register");
  if (userProtectedMatch) {
    const userSession = verifyUserSession(request.headers.get("cookie"));
    if (!userSession) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  // Run i18n middleware first
  const response = intlMiddleware(request);

  // Age verification check — uses cookie set by client (sessionStorage-based)
  // The client-side AgeGate sets this cookie on confirm; it has no max-age so it
  // becomes a session cookie that expires when the browser is closed.
  const ageVerified = request.cookies.get("age_verified")?.value;
  const isAgeVerifyPage = pathname.includes("/age-verify");

  if (!ageVerified && !isAgeVerifyPage && !isLoginPage && !isRegisterPage) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/age-verify`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
