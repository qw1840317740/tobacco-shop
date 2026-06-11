import { getProducts } from "@/lib/data-store";
import { ProductCard } from "@/components/product/ProductCard";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const data: Record<string, { title: string; description: string }> = {
    ja: {
      title: "商品一覧",
      description:
        "日本製たばこ500銘柄以上の商品一覧。JT国内ブランド・国際ブランド・Ploom加熱たばこを幅広く取り揃えています。",
    },
    en: {
      title: "All Products",
      description:
        "Browse our full collection of 500+ authentic Japanese cigarettes, including JT domestic brands, international brands, and Ploom heated tobacco.",
    },
    zh: {
      title: "全部商品",
      description:
        "浏览500种以上的日本制造香烟全系列，包括JT国内品牌、国际品牌和Ploom加热烟。",
    },
  };
  const d = data[locale] ?? data.ja;

  return { title: d.title, description: d.description };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const products = await getProducts();
  const t = await getTranslations("nav");
  const tProduct = await getTranslations("product");
  const tHome = await getTranslations("home");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">{t("products")}</h1>
      <p className="mt-2 text-stone-500">{products.length}+ {tProduct("productCount")}</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
