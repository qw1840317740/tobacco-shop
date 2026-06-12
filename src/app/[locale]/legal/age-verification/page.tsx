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
      title: "年齢確認ポリシー",
      description:
        "TABACOYAの年齢確認ポリシー。たばこ製品の販売における年齢確認の方法、身分証明書、20歳未満の購入禁止について説明しています。",
    },
    en: {
      title: "Age Verification Policy",
      description:
        "TABACOYA age verification policy. Learn about our age verification methods, accepted ID documents, and underage purchase prohibition.",
    },
    zh: {
      title: "年龄确认政策",
      description:
        "TABACOYA年龄确认政策。了解烟草制品销售中的年龄确认方法、身份证明文件以及禁止未满20岁购买的规定。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/legal/age-verification`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/legal/age-verification`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/legal/age-verification`,
      languages,
    },
  };
}

export default function AgeVerificationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: "年齢確認ポリシー" }]} />

      <h1 className="text-3xl font-bold text-[#1A1A1A]">年齢確認ポリシー</h1>
      <p className="mt-2 text-sm text-[#888888]">最終更新日：2026年6月1日</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#888888]">
        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">1. 年齢確認の重要性</h2>
          <p className="mt-3">
            タバコ屋は、たばこ事業法および未成年者喫煙禁止法を遵守し、20歳未満の方へのたばこ製品の販売を固くお断りしております。未成年者の喫煙は健康に極めて重大な悪影響を及ぼすことが科学的に証明されており、当店は適正な年齢確認を実施することを社会的責任と考えております。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">2. ウェブサイトでの年齢確認</h2>
          <p className="mt-3">
            本サイトにアクセスする際、年齢確認ゲートにより20歳以上であることの確認を行っております。「私は法定年齢です」ボタンをクリックすることで、お客様が20歳以上であることを自己申告されたものとみなします。
          </p>
          <div className="mt-3 rounded-lg border-l-4 border-[#C8A97E] bg-[#F5F5F5] p-4">
            <p className="font-medium text-[#333]">
              ⚠️ 20歳未満の方は、本サイトを直ちに離脱してください。年齢を詐称してたばこ製品を購入することは法律で禁止されています。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">3. ご注文時の年齢確認</h2>
          <p className="mt-3">ご注文時に以下の方法で年齢確認を実施いたします。</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>ご注文情報（生年月日）による年齢確認</li>
            <li>配送時の対面による年齢確認（公的身分証明書の提示をお願いする場合があります）</li>
            <li>代金引換の場合、配送員による年齢確認</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">4. 公的身分証明書</h2>
          <p className="mt-3">年齢確認の際、以下のいずれかの身分証明書をご提示いただく場合があります。</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>運転免許証</li>
            <li>パスポート</li>
            <li>個人番号カード（マイナンバーカード）</li>
            <li>在留カード</li>
            <li>住民基本台帳カード（写真付き）</li>
          </ul>
          <p className="mt-3">
            提示いただいた身分証明書の情報は年齢確認の目的以外には使用せず、確認後は速やかに破棄いたします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">5. 年齢詐称について</h2>
          <p className="mt-3">
            年齢を詐称してたばこ製品を購入することは法律で禁止されています。20歳未満の方が年齢を詐称してご注文されたことが発覚した場合、直ちにご注文をキャンセルし、今後のご利用をお断りいたします。また、必要に応じて法的措置を講じる場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">6. 保護者の皆様へ</h2>
          <p className="mt-3">
            保護者の皆様には、未成年者の喫煙を防止するための以下の取り組みにご協力をお願いいたします。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>たばこ製品を未成年者の手の届かない場所に保管する</li>
            <li>未成年者によるオンラインでのたばこ購入に注意する</li>
            <li>喫煙の健康被害について家庭内で話し合う</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-[#1A1A1A]">7. お問い合わせ</h2>
          <div className="mt-3 rounded-lg bg-[#F5F5F5] p-4 text-[#333]">
            <p>タバコ屋 カスタマーサポート</p>
            <p>メール：age-check@tabacoya.jp</p>
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
