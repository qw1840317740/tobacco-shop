import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");

  return (
    <footer className="relative overflow-hidden bg-stone-950 text-stone-300">
      {/* Top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

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
            <p className="mt-4 text-sm leading-relaxed text-stone-500">
              {t("companyInfo")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              {t("quickLinks")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/products" className="text-stone-500 transition-colors hover:text-primary">{tNav("products")}</Link></li>
              <li><Link href="/guide" className="text-stone-500 transition-colors hover:text-primary">{tNav("guide")}</Link></li>
              <li><Link href="/blog" className="text-stone-500 transition-colors hover:text-primary">{tNav("blog")}</Link></li>
              <li><Link href="/about" className="text-stone-500 transition-colors hover:text-primary">{tNav("about")}</Link></li>
              <li><Link href="/contact" className="text-stone-500 transition-colors hover:text-primary">{tNav("contact")}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              {t("customerService")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/legal/shipping" className="text-stone-500 transition-colors hover:text-primary">{t("shippingPolicy")}</Link></li>
              <li><Link href="/legal/returns" className="text-stone-500 transition-colors hover:text-primary">{t("returnPolicy")}</Link></li>
              <li><Link href="/legal/age-verification" className="text-stone-500 transition-colors hover:text-primary">{t("agePolicy")}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              {t("legal")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/legal/privacy" className="text-stone-500 transition-colors hover:text-primary">{t("privacyPolicy")}</Link></li>
              <li><Link href="/legal/terms" className="text-stone-500 transition-colors hover:text-primary">{t("termsOfService")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-white/5 pt-8">
          <p className="text-xs text-stone-600">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
