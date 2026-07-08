import { defineRouting } from "next-intl/routing";

// Mono-language site: Japanese only. /en and /zh paths are 301-redirected
// to /ja in middleware.ts. The locales array still includes them for the
// redirect logic; messages exist only for "ja" now.
export const routing = defineRouting({
  locales: ["ja"],
  defaultLocale: "ja",
});