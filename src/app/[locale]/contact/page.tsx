import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "お問い合わせ" }]} />

      <h1 className="font-heading text-3xl font-bold text-stone-800">お問い合わせ</h1>
      <p className="mt-2 text-stone-500">ご質問・ご要望は以下のフォームよりお気軽にどうぞ。</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Contact Form */}
        <Card className="lg:col-span-3 p-6">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>お名前 *</Label>
                <Input placeholder="山田太郎" className="mt-1" />
              </div>
              <div>
                <Label>メールアドレス *</Label>
                <Input type="email" placeholder="email@example.com" className="mt-1" />
              </div>
            </div>
            <div>
              <Label>お問い合わせ種類</Label>
              <select className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm">
                <option>商品について</option>
                <option>ご注文について</option>
                <option>配送について</option>
                <option>返品・交換について</option>
                <option>年齢確認について</option>
                <option>その他</option>
              </select>
            </div>
            <div>
              <Label>ご注文番号（該当する場合）</Label>
              <Input placeholder="ORD-2026-XXX" className="mt-1" />
            </div>
            <div>
              <Label>お問い合わせ内容 *</Label>
              <textarea
                rows={6}
                placeholder="お問い合わせ内容をご記入ください"
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Button className="w-full bg-primary text-white hover:bg-primary/90">
              送信する
            </Button>
          </div>
        </Card>

        {/* Contact Info */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">電話でのお問い合わせ</h3>
            <p className="mt-3 text-2xl font-bold text-stone-800">0120-XXX-XXX</p>
            <p className="mt-1 text-xs text-stone-500">平日 9:00〜18:00</p>
          </Card>
          <Card className="p-5">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">メールでのお問い合わせ</h3>
            <p className="mt-3 text-sm font-medium text-stone-800">support@tabacoya.jp</p>
            <p className="mt-1 text-xs text-stone-500">24時間受付 / 返信は営業日内</p>
          </Card>
          <Card className="p-5">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-primary">よくあるご質問</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="text-stone-600">
                <span className="font-medium">Q. 配送には何日かかりますか？</span><br />
                <span className="text-stone-500">A. ご注文後2〜5営業日でお届けします。</span>
              </li>
              <li className="text-stone-600">
                <span className="font-medium">Q. 返品はできますか？</span><br />
                <span className="text-stone-500">A. 商品不良・誤配送の場合のみ承ります。</span>
              </li>
              <li className="text-stone-600">
                <span className="font-medium">Q. 海外への発送は可能ですか？</span><br />
                <span className="text-stone-500">A. 申し訳ありませんが、国内のみとなります。</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-primary hover:underline">← ホームに戻る</Link>
      </div>
    </div>
  );
}
