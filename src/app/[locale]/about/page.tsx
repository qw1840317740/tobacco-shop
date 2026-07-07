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

          {/* Basic operator info table — required fields per 特定商取引法 */}
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y">
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalSeller")}</th><td className="px-4 py-3">開成産業合同会社</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalRepresentative")}</th><td className="px-4 py-3">[代表者名]<span className="ml-2 text-[10px] text-[#999]">（※本稼働時に正式な情報を記載します）</span></td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalAddressLabel")}</th><td className="px-4 py-3">〒354-0015 埼玉県富士見市東みずほ台2-4-16 1F</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalPhoneNumber")}</th><td className="px-4 py-3">049-257-4332</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalEmailLabel")}</th><td className="px-4 py-3">kaiseisg@kaiseisg.com</td></tr>
                <tr><th className="w-40 bg-[#F5F5F5] px-4 py-3 font-medium text-[#1A1A1A]">{t("legalUrl")}</th><td className="px-4 py-3">https://tabacoya.jp</td></tr>
              </tbody>
            </table>
          </div>

          {/* Detailed 特定商取引法 8-section block */}
          <div className="mt-6 space-y-5 text-sm leading-relaxed text-[#333]">
            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">1. 商品代金以外の必要料金</h3>
              <p className="mt-2">商品代金とは別に、送料および決済に伴う各種手数料（代金引換の場合は代引手数料、銀行振込の場合は振込手数料）が必要となるほか、表示価格には消費税（10%）が含まれております。なお、たばこ事業法第36条の規定により、送料はご注文金額にかかわらず、すべてご購入者負担となります。</p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">2. 申し込み有効期限</h3>
              <p className="mt-2">ご注文確認メール送信後、原則として7日以内とさせていただきます。期限を過ぎてもご入金の確認が取れないご注文は、自動的にキャンセル扱いとなる場合がございます。</p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">3. 不良品・商品不具合について</h3>
              <p className="mt-2">商品到着時に不良・破損・ご注文との相違がございましたら、商品到着後すみやかに当店までご連絡ください。状況を確認のうえ、交換または返金にて対応いたします。なお、配送業者の過失による外装箱の破損等につきましては、直接配送業者へお問い合わせくださいますようお願いいたします。</p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">4. 販売数量の制限</h3>
              <p className="mt-2">特に数量制限は設けておりませんが、商品ページ上にて個別の購入上限を定めている場合がございます。</p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">5. 引き渡し時期</h3>
              <p className="mt-2">ご入金の確認が取れ次第（銀行振込の場合）、またはご注文確定後（代金引換の場合）、原則として4日以内に発送いたします。在庫切れにより発送が遅れる場合は、メール等にて事前にお知らせいたします。また、天候不順や配送業者の事情、その他やむを得ない理由によりお届けが遅れる場合がございます。</p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">6. お支払い方法・お支払い時期</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li><strong>銀行振込（前払い）</strong>：ご注文確定後7日以内に、当店指定の口座へお振込みください。期限を過ぎた場合は一旦キャンセル扱いとさせていただくことがございます。</li>
                <li><strong>代金引換</strong>：商品到着時に配達員へ代金をお支払いください。なお、代金引換をご利用の場合、たばこ事業法の規定により、配送はご購入者ご本人様の住所宛に限らせていただきます。</li>
              </ul>
            </section>

            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">7. 返品・交換について</h3>
              <p className="mt-2">たばこ製品の性質上、お客様都合による返品・交換はお受けいたしかねます。ご注文確定前に内容（銘柄・数量・配送先等）を十分にご確認のうえ、お間違えのないようご注文ください。商品に欠陥がある場合、またはご注文内容と異なる商品が届いた場合は、商品到着後7日以内にご連絡をいただければ、当店負担にて交換対応いたします。</p>
            </section>

            <section>
              <h3 className="text-base font-semibold text-[#1A1A1A]">8. ご注文のキャンセル・受取拒否について</h3>
              <p className="mt-2">商品発送後のキャンセル、代金引換での受取拒否、長期ご不在による返送等につきましては、当店所定の判断により「いたずら注文」または「購入意志のないご注文」として扱わせていただくことがございます。該当するご注文が繰り返し確認された場合、今後のご注文をお断りする、またはお支払い方法を銀行振込のみに限定させていただくことがございますので、予めご了承ください。</p>
            </section>
          </div>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-[#C8A97E] hover:underline">{t("backToHome")}</Link>
      </div>
    </div>
  );
}
