import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/data-store";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumb items={[{ label: category.nameJa }]} />
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-stone-800">{category.nameJa}</h1>
        <p className="mt-2 text-stone-500">{category.count}+ の商品</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
