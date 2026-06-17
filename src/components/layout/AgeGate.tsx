"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function AgeGate() {
  const t = useTranslations("ageGate");
  const tCommon = useTranslations("common");
  const [denied, setDenied] = useState(false);
  const params = useParams();
  const locale = (params?.locale as string) || "ja";

  const handleConfirm = () => {
    // Session cookie — no max-age means it expires when browser closes
    document.cookie = "age_verified=true; path=/; samesite=lax";
    window.location.href = `/${locale}`;
  };

  const handleDeny = () => {
    setDenied(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0F0F]/95 backdrop-blur-md">
      <Card className="relative mx-4 max-w-lg overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A] p-8 text-center shadow-2xl">
        {/* Logo */}
        <div className="relative mb-6">
          <div className="inline-block rounded-xl bg-white/10 p-3">
            <img
              src="/images/logo.png"
              alt="TABACOYA"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        {/* Warning icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#C8A97E]/40 bg-[#C8A97E]/10">
          <AlertTriangle className="h-8 w-8 text-[#C8A97E]" strokeWidth={1.5} />
        </div>

        <h2 className="mb-2 text-xl font-bold text-white">
          {t("title")}
        </h2>

        <p className="mb-6 text-sm text-[#bbb]">
          {t("message")}
        </p>

        {denied ? (
          <div className="rounded-lg border border-[#3A2A2A] bg-[#2A1A1A] p-4">
            <p className="text-sm text-[#e8b4b4]">{t("denyMessage")}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={handleConfirm}
                className="h-12 bg-[#C8A97E] text-[#0F0F0F] font-semibold hover:bg-[#B8956A]"
              >
                {t("confirm")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDeny}
                className="h-12 border-[#3A3A3A] bg-[#0F0F0F] text-[#ddd] hover:bg-[#2A2A2A] hover:text-white"
              >
                {t("deny")}
              </Button>
            </div>

            <p className="text-xs text-[#999]">
              {t("warning")}
            </p>

            {/* Legal declarations */}
            <div className="mt-4 rounded-lg border border-[#3A3220] bg-[#2A2418] p-3">
              <ul className="space-y-1 text-left text-xs text-[#d8c9a8]">
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A97E]" strokeWidth={1.5} />
                  {t("declaration1")}
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A97E]" strokeWidth={1.5} />
                  {t("declaration2")}
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#C8A97E]" strokeWidth={1.5} />
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
