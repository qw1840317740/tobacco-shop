import { getTranslations } from "next-intl/server";
import { setRequestLocale, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/data-store";
import { formatPrice } from "@/lib/utils";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Truck, ShieldCheck, Lock, Package } from "lucide-react";

const HERO_IMAGES = {
  main: "https://images.unsplash.com/photo-1502389872488-08725e638945?w=1920&q=80",
  barn: "https://images.unsplash.com/photo-1634922951968-11ca107aa6e3?w=1920&q=80",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const data: Record<string, { title: string; description: string }> = {
    ja: {
      title: "日本製たばこ専門オンラインショップ",
      description:
        "TABACOYA（タバコ屋）は日本製たばこの専門オンラインショップ。JT国内ブランド・国際ブランド・Ploom加熱たばこなど500銘柄以上を厳選してお届けします。",
    },
    en: {
      title: "Premium Japanese Cigarettes Online Shop",
      description:
        "TABACOYA is a specialty online shop for authentic Japanese cigarettes. Browse 500+ curated brands including JT domestic, international, and Ploom heated tobacco.",
    },
    zh: {
      title: "日本制造香烟专营网店",
      description:
        "TABACOYA是日本制造香烟的专营网店。精选JT国内品牌、国际品牌、Ploom加热烟等500种以上的优质香烟。",
    },
  };
  const d = data[locale] ?? data.ja;
  return {
    title: d.title,
    description: d.description,
    openGraph: { title: `${d.title} | TABACOYA`, description: d.description },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tBrands = await getTranslations("brands");

  const [categories, featuredProducts, allProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getProducts(),
  ]);

  const editorsPick = featuredProducts[0] ?? allProducts[0] ?? null;
  const featuredCards = featuredProducts
    .filter((p) => p.id !== editorsPick?.id)
    .slice(0, 5);

  // Group categories
  const groups: Record<string, number> = {};
  const gProducts: Record<string, number> = {};
  for (const cat of categories) {
    const g = cat.group || "other";
    groups[g] = (groups[g] || 0) + 1;
    gProducts[g] = (gProducts[g] || 0) + cat.count;
  }

  const groupMeta: Record<string, { label: string; image: string }> = {
    jt_japan: {
      label: tBrands("jt_japan"),
      image: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=800&q=80",
    },
    jt_international: {
      label: tBrands("jt_international"),
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&q=80",
    },
    ploom: {
      label: tBrands("ploom"),
      image: "https://images.unsplash.com/photo-1561068201-27e4a1e32f57?w=800&q=80",
    },
  };

  // Announcement messages
  const announcements = locale === "en"
    ? ["Free shipping on orders over ¥5,000", "100% authentic Japanese products", "Discreet packaging for all orders"]
    : locale === "zh"
    ? ["订单满¥5,000免运费", "100%日本正品保障", "所有订单隐私包装"]
    : ["¥5,000以上で送料無料", "100%正規品保証", "すべてのご注文を厳重に梱包"];

  return (
    <div>
      {/* ===== HERO — Split layout ===== */}
      <section className="grid lg:grid-cols-2">
        <div className="relative h-[50vh] lg:h-auto lg:min-h-[70vh] overflow-hidden">
          <Image
            src={HERO_IMAGES.main}
            alt="Premium Japanese cigarettes"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="flex items-center bg-[#0F0F0F] px-8 py-12 lg:px-16 lg:py-0">
          <div className="max-w-lg">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#C8A97E]">Est. 2001 · Japan</span>
            <h1 className="mt-4 text-4xl font-bold text-white tracking-tight sm:text-5xl">
              {t("heroTitle")}
              <br />
              <span className="text-[#C8A97E]">{t("heroTitleHighlight")}</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#888]">{t("heroDescription")}</p>
            <div className="mt-8 flex gap-3">
              <Link href="/products" className="inline-flex h-11 items-center bg-[#C8A97E] px-6 text-xs font-semibold text-white uppercase tracking-wider transition-colors hover:bg-[#B8956A]">
                {t("heroCtaProducts")}
              </Link>
              <Link href="/guide" className="inline-flex h-11 items-center border border-[#2A2A2A] px-6 text-xs font-medium text-[#888] uppercase tracking-wider transition-colors hover:text-white hover:border-[#555]">
                {t("heroCtaGuide")}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#2A2A2A] pt-6">
              <div>
                <p className="text-2xl font-bold text-[#C8A97E]">500+</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">{t("statBrands")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#C8A97E]">100%</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">{t("statAuthentic")}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#C8A97E]">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-sm border-2 border-[#C8A97E] text-[10px] font-bold text-[#C8A97E]">JP</span>
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">{t("statMadeInJapan")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ANNOUNCEMENT BAR — Scrolling ===== */}
      <div className="bg-[#0F0F0F] py-2.5 text-center border-t border-[#2A2A2A] overflow-hidden">
        <div className="flex animate-[scroll_18s_linear_infinite] whitespace-nowrap" style={{ willChange: "transform" }}>
          {[0, 1].map((i) => (
            <span key={i} className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#C8A97E]" aria-hidden={i === 1}>
              {announcements.map((a, j) => (
                <span key={j} className="mx-6 inline-flex items-center gap-2">
                  <span className="inline-block h-1 w-1 rounded-full bg-[#C8A97E]" />
                  {a}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ===== TRUST BAR ===== */}
      <section className="border-b border-[#E5E5E5] bg-white">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10 py-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { icon: <Truck className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />, title: locale === "en" ? "Free Shipping" : locale === "zh" ? "免费配送" : "送料無料", desc: locale === "en" ? "Orders over ¥5,000" : locale === "zh" ? "订单满¥5,000" : "¥5,000以上" },
              { icon: <ShieldCheck className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />, title: locale === "en" ? "100% Authentic" : locale === "zh" ? "正品保障" : "正規品保証", desc: locale === "en" ? "Directly from Japan" : locale === "zh" ? "日本直邮" : "日本直送" },
              { icon: <Lock className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />, title: locale === "en" ? "Discreet Package" : locale === "zh" ? "隐私包装" : "厳重梱包", desc: locale === "en" ? "Privacy protected" : locale === "zh" ? "保护您的隐私" : "プライバシー保護" },
              { icon: <Package className="h-6 w-6 text-[#1A1A1A]" strokeWidth={1.5} />, title: locale === "en" ? "Fast Delivery" : locale === "zh" ? "快速配送" : "迅速配送", desc: locale === "en" ? "2-5 business days" : locale === "zh" ? "2-5个工作日" : "2〜5営業日" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-[#1A1A1A]">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-[#1A1A1A]">{item.title}</p>
                  <p className="text-[11px] text-[#888]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRAND SHOWCASE ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-center text-[#1A1A1A]">{t("brandsTitle")}</h2>
          <p className="mt-2 text-sm text-center text-[#888]">{t("brandsSubtitle")}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {(["jt_japan", "jt_international", "ploom"] as const).map((key) => {
              if (!groups[key]) return null;
              const meta = groupMeta[key];
              return (
                <Link key={key} href={`/categories?group=${key}`} className="group relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image src={meta.image} alt={meta.label} fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white uppercase tracking-wider">{meta.label}</span>
                    <span className="mt-1 text-sm text-white/70">{groups[key]} {t("brandsLabel")} &middot; {gProducts[key]} {t("items")}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold tracking-wider text-[#888] uppercase">{t("popularBrands")}</span>
              <Link href="/categories" className="text-xs font-medium text-[#C8A97E] hover:underline">{t("viewAll")} &rarr;</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categories.filter((c) => c.count > 0).sort((a, b) => b.count - a.count).map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`} className="group flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-xs font-bold text-[#1A1A1A] transition-colors group-hover:bg-[#1A1A1A] group-hover:text-white">
                    {cat.nameJa.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-sm font-medium text-[#1A1A1A] truncate">
                      {locale === "en" && cat.nameEn ? cat.nameEn : locale === "zh" && cat.nameZh ? cat.nameZh : cat.nameJa}
                    </span>
                    <span className="block text-[11px] text-[#888]">{cat.count} {t("items")}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 sm:py-20 bg-[#F5F5F5]">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-[#1A1A1A]">{t("featuredTitle")}</h2>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#C8A97E] hover:gap-2 transition-all">{t("viewAll")} &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {editorsPick && (
              <div className="col-span-2 row-span-2 hidden lg:block">
                <div className="group relative h-full overflow-hidden rounded-lg">
                  <Image src={editorsPick.image} alt={editorsPick.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/70">Editor&apos;s Pick</span>
                    <h3 className="mt-1 text-xl font-bold text-white">{editorsPick.name}</h3>
                    <p className="mt-1 text-sm text-white/60 line-clamp-2">{editorsPick.desc}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-lg font-bold text-[#C8A97E]">{formatPrice(editorsPick.price)}</span>
                    </div>
                    <Link href={`/products/${editorsPick.slug}`} className="mt-4 inline-flex items-center gap-2 bg-[#C8A97E] px-5 py-2 text-sm font-medium text-white uppercase tracking-wider hover:bg-[#B8956A] transition-colors">
                      {t("viewDetails")}
                    </Link>
                  </div>
                </div>
              </div>
            )}
            {featuredCards.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL SECTION ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-10">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-[#1A1A1A]">
            {locale === "en" ? "Buying Guide" : locale === "zh" ? "选购指南" : "購入ガイド"}
          </h2>
          <p className="mt-2 text-sm text-[#888]">
            {locale === "en" ? "Everything you need to know about Japanese cigarettes" : locale === "zh" ? "关于日本香烟你需要知道的一切" : "日本のたばこについて知っておきたいすべて"}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/guide" className="group">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-[#F5F5F5]">
                <Image src="https://images.unsplash.com/photo-1584655722139-69a7adbecc49?w=600&q=80" alt="Beginner Guide" fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" />
              </div>
              <span className="mt-3 block text-[10px] font-medium tracking-[0.15em] uppercase text-[#C8A97E]">
                {locale === "en" ? "Beginner" : locale === "zh" ? "入门" : "初心者"}
              </span>
              <h3 className="mt-1 text-base font-bold text-[#1A1A1A] group-hover:text-[#C8A97E] transition-colors">
                {locale === "en" ? "Your First Japanese Cigarette" : locale === "zh" ? "你的第一支日本香烟" : "初めての日本製たばこ"}
              </h3>
              <p className="mt-1 text-sm text-[#888] line-clamp-2">
                {locale === "en" ? "A complete guide to choosing and enjoying authentic Japanese tobacco." : locale === "zh" ? "选择和品鉴正宗日本烟草的完整指南。" : "本物の日本製たばこの選び方・楽しみ方の完全ガイド。"}
              </p>
            </Link>
            <Link href="/blog" className="group">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-[#F5F5F5]">
                <Image src="https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&q=80" alt="Brand Stories" fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" />
              </div>
              <span className="mt-3 block text-[10px] font-medium tracking-[0.15em] uppercase text-[#C8A97E]">
                {locale === "en" ? "Culture" : locale === "zh" ? "文化" : "文化"}
              </span>
              <h3 className="mt-1 text-base font-bold text-[#1A1A1A] group-hover:text-[#C8A97E] transition-colors">
                {locale === "en" ? "The Art of Japanese Tobacco" : locale === "zh" ? "日本烟草的艺术" : "日本のたばこの芸術"}
              </h3>
              <p className="mt-1 text-sm text-[#888] line-clamp-2">
                {locale === "en" ? "Explore the rich heritage and craftsmanship behind every pack." : locale === "zh" ? "探索每一包烟背后丰富的传统与工艺。" : "すべてのパッケージに込められた伝統と技を探る。"}
              </p>
            </Link>
            <Link href="/categories" className="group">
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-[#F5F5F5]">
                <Image src="https://images.unsplash.com/photo-1561542320-7a0f32e4e288?w=600&q=80" alt="Explore Brands" fill className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" sizes="(max-width: 640px) 100vw, 33vw" />
              </div>
              <span className="mt-3 block text-[10px] font-medium tracking-[0.15em] uppercase text-[#C8A97E]">
                {locale === "en" ? "Explore" : locale === "zh" ? "探索" : "探す"}
              </span>
              <h3 className="mt-1 text-base font-bold text-[#1A1A1A] group-hover:text-[#C8A97E] transition-colors">
                {locale === "en" ? "500+ Brands Collection" : locale === "zh" ? "500+品牌合集" : "500+ブランドコレクション"}
              </h3>
              <p className="mt-1 text-sm text-[#888] line-clamp-2">
                {locale === "en" ? "From classic JT to international favorites, find your perfect match." : locale === "zh" ? "从经典JT到国际品牌，找到你的完美匹配。" : "クラシックJTから国際ブランドまで、あなたにぴったりの一冊を。"}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION — with background ===== */}
      <section className="relative py-20 overflow-hidden">
        <Image src={HERO_IMAGES.barn} alt="Tobacco heritage" fill className="object-cover" loading="lazy" sizes="100vw" />
        <div className="absolute inset-0 bg-[#0F0F0F]/90" />
        <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 text-center">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#C8A97E]">About Us</span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider text-white">{t("aboutTitle")}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#888] leading-relaxed text-sm">{t("aboutDescription")}</p>
          <div className="mt-10 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <p className="text-3xl font-bold text-[#C8A97E]">20+</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">{locale === "en" ? "Years" : locale === "zh" ? "年历史" : "年の歴史"}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#C8A97E]">50K+</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">{locale === "en" ? "Customers" : locale === "zh" ? "客户信赖" : "お客様"}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#C8A97E]">4.8</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-[#999]">{locale === "en" ? "Rating" : locale === "zh" ? "好评评分" : "評価"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="bg-[#0F0F0F] py-16 border-t border-[#1A1A1A]">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888]">Newsletter</span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider text-white">{t("newsletterTitle")}</h2>
          <p className="mt-2 text-sm text-[#999]">
            {locale === "en" ? "Subscribe for new arrivals, restocks & recommendations" : locale === "zh" ? "订阅获取新品上架、补货通知与精选推荐" : "新着・再入荷・おすすめ情報をお届け"}
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
