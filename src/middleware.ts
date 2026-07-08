import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/lib/routing";
import { verifySession } from "@/lib/admin-auth";
import { verifyUserSession } from "@/lib/user-auth";

const intlMiddleware = createMiddleware(routing);

/**
 * Known search engine crawler User-Agent patterns.
 * Google explicitly allows serving the full page content to these bots
 * while gating human visitors behind age verification — this is NOT cloaking.
 */
const CRAWLER_PATTERNS = [
  "Googlebot",
  "Google-InspectionTool",
  "Googlebot-Image",
  "Googlebot-Video",
  "Mediapartners-Google",     // AdSense
  "AdsBot-Google",
  "bingbot",
  "BingPreview",
  "Slurp",                    // Yahoo
  "DuckDuckBot",
  "Baiduspider",
  "YandexBot",
  "facebookexternalhit",      // Facebook crawler (for social previews)
  "Twitterbot",               // Twitter crawler
  "LinkedInBot",
  "AhrefsBot",
  "MJ12bot",
  "SemrushBot",
];

function isCrawler(ua: string | null): boolean {
  if (!ua) return false;
  return CRAWLER_PATTERNS.some((pattern) => ua.includes(pattern));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Force every request onto the Japanese locale: /en/* and /zh/* are 301'd
  // to /ja/*. The site is now mono-language (Japanese-only) — see
  // src/lib/routing.ts.
  const legacyLocaleMatch = pathname.match(/^\/(en|zh)(\/|$)/);
  if (legacyLocaleMatch) {
    const url = request.nextUrl.clone();
    url.pathname = `/ja${pathname.slice(3)}` || "/ja";
    return NextResponse.redirect(url, 301);
  }

  const localeMatch = pathname.match(/^\/ja/);
  const locale = localeMatch ? "ja" : routing.defaultLocale;

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
    const session = await verifySession(request.headers.get("cookie"));
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
    const userSession = await verifyUserSession(request.headers.get("cookie"));
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
  //
  // IMPORTANT: Search engine crawlers are exempted so they can index the actual
  // page content. This is standard practice and explicitly allowed by Google.
  // The content shown to crawlers is identical to what a verified human sees.
  const ageVerified = request.cookies.get("age_verified")?.value;
  const isAgeVerifyPage = pathname.includes("/age-verify");
  const requestIsFromCrawler = isCrawler(request.headers.get("user-agent"));

  if (!ageVerified && !isAgeVerifyPage && !isLoginPage && !isRegisterPage && !requestIsFromCrawler) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/age-verify`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
