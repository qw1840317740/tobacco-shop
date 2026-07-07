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
      title: "プライバシーポリシー",
      description:
        "TABACOYAのプライバシーポリシー。お客様の個人情報の取り扱い、Cookieの使用、お客様の権利についてご説明します。",
    },
    en: {
      title: "Privacy Policy",
      description:
        "TABACOYA privacy policy. Learn how we handle your personal information, cookies, and your rights.",
    },
    zh: {
      title: "隐私政策",
      description:
        "TABACOYA隐私政策。了解我们如何处理您的个人信息、Cookie的使用以及您的权利。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/legal/privacy`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/legal/privacy`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/legal/privacy`,
      languages,
    },
  };
}

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "プライバシーポリシー" }]} />

      <h1 className="text-3xl font-bold text-[#1A1A1A]">プライバシーポリシー</h1>
      <p className="mt-2 text-sm text-[#888888]">最終更新日：2026年6月1日</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#888888]">
        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">1. お客様の個人情報の取り扱いについて</h2>
          <p className="mt-3">
            タバコ屋（以下「当店」）は、お客様の個人情報（氏名、住所、電話番号、メールアドレス、生年月日、購入履歴など）を適切に管理し、以下の目的で利用いたします。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>ご注文の確認・発送・配送</li>
            <li>年齢確認のための本人確認</li>
            <li>お支払いの処理</li>
            <li>お問い合わせへの対応</li>
            <li>新商品やセール情報のお知らせ（お客様の同意がある場合）</li>
            <li>サービス改善のための統計分析</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">2. 個人情報の提供先</h2>
          <p className="mt-3">
            当店は、お客様の個人情報を以下の場合を除き、第三者に開示・提供することはありません。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>ご注文の配送を委託する配送業者に対して（住所・氏名・電話番号）</li>
            <li>お支払い処理を委託する決済代行業者に対して</li>
            <li>法令に基づく要請があった場合</li>
            <li>お客様の事前の同意があった場合</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">3. 個人情報の管理</h2>
          <p className="mt-3">
            当店は、お客様の個人情報を正確かつ最新の状態に保ち、不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、適切な安全管理措置を講じます。SSL暗号化通信を用いて、お客様の情報を安全に送受信いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">3-2. 年齢確認のための公定証明書の取り扱い</h2>
          <p className="mt-3">
            20歳未満の方へのたばこ販売を防ぐため、たばこ事業法および関係法令に基づき、ご本人様の公定証明書（運転免許証、健康保険証、マイナンバーカード、パスポート等）のご提出をお願いしております。お預かりした公定証明書画像は、以下のとおり厳格に管理いたします。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li><strong>取得目的</strong>：法定喫煙年齢（20歳以上）であることの確認、および本人性の確認に限定して利用いたします。マーケティングやその他の目的には一切使用いたしません。</li>
            <li><strong>保管方法</strong>：画像データはSSL/TLS暗号化通信で送信し、サーバー側ではAES-256等の業界標準の暗号化方式により保管いたします。プレーン（平文）での保管はいたしません。</li>
            <li><strong>アクセス制限</strong>：保管された画像データへアクセスできるのは、当店所定の年齢確認担当者のみです。アクセスには操作ログを取得し、不正閲覧がないかを定期的に監査いたします。</li>
            <li><strong>共有・第三者提供</strong>：法令に基づく場合（捜査機関からの令状に基づく要請等）を除き、ご本人様の同意なく第三者に提供することは一切ありません。配送委託先等の業務提携先にも一切共有いたしません。</li>
            <li><strong>保管期間</strong>：年齢確認完了後は、確認結果（成人である旨のフラグ）のみ保持し、証明書画像データは<strong>確認完了後30日以内に当社システムから完全削除</strong>いたします。法令で別段の保管義務が定められている場合のみ、その期間に限り保管いたします。</li>
            <li><strong>ご本人様のご請求</strong>：保管期間中にご本人様から削除のご請求があった場合は、ご本人様確認の上、遅滞なく削除いたします。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">4. Cookie（クッキー）の使用</h2>
          <p className="mt-3">
            当店のウェブサイトでは、サービス向上のためにCookieを使用することがあります。Cookieはお客様のブラウザに保存される小さなテキストファイルで、訪問回数や利用ページなどの情報を記録します。お客様はブラウザの設定によりCookieの使用を拒否することができますが、その場合一部のサービスがご利用いただけない場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">5. お客様の権利</h2>
          <p className="mt-3">
            お客様はご自身の個人情報について、以下の権利を有します。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>個人情報の開示請求</li>
            <li>個人情報の訂正・追加・削除</li>
            <li>個人情報の利用停止・消去</li>
            <li>第三者提供の停止</li>
          </ul>
          <p className="mt-3">
            上記に関するご要望は、お問い合わせフォームより承ります。本人確認を行った上で、速やかに対応いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">6. プライバシーポリシーの変更</h2>
          <p className="mt-3">
            当店は、法令の変更やサービスの改善に伴い、本プライバシーポリシーを変更することがあります。変更後のポリシーは本ページに掲載し、重要な変更がある場合は適切な方法でお客様にお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">7. お問い合わせ</h2>
          <p className="mt-3">
            プライバシーポリシーに関するご質問・ご要望は、以下までお問い合わせください。
          </p>
          <div className="mt-3 rounded-lg bg-[#F5F5F5] p-4 text-[#333]">
            <p>開成産業合同会社 カスタマーサポート</p>
            <p>メール：kaiseisg@kaiseisg.com</p>
            <p>電話：049-257-4332（平日 9:00〜18:00）</p>
          </div>
        </section>
      </div>

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-sm text-[#C8A97E] hover:underline">← ホームに戻る</Link>
      </div>
    </div>
  );
}
