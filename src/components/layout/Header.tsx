"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import AuthButton from "@/components/auth/AuthButton";
import { SearchDropdown } from "./SearchDropdown";
import Image from "next/image";

function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems);
  const hydrated = useCartStore((s) => s._hydrated);
  if (!hydrated || totalItems() === 0) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white animate-in zoom-in-50 duration-200">
      {totalItems()}
    </span>
  );
}

export default function Header() {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const isHome = pathname === "/";

  const navItems = [
    { href: "/products", label: tNav("products") },
    { href: "/categories", label: tNav("brands") },
    { href: "/guide", label: tNav("guide") },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-lg transition-colors duration-500 ${
      isHome
        ? "bg-stone-950/80 border-b border-white/5"
        : "bg-background/80 border-b border-border"
    }`}>
      {/* Subtle top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo.png"
            alt="TABACOYA"
            width={40}
            height={40}
            className="h-9 sm:h-10 w-auto object-contain rounded-lg"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                pathname === item.href
                  ? isHome
                    ? "bg-white/10 text-white"
                    : "bg-primary/10 text-primary"
                  : isHome
                    ? "text-stone-400 hover:bg-white/5 hover:text-white"
                    : "text-stone-600 hover:bg-muted hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          {/* Auth */}
          <AuthButton isHome={isHome} />

          {/* Search */}
          <SearchDropdown isHome={isHome} />

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${isHome ? "text-stone-400 hover:bg-white/10 hover:text-white" : ""}`}
            onClick={() => setCartOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <CartBadge />
          </Button>

          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-1">
            {(["en", "ja", "zh"] as const).map((loc) => (
              <button
                key={loc}
                onClick={() => router.replace(pathname || "/", { locale: loc })}
                className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                  locale === loc
                    ? "bg-primary/10 text-primary"
                    : isHome
                      ? "text-stone-500 hover:bg-white/10 hover:text-white"
                      : "text-stone-400 hover:bg-muted hover:text-foreground"
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className={`lg:hidden inline-flex size-9 items-center justify-center rounded-lg outline-none transition-colors ${
              isHome ? "text-stone-400 hover:bg-white/10 hover:text-white" : "hover:bg-muted hover:text-foreground"
            }`}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary ${
                      pathname === item.href ? "text-primary bg-muted" : "text-stone-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-4 border-t" />
                <Link href="/search" className="px-3 py-2 text-sm text-stone-600 hover:text-primary">{t("search")}</Link>
                <div className="flex gap-2 px-3 py-2">
                  <Link href={pathname || "/"} locale="en" className="text-sm text-stone-500 hover:text-primary">EN</Link>
                  <Link href={pathname || "/"} locale="ja" className="text-sm text-stone-500 hover:text-primary">JA</Link>
                  <Link href={pathname || "/"} locale="zh" className="text-sm text-stone-500 hover:text-primary">ZH</Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
