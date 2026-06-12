"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";

interface AdminInfo {
  username: string;
  role: string;
}

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "ja";
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin-auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setAdmin(data.admin);
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { href: `/${locale}/admin/products`, label: "商品管理", icon: "📦" },
    { href: `/${locale}/admin/categories`, label: "カテゴリー", icon: "🏷️" },
    { href: `/${locale}/admin/age-docs`, label: "年齢確認", icon: "🪪" },
    { href: `/${locale}/admin/orders`, label: "注文管理", icon: "📋" },
    ...(admin?.role === "superadmin"
      ? [{ href: `/${locale}/admin/users`, label: "管理者", icon: "👥" }]
      : []),
  ];

  const handleLogout = async () => {
    await fetch("/api/admin-auth", { method: "DELETE" });
    window.location.href = `/${locale}/admin/login`;
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 bg-[#0F0F0F] lg:flex lg:flex-col">
        <div className="px-5 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-white/10 p-1.5">
              <img src="/images/logo.png" alt="TABACOYA" className="h-7 w-auto object-contain" />
            </div>
          </Link>
          <p className="mt-1 text-xs text-[#888888]">管理パネル</p>
        </div>
        <div className="h-px bg-[#2A2A2A]" />
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                pathname === item.href
                  ? "bg-[#C8A97E]/20 text-[#C8A97E] font-medium"
                  : "text-[#888888] hover:bg-[#2A2A2A] hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[#2A2A2A] px-3 py-4">
          {admin && (
            <p className="mb-2 px-3 text-xs text-[#888888]">ログイン中: {admin.username}</p>
          )}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#888888] hover:bg-[#2A2A2A] hover:text-[#888888]"
          >
            ログアウト
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex h-14 items-center justify-between bg-[#0F0F0F] px-4">
        <span className="flex items-center gap-2">
          <div className="rounded-md bg-white/10 p-1">
            <img src="/images/logo.png" alt="TABACOYA" className="h-5 w-auto object-contain" />
          </div>
          <span className="text-xs text-[#888888]">管理</span>
        </span>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-56 bg-[#0F0F0F] flex flex-col">
            <div className="px-5 py-5">
              <span className="text-lg font-bold text-white">管理パネル</span>
            </div>
            <nav className="flex-1 px-3 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                    pathname === item.href
                      ? "bg-[#C8A97E]/20 text-[#C8A97E] font-medium"
                      : "text-[#888888] hover:bg-[#2A2A2A] hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-[#2A2A2A] px-3 py-3">
              <button onClick={handleLogout} className="w-full rounded-lg px-3 py-2 text-left text-sm text-[#888888] hover:bg-[#2A2A2A]">
                ログアウト
              </button>
            </div>
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
