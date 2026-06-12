"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth-store";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const t = useTranslations("auth");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error(t("fillEmailAndPassword"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        toast.success(t("loginSuccess"));
        router.push(`/${locale}`);
      } else {
        toast.error(data.error || t("loginFailed"));
      }
    } catch {
      toast.error(t("loginFailed"));
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
          <p className="mt-2 text-sm text-stone-400">{t("loginTitle")}</p>
          <div className="mx-auto mt-4 h-px w-16 bg-primary" />
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">{t("email")}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="email@example.com"
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">{t("password")}</label>
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
            {loading ? t("loggingIn") : t("loginButton")}
          </Button>
          <p className="text-center text-xs text-stone-400">
            {t("noAccount")}{" "}
            <Link href="/register" className="text-primary hover:underline">{t("registerTitle")}</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
