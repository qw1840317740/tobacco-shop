import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/routing";
import type { Metadata } from "next";
import { Tag, Truck, BookOpen } from "lucide-react";

const SITE_URL = "https://tabacoya.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data: Record<string, { title: string; description: string }> = {
    ja: {
      title: "当店について",
      description:
        "TABACOYA（タバコ屋）は日本製たばこの専門オンラインショップ。JTをはじめ国内メーカーの本物のたばこを正規品として全国にお届けします。",
    },
    en: {
      title: "About Us",
      description:
        "TABACOYA is a specialty online shop for authentic Japanese cigarettes. We deliver genuine, JT-sourced and domestically produced tobacco across Japan.",
    },
    zh: {
      title: "关于我们",
      description:
        "TABACOYA是日本制造香烟的专营网店。以正品保证向全国配送JT及国内品牌的真品香烟。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/about`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/about`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/about`,
      languages,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: t("breadcrumb") }]} />

      <h1 className="text-3xl font-bold text-[#1A1A1A]">{t("title")}</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#888888]">
        <section className="rounded-lg bg-[#F5F5F5] p-6">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{t("specialtyTitle")}</h2>
          <p className="mt-3">{t("specialtyDesc")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{t("missionTitle")}</h2>
          <p className="mt-3">{t("missionDesc")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{t("reasonsTitle")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-[#E5E5E5] p-5">
              <div className="mb-2">
                <Tag className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-[#1A1A1A]">{t("reasonAuthentic")}</h3>
              <p className="mt-1 text-xs text-[#888888]">{t("reasonAuthenticDesc")}</p>
            </div>
            <div className="rounded-lg border border-[#E5E5E5] p-5">
              <div className="mb-2">
                <Truck className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-[#1A1A1A]">{t("reasonShipping")}</h3>
              <p className="mt-1 text-xs text-[#888888]">{t("reasonShippingDesc")}</p>
            </div>
            <div className="rounded-lg border border-[#E5E5E5] p-5">
              <div className="mb-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm border-2 border-[#C8A97E] text-[9px] font-bold text-[#C8A97E]">JP</span>
              </div>
              <h3 className="font-medium text-[#1A1A1A]">{t("reasonJapanese")}</h3>
              <p className="mt-1 text-xs text-[#888888]">{t("reasonJapaneseDesc")}</p>
            </div>
            <div className="rounded-lg border border-[#E5E5E5] p-5">
              <div className="mb-2">
                <BookOpen className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />
              </div>
              <h3 className="font-medium text-[#1A1A1A]">{t("reasonGuide")}</h3>
              <p className="mt-1 text-xs text-[#888888]">{t("reasonGuideDesc")}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{t("companyTitle")}</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y">
                <tr><th className="w-32 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("companyStoreName")}</th><td className="px-4 py-3">TABACOYA（タバコ屋）</td></tr>
                <tr><th className="w-32 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("companyOperator")}</th><td className="px-4 py-3">開成産業合同会社</td></tr>
                <tr><th className="w-32 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("companyAddress")}</th><td className="px-4 py-3">〒354-0015 埼玉県富士見市東みずほ台2-4-16 1F</td></tr>
                <tr><th className="w-32 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("companyEstablished")}</th><td className="px-4 py-3">平成29年7月11日</td></tr>
                <tr><th className="w-32 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("companyBusiness")}</th><td className="px-4 py-3">{t("specialtyTitle")}</td></tr>
                <tr><th className="w-32 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("companyEmail")}</th><td className="px-4 py-3">kaiseisg@kaiseisg.com</td></tr>
                <tr><th className="w-32 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("companyPhone")}</th><td className="px-4 py-3">049-257-4332（平日 9:00〜18:00）</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">{t("legalTitle")}</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y">
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalSeller")}</th><td className="px-4 py-3">開成産業合同会社</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalRepresentative")}</th><td className="px-4 py-3">[代表者名]<span className="ml-2 text-[10px] text-[#999]">（※本稼働時に正式な情報を記載します）</span></td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalAddressLabel")}</th><td className="px-4 py-3">〒354-0015 埼玉県富士見市東みずほ台2-4-16 1F</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalPhoneNumber")}</th><td className="px-4 py-3">049-257-4332</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalEmailLabel")}</th><td className="px-4 py-3">kaiseisg@kaiseisg.com</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalUrl")}</th><td className="px-4 py-3">https://tabacoya.jp</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalPrice")}</th><td className="px-4 py-3">{t("legalPriceNote")}</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalExtraCost")}</th><td className="px-4 py-3">{t("legalExtraCostNote")}</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalPayment")}</th><td className="px-4 py-3">{t("legalPaymentNote")}</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalPaymentTiming")}</th><td className="px-4 py-3">{t("legalPaymentTimingNote")}</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalDelivery")}</th><td className="px-4 py-3">{t("legalDeliveryNote")}</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalReturns")}</th><td className="px-4 py-3">{t("legalReturnsNote")}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-[#C8A97E] hover:underline">{t("backToHome")}</Link>
      </div>
    </div>
  );
}
