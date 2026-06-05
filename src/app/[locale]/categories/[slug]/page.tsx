import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data-store";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";

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

  const groupLabel = category.group ? tBrands(category.group as any) : "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[
        { label: tNav("brands"), href: "/categories" },
        { label: localizedName },
      ]} />
      <div className="mb-8">
        {groupLabel && (
          <span className="text-xs font-medium uppercase tracking-wider text-primary">{groupLabel}</span>
        )}
        <h1 className="mt-1 font-heading text-3xl font-bold text-stone-800">{localizedName}</h1>
        <p className="mt-2 text-stone-500">{products.length} {tBrands("productCount", { count: products.length })}</p>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-stone-400">{tBrands("noProducts")}</p>
        </div>
      )}
    </div>
  );
}
