"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "ja";
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("ユーザー名とパスワードを入力してください");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("ログインしました");
        router.push(`/${locale}/admin/products`);
      } else {
        toast.error(data.error || "ログインに失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <Card className="w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 px-6 py-8 text-center">
          <div className="inline-block rounded-lg bg-white/10 p-2.5">
            <img src="/images/logo.png" alt="TABACOYA" className="h-10 w-auto object-contain" />
          </div>
          <p className="mt-1 text-sm text-stone-400">管理パネル</p>
          <div className="mx-auto mt-4 h-px w-16 bg-primary" />
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">ユーザー名</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="admin"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">パスワード</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="••••••"
            />
          </div>
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
          <p className="text-center text-xs text-stone-400">
            <a href="/" className="hover:text-stone-600 hover:underline">← サイトに戻る</a>
          </p>
        </div>
      </Card>
    </div>
  );
}
