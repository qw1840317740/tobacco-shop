import { getProducts } from "@/lib/data-store";
import { ProductCard } from "@/components/product/ProductCard";
import { getTranslations } from "next-intl/server";

export default async function ProductsPage() {
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
