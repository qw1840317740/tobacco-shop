"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore, AuthUser } from "@/stores/auth-store";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";

export default function AuthButton({ isHome = false }: { isHome?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const hydrated = useAuthStore((s) => s._hydrated);
  const params = useParams();
  const locale = (params?.locale as string) || "ja";
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  // Hydrate from server session on mount
  useEffect(() => {
    if (hydrated && !user && !checked) {
      fetch("/api/user-auth")
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {})
        .finally(() => setChecked(true));
    } else if (user) {
      setChecked(true);
    }
  }, [hydrated, user, checked, setUser]);

  const handleLogout = async () => {
    try {
      await fetch("/api/user-auth", { method: "DELETE" });
      setUser(null);
      toast.success("ログアウトしました");
      router.push(`/${locale}`);
    } catch {
      toast.error("ログアウトに失敗しました");
    }
  };

  const textColor = isHome
    ? "text-stone-400 hover:bg-white/10 hover:text-white"
    : "hover:bg-muted hover:text-foreground";

  if (!hydrated || !checked) {
    return <div className="w-9 h-9" />;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className={`inline-flex size-9 items-center justify-center rounded-lg transition-colors ${textColor}`}>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {user.name.charAt(0)}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-stone-500">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/${locale}/profile`)} className="cursor-pointer">
            プロフィール
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${locale}/orders`)} className="cursor-pointer">
            注文履歴
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${locale}/profile/addresses`)} className="cursor-pointer">
            住所管理
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link href="/login">
        <Button variant="ghost" size="sm" className={`text-xs ${textColor}`}>
          ログイン
        </Button>
      </Link>
      <Link href="/register" className="hidden sm:inline-flex">
        <Button size="sm" className="text-xs bg-primary text-white hover:bg-primary/90">
          新規登録
        </Button>
      </Link>
    </div>
  );
}
