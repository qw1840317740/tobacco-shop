import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/lib/routing";
import type { Metadata } from "next";
import { User, ShieldCheck, Search, ShoppingCart, Package, Landmark, Truck, ClipboardList } from "lucide-react";

const SITE_URL = "https://tabacoya.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data: Record<string, { title: string; description: string }> = {
    ja: {
      title: "ご利用ガイド｜お買い物の流れ",
      description:
        "TABACOYAのご利用方法をわかりやすくご案内。会員登録・年齢確認・商品の選び方・お支払い（銀行振込）・配送まで、はじめての方も安心のステップバイステップ。",
    },
    en: {
      title: "How to Shop | Purchase Guide",
      description:
        "A step-by-step guide to shopping on TABACOYA. From account registration and age verification to product selection, bank transfer payment, and delivery.",
    },
    zh: {
      title: "购物指南｜购买流程",
      description:
        "TABACOYA 使用方法分步指南。涵盖注册账号、年龄认证、选购商品、银行转账付款到配送的完整流程，新手也能轻松上手。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/guide`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/guide`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/guide`,
      languages,
    },
  };
}

type Step = {
  n: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
};

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // ---- Localized content ----
  const content = locale === "en"
    ? {
        hero: { title: "How to Shop", subtitle: "A simple step-by-step guide to ordering from TABACOYA." },
        cta: { register: "Create Account", products: "Browse Products", contact: "Contact Us" },
        steps: [
          { n: 1, icon: <User className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Create an Account", desc: "Register with your email and password. Your shipping address is saved for faster checkout next time." },
          { n: 2, icon: <ShieldCheck className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Age Verification", desc: "By law, you must be of legal smoking age. Upload an ID (driver's license, etc.) from your profile. We review it within 1 business day." },
          { n: 3, icon: <Search className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Find Your Product", desc: "Browse by brand or category, use the search bar, or open Quick View for details. Add items to your cart and choose quantity." },
          { n: 4, icon: <ShoppingCart className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Review Your Cart", desc: "Open the cart from the top-right icon. Adjust quantities or remove items. A flat shipping fee applies (paid by buyer, per tobacco law)." },
          { n: 5, icon: <Package className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Checkout", desc: "Enter your shipping address and select Bank Transfer as the payment method. Confirm your order summary and submit." },
          { n: 6, icon: <Landmark className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Bank Transfer Payment", desc: "After ordering, you'll receive our bank account details. Transfer the total within 7 days via ATM, bank counter, or online banking." },
          { n: 7, icon: <Truck className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Shipping", desc: "Once payment is confirmed, your order ships in 1–2 business days. Delivery takes 2–5 business days nationwide." },
          { n: 8, icon: <ClipboardList className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "Track Your Order", desc: "Check order status anytime from My Page > Orders. You'll see 'pending → paid → shipped → delivered'." },
        ],
        faqTitle: "Frequently Asked Questions",
        faq: [
          { q: "Can I order without registering?", a: "No. Registration and age verification are required by law to purchase tobacco products." },
          { q: "How long until my age is verified?", a: "Usually within 1 business day of uploading your ID. You'll be notified if additional info is needed." },
          { q: "What is the payment deadline?", a: "Please complete the bank transfer within 7 days of ordering. Unpaid orders are automatically cancelled after that." },
          { q: "When will my order ship?", a: "After your payment is confirmed. Typically ships within 1–2 business days, delivered in 2–5 business days." },
          { q: "Is shipping free?", a: "No. By Japanese tobacco law (Tobacco Business Act Article 36), shipping fees for tobacco products must be paid by the buyer regardless of order amount. A flat shipping fee is added to every order." },
          { q: "Can I cancel or change my order?", a: "Orders can be changed or cancelled before payment. Please contact us as soon as possible." },
        ],
      }
    : locale === "zh"
    ? {
        hero: { title: "购物指南", subtitle: "在 TABACOYA 下单的简单分步指南。" },
        cta: { register: "注册账号", products: "浏览商品", contact: "联系我们" },
        steps: [
          { n: 1, icon: <User className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "注册账号", desc: "用邮箱和密码注册。收货地址会保存，下次下单更快捷。" },
          { n: 2, icon: <ShieldCheck className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "年龄认证", desc: "依法律规定须达法定吸烟年龄。请在个人中心上传身份证件（驾照等），我们会在1个工作日内审核。" },
          { n: 3, icon: <Search className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "挑选商品", desc: "按品牌/分类浏览，用搜索栏查找，或点击「快速查看」看详情。加入购物车并选择数量。" },
          { n: 4, icon: <ShoppingCart className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "确认购物车", desc: "点右上角购物车图标。可调整数量或移除商品。每单均需支付固定运费（按烟草法律规定由购买者承担）。" },
          { n: 5, icon: <Package className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "提交订单", desc: "填写收货地址，选择银行转账付款。确认订单明细后提交。" },
          { n: 6, icon: <Landmark className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "银行转账", desc: "下单后会收到我们的收款账户。请在7天内通过ATM、银行柜台或网银转账付款。" },
          { n: 7, icon: <Truck className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "发货配送", desc: "确认到账后，订单会在1-2个工作日内发出。全国2-5个工作日送达。" },
          { n: 8, icon: <ClipboardList className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "查询订单", desc: "随时在「我的 > 订单」查看状态：待付款 → 已付款 → 已发货 → 已送达。" },
        ],
        faqTitle: "常见问题",
        faq: [
          { q: "不注册可以下单吗？", a: "不可以。依法律规定，购买香烟必须注册并通过年龄认证。" },
          { q: "年龄认证要多久？", a: "上传证件后通常1个工作日内完成。如需补充材料会通知您。" },
          { q: "付款有期限吗？", a: "请在下单后7天内完成银行转账。超期未付的订单将自动取消。" },
          { q: "什么时候发货？", a: "确认到账后发货。通常1-2个工作日内发出，2-5个工作日送达。" },
          { q: "包邮吗？", a: "不包邮。根据日本《烟草事业法》第36条，烟草运费由购买者承担，每单均需支付固定运费，与订单金额无关。" },
          { q: "能修改或取消订单吗？", a: "付款前可修改或取消。请尽快联系我们。" },
        ],
      }
    : {
        hero: { title: "ご利用ガイド", subtitle: "TABACOYAでのお買い物の流れをステップでご案内します。" },
        cta: { register: "会員登録する", products: "商品を見る", contact: "お問い合わせ" },
        steps: [
          { n: 1, icon: <User className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "会員登録", desc: "メールアドレスとパスワードでご登録ください。お届け先は保存され、次回からスムーズにご注文いただけます。" },
          { n: 2, icon: <ShieldCheck className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "年齢確認", desc: "法律により喫煙可能年齢の確認が必要です。マイページから身分証（運転免許証など）をご提出ください。1営業日以内に審査します。" },
          { n: 3, icon: <Search className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "商品を選ぶ", desc: "ブランドやカテゴリーから探す、検索バーを使う、クイックビューで詳細を見るなど自由に。数量を選んでカートに入れます。" },
          { n: 4, icon: <ShoppingCart className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "カートを確認", desc: "右上のカートアイコンを開きます。数量の変更や商品の削除ができます。送料は購入者負担（たばこ事業法第36条により、金額にかかわらず発生します）。" },
          { n: 5, icon: <Package className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "ご注文手続き", desc: "お届け先を入力し、お支払い方法を「銀行振込」でお選びください。注文内容をご確認のうえ送信します。" },
          { n: 6, icon: <Landmark className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "銀行振込でお支払い", desc: "ご注文後、振込先口座情報をお送りします。7日以内にATM・窓口・ネットバンキングで合計金額をお振込みください。" },
          { n: 7, icon: <Truck className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "発送・お届け", desc: "入金確認後、1〜2営業日で発送します。全国2〜5営業日でお届けします。" },
          { n: 8, icon: <ClipboardList className="h-6 w-6 text-[#C8A97E]" strokeWidth={1.5} />, title: "注文を確認", desc: "マイページの「注文履歴」でいつでもご確認いただけます（受付中→入金済み→発送済み→配達完了）。" },
        ],
        faqTitle: "よくある質問",
        faq: [
          { q: "会員登録なしで注文できますか？", a: "いいえ。法律により、たばこ購入には会員登録と年齢確認が必須です。" },
          { q: "年齢確認にはどのくらいかかりますか？", a: "身分証のご提出後、通常1営業日以内に完了します。追加確認が必要な場合はご連絡します。" },
          { q: "お支払いの期限は？", a: "ご注文後7日以内に銀行振込をお願いします。期間を過ぎますと自動キャンセルとなります。" },
          { q: "いつ発送されますか？", a: "入金確認後の発送です。通常1〜2営業日で発送、2〜5営業日でお届けします。" },
          { q: "送料無料になりますか？", a: "なりません。たばこ事業法第36条により、たばこの送料は購入者負担となり、ご注文金額にかかわらず必ず発生します。" },
          { q: "注文の変更・キャンセルはできますか？", a: "お支払い前であれば可能です。お早めにお問い合わせください。" },
        ],
      };

  const steps: Step[] = content.steps;

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#0F0F0F] px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#C8A97E]">
            {locale === "en" ? "Guide" : locale === "zh" ? "指南" : "ご利用ガイド"}
          </span>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{content.hero.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#999]">{content.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex h-11 items-center bg-[#C8A97E] px-6 text-xs font-semibold text-white uppercase tracking-wider transition-colors hover:bg-[#B8956A]">
              {content.cta.register}
            </Link>
            <Link href="/products" className="inline-flex h-11 items-center border border-[#2A2A2A] px-6 text-xs font-medium text-[#999] uppercase tracking-wider transition-colors hover:text-white hover:border-[#555]">
              {content.cta.products}
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-lg border border-[#E5E5E5] bg-white p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F0F0F] text-sm font-bold text-[#C8A97E]">
                    {String(s.n).padStart(2, "0")}
                  </span>
                  {s.icon}
                </div>
                <h3 className="mt-4 text-base font-bold text-[#1A1A1A]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#888]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment highlight */}
      <section className="bg-[#F5F5F5] px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-[#E5E5E5] bg-white p-8">
          <div className="flex items-center gap-3">
            <Landmark className="h-7 w-7 text-[#1A1A1A]" strokeWidth={1.5} />
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A1A]">
              {locale === "en" ? "Bank Transfer" : locale === "zh" ? "银行转账付款" : "銀行振込でのお支払い"}
            </h2>
          </div>
          <ol className="mt-6 space-y-3 text-sm text-[#888]">
            {(locale === "en"
              ? ["Receive the account details after ordering", "Transfer within 7 days (ATM / counter / online banking)", "Order ships after payment is confirmed"]
              : locale === "zh"
              ? ["下单后收到收款账户信息", "7天内转账（ATM / 柜台 / 网银）", "确认到账后发货"]
              : ["ご注文後、振込先口座をお知らせします", "7日以内にATM・窓口・ネットバンキングでお振込", "入金確認後に発送となります"]
            ).map((line, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C8A97E] text-[10px] font-bold text-white">{i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-[#1A1A1A]">{content.faqTitle}</h2>
          <div className="mt-8 divide-y divide-[#E5E5E5] border-t border-b border-[#E5E5E5]">
            {content.faq.map((item, i) => (
              <details key={i} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-[#1A1A1A]">
                  {item.q}
                  <span className="text-[#C8A97E] transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 pl-1 text-sm leading-relaxed text-[#888]">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/contact" className="inline-flex h-11 items-center border border-[#E5E5E5] px-6 text-xs font-medium text-[#1A1A1A] uppercase tracking-wider transition-colors hover:border-[#C8A97E] hover:text-[#C8A97E]">
              {content.cta.contact} →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
