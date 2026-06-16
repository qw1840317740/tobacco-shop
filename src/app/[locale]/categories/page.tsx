import { getAllCategories, getProductsByCategory } from "@/lib/data-store";
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
      title: "ブランド一覧",
      description:
        "TABACOYA取扱いの全ブランド一覧。JT日本ブランド・JT国際ブランド・Ploom加熱たばこからお好きな銘柄をお探しください。",
    },
    en: {
      title: "All Brands",
      description:
        "Browse all cigarette brands available at TABACOYA. Find your favorite from JT Japanese, JT International, and Ploom heated tobacco brands.",
    },
    zh: {
      title: "品牌一览",
      description:
        "TABACOYA全品牌一览。从JT日本品牌、JT国际品牌和Ploom加热烟中找到您喜欢的品牌。",
    },
  };
  const d = data[locale] ?? data.ja;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/categories`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/categories`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/categories`,
      languages,
    },
  };
}

// Must be separate from generateMetadata import — this file also imports getTranslations below.
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { formatPrice } from "@/lib/utils";

const groupStyles: Record<string, { gradient: string; badge: string; accent: string }> = {
  jt_japan: {
    gradient: "",
    badge: "bg-amber-100 text-amber-700",
    accent: "border-amber-300/50",
  },
  jt_international: {
    gradient: "",
    badge: "bg-blue-100 text-blue-700",
    accent: "border-blue-300/50",
  },
  ploom: {
    gradient: "",
    badge: "bg-purple-100 text-purple-700",
    accent: "border-purple-300/50",
  },
};

export default async function BrandsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ group?: string }>;
}) {
  const { locale } = await params;
  const { group: filterGroup } = await searchParams;
  setRequestLocale(locale);
  const tBrands = await getTranslations("brands");

  const categories = await getAllCategories();

  // Get price ranges for categories with products
  const priceRanges: Record<string, { min: number; max: number }> = {};
  for (const cat of categories) {
    if (cat.count > 0) {
      const products = await getProductsByCategory(cat.id);
      if (products.length > 0) {
        const prices = products.map((p) => p.price);
        priceRanges[cat.id] = { min: Math.min(...prices), max: Math.max(...prices) };
      }
    }
  }

  // Group by group field
  const groups: Record<string, typeof categories> = {};
  const groupOrder = ["jt_japan", "jt_international", "ploom"];
  for (const cat of categories) {
    const g = cat.group || "other";
    if (!groups[g]) groups[g] = [];
    groups[g].push(cat);
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-6">
      <Breadcrumb items={[{ label: tBrands("title") }]} />

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">{tBrands("title")}</h1>
        <p className="mt-2 text-[#888888]">{tBrands("subtitle")}</p>
      </div>

      {groupOrder
        .filter((gk) => !filterGroup || gk === filterGroup)
        .map((groupKey) => {
        const items = groups[groupKey];
        if (!items || items.length === 0) return null;
        const style = groupStyles[groupKey] || groupStyles.jt_japan;

        return (
          <div key={groupKey} className="mb-12">
            {/* Group header */}
            <div className="mb-5 flex items-center gap-4">
              <div className={`h-1.5 w-1.5 rounded-full ${groupKey === "jt_japan" ? "bg-amber-500" : groupKey === "jt_international" ? "bg-blue-500" : "bg-purple-500"}`} />
              <h2 className="text-xl font-bold text-[#333]">{tBrands(groupKey as any)}</h2>
              <div className="h-px flex-1 bg-[#E5E5E5]" />
              <span className="text-xs text-[#888888]">{items.length} brands</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((cat) => {
                const localizedName = locale === "en" && cat.nameEn ? cat.nameEn
                  : locale === "zh" && cat.nameZh ? cat.nameZh
                  : cat.nameJa;
                const hasProducts = cat.count > 0;
                const range = priceRanges[cat.id];

                return (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`group relative overflow-hidden rounded-lg border transition-all duration-300 ${
                      hasProducts
                        ? `border-[#E5E5E5]/60 bg-white hover:border-[#C8A97E]/30 hover:shadow-sm hover:-translate-y-1`
                        : `border-[#E5E5E5] bg-[#F5F5F5]/50 opacity-60 hover:opacity-80`
                    }`}
                  >
                    {/* Top accent line */}
                    <div className={`h-1 ${style.gradient}`} />

                    <div className="p-5">
                      {/* Brand initial + name */}
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                          hasProducts
                            ? `${style.badge}`
                            : "bg-[#F5F5F5] text-[#888888]"
                        }`}>
                          {localizedName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className={`text-sm font-bold leading-tight transition-colors line-clamp-2 ${
                            hasProducts ? "text-[#1A1A1A] group-hover:text-[#C8A97E]" : "text-[#888888]"
                          }`}>
                            {localizedName}
                          </h3>
                          {/* Show Japanese name when not in ja locale */}
                          {locale !== "ja" && cat.nameJa !== localizedName && (
                            <p className="mt-0.5 text-[11px] text-[#888888] line-clamp-1">{cat.nameJa}</p>
                          )}
                        </div>
                      </div>

                      {/* Bottom info */}
                      <div className="mt-4 flex items-center justify-between">
                        {hasProducts ? (
                          <>
                            <span className="text-xs font-semibold text-[#C8A97E]">
                              {range ? tBrands("priceRange", { min: range.min }) : ""}
                            </span>
                            <Badge variant="secondary" className="rounded-md text-[10px] font-medium">
                              {tBrands("productCount", { count: cat.count })}
                            </Badge>
                          </>
                        ) : (
                          <span className="text-xs text-[#888888]">{tBrands("comingSoon")}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
