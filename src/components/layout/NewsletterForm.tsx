"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const t = useTranslations("newsletter");
  const locale = useLocale();

  const consentLabel =
    locale === "en"
      ? "I agree to the "
      : locale === "zh"
        ? "我同意 "
        : "個人情報の取扱いに";

  const consentTail =
    locale === "en"
      ? " privacy policy"
      : locale === "zh"
        ? "隐私政策"
        : "同意する";

  const privacyLabel =
    locale === "en" ? "privacy policy" : locale === "zh" ? "隐私政策" : "プライバシーポリシー";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError(t("invalidEmail"));
      return;
    }
    if (!agreed) {
      setError(
        locale === "en"
          ? "Please accept the privacy policy to subscribe."
          : locale === "zh"
            ? "请同意隐私政策后再订阅。"
            : "プライバシーポリシーにご同意ください。"
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("subscribeError"));
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("subscribeError"));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return <p className="mt-5 text-sm text-[#C8A97E]">{t("successMessage")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-5 max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder={t("placeholder")}
          required
          className="flex-1 rounded-lg border border-[#2A2A2A] bg-transparent px-5 py-2.5 text-sm text-white placeholder:text-[#999] transition-all focus:border-[#C8A97E] focus:outline-none focus:ring-0"
        />
        <Button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#C8A97E] px-6 py-2.5 text-sm font-semibold text-white uppercase tracking-wider hover:bg-[#B8956A] disabled:opacity-50"
        >
          {loading ? t("submitting") : t("submit")}
        </Button>
      </div>

      <label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[#999]">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => { setAgreed(e.target.checked); setError(""); }}
          className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#C8A97E]"
        />
        <span>
          {consentLabel}
          <Link href="/legal/privacy" className="text-[#C8A97E] hover:underline">{privacyLabel}</Link>
          {consentTail}
        </span>
      </label>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </form>
  );
}
