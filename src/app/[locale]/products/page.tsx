import { getProducts, getCategories } from "@/lib/data-store";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/routing";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductsClient } from "./ProductsClient";
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
      title: "商品一覧",
      description:
        "日本製たばこの商品一覧。JT国内ブランド・国際ブランド・Ploom加熱たばこを取り揃えています。",
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

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/products`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/products`;

  return {
    title: d.title,
    description: d.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/products`,
      languages,
    },
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const t = await getTranslations("nav");
  const tProduct = await getTranslations("product");

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-8 sm:px-6">
      <Breadcrumb items={[{ label: t("products") }]} />

      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-800">
          {t("products")}
        </h1>
        <p className="mt-2 text-stone-500">
          {products.length}+ {tProduct("productCount")}
        </p>
      </div>

      <ProductsClient products={products} categories={categories} />
    </div>
  );
}
