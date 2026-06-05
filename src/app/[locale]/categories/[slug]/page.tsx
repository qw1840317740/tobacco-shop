import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data-store";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { formatPrice } from "@/lib/utils";

const groupStyles: Record<string, { gradient: string; badge: string; icon: string }> = {
  jt_japan: {
    gradient: "from-amber-500/8 via-orange-500/4 to-transparent",
    badge: "bg-amber-100 text-amber-700",
    icon: "🇯🇵",
  },
  jt_international: {
    gradient: "from-blue-500/8 via-sky-500/4 to-transparent",
    badge: "bg-blue-100 text-blue-700",
    icon: "🌍",
  },
  ploom: {
    gradient: "from-purple-500/8 via-violet-500/4 to-transparent",
    badge: "bg-purple-100 text-purple-700",
    icon: "🔥",
  },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tBrands = await getTranslations("brands");
  const tNav = await getTranslations("nav");

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getProductsByCategory(category.id);

  const localizedName = locale === "en" && category.nameEn ? category.nameEn
    : locale === "zh" && category.nameZh ? category.nameZh
    : category.nameJa;

  const altName = locale === "ja" && category.nameEn ? category.nameEn
    : category.nameJa;

  const groupLabel = category.group ? tBrands(category.group as any) : "";
  const style = groupStyles[category.group] || groupStyles.jt_japan;

  // Calculate price range
  const prices = products.map((p) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[
        { label: tNav("brands"), href: "/categories" },
        { label: localizedName },
      ]} />

      {/* Hero section */}
      <div className={`mt-6 overflow-hidden rounded-2xl border bg-gradient-to-br ${style.gradient}`}>
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          {/* Group badge */}
          {groupLabel && (
            <Badge className={`mb-3 ${style.badge} border-0 text-xs font-medium`}>
              {style.icon} {groupLabel}
            </Badge>
          )}

          {/* Brand name */}
          <h1 className="font-heading text-3xl font-bold text-stone-800 sm:text-4xl">
            {localizedName}
          </h1>

          {/* Alt name (show Japanese/English when different) */}
          {altName && altName !== localizedName && (
            <p className="mt-1 text-base text-stone-400">{altName}</p>
          )}

          {/* Description */}
          {category.description ? (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500">
              {category.description}
            </p>
          ) : (
            <p className="mt-4 text-sm text-stone-400 italic">
              {tBrands("comingSoon")}
            </p>
          )}

          {/* Stats bar */}
          {products.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1.5">
                <span className="text-xs text-stone-400">{tBrands("productCount", { count: "" }).replace(/\s*$/, "")}</span>
                <span className="text-sm font-bold text-stone-700">{products.length}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1.5">
                <span className="text-xs text-stone-400">{locale === "en" ? "Price" : locale === "zh" ? "价格" : "価格"}</span>
                <span className="text-sm font-bold text-primary">
                  {minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} 〜 ${formatPrice(maxPrice)}`}
                </span>
              </div>
              {category.group === "ploom" ? (
                <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1.5">
                  <span className="text-xs text-stone-400">{tBrands("heatedTobacco")}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1.5">
                  <span className="text-xs text-stone-400">{tBrands("fromJapan")}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-700">
              {locale === "en" ? "All Products" : locale === "zh" ? "全部商品" : "全商品"}
            </h2>
            <span className="text-sm text-stone-400">{tBrands("productCount", { count: products.length })}</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-stone-600">{tBrands("comingSoon")}</h3>
          <p className="mt-1 text-sm text-stone-400">
            {localizedName} — {tBrands("noProducts")}
          </p>
        </div>
      )}
    </div>
  );
}
