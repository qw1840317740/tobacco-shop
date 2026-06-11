import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "返品ポリシー",
  description:
    "TABACOYAの返品ポリシー。商品不良・誤配送の場合の返品・交換手続き、返金方法についてご説明します。",
};

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "返品ポリシー" }]} />

      <h1 className="font-heading text-3xl font-bold text-stone-800">返品ポリシー</h1>
      <p className="mt-2 text-sm text-stone-400">最終更新日：2026年6月1日</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-600">
        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">返品・交換について</h2>
          <div className="mt-3 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
            <p className="font-medium text-stone-700">
              たばこ製品の性質上、お客様都合による返品・交換はお受けできません。あらかじめご了承ください。
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">返品対応の条件</h2>
          <p className="mt-3">以下の場合に限り、返品・交換を承ります。</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-stone-700">ご注文と異なる商品が届いた場合</span>
              <br />ご注文内容と異なる商品がお手元に届いた場合は、商品到着後7日以内にご連絡ください。
            </li>
            <li>
              <span className="font-medium text-stone-700">商品に破損・欠陥があった場合</span>
              <br />パッケージに著しい損傷がある、商品に不具合がある場合は、商品到着後7日以内にご連絡ください。
            </li>
            <li>
              <span className="font-medium text-stone-700">配送中の事故により商品が損傷した場合</span>
              <br />配送中の事故が疑われる場合は、商品をお受け取りの際に配送員にお申し出ください。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">返品手続きの流れ</h2>
          <div className="mt-3 space-y-4">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">1</div>
              <div>
                <p className="font-medium text-stone-700">お問い合わせ</p>
                <p className="mt-1 text-stone-500">お問い合わせフォームより、返品理由・注文番号・写真（破損の場合）をお送りください。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">2</div>
              <div>
                <p className="font-medium text-stone-700">確認・返品指示</p>
                <p className="mt-1 text-stone-500">内容を確認の上、返送先住所および着払い伝票の情報をお伝えします。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">3</div>
              <div>
                <p className="font-medium text-stone-700">返送</p>
                <p className="mt-1 text-stone-500">商品を元の状態に近い形で梱包し、指定の住所へ着払いでご返送ください。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">4</div>
              <div>
                <p className="font-medium text-stone-700">返金・交換</p>
                <p className="mt-1 text-stone-500">返送品の確認後、5営業日以内に返金または交換品の発送を行います。返金はご注文時の決済方法にて行います。</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">返品の期限</h2>
          <p className="mt-3">
            返品のお申し出は、商品到着後<strong className="text-stone-700">7日以内</strong>にお願いいたします。7日を過ぎた場合、返品・交換に応じられない場合があります。
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">返金について</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>返金はご注文時と同じ決済方法にて行います。</li>
            <li>クレジットカード決済の場合、返金処理から反映まで1〜2ヶ月かかる場合があります。</li>
            <li>銀行振込の場合、指定の口座へ振込みます（振込手数料は当店負担）。</li>
            <li>送料は当店負担にて対応いたします。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">お問い合わせ</h2>
          <div className="mt-3 rounded-lg bg-stone-50 p-4 text-stone-700">
            <p>タバコ屋 カスタマーサポート</p>
            <p>メール：support@tabacoya.jp</p>
            <p>電話：0120-XXX-XXX（平日 9:00〜18:00）</p>
          </div>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-primary hover:underline">← ホームに戻る</Link>
      </div>
    </div>
  );
}
