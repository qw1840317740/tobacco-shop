import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "店舗情報" }]} />

      <h1 className="font-heading text-3xl font-bold text-stone-800">タバコ屋について</h1>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-stone-600">
        <section className="rounded-2xl bg-stone-50 p-6">
          <h2 className="font-heading text-lg font-semibold text-stone-800">日本製たばこ専門店</h2>
          <p className="mt-3">
            タバコ屋は、日本国内の全メーカーの紙巻たばこを取り扱うオンライン専門店です。日本たばこ産業（JT）をはじめ、国内で製造される500銘柄以上のたばこを厳選し、全国にお届けいたします。
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">当店の使命</h2>
          <p className="mt-3">
            日本のたばこは、世界でも類を見ない品質管理と製造技術によって作られています。当店は、この日本のたばこ文化を全国の愛好家にお届けすることを使命としています。定番のロングセラーブランドから、季節限定のフレーバーまで、多彩な商品をラインナップしています。
          </p>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">当店が選ばれる理由</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">🏷️</div>
              <h3 className="font-medium text-stone-800">正規品保証</h3>
              <p className="mt-1 text-xs text-stone-500">すべての商品は正規ルートから仕入れた100%本物です。</p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-medium text-stone-800">迅速配送</h3>
              <p className="mt-1 text-xs text-stone-500">ご注文後、最短2日でお届け。5,000円以上で送料無料。</p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">🇯🇵</div>
              <h3 className="font-medium text-stone-800">日本製に特化</h3>
              <p className="mt-1 text-xs text-stone-500">国内の全メーカー・全銘柄を網羅。日本国内のみ取扱い。</p>
            </div>
            <div className="rounded-xl border p-5">
              <div className="text-2xl mb-2">📖</div>
              <h3 className="font-medium text-stone-800">専門ガイド</h3>
              <p className="mt-1 text-xs text-stone-500">初心者の方にも安心の、濃さ・味わいガイドをご用意。</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">会社概要</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y">
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">店名</th><td className="px-4 py-3">タバコ屋</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">運営</th><td className="px-4 py-3">TABACOYA 株式会社</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">所在地</th><td className="px-4 py-3">〒100-0001 東京都千代田区千代田1-1</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">設立</th><td className="px-4 py-3">2001年</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">事業内容</th><td className="px-4 py-3">日本製たばこのオンライン販売</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">メール</th><td className="px-4 py-3">info@tabacoya.jp</td></tr>
                <tr><th className="w-32 bg-stone-50 px-4 py-3 font-medium text-stone-700">電話</th><td className="px-4 py-3">0120-XXX-XXX（平日 9:00〜18:00）</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-heading text-lg font-semibold text-stone-800">特定商取引法に基づく表記</h2>
          <div className="mt-3 overflow-hidden rounded-lg border">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y">
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">販売業者</th><td className="px-4 py-3">TABACOYA 株式会社</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">代表者</th><td className="px-4 py-3">山田 太郎</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">所在地</th><td className="px-4 py-3">東京都千代田区千代田1-1</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">電話番号</th><td className="px-4 py-3">0120-XXX-XXX</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">メール</th><td className="px-4 py-3">info@tabacoya.jp</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">URL</th><td className="px-4 py-3">https://tabacoya.jp</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">販売価格</th><td className="px-4 py-3">各商品ページに記載（税込）</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">販売価格以外の費用</th><td className="px-4 py-3">送料（全国600円〜、5,000円以上で無料）</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">お支払い方法</th><td className="px-4 py-3">クレジットカード / 代金引換 / 銀行振込</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">お支払い時期</th><td className="px-4 py-3">ご注文確定時（銀行振込の場合は7日以内）</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">引き渡し時期</th><td className="px-4 py-3">ご注文後3〜5営業日以内</td></tr>
                <tr><th className="w-40 bg-stone-50 px-4 py-3 font-medium text-stone-700">返品について</th><td className="px-4 py-3">商品不良・誤配送に限り7日以内対応</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-primary hover:underline">← ホームに戻る</Link>
      </div>
    </div>
  );
}
