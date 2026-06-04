"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Link } from "@/i18n/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "ja";
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("すべての項目を入力してください");
      return;
    }
    // Email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("正しいメールアドレスを入力してください");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("氏名は2文字以上入力してください");
      return;
    }
    if (password.length < 6) {
      toast.error("パスワードは6文字以上必要です");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error("パスワードは英字と数字をそれぞれ含めてください");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("パスワードが一致しません");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        toast.success("登録が完了しました");
        router.push(`/${locale}`);
      } else {
        toast.error(data.error || "登録に失敗しました");
      }
    } catch {
      toast.error("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 px-6 py-8 text-center">
          <div className="inline-block rounded-lg bg-white/10 p-2.5">
            <img src="/images/logo.png" alt="TABACOYA" className="h-10 w-auto object-contain" />
          </div>
          <p className="mt-2 text-sm text-stone-400">新規登録</p>
          <div className="mx-auto mt-4 h-px w-16 bg-primary" />
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">氏名</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">メールアドレス</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">パスワード</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6文字以上"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">パスワード確認</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              placeholder="パスワードを再入力"
            />
          </div>
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "登録中..." : "登録する"}
          </Button>
          <p className="text-center text-xs text-stone-400">
            アカウントをお持ちの方は{" "}
            <Link href="/login" className="text-primary hover:underline">ログイン</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
