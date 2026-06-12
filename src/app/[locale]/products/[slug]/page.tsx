import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data-store";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductJsonLd } from "@/components/seo-json-ld";
import { routing } from "@/lib/routing";
import type { Metadata } from "next";

const SITE_URL = "https://tabacoya.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const name =
    locale === "en" && product.nameEn
      ? product.nameEn
      : locale === "zh" && product.nameZh
        ? product.nameZh
        : product.name;

  const desc =
    product.desc ||
    `${name} — Premium Japanese tobacco with rich flavor and smooth draw.`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}/products/${slug}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/products/${slug}`;

  return {
    title: name,
    description: desc.slice(0, 160),
    alternates: {
      canonical: `${SITE_URL}/${locale}/products/${slug}`,
      languages,
    },
    openGraph: {
      title: name,
      description: desc.slice(0, 160),
      images: [{ url: product.image, width: 800, height: 800, alt: name }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 4);

  const name =
    locale === "en" && product.nameEn
      ? product.nameEn
      : locale === "zh" && product.nameZh
        ? product.nameZh
        : product.name;

  return (
    <>
      <ProductJsonLd
        name={name}
        description={product.desc || `${name} — Premium Japanese tobacco`}
        image={product.image}
        price={product.price}
        currency="JPY"
        sku={product.slug}
        inStock={product.inStock !== false}
        url={`${SITE_URL}/${locale}/products/${product.slug}`}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
