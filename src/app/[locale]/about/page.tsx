import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

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
        "TABACOYA（タバコ屋）は日本製たばこの専門オンラインショップ。2001年設立、500銘柄以上のプレミアムたばこを正規品として全国にお届けします。",
    },
    en: {
      title: "About Us",
      description:
        "TABACOYA is a specialty online shop for authentic Japanese cigarettes. Established in 2001, we deliver 500+ premium brands across Japan with guaranteed authenticity.",
    },
    zh: {
      title: "关于我们",
      description:
        "TABACOYA是日本制造香烟的专营网店。成立于2001年，以正品保证向全国配送500种以上的优质香烟。",
    },
  };
  const d = data[locale] ?? data.ja;
  return { title: d.title, description: d.description };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: t("breadcrumb") }]} />

      <h1 className="font-heading text-3xl font-bold text-stone-800">{t("title")}</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-600">
        <section className="rounded-2xl bg-stone-50 p-6">
          <h2 className="font-heading text-lg font-semibold text-stone-800">{t("specialtyTitle")}</h2>
          <p className="mt-3">{t("specialtyDesc")}</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">{t("missionTitle")}</h2>
          <p className="mt-3">{t("missionDesc")}</p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">{t("reasonsTitle")}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-medium text-stone-800">{t("reasonAuthentic")}</h3>
              <p className="mt-1 text-xs text-stone-500">{t("reasonAuthenticDesc")}</p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-medium text-stone-800">{t("reasonShipping")}</h3>
              <p className="mt-1 text-xs text-stone-500">{t("reasonShippingDesc")}</p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">🇯🇵</div>
              <h3 className="font-medium text-stone-800">{t("reasonJapanese")}</h3>
              <p className="mt-1 text-xs text-stone-500">{t("reasonJapaneseDesc")}</p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-medium text-stone-800">{t("reasonGuide")}</h3>
              <p className="mt-1 text-xs text-stone-500">{t("reasonGuideDesc")}</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">{t("companyTitle")}</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y">
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("companyStoreName")}</th><td className="px-4 py-3">TABACOYA（タバコ屋）</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("companyOperator")}</th><td className="px-4 py-3">TABACOYA 株式会社</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("companyAddress")}</th><td className="px-4 py-3">〒100-0001 東京都千代田区千代田1-1</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("companyEstablished")}</th><td className="px-4 py-3">2001</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("companyBusiness")}</th><td className="px-4 py-3">{t("specialtyTitle")}</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("companyEmail")}</th><td className="px-4 py-3">info@tabacoya.jp</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("companyPhone")}</th><td className="px-4 py-3">0120-XXX-XXX（平日 9:00〜18:00）</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">{t("legalTitle")}</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y">
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalSeller")}</th><td className="px-4 py-3">TABACOYA 株式会社</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalRepresentative")}</th><td className="px-4 py-3">山田 太郎</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalAddressLabel")}</th><td className="px-4 py-3">東京都千代田区千代田1-1</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalPhoneNumber")}</th><td className="px-4 py-3">0120-XXX-XXX</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalEmailLabel")}</th><td className="px-4 py-3">info@tabacoya.jp</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalUrl")}</th><td className="px-4 py-3">https://tabacoya.jp</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalPrice")}</th><td className="px-4 py-3">{t("legalPriceNote")}</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalExtraCost")}</th><td className="px-4 py-3">{t("legalExtraCostNote")}</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalPayment")}</th><td className="px-4 py-3">{t("legalPaymentNote")}</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalPaymentTiming")}</th><td className="px-4 py-3">{t("legalPaymentTimingNote")}</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalDelivery")}</th><td className="px-4 py-3">{t("legalDeliveryNote")}</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">{t("legalReturns")}</th><td className="px-4 py-3">{t("legalReturnsNote")}</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-primary hover:underline">{t("backToHome")}</Link>
      </div>
    </div>
  );
}
