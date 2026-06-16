import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative overflow-hidden bg-[#0F0F0F] text-[#999]">
      <div className="relative mx-auto max-w-[1440px] px-6 py-16 pb-24 sm:px-10 sm:pb-16">
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
            <p className="mt-4 text-sm leading-relaxed text-[#999]">
              {t("companyInfo")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8A97E]">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{tNav("products")}</Link></li>
              <li><Link href="/guide" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{tNav("guide")}</Link></li>
              <li><Link href="/blog" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{tNav("blog")}</Link></li>
              <li><Link href="/about" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{tNav("about")}</Link></li>
              <li><Link href="/contact" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{tNav("contact")}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8A97E]">
              {t("customerService")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/legal/shipping" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{t("shippingPolicy")}</Link></li>
              <li><Link href="/legal/returns" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{t("returnPolicy")}</Link></li>
              <li><Link href="/legal/age-verification" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{t("agePolicy")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#C8A97E]">
              {t("legal")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/legal/privacy" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{t("privacyPolicy")}</Link></li>
              <li><Link href="/legal/terms" className="text-[#aaa] transition-colors hover:text-[#C8A97E]">{t("termsOfService")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-[#2A2A2A] pt-8">
          <p className="text-xs text-[#777]">
            {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
