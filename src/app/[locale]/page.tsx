import { getTranslations } from "next-intl/server";
import { setRequestLocale, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getFeaturedProducts, getProducts } from "@/lib/data-store";
import { formatPrice } from "@/lib/utils";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

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

  return (
    <div>
      {/* ===== HERO — Full-bleed image ===== */}
      <section className="relative h-[90vh] overflow-hidden">
        <Image
          src={HERO_IMAGES.main}
          alt="Premium Japanese cigarettes"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-16 left-0 max-w-2xl px-8">
          <h1 className="text-5xl font-bold text-white tracking-tight sm:text-7xl">
            {t("heroTitle")}
            <br />
            {t("heroTitleHighlight")}
          </h1>
          <p className="mt-4 text-base text-white/70">
            {t("heroDescription")}
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/products"
              className="inline-flex h-12 items-center gap-2 bg-[#C8A97E] px-8 text-sm font-semibold text-white uppercase tracking-wider transition-colors hover:bg-[#B8956A]"
            >
              {t("heroCtaProducts")}
            </Link>
            <Link
              href="/guide"
              className="inline-flex h-12 items-center border border-white/30 px-8 text-sm font-medium text-white uppercase tracking-wider transition-colors hover:bg-white/10"
            >
              {t("heroCtaGuide")}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ANNOUNCEMENT BAR ===== */}
      <div className="bg-[#0F0F0F] py-2.5 text-center">
        <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888]">
          {t("marqueeText")}
        </span>
      </div>

      {/* ===== BRAND SHOWCASE ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold uppercase tracking-wider text-center text-[#1A1A1A]">
            {t("brandsTitle")}
          </h2>
          <p className="mt-2 text-sm text-center text-[#888]">
            {t("brandsSubtitle")}
          </p>

          {/* Category cards — 3-column */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {(["jt_japan", "jt_international", "ploom"] as const).map((key) => {
              if (!groups[key]) return null;
              const meta = groupMeta[key];
              return (
                <Link
                  key={key}
                  href={`/categories?group=${key}`}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden"
                >
                  <Image
                    src={meta.image}
                    alt={meta.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-white uppercase tracking-wider">
                      {meta.label}
                    </span>
                    <span className="mt-1 text-sm text-white/70">
                      {groups[key]} {t("brandsLabel")} &middot; {gProducts[key]} {t("items")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Individual brand list */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-bold tracking-wider text-[#888] uppercase">
                {t("popularBrands")}
              </span>
              <Link
                href="/categories"
                className="text-xs font-medium text-[#C8A97E] hover:underline"
              >
                {t("viewAll")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {categories
                .filter((c) => c.count > 0)
                .sort((a, b) => b.count - a.count)
                .map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white px-4 py-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-xs font-bold text-[#1A1A1A] transition-colors group-hover:bg-[#1A1A1A] group-hover:text-white">
                      {cat.nameJa.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-medium text-[#1A1A1A] truncate">
                        {locale === "en" && cat.nameEn
                          ? cat.nameEn
                          : locale === "zh" && cat.nameZh
                            ? cat.nameZh
                            : cat.nameJa}
                      </span>
                      <span className="block text-[11px] text-[#888]">
                        {cat.count} {t("items")}
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-16 sm:py-20 bg-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-[#1A1A1A]">
              {t("featuredTitle")}
            </h2>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#C8A97E] hover:gap-2 transition-all"
            >
              {t("viewAll")} &rarr;
            </Link>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
            {editorsPick && (
              <div className="col-span-2 row-span-2 hidden lg:block">
                <div className="group relative h-full overflow-hidden rounded-lg">
                  <Image
                    src={editorsPick.image}
                    alt={editorsPick.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/70">
                      Editor&apos;s Pick
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      {editorsPick.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/60 line-clamp-2">
                      {editorsPick.desc}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-lg font-bold text-[#C8A97E]">
                        {formatPrice(editorsPick.price)}
                      </span>
                    </div>
                    <Link
                      href={`/products/${editorsPick.slug}`}
                      className="mt-4 inline-flex items-center gap-2 bg-[#C8A97E] px-5 py-2 text-sm font-medium text-white uppercase tracking-wider hover:bg-[#B8956A] transition-colors"
                    >
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

      {/* ===== ABOUT SECTION ===== */}
      <section className="bg-[#0F0F0F] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888]">
              About Us
            </span>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider text-white">
              {t("aboutTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#888] leading-relaxed text-sm">
              {t("aboutDescription")}
            </p>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { num: "500+", label: t("statBrands") },
              { num: "100%", label: t("statAuthentic") },
              { num: "🇯🇵", label: t("statMadeInJapan") },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-[#C8A97E]">{s.num}</p>
                <p className="mt-2 text-sm text-[#888]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="bg-[#0F0F0F] py-16 border-t border-[#1A1A1A]">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888]">
            Newsletter
          </span>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-wider text-white">
            {t("newsletterTitle")}
          </h2>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
