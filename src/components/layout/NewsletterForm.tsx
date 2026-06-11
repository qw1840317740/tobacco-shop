"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslations("newsletter");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError(t("invalidEmail"));
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
    return (
      <p className="mt-5 text-sm text-green-200">{t("successMessage")}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-5 flex max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        placeholder={t("placeholder")}
        required
        className="flex-1 rounded-xl bg-white/10 px-5 py-2.5 text-sm text-white placeholder-red-200/50 backdrop-blur-sm border border-white/20 transition-all focus:border-white/40 focus:bg-white/15 focus:outline-none focus:ring-0"
      />
      <Button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-stone-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xl shadow-stone-900/50 hover:bg-stone-800 disabled:opacity-50"
      >
        {loading ? t("submitting") : t("submit")}
      </Button>
      {error && <p className="text-xs text-red-200 sm:col-span-2">{error}</p>}
    </form>
  );
}
