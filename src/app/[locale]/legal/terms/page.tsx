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
      title: "利用規約",
      description:
        "TABACOYAの利用規約。たばこ製品のオンライン販売に関するご利用条件、年齢確認、支払い、配送、返品について定めています。",
    },
    en: {
      title: "Terms of Service",
      description:
        "TABACOYA terms of service. Usage conditions for online tobacco sales, including age verification, payment, shipping, and returns.",
    },
    zh: {
      title: "使用条款",
      description:
        "TABACOYA使用条款。关于烟草制品在线销售的使用条件、年龄确认、付款、配送和退货的规定。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/legal/terms`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/legal/terms`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/legal/terms`,
      languages,
    },
  };
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "利用規約" }]} />

      <h1 className="text-3xl font-bold text-[#1A1A1A]">利用規約</h1>
      <p className="mt-2 text-sm text-[#888888]">最終更新日：2026年6月1日</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#888888]">
        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第1条（総則）</h2>
          <p className="mt-3">
            本利用規約（以下「本規約」）は、タバコ屋（以下「当店」）が運営するオンラインショップ（以下「本サイト」）の利用条件を定めるものです。本サイトをご利用いただく前に、本規約を必ずお読みください。本サイトを利用された場合、本規約に同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第2条（年齢確認）</h2>
          <p className="mt-3">
            本サイトはたばこ製品を取り扱うため、20歳未満の方はご利用いただけません。ご注文時に年齢確認を行います。日本国内の法令に基づき、20歳未満の方へのたばこ製品の販売は固くお断りいたします。ご注文の際、お客様が法定喫煙年齢以上であることを確認できる公的身分証明書の提示をお願いする場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第3条（ご注文について）</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>ご注文は24時間受け付けております。ただし、確認・発送の対応は営業日（平日）となります。</li>
            <li>商品の価格・仕様は予告なく変更される場合があります。</li>
            <li>在庫切れの場合、ご注文をキャンセルさせていただくことがあります。</li>
            <li>悪質なキャンセルや虚偽の注文が発覚した場合、今後のご注文をお断りする場合があります。</li>
            <li>一回のご注文につき、数量制限を設ける場合があります。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第4条（お支払い）</h2>
          <p className="mt-3">
            お支払いは以下の方法よりお選びいただけます。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>クレジットカード（Visa、Mastercard、JCB、AMEX）</li>
            <li>代金引換</li>
            <li>銀行振込（前払い）</li>
          </ul>
          <p className="mt-3">
            商品代金のほか、送料・消費税が別途かかります。クレジットカード決済はSSL暗号化通信により安全に処理されます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第5条（配送）</h2>
          <p className="mt-3">
            ご注文確認後、原則として3〜5営業日以内に発送いたします。配送は日本国内に限定しております。配送業者の都合・天候・交通事情により、お届けにお時間をいただく場合があります。配送状況は注文確認メールの追跡番号よりご確認いただけます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第6条（返品・交換）</h2>
          <p className="mt-3">
            たばこ製品の性質上、お客様都合による返品・交換はお受けできません。ただし、以下の場合は返品対応いたします。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>ご注文と異なる商品が届いた場合</li>
            <li>商品に破損・欠陥があった場合</li>
            <li>配送中の事故により商品が損傷した場合</li>
          </ul>
          <p className="mt-3">
            上記の場合、商品到着後7日以内にお問い合わせフォームよりご連絡ください。着払いにて返送をお願いし、確認後、交換または返金対応いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第7条（禁止事項）</h2>
          <p className="mt-3">本サイトのご利用にあたり、以下の行為を禁止します。</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>20歳未満の方によるたばこ製品の購入</li>
            <li>転売を目的とした大量購入</li>
            <li>虚偽の情報によるご注文</li>
            <li>本サイトのシステムへの不正アクセス</li>
            <li>他のお客様や当店に不利益を与える行為</li>
            <li>自動購入ツール・ボットの使用</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第8条（免責事項）</h2>
          <p className="mt-3">
            当店は、本サイトの内容・商品情報の正確性について最善を尽くしますが、その完全性を保証するものではありません。本サイトの利用により発生した損害について、当店の故意または重大な過失による場合を除き、責任を負わないものとします。システムメンテナンスや不可抗力により、一時的にサービスを停止する場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第9条（規約の変更）</h2>
          <p className="mt-3">
            当店は、本規約を随時変更することができます。変更後の規約は本ページに掲載した時点で効力を生じます。重要な変更がある場合は、本サイト上でお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">第10条（準拠法・管轄）</h2>
          <p className="mt-3">
            本規約は日本法に準拠し、本規約に関する紛争は、当店の本店所在地を管轄する裁判所を専属的合意管轄裁判所とします。
          </p>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-[#C8A97E] hover:underline">← ホームに戻る</Link>
      </div>
    </div>
  );
}
