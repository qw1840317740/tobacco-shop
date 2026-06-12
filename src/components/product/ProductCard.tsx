"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { formatPrice, getLocalizedName } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { Star, Eye } from "lucide-react";
import { QuickView } from "@/components/product/QuickView";
import Image from "next/image";

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

function deterministicRating(productId: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    const char = productId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  hash = Math.abs(hash);
  const rating = 3.5 + (hash % 15) / 10; // 3.5 to 4.9
  const count = 8 + (hash % 93); // 8 to 100
  return { rating: Math.round(rating * 10) / 10, count };
}

export function ProductCard({ product, dark }: { product: Product; dark?: boolean }) {
  const addItem = useCartStore((s) => s.addItem);
  const tCommon = useTranslations("common");
  const tProduct = useTranslations("product");
  const locale = useLocale();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const displayName = getLocalizedName(product, locale);
  const { rating, count } = deterministicRating(product.id);

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
          <Image
            src={product.image}
            alt={displayName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {product.inStock === false && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-stone-700">{tCommon("outOfStock")}</span>
            </div>
          )}
          {product.inStock !== false && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/40 to-transparent p-3 pt-8 transition-transform duration-300 group-hover:translate-y-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-primary/90"
                >
                  {tCommon("addToCart")}
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setQuickViewOpen(true);
                  }}
                  className="rounded-xl bg-white/90 p-2 text-stone-700 shadow-lg transition-colors hover:bg-white hover:text-primary"
                  title={tCommon("quickView")}
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
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
        {/* Star rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : star - 0.5 <= rating
                      ? "fill-amber-400/50 text-amber-400"
                      : "fill-stone-200 text-stone-200"
                }`}
              />
            ))}
          </div>
          <span className={`text-xs font-medium ${dark ? "text-stone-400" : "text-stone-500"}`}>{rating.toFixed(1)}</span>
          <span className={`text-xs ${dark ? "text-stone-500" : "text-stone-400"}`}>({count})</span>
        </div>
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
      <QuickView product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  );
}
