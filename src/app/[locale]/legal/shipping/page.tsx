import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { routing } from "@/lib/routing";
import type { Metadata } from "next";

const SITE_URL = "https://tabacoya.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data: Record<string, { title: string; description: string }> = {
    ja: {
      title: "配送ポリシー",
      description:
        "TABACOYAの配送ポリシー。日本国内の送料、お届け日数、配送状況の確認についてご説明します。たばこ事業法第36条により、送料はご注文金額にかかわらず購入者負担となります。",
    },
    en: {
      title: "Shipping Policy",
      description:
        "TABACOYA shipping policy. Learn about domestic shipping fees, delivery times, and order tracking. Per Japan's Tobacco Business Act (Article 36), shipping fees are paid by the buyer regardless of order amount.",
    },
    zh: {
      title: "配送政策",
      description:
        "TABACOYA配送政策。了解日本国内运费、送达时间和配送状态确认。根据日本《烟草事业法》第36条，运费由购买者承担，不因订单金额免除。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/legal/shipping`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/legal/shipping`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/legal/shipping`,
      languages,
    },
  };
}

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "配送ポリシー" }]} />

      <h1 className="text-3xl font-bold text-[#1A1A1A]">配送ポリシー</h1>
      <p className="mt-2 text-sm text-[#888888]">最終更新日：2026年6月1日</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#888888]">
        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">配送先について</h2>
          <p className="mt-3">
            当店の配送は日本国内のみとさせていただいております。海外への配送は行っておりません。日本国内の法令により、たばこ製品の輸出には許可が必要となるため、ご理解ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">送料</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#333]">お届け先</th>
                  <th className="px-4 py-3 font-medium text-[#333]">送料</th>
                  <th className="px-4 py-3 font-medium text-[#333]">備考</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">北海道・九州・沖縄</td>
                  <td className="px-4 py-3">800円</td>
                  <td className="px-4 py-3 text-[#888888]">-</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">その他の地域</td>
                  <td className="px-4 py-3">600円</td>
                  <td className="px-4 py-3 text-[#888888]">-</td>
                </tr>
                <tr className="bg-[#F5F5F5]">
                  <td className="px-4 py-3 font-medium" colSpan={3}>
                    ※ たばこ事業法第36条により、送料はご注文金額にかかわらず購入者負担となります。ご注文1回ごとに上記送料が発生します。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">お届け日数</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-4 py-3 font-medium text-[#333]">配送方法</th>
                  <th className="px-4 py-3 font-medium text-[#333]">お届け目安</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3">佐川急便</td>
                  <td className="px-4 py-3">ご注文後 2〜4 営業日</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">日本郵便（ゆうパック）</td>
                  <td className="px-4 py-3">ご注文後 2〜5 営業日</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[#888888]">
            ※ 配送業者の都合・天候・交通事情により、お届けにお時間をいただく場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">配送状況の確認</h2>
          <p className="mt-3">
            ご注文の発送が完了しましたら、登録いただいたメールアドレス宛に「発送完了のお知らせ」をお送りします。メールに記載の追跡番号より、配送状況をご確認いただけます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">時間指定について</h2>
          <p className="mt-3">
            お届け時間帯のご指定が可能です。ご注文時にお選びください。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>午前中（8:00〜12:00）</li>
            <li>12:00〜14:00</li>
            <li>14:00〜16:00</li>
            <li>16:00〜18:00</li>
            <li>18:00〜20:00</li>
            <li>19:00〜21:00</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">受け取り時の注意</h2>
          <p className="mt-3">
            たばこ製品のお受け取りには、20歳以上であることの確認が伴います。配送員より年齢確認を求められた場合は、公的身分証明書をご提示ください。年齢確認ができない場合、お届けできないことがあります。保管期間を過ぎてもお受け取りいただけない場合、商品は当店に返送され、キャンセル扱いとなります。
          </p>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-[#C8A97E] hover:underline">← ホームに戻る</Link>
      </div>
    </div>
  );
}
