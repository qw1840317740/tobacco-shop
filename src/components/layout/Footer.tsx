import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative overflow-hidden bg-[#0F0F0F] text-stone-300">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="inline-block rounded-lg bg-white/10 p-2">
              <Image
                src="/images/logo.png"
                alt="TABACOYA"
                width={36}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#666]">
              {t("companyInfo")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#888]">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="text-[#666] transition-colors hover:text-[#C8A97E]">{tNav("products")}</Link></li>
              <li><Link href="/guide" className="text-[#666] transition-colors hover:text-[#C8A97E]">{tNav("guide")}</Link></li>
              <li><Link href="/blog" className="text-[#666] transition-colors hover:text-[#C8A97E]">{tNav("blog")}</Link></li>
              <li><Link href="/about" className="text-[#666] transition-colors hover:text-[#C8A97E]">{tNav("about")}</Link></li>
              <li><Link href="/contact" className="text-[#666] transition-colors hover:text-[#C8A97E]">{tNav("contact")}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#888]">
              {t("customerService")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/legal/shipping" className="text-[#666] transition-colors hover:text-[#C8A97E]">{t("shippingPolicy")}</Link></li>
              <li><Link href="/legal/returns" className="text-[#666] transition-colors hover:text-[#C8A97E]">{t("returnPolicy")}</Link></li>
              <li><Link href="/legal/age-verification" className="text-[#666] transition-colors hover:text-[#C8A97E]">{t("agePolicy")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#888]">
              {t("legal")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/legal/privacy" className="text-[#666] transition-colors hover:text-[#C8A97E]">{t("privacyPolicy")}</Link></li>
              <li><Link href="/legal/terms" className="text-[#666] transition-colors hover:text-[#C8A97E]">{t("termsOfService")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-[#2A2A2A] pt-8">
          <p className="text-xs text-[#444]">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
