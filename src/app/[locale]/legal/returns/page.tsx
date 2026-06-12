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
      title: "返品ポリシー",
      description:
        "TABACOYAの返品ポリシー。商品不良・誤配送の場合の返品・交換手続き、返金方法についてご説明します。",
    },
    en: {
      title: "Return Policy",
      description:
        "TABACOYA return policy. Learn about return and exchange procedures for defective or incorrectly shipped items, and refund methods.",
    },
    zh: {
      title: "退货政策",
      description:
        "TABACOYA退货政策。了解商品不良或发错货时的退货、交换手续和退款方法。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/legal/returns`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/legal/returns`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/legal/returns`,
      languages,
    },
  };
}

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "返品ポリシー" }]} />

      <h1 className="text-3xl font-bold text-[#1A1A1A]">返品ポリシー</h1>
      <p className="mt-2 text-sm text-[#888888]">最終更新日：2026年6月1日</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#888888]">
        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">返品・交換について</h2>
          <div className="mt-3 rounded-lg border-l-4 border-[#C8A97E] bg-[#F5F5F5] p-4">
            <p className="font-medium text-[#333]">
              たばこ製品の性質上、お客様都合による返品・交換はお受けできません。あらかじめご了承ください。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">返品対応の条件</h2>
          <p className="mt-3">以下の場合に限り、返品・交換を承ります。</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-[#333]">ご注文と異なる商品が届いた場合</span>
              <br />ご注文内容と異なる商品がお手元に届いた場合は、商品到着後7日以内にご連絡ください。
            </li>
            <li>
              <span className="font-medium text-[#333]">商品に破損・欠陥があった場合</span>
              <br />パッケージに著しい損傷がある、商品に不具合がある場合は、商品到着後7日以内にご連絡ください。
            </li>
            <li>
              <span className="font-medium text-[#333]">配送中の事故により商品が損傷した場合</span>
              <br />配送中の事故が疑われる場合は、商品をお受け取りの際に配送員にお申し出ください。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">返品手続きの流れ</h2>
          <div className="mt-3 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-bold text-white">1</div>
              <div>
                <p className="font-medium text-[#333]">お問い合わせ</p>
                <p className="mt-1 text-[#888888]">お問い合わせフォームより、返品理由・注文番号・写真（破損の場合）をお送りください。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-bold text-white">2</div>
              <div>
                <p className="font-medium text-[#333]">確認・返品指示</p>
                <p className="mt-1 text-[#888888]">内容を確認の上、返送先住所および着払い伝票の情報をお伝えします。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-bold text-white">3</div>
              <div>
                <p className="font-medium text-[#333]">返送</p>
                <p className="mt-1 text-[#888888]">商品を元の状態に近い形で梱包し、指定の住所へ着払いでご返送ください。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-sm font-bold text-white">4</div>
              <div>
                <p className="font-medium text-[#333]">返金・交換</p>
                <p className="mt-1 text-[#888888]">返送品の確認後、5営業日以内に返金または交換品の発送を行います。返金はご注文時の決済方法にて行います。</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">返品の期限</h2>
          <p className="mt-3">
            返品のお申し出は、商品到着後<strong className="text-[#333]">7日以内</strong>にお願いいたします。7日を過ぎた場合、返品・交換に応じられない場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">返金について</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>返金はご注文時と同じ決済方法にて行います。</li>
            <li>クレジットカード決済の場合、返金処理から反映まで1〜2ヶ月かかる場合があります。</li>
            <li>銀行振込の場合、指定の口座へ振込みます（振込手数料は当店負担）。</li>
            <li>送料は当店負担にて対応いたします。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">お問い合わせ</h2>
          <div className="mt-3 rounded-lg bg-[#F5F5F5] p-4 text-[#333]">
            <p>タバコ屋 カスタマーサポート</p>
            <p>メール：support@tabacoya.jp</p>
            <p>電話：0120-XXX-XXX（平日 9:00〜18:00）</p>
          </div>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-[#C8A97E] hover:underline">← ホームに戻る</Link>
      </div>
    </div>
  );
}
