"use client";

import { useCartStore } from "@/stores/cart-store";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

interface Product {
  id: string;
  slug: string;
  code?: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  price: number;
  image: string;
  type: string;
  region: string;
  inStock?: boolean;
  desc?: string;
}

function getLocalizedName(product: Product, locale: string): string {
  if (locale === "en" && product.nameEn) return product.nameEn;
  if (locale === "zh" && product.nameZh) return product.nameZh;
  return product.name;
}

export function ProductCard({ product, dark }: { product: Product; dark?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const locale = useLocale();

  const displayName = getLocalizedName(product, locale);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: displayName,
      price: product.price,
      image: product.image,
    });
    toast.success(tCommon("addedToCartToast", { name: displayName, qty: 1 }));
  };

  const regionLabel = tProduct(`regions.${product.region}`) || product.region;

  return (
    <div className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 ${
      dark
        ? "bg-gradient-to-br from-stone-800/80 to-stone-900/80 border border-stone-700/30 backdrop-blur-sm"
        : "bg-white/70 border border-stone-200/50 backdrop-blur-sm shadow-sm"
    }`}>
      <Link href={`/products/${product.slug}`}>
        <div className={`relative aspect-square overflow-hidden ${dark ? "bg-stone-800" : "bg-stone-50"}`}>
          <img
            src={product.image}
            alt={displayName}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {product.inStock === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-stone-700">{tCommon("outOfStock")}</span>
            </div>
          )}
          {product.inStock !== false && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/40 to-transparent p-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
              <button
                onClick={handleAdd}
                className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-primary/90"
              >
                {tCommon("addToCart")}
              </button>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-1.5">
          {product.code && (
            <Badge variant="secondary" className={`rounded-md text-[10px] font-mono font-medium ${dark ? "bg-stone-700/60 text-stone-300 border-stone-600/30" : "bg-primary/10 text-primary border-stone-200/50"}`}>#{product.code}</Badge>
          )}
          <Badge variant="secondary" className={`rounded-md text-[10px] font-medium ${dark ? "bg-stone-700/60 text-stone-300 border-stone-600/30" : "bg-stone-100 border-stone-200/50"}`}>{regionLabel}</Badge>
        </div>
        <Link href={`/products/${product.slug}`}>
          <h3 className={`mt-2 text-sm font-semibold leading-snug transition-colors line-clamp-1 ${
            dark ? "text-white group-hover:text-red-400" : "text-stone-800 group-hover:text-primary"
          }`}>
            {displayName}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
        </div>
        {/* Mobile add */}
        {product.inStock !== false && (
          <button
            onClick={handleAdd}
            className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 sm:hidden"
          >
            {tCommon("addToCart")}
          </button>
        )}
      </div>
    </div>
  );
}
