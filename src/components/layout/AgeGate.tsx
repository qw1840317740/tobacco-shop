"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function AgeGate() {
  const t = useTranslations("ageGate");
  const tCommon = useTranslations("common");
  const [denied, setDenied] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "ja";

  const handleConfirm = () => {
    document.cookie = "age_verified=true; path=/; max-age=31536000; samesite=lax";
    // Full page reload to trigger middleware re-check with cookie
    window.location.href = `/${locale}`;
  };

  const handleDeny = () => {
    setDenied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-stone-950/90 via-stone-900/90 to-stone-950/95 backdrop-blur-md">
      <Card className="relative mx-4 max-w-lg overflow-hidden border-primary/30 bg-stone-900/95 p-8 text-center shadow-2xl">
        {/* Decorative border */}
        <div className="pointer-events-none absolute inset-0 rounded-lg border border-primary/20" />

        {/* Logo */}
        <div className="relative mb-6">
          <div className="inline-block rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <img
              src="/images/logo.png"
              alt="TABACOYA"
              className="h-14 w-auto object-contain"
            />
          </div>
          <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Warning icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
          <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>

        <h2 className="mb-2 font-heading text-xl font-semibold text-stone-100">
          {t("title")}
        </h2>

        <p className="mb-6 text-sm text-stone-400">
          {t("message")}
        </p>

        {denied ? (
          <div className="rounded-lg border border-red-800/30 bg-red-950/30 p-4">
            <p className="text-sm text-red-300">{t("denyMessage")}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={handleConfirm}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {t("confirm")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDeny}
                className="border-stone-600 text-stone-300 hover:bg-stone-800"
              >
                {t("deny")}
              </Button>
            </div>

            <p className="text-xs text-stone-500">
              {t("warning")}
            </p>

            {/* Legal declarations */}
            <div className="mt-4 rounded-lg border border-red-800/20 bg-red-950/20 p-3">
              <ul className="space-y-1 text-left text-xs text-red-300">
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-red-400">⚠</span>
                  {t("declaration1")}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-red-400">⚠</span>
                  {t("declaration2")}
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-red-400">⚠</span>
                  {t("declaration3")}
                </li>
              </ul>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
