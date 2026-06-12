"use client";

import { usePathname, Link } from "@/i18n/navigation";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { useTranslations } from "next-intl";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const totalItems = useCartStore((s) => s.totalItems);
  const hydrated = useCartStore((s) => s._hydrated);
  const user = useAuthStore((s) => s.user);
  const t = useTranslations("common");

  const itemCount = hydrated ? totalItems() : 0;

  const tabs = [
    {
      label: t("home"),
      href: "/",
      icon: Home,
      active: pathname === "/",
    },
    {
      label: t("search"),
      href: "/search",
      icon: Search,
      active: pathname === "/search",
    },
    {
      label: t("cart"),
      href: null,
      icon: ShoppingCart,
      active: false,
      badge: itemCount,
      onClick: () => setCartOpen(true),
    },
    {
      label: t("account"),
      href: user ? "/profile" : "/login",
      icon: User,
      active: pathname === "/profile" || pathname === "/login",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200/80 bg-white/95 backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.active;

          const content = (
            <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors duration-200">
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? "text-primary" : "text-stone-400"
                  )}
                />
                {tab.badge != null && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-stone-400"
                )}
              >
                {tab.label}
              </span>
            </div>
          );

          if (tab.onClick) {
            return (
              <button
                key={tab.label}
                onClick={tab.onClick}
                className="outline-none"
              >
                {content}
              </button>
            );
          }

          return (
            <Link key={tab.label} href={tab.href!}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
