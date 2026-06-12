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
    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#C8A97E] text-xs font-bold text-white animate-in zoom-in-50 duration-200">
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

  const navItems = [
    { href: "/products", label: tNav("products") },
    { href: "/categories", label: tNav("brands") },
    { href: "/guide", label: tNav("guide") },
    { href: "/blog", label: tNav("blog") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5]">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo.png"
            alt="TABACOYA"
            width={40}
            height={40}
            className="h-8 sm:h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative pb-0.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
                pathname === item.href
                  ? "text-[#1A1A1A]"
                  : "text-[#888] hover:text-[#1A1A1A]"
              }`}
            >
              {item.label}
              {pathname === item.href && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-px bg-[#1A1A1A]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1">
          {/* Auth */}
          <AuthButton />

          {/* Search */}
          <SearchDropdown />

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <CartBadge />
          </Button>

          {/* Language switcher */}
          <div className="hidden sm:flex items-center">
            {(["en", "ja", "zh"] as const).map((loc, i) => (
              <button
                key={loc}
                onClick={() => router.replace(pathname || "/", { locale: loc })}
                className={`px-1.5 py-1 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  locale === loc
                    ? "text-[#1A1A1A]"
                    : "text-[#888] hover:text-[#1A1A1A]"
                }`}
              >
                {loc.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="lg:hidden inline-flex size-9 items-center justify-center rounded-lg outline-none transition-colors hover:bg-[#F5F5F5]">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <nav className="mt-8 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2.5 text-xs font-medium uppercase tracking-[0.1em] transition-colors hover:text-[#1A1A1A] ${
                      pathname === item.href ? "text-[#1A1A1A]" : "text-[#888]"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-3 border-t border-[#E5E5E5]" />
                <Link href="/search" className="px-3 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-[#888] hover:text-[#1A1A1A]">{t("search")}</Link>
                <div className="flex gap-3 px-3 py-2.5">
                  <Link href={pathname || "/"} locale="en" className="text-[10px] font-medium uppercase tracking-wider text-[#888] hover:text-[#1A1A1A]">EN</Link>
                  <Link href={pathname || "/"} locale="ja" className="text-[10px] font-medium uppercase tracking-wider text-[#888] hover:text-[#1A1A1A]">JA</Link>
                  <Link href={pathname || "/"} locale="zh" className="text-[10px] font-medium uppercase tracking-wider text-[#888] hover:text-[#1A1A1A]">ZH</Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
