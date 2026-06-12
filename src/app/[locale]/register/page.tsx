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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const t = useTranslations("auth");

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error(t("fillAllFields"));
      return;
    }
    // Email format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error(t("invalidEmailFormat"));
      return;
    }
    if (name.trim().length < 2) {
      toast.error(t("nameTooShort"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("passwordTooShort"));
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error(t("passwordNeedsAlphaNum"));
      return;
    }
    if (password !== confirmPassword) {
      toast.error(t("passwordMismatch"));
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
        toast.success(t("registerSuccess"));
        router.push(`/${locale}`);
      } else {
        toast.error(data.error || t("registerFailed"));
      }
    } catch {
      toast.error(t("registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F0F0F] px-6 py-8 text-center">
          <div className="inline-block rounded-lg bg-white/10 p-2.5">
            <img src="/images/logo.png" alt="TABACOYA" className="h-10 w-auto object-contain" />
          </div>
          <p className="mt-2 text-sm text-[#888888]">{t("registerTitle")}</p>
          <div className="mx-auto mt-4 h-px w-16 bg-[#C8A97E]" />
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#888888]">{t("name")}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#888888]">{t("email")}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#888888]">{t("password")}</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#888888]">{t("confirmPassword")}</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              placeholder={t("confirmPasswordPlaceholder")}
            />
          </div>
          <Button
            className="w-full bg-[#1A1A1A] text-white hover:bg-[#333]"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? t("registering") : t("registerButton")}
          </Button>
          <p className="text-center text-xs text-[#888888]">
            {t("hasAccount")}{" "}
            <Link href="/login" className="text-[#C8A97E] hover:underline">{t("loginTitle")}</Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
