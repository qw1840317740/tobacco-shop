import { getProducts } from "@/lib/data-store";
import { ProductCard } from "@/components/product/ProductCard";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-stone-800">商品一覧</h1>
      <p className="mt-2 text-stone-500">{products.length}+ のプレミアムたばこ商品</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
